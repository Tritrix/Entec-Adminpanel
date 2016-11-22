var LogoutModule = angular.module("LogoutModule", []);

LogoutModule.controller("LogoutController", function ($scope, $state, Data, LogoutService, RoutingService) {
    console.log('Logout Controller Loaded ');
    
    $scope.user = Data.getUser();
      
    $scope.logout = function()  {     
        var user = Data.getUser();
        console.log('user details'+JSON.stringify(user));
        var logoutPromise = LogoutService.doLogout(user);        
        logoutPromise.then(function (data) {
        console.log(JSON.stringify(data.status));
        logoutResponse(data);
        }, function (error){
            var msg = 'Server error. Something went wrong Try again later.';
            $scope.showNotification(msg);
        });    
   
    }
    
    /**
     * Logout Succes or Failure
     **/ 
    function logoutResponse(data) {
        if (data.status == "success") {
            var removeToken = Data.clear();   
            console.log('-token deleted-'+ removeToken);
            $state.go('login');
        } else { 
            var msg = 'Logout Error';
            $scope.showNotification(msg);
        }

    }
});
