frontAppSpto
        //Controller to view specified Company and update fourm comments //
        .controller('CompanyViewCtlr', function ($scope, store, $rootScope, $uibModal, $log, $http, toaster, Config, UserCollection, GuestCollections, CompanyFavCollection, CompanyCollection, $stateParams, $state, $localStorage, $location) {
            //call to collection to get all Company//
            $scope.user_id = $localStorage.id;


            $scope.getCompanyData = function (data) {
//                
                CompanyCollection.get({id: $stateParams.id}).$promise.then(function (res) {
                    //set scope Company //
                    $scope.company = res.data;
                }, function (error) {
                });
                $scope.userRelatedInfo();
            };

            $scope.userfavcompany = [];

            $scope.userRelatedInfo = function () {
                var userfavCompanies = [];
                if ($localStorage.id) {
                    UserCollection.getProfile({id: $localStorage.id}).$promise.then(function (res) {
                        $scope.userinfo = res.data;
                        angular.forEach($scope.userinfo.user_fav_comanies, function (value, key) {
                            userfavCompanies.push(value.company_id);
                        });
                        $scope.userfavcompany = userfavCompanies;
                    });
                }
            };
            $scope.dofollow = function (followid, action) {
                UserCollection.followUser({follow_id: followid, action: action}).$promise.then(function (res) {
                    $scope.getCompanyData();
                }, function (err) {

                });
            };

            $scope.companyAsFav = function (cId, uId, action, type) {

                $scope.favCompany = {company_id: cId, user_id: uId, action: action}
                CompanyFavCollection.save($scope.favCompany).$promise.then(function (res) {
                    //$scope.favdata = res.data;

                    $state.reload();
                    if (type == 'single') {
                        if (action == 'add') {
                            $scope.company.company_favorite[0] = {};
                            $scope.company.company_favorite[0].user_id = uId;
                        } else if (action == 'remove') {
                            $scope.company.company_favorite[0].user_id = '';
                        }
                    }
                    toaster.success(res.msg);

                }, function (err) {
                    console.log(err);
                });
            };
            $scope.companyreview = {};

            $scope.animationsEnabled = true;
            $scope.openModelCompanyReview = function (size) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: Config.httpBasePath + 'tpl/companyReview.html',
                    controller: 'AddCompanyReviewsCtlr',
                    size: size,
                    resolve: {
                    }
                });
                modalInstance.result.then(function () {

                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });

            };

            $scope.selectMembertype = function (selectedvalue, memberType) {
                console.log(memberType);

                $scope.userreview.membertype = memberType;
                $scope.advstatus = selectedvalue;
            };

            $scope.openModelAddBusinessEntity = function (size) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: Config.httpBasePath + 'tpl/affilatedBusiness.html',
                    controller: 'addpopup',
                    size: size,
                    resolve: {
                    }
                });
                modalInstance.result.then(function () {

                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });

            };


            $scope.openModelAddNewProduct = function (size) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: Config.httpBasePath + 'tpl/linkedProduct.html',
                    controller: 'addpopup',
                    size: size,
                    resolve: {
                    }
                });
                modalInstance.result.then(function () {

                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });

            };
            $scope.cancel = function () {
                $uibModal.dismiss('cancel');
            };


            $scope.deleteCompanyReview = function (reviewid) {
                if (reviewid) {
                    CompanyCollection.deleteCompanyReview({id: reviewid}).$promise.then(function (res) {
                        toaster.success(res.msg);
                        $state.reload();
                    });
                }
            };

            $scope.guestCompanyData = function (data) {
                GuestCollections.guestCompanyData({id: $stateParams.id}).$promise.then(function (res) {
                    //set scope Company //
                    $scope.company = res.data;
                }, function (error) {
                });
                $scope.userRelatedInfo();
            };


            $scope.deleteCompany = function (id) {

                CompanyCollection.delete({id: id}).$promise.then(function (res) {
                    toaster.success(res.msg);
                    $state.go('company-list');
                });

            };



        })
        
        // Controller to add new CompanyAddCtlr // 
        .controller('CompanyAddCtlr', function ($scope, $http, uiGmapGoogleMapApi, Config, CompanyCollection, $stateParams, $state, toaster, $localStorage, $location) {
            // Call to collection if Company beaing created for specified product //
            $scope.company = {};
            $scope.map = {center: {latitude: 40.1451, longitude: -99.6680}, zoom: 4};
            $scope.options = {scrollwheel: false};
            var events = {places_changed: function (searchBox) {
                    var places = searchBox.getPlaces();
                    if (places) {
                        $scope.company.location = places[0].formatted_address;
                        $scope.company.lat = places[0].geometry.location.lat();
                        $scope.company.long = places[0].geometry.location.lng();
                        //console.log(places);
                    }
                }};

            if ($stateParams.name) {
                $scope.company.name = $stateParams.name;
            }

            $scope.searchbox = {template: 'searchbox.tpl.html', events: events, parentdiv: 'searchBoxParent'};



            $scope.getexistCompany = function (val) {
                return $http.get(Config.apiEndPointBase + '/companies/getAllexist', {
                    params: {
                        word: val
                    }
                }).then(function (response) {
                    $scope.tagerror = "";
                    if (response.data.companies.length) {
                        return response.data.companies.map(function (item) {
                            return item;
                        });
                    } else {
                        $scope.myHTML = '<span class="ErMsg">This company name does not exist. Do you want to <a href="#/company/add/' + val + '">Create</a> it?</span>';
//                        $scope.company.name = val;
                        return response.data.companies.map(function (item) {
                            return item;
                        });
                    }

                });
            };



            $scope.addCompany = function () {

                // document.getElementById('company_submit').disabled = true;

                //  console.log(JSON.stringify($scope.company));

                CompanyCollection.save($scope.company).$promise.then(function (res) {
                    console.log("hi.....");
                    toaster.success(res.msg);
                    $state.go('link-product', {"id": res._id});
                }, function (error) {
                    toaster.error(error.data.msg);
                });
            };


            $scope.getlocalProducts = function (val) {
                return $http.get(Config.apiEndPointBase + '/product/getAllproducts', {
                    params: {
                        product: val,
                    }
                }).then(function (response) {
                    //console.log(response.data.product);
                    var result;
                    /*             if(response.data.products.length > 0){
                     console.log("dfsgdsg");         */
                    var result = response.data.products;
                    /*               }else{
                     console.log("sssssss");         
                     var result = [{name:'<a ui-sref="user-product" class="add-product">Add new Product</a>'}];
                     } 
                     */
                    return result.map(function (item) {
                        return item;
                    });

                });
            };

            $scope.modelOptions = {
                debounce: {
                    default: 500,
                    blur: 250
                },
                getterSetter: true
            };


            $scope.loadTags = function (query) {
                return $http.get(Config.apiEndPointBase + '/product/getTagProduct', {
                    params: {
                        product: query
                    }
                });
            };

            $scope.companyupdates = {};
            $scope.linkProductToCompany = function () {
                if ($scope.companyP) {
                    $scope.companyupdates.id = $stateParams.id;
                    $scope.companyupdates.products = $scope.companyP.tags;

                    CompanyCollection.linkproduct($scope.companyupdates, function (res) {
                        if (!res.error) {
                            toaster.success(res.data);
                            $state.go('company-list');
                        }
                    }, function (error) {
                        toaster.error(error.data);
                    });
                } else {
                    $state.go('company-list');
                }
            };

            $scope.addAffilatedBussiness = function () {

            };

        })
        // Controller to Edit new Company // 
        .controller('CompanyEditCtlr', function ($scope, $http, Config, CompanyCollection, $stateParams, $state, toaster, $localStorage, $location) {
            // Call to collection if Company beaing created for specified product //

            $scope.company = {};
            $scope.company.parent = [
            ];
            CompanyCollection.get({id: $stateParams.id}).$promise.then(function (res) {
                // Set scope Company //
                console.log(JSON.stringify(res));
                $scope.company = res.data;
                if (res.data.parent) {
                    $scope.company.parent = {id: res.data.parent.parent_id, name: res.data.parent.comapnies.name};

                }

                $scope.map = {center: {latitude: $scope.company.lat, longitude: $scope.company.long}, zoom: 4};
            }, function (error) {
            });

            $scope.options = {scrollwheel: false};
            var events = {places_changed: function (searchBox) {
                    var places = searchBox.getPlaces();
                    if (places) {
                        $scope.company.location = places[0].formatted_address;
                        $scope.company.lat = places[0].geometry.location.lat();
                        $scope.company.long = places[0].geometry.location.lng();
                    }
                }};
            $scope.searchbox = {template: 'searchbox.tpl.html', events: events, parentdiv: 'searchBoxParent'};


            $scope.modelOptions = {
                debounce: {
                    default: 500,
                    blur: 250
                },
                getterSetter: true
            };

            /***********NEW CHANGES *************/
      
            $scope.getexistCompany = function (val) {
                return $http.get(Config.apiEndPointBase + '/companies/getAllexist', {
                    params: {
                        word: val
                    }
                }).then(function (response) {
                    return response.data.companies.map(function (item) {
                        return item;
                    });
                });
            };

            $scope.getlocalProducts = function (val) {
                return $http.get(Config.apiEndPointBase + '/product/getAllproducts', {
                    params: {
                        product: val,
                    }
                }).then(function (response) {
                    return response.data.products.map(function (item) {
                        return item;
                    });
                });
            };

            $scope.updateCompany = function () {
                document.getElementById('company_edit').disabled = true;
                $scope.company.id = $scope.company._id;
                CompanyCollection.update($scope.company).$promise.then(function (res) {
                    toaster.success(res.data);
                    $state.go('company-view', {"id": $scope.company._id});
                }, function (error) {
                });
            };

            $scope.goBack = function () {
                window.history.go(-1);
            };

        })
        //Controller to generate Company list // 
        .controller('CompanyListCtlr', function ($scope, $http, toaster, $localStorage, store, Config, UserCollection, CompanyCollection, CompanyFavCollection, $stateParams, $state, $localStorage, $location) {
            //call to collection get all Company //
            $scope.userfavcompany = [];
            $scope.logged_id = $localStorage.id;
            $scope.userRelatedInfo = function () {
                var userfavCompanies = [];
                if ($localStorage.id) {
                    UserCollection.getProfile({id: $localStorage.id}).$promise.then(function (res) {
                        $scope.userinfo = res.data;
                        angular.forEach($scope.userinfo.user_fav_comanies, function (value, key) {
                            userfavCompanies.push(value.company_id);
                        });
                        $scope.userfavcompany = userfavCompanies;
                    });
                }
            };

            $scope.compListing = function () {
                CompanyCollection.get().$promise.then(function (res) {
                    //set name and id of Company to add Company scope  //
                    $scope.company = res.comPany;
                }, function (error) {
                });
                $scope.loadMore = function (data) {
                    CompanyCollection.paginator({page: data}).$promise.then(function (res) {
                        //set all fourm  to scope  //
                        $scope.company.data = $scope.company.data.concat(res.comPany.data);
                        $scope.company.current_page = res.comPany.current_page;
                        $scope.company.next_page_url = res.comPany.next_page_url;
                    }, function (error) {
                    });
                };
                $scope.userRelatedInfo();
            };
            $scope.companyAsFav = function (cId, uId, action, type) {

                $scope.favCompany = {company_id: cId, user_id: uId, action: action}
                CompanyFavCollection.save($scope.favCompany).$promise.then(function (res) {
                    //$scope.favdata = res.data;
                    if (type == 'multi') {

                        if (action == 'add') {
                            $scope.userfavcompany.push(res.company_id);
                        } else if (action == 'remove') {
                            var index = $scope.userfavcompany.indexOf(res.company_id);
                            $scope.userfavcompany.splice(index, 1);
                        }
                    }
                   
                    toaster.success(res.msg);
                    $state.reload();
                }, function (err) {
                    console.log(err);
                });
            };


            $scope.deleteCompany = function (id) {

                CompanyCollection.delete({id: id}).$promise.then(function (res) {
                    toaster.success(res.msg);
                    $state.reload();
                });

            };





        });       
