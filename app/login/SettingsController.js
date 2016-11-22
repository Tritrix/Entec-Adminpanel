LoginModule.controller("VerificationController", function ($scope, $state, Data, RoutingService, NewPasswordService) {
    
//    RoutingService.goToLogin(RoutingService.checkIfLoggedIn());
    var logList = Data.getUser();
    
    $scope.changePassword = function (password){
        console.log(password.newPassword);  
            logList.password = password.newPassword;
                
            var changeNewPasswordPromise = NewPasswordService.changeNewPassword(logList);
                changeNewPasswordPromise.then(function (data) {
                    console.log(JSON.stringify(data));
                }, function (error) {
                    var msg = 'Error Updating!' + 'Check Server Connections';
                    $scope.showNotification(msg);
            });
    }
    
 
});
    
    
    