LogoutModule.service("LogoutService", function ($http, $q, baseUrl) {
    return {
        doLogout: function (user) {
            return $http.post(baseUrl.Url + 'logoutadmin', user)
                .then(function (response) {
                    if (typeof response.data === 'object') {
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
