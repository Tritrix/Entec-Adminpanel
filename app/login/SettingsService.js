LoginModule.service("NewPasswordService", function ($http, $q) {
    return {
        changeNewPassword: function (logList) {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default
            return $http.post('http://entec/api/v1/users/changepassword', logList)
                .then(function (response) {
                    if (typeof response.data === 'object' && response.status === 200) {
                        return response.data;
                    } else {
                        // invalid response
                        return $q.reject(response.data);
                    }
                }, function (response) {
                    // something went wrong
                    return $q.reject(response.data);
                });
        }
    };
});