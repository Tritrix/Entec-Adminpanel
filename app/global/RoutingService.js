GlobalModule.service("RoutingService", function (Data, $state) {
    console.log("routing service");
    this.checkIfLoggedIn = function () {
        var user = Data.getUser();
        var isLoggedIn = true;
        if (Object.keys(user).length === 0) {
            isLoggedIn = false;
            console.log(isLoggedIn + JSON.stringify(user));
        }
        return isLoggedIn;
    }

    this.goToLogin = function (isLoggedIn) {
        if(!isLoggedIn){
            console.log(isLoggedIn);
            $state.go('login');
        }
    }
    
    this.goToHome = function (isLoggedIn) {
        if(isLoggedIn) {
            console.log(isLoggedIn );
            $state.go('home');
        }
    }
});