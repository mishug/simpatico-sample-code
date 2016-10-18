var frontAppSpto = angular.module('MyApp', ['ngResource',
                                            'ui.router',
                                            'ngRoute',
                                            'ngMessages',
                                            'toaster',
                                            'ngStorage',
                                            'angular-storage',
                                            'base64',
                                            'ngSanitize',
                                            'angular-jwt',
                                            'oc.lazyLoad',                                         
                                            'ui.bootstrap',
                                            'angular-loading-bar',
                                            'angularMoment',
                                            'textAngular',
                                            'ngTagsInput',
                                            'ng-sweet-alert',
                                            'youtube-embed',
                                            'uiGmapgoogle-maps',
                                            ]);

/* Configure ocLazyLoader*/
frontAppSpto.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
        });
    }])
.config(function(uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
          key: 'AIzaSyBzsboIEzlJFhrQsjExCXlboIEzl',
          v: '3.17',
          libraries: 'places' // Required for SearchBox.
          
      });
    }) ;
frontAppSpto.config(['$controllerProvider', function ($controllerProvider) {
        $controllerProvider.allowGlobals();
    }]);


frontAppSpto.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'Config', 'jwtInterceptorProvider', '$httpProvider', 
  function ($stateProvider, $urlRouterProvider, $locationProvider, Config, jwtInterceptorProvider, $httpProvider) {

        $stateProvider
                
            .state('company-add', {            
                url: '/company/add',
                requiresLogin: true,  
                templateUrl: Config.httpBasePath + 'views/company/add.html',
                controller: 'CompanyAddCtlr',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MyApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    Config.httpBasePath + '/controllers/CompanyController.js',                                       
                                    Config.httpBasePath + '/controllers/ProductsController.js',
                                ]
                            });
                        }]
                }            
            })
            .state('company-new', {            
                url: '/company/add/:name',
                requiresLogin: true,  
                templateUrl: Config.httpBasePath + 'views/company/add.html',
                controller: 'CompanyAddCtlr',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MyApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    Config.httpBasePath + '/controllers/CompanyController.js',                                       
                                    Config.httpBasePath + '/controllers/ProductsController.js',
                                ]
                            });
                        }]
                }            
            })
            .state('company-edit', {            
                url: '/company/edit/:id',
                requiresLogin: true,  
                templateUrl: Config.httpBasePath + 'views/company/edit.html',
                controller: 'CompanyEditCtlr',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MyApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    Config.httpBasePath + '/controllers/CompanyController.js',                                       
                                    Config.httpBasePath + '/controllers/ProductsController.js',
                                ]
                            });
                        }]
                }
               
            })
            .state('company-view', {
                url: '/company/view/:id',
                requiresLogin: true,            
                templateUrl: Config.httpBasePath + 'views/company/view.html',
                controller: 'CompanyViewCtlr',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MyApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    Config.httpBasePath + '/controllers/ProductsController.js',                                      
                                    Config.httpBasePath + '/controllers/CompanyController.js',
                                ]
                            });
                        }]
                }
            })
            .state('view-company', {
                url: '/view/company/:id',
                requiresLogin: false,            
                templateUrl: Config.httpBasePath + 'views/guest/company-view.html',
                controller: 'CompanyViewCtlr',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MyApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [
                                    Config.httpBasePath + '/controllers/ProductsController.js',                                      
                                    Config.httpBasePath + '/controllers/CompanyController.js',
                                ]
                            });
                        }]
                }
            })
           .state('company-list', {                                 
                url: '/company/list',  
                requiresLogin: true,
                templateUrl: Config.httpBasePath + 'views/company/list.html',
                controller: 'CompanyListCtlr',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'MyApp',
                                insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                files: [                                      
                                    Config.httpBasePath + '/controllers/ProductsController.js',                                       
                                    Config.httpBasePath + '/controllers/CompanyController.js',
                                ]
                            });
                        }]
                }
               
            })
           

      ;
      
      
