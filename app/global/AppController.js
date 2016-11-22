var GlobalModule = angular.module('GlobalModule', []);

GlobalModule.controller('AppController', function ($scope, $timeout, Data, RoutingService) {

    console.log("Application Controller loaded");
    Data.init();
    console.log("data init loaded");
    $scope.showMessage = false;

    $scope.showNotification = function (msg) {
        $(".alerts").addClass("alertNotify");
        $scope.notificationMsg = msg;
        setTimeout(function () {
            $scope.$apply(function () {
                $scope.hideNotification();
                $(".alerts").addClass("alertNotify").removeClass("alertNotify");
            });
        }, 3000);
    }

    $scope.hideNotification = function (msg) {
        $scope.notificationMsg = "";
    }

    //    $scope.$on('LOAD', function(){
    //        $scope.loading = true;   
    //    }); 
    //    
    //    $scope.$on('UNLOAD', function(){
    //        $scope.loading = false;   
    //    }); 
});
