var OriginalPath=window.location.origin;
var templatePath='';
if(OriginalPath=='http://ec2-52-37-202-115.us-west-2.compute.amazonaws.com' || OriginalPath=='http://52.37.202.115'){
   templatePath=OriginalPath+'/simpatico/public/';   
   OriginalPath+='/simpatico/public/admin/';
   
}

/**
 * Created by gaurav rana on 18/5/16.
 */


frontAppSpto.constant('Roles',{
    admin:1,
    user:2
}).constant('Config',{
    appTitle:'simpatico',
    apiEndPoint:templatePath+'api/v1/admin',
    apiEndPointBase:templatePath+'api/v1',
    apiEndPointPublic:templatePath+'/api/v1/guest',
    httpServerUrl:templatePath,
    httpBasePath:templatePath,
    httpUploadPath:templatePath+'uploads/',
    AppBasePath:templatePath+'/backend',
    templatePath:templatePath+'/backend/views',
    layoutElementPath:templatePath+'/backend/tpls',
}).constant('google',{
    clientId:'650812187279-8a5gesldih6tot7io5an2rvsl4dr99or.apps.googleusercontent.com',
    scope:'https://www.google.com/m8/feeds',
    url:'https://www.google.com/m8/feeds/contacts/default/full?access_token=',
    limit:'250'
}).constant('toasterOptions',{
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"

});;