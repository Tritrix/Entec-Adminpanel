/**
 * Storage Mechanism to persist user info in the application
 *      user = {
 *          email: 'xxxx.com',
 *          token: 'ebjaosdo1234423'
 *      }
 *
 **/


GlobalModule.service("Data", function ($localStorage) {
    console.log("2. Data.init");
    /**
     * Initializes user profile if not already present
     **/
    this.init = function () {
        if (!$localStorage.user) {
            $localStorage.user = {};
        }
    }


    /**
     * Returns total user information from localstorage
     **/

    this.getUser = function () {
        return $localStorage.user;
    }
    
    /**
     * Updates total user information in localstorage
     **/

    this.setUser = function (user) {
        $localStorage.user = user;
    }
    
    /**
     * Clear all user data from localstorage
     **/

    this.clear = function () {
        $localStorage.$reset();
    }
    
    /**
     * Add property to user
     **/
    
    this.addProperty = function (key, value) {
        this.init();
        $localStorage.user[key] = value;
    }
    
    /**
     * Get a property of user
     **/
    
    this.getProperty = function(key) {
        return $localStorage.user[key];
    }
    
    /**
     * Remove a property to user
     **/
    
    this.removeProperty = function(key) {
        delete $localStorage.user[key];
    }
 
    
    return this;
})