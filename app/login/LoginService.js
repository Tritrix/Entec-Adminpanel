LoginModule.service("LoginService", function ($http, $q, baseUrl) {
    return {
        doLogin: function (credentials) {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default
            console.log(credentials);
            return $http.post(baseUrl.Url + 'adminlogin', credentials)
                //            return $http.post('http://entec/api/v1/users/adminlogin', credentials)
                .then(function (response) {
                    console.log(response.data);
                    if (typeof response.data === 'object' && response.status === 200) {
                        console.log(response.data);
                        return response.data;
                    } else {
                        // invalid response
                        console.log(response.data);
                        return $q.reject(response.data);
                    }
                }, function (response) {
                    // something went wrong
                    console.log(response.data);
                    return $q.reject(response.data);
                });
        }
    };
});
