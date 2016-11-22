HomeModule.service("LocalStorageInformationService", function ($localStorage) {


    /**
     * Initializes user profile if not already present
     **/
    this.init = function () {
        if (!$localStorage.information) {
            $localStorage.information = {};
        }
    }

    /**
     * Returns observation details
     **/
    this.getInformation = function (key) {
        return $localStorage.information[key];
        console.log($localStorage.information);
    }


    /**
     * Updates observation details
     **/
    this.setInformation = function (key, information) {
        console.log(key);
        this.init();
        $localStorage.information[key] = information;
        console.log($localStorage.information);
    }

    return this;
})
