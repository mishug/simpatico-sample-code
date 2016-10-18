<?php
namespace App;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

class Company extends Eloquent {

    protected $collection = 'company';
    protected $fillable = ['name', 'location', 'lat', 'long', 'activities', 'status', 'is_deleted', 'user_id', 'created_at', 'updated_at'];
    protected $primaryKey='_id';
     
    
    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function product()
    {
        return $this->belongsTo('App\CompanyProduct');
    }
    
    public function parent()
    {
        return $this->hasMany('App\ParentCompanies','child_id')->with(["comapnies"=> function($query){
            $query->where('status','=','1');
        }]);
    }    
    
    public function CompanyFavorite()
    {
        return $this->hasMany('App\CompanyFavorite','company_id');
    }    
    public function companyProduct()
    {
        return $this->hasMany('App\CompanyProduct','company_id')->with("product");
    }

    public function CompanyForum()
    {
        return $this->hasMany('App\Fourm','company_id')->with("user");
    }

    public function companyReviews()
    {
        return $this->hasMany('App\CompanyReviews','company_id')->with("user");
    }
    
    
     
}
