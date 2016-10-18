<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Product;
use App\Company;
use App\ParentCompanies;
use App\CompanyProduct;
use App\CompanyReviews;
use DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Requests;
use Illuminate\Support\Facades\Response;

class CompanyController extends Controller {

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        try {
            $company = Company::with(["user", 'CompanyFavorite'])->where('status', '=', '1')->orderBy('updated_at', 'DESC')->paginate(10);

            foreach ($company as $k => $item) {
                $company[$k]["companyAvgRating"] = self::averageRating($item["_id"]);
            }

            return Response::json(['comPany' => $company, 'error' => false], 200);
        } catch (\Exception $e) {
            return Response::json(['error' => true, 'msg' => $e->getMessage()], 400);
        }
    }

    /**
     * get company call api .
     *     
     * @return \Illuminate\Http\Response
     */
    public function searchAllcompany() {
        $title = @$_GET['company'];
        $company = Company::where('name', 'LIKE', '%' . $title . '%')->where('status', '=', '1')->get(["name"]);
        return Response::json(['companies' => $company, 'error' => false], 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create() {
        //
    }

    public function saveReview() {

        $params = \Input::all();
//        echo "<pre>"; print_r($params); die;
        $where = array('company_id' => $params["company_id"], 'user_id' => $params["user_id"]);
        $existCompany = CompanyReviews::where($where)->count();

        if ($existCompany) {
            return Response::json(['msg' => 'You have been already reviewed', 'error' => true], 401);
            exit();
        } else {
            $reviewed = CompanyReviews::create($params);
            if ($reviewed) {
                return Response::json(['msg' => 'Reviewed successfully', 'error' => false], 200);
            } else {
                return Response::json(['msg' => 'Somthing went wrong plaese try again.', 'error' => true], 401);
            }
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {
        $params = \Input::all();

        $user = JWTAuth::parseToken()->toUser();

        $params["user_id"] = $user->_id;
        $params["status"] = '1';
        $where = array('name' => $params["name"], 'user_id' => $user->_id);
        $existCompany = Company::where($where)->count();

        if ($existCompany) {
            return Response::json(['msg' => 'Already exist company name', 'error' => true], 401);
            exit();
        } else {
            $comPany = Company::create($params);
            $parent = array();
            if (@isset($params["parent"]) && !empty($params["parent"])) {
                foreach ($params["parent"] as $parentArray) {
                    $parent["parent_id"] = $parentArray["_id"];
                    $parent["child_id"] = $comPany->_id;
                    $parent["user_id"] = $user->_id;
                    $parentAdded = ParentCompanies::create($parent);
                }
                
            }
            if ($comPany) {
                return Response::json(['msg' => 'Company added successfully', '_id' => $comPany->_id, 'error' => false], 200);
            } else {
                return Response::json(['msg' => 'Somthing went wrong plaese try again.', 'error' => true], 401);
            }
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) {
        try {
            $company = Company::with(['user', 'product', 'parent', 'CompanyFavorite', 'companyProduct', 'CompanyForum', 'companyReviews'])->where('_id', '=', $id)->where('status', '=', '1')->first();

            if (!empty($company->companyReviews)) {
                $company["companyAvgRating"] = self::averageRating($company["_id"]);
            }

            return Response::json(['data' => $company, 'error' => false], 200);
        } catch (\Exception $e) {
            return Response::json(['error' => true, 'msg' => $e->getMessage()], 400);
        }
    }

    /**
     * Find query to get exist company for entities fields
     *
     * @param string word
     */
    public function getAllexist() {


        $word = @$_GET['word'];
        try {
            $query = Company::where('name', 'LIKE', '%' . $word . '%')
                    ->where('status', '=', '1');
            if (isset($_GET['id']) && @$_GET['id'] != "") {
                $query->where('_id', '!=', $_GET['id']);
            }
            $company = $query->limit(5)->get(["name"])->toArray();
            return Response::json(['companies' => $company, 'error' => false], 200);
        } catch (\Exception $e) {
            return Response::json(['error' => true, 'msg' => $e->getMessage()], 400);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id) {
        //
    }

    /**
     * Update company details.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id) {
        $user = JWTAuth::parseToken()->toUser();
        $comPany = array();

        try {
            $comPany['name'] = $request['name'];
            $comPany['location'] = $request['location'];
            $comPany['long'] = $request['long'];
            $comPany['lat'] = $request['lat'];
            $comPany['product_id'] = $request['product_name']["_id"];
            $comPany['activities'] = $request['activities'];
            $companyObj = Company::where(array('_id' => $id));
            $companyObj->update($comPany);
            //DB::collection('company')->where()->update($comPany);

            $parent = array();
            if (@isset($request["parent"])) {
                $parent["parent_id"] = $request["parent"]["_id"];
                $parent["child_id"] = $id;
                $parentObj = ParentCompanies::where(array("child_id" => $id));
                $companyExist = $companyObj->count();

                if ($companyExist > 0) {
                    $parentObj->delete();
                }
                $parent["user_id"] = $user->_id;
                ParentCompanies::create($parent);
            }

            return Response::json(['data' => 'Record has been updated !', 'error' => false], 200);
        } catch (\Exception $e) {
            return Response::json(['error' => true, 'msg' => $e->getMessage()], 400);
        }
        //
    }

    /**
     * Update produt id in company ( product linking ).
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function affilatedbusiness() {
        try {
            $params = \Input::all();
            $user = JWTAuth::parseToken()->toUser();

            if (@isset($params["business"])) {
                foreach ($params["business"] as $key => $value) {
                    $business["parent_id"] = $value["_id"];
                    $business["child_id"] = $params["id"];
                    $business["user_id"] = $user->_id;
                    $businessAdded = ParentCompanies::create($business);
                }
            }

            return Response::json(['data' => 'Record has been updated !', 'error' => false], 200);
        } catch (\Exception $e) {
            return Response::json(['error' => true, 'msg' => $e->getMessage()], 400);
        }
    }

    public function linkproduct() {
        try {
            $params = \Input::all();

            $user = JWTAuth::parseToken()->toUser();
            
            if (@isset($params["products"])) {
                foreach ($params["products"] as $key => $value) {
                    $product["product_id"] = $value["_id"];
                    $product["company_id"] = $params["id"];
                    $product["user_id"] = $user->_id;
                    $productAdded = CompanyProduct::create($product);
                }
            }

            return Response::json(['data' => 'Record has been updated !', 'error' => false], 200);
        } catch (\Exception $e) {
            return Response::json(['error' => true, 'msg' => $e->getMessage()], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) {
        try {
            $company = Company::find($id);
            $company->delete();

            $where = array('company_id' => $id);
            $companyReviews = CompanyReviews::where($where);
            $result = $companyReviews->delete();

            return Response::json([
                        'msg' => "Record has been Deleted successfully !",
                        'error' => false
                            ], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return Response::json([
                        'msg' => [$e->getMessage()],
                        'error' => true
                            ], 500);
        }
    }

    public static function averageRating($id) {

        $where = array('company_id' => $id);
        $where['status'] = "1";

        $reviews = CompanyReviews::where($where)->get(["rating"])->toArray();


        $averageRating = array();
        $ratingTotal = 0;
        $onestars = 0;
        $twostars = 0;
        $threestars = 0;
        $fourstars = 0;
        $fivestars = 0;
        if ($reviews) {
            foreach ($reviews as $key => $value) {
                $ratingTotal += $value["rating"];
                if ($value["rating"] == 1) {
                    $onestars++;
                } elseif ($value["rating"] == 2) {
                    $twostars++;
                } elseif ($value["rating"] == 3) {
                    $threestars++;
                } elseif ($value["rating"] == 4) {
                    $fourstars++;
                } elseif ($value["rating"] == 5) {
                    $fivestars++;
                }
            }
        }
        if (count($reviews) != 0) {
            $aveg = round($ratingTotal / count($reviews));
        } else {
            $aveg = 0;
        }
        $averageRating["total_avrg"] = $aveg;
        $averageRating["total_one_rating"] = $onestars;
        $averageRating["total_two_rating"] = $twostars;
        $averageRating["total_three_rating"] = $threestars;
        $averageRating["total_four_rating"] = $fourstars;
        $averageRating["total_five_rating"] = $fivestars;

        return $averageRating;
    }

    /*
     * @Fetch company review detail from compnayReview collection
     * @Params: review id($id)
     */

    public function getCompanyreview($id) {

        try {
            $review = CompanyReviews::with(['user', 'company'])->where('_id', '=', $id)->where('status', '=', '1')->first();
            return Response::json(['data' => $review, 'error' => false], 200);
        } catch (\Exception $e) {
            return Response::json(['error' => true, 'msg' => $e->getMessage()], 400);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateReview() {
        $params = \Input::all();

        try {
            /* Update in recipe table */
            $companyReviews = CompanyReviews::find($params["review_id"]);

            $result = $companyReviews->update($params);

            return Response::json([
                        'msg' => ["Record has been updated successfully !"],
                        'error' => false
                            ], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return Response::json([
                        'msg' => [$e->getMessage()],
                        'error' => true
                            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function delReview($id) {

        try {
            /* Update in recipe table */
            $companyReviews = CompanyReviews::find($id);
            $result = $companyReviews->delete();

            return Response::json([
                        'msg' => "Record has been Deleted successfully !",
                        'error' => false
                            ], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return Response::json([
                        'msg' => [$e->getMessage()],
                        'error' => true
                            ], 500);
        }
    }

}
