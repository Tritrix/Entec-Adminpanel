var LoginModule = angular.module("LoginModule", []);

LoginModule.controller("LoginController", function ($scope, $state, LoginService, Data, RoutingService) {
   
    console.log("Login Controller loaded");

    $scope.credentials = {
        username: '',
        password: ''
    };

    $scope.login = function (credentials) {
        $scope.$emit('LOAD');
        var checkValidity = checkValidResponse(credentials);
        if (checkValidity) {
            var loginPromise = LoginService.doLogin(credentials);
            loginPromise.then(function (data) {
                checkLoginResponse(data);
                 $scope.$emit('UNLOAD');
            }, function (error) {
                var msg = 'NetWork Error! Check Network Connectivity';
                $scope.showNotification(msg);
            });
        } else {
            $scope.anyDirtyAndInvalid = true;
            setTimeout(function () {
                $scope.$apply(function () {
                    $scope.anyDirtyAndInvalid = false;
                });
            }, 2000);
        }
    }

    /**
     * Private Methods
     **/

    function checkValidResponse(credentials) {
        if ($scope.credentials.email == '' || $scope.credentials.password == '') {
            var msg = 'Enter Credentials';
            $scope.showNotification(msg);
            return false;
        }

        return true;
    }

    function checkLoginResponse(data) {
        if (data.loginstatus === "success") {
            updateUserInfo(data);
            RoutingService.goToHome(true);
        } else {
            console.log("error");
            var msg = 'Wrong User Credentials';
            $scope.showNotification(msg);
        }
    }

    function updateUserInfo(data) {
        var excludedKeys = ["id", "token"];

        for (var key in data) {
            if (data.hasOwnProperty(key) && (excludedKeys.indexOf(key) !== -1)) {
                Data.addProperty(key, data[key]);
            }
        }
    }

})
