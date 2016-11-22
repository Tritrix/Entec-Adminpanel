HomeModule.service("AddUsersService", function ($http, $q, baseUrl) {
    return {
        doCreateUser: function (userBucket) {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default

            return $http.post(baseUrl.Url + 'adduser', userBucket) 
                .then(function (response) {
                    if (typeof response.data == 'object' && response.status == '200') {
                        return response.data;
                    } else {
                        // invalid response
                        console.log("response.data error");
                        return $q.reject(response.data);
                    }

                }, function (response) {
                    // something went wrong
                    console.log("error");
                    return $q.reject(response.data);
                });
        }
    };
});

HomeModule.service("DeleteUserService", function ($http, $q, baseUrl) {
    return {
        doDeleteUser: function (userToDelete) {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default

            return $http.post(baseUrl.Url + 'deleteuser', userToDelete) 
                .then(function (response) {
                    if (typeof response.data == 'object' && response.status == '200') {
                        return response.data;
                    } else {
                        // invalid response
                        console.log("response.data error");
                        return $q.reject(response.data);
                    }

                }, function (response) {
                    // something went wrong
                    console.log("error");
                    return $q.reject(response.data);
                });
        }
    };
});


HomeModule.service("UpdateUsersService", function ($http, $q, baseUrl) {
    return {
        doUpdateUsers: function (updateBucket) {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default

            return $http.post(baseUrl.Url + 'updateuser', updateBucket) 
                .then(function (response) {
                    if (typeof response.data == 'object' && response.status == '200') {
                        return response.data;
                    } else {
                        // invalid response
                        console.log("response.data error");
                        return $q.reject(response.data);
                    }

                }, function (response) {
                    // something went wrong
                    console.log("error");
                    return $q.reject(response.data);
                });
        }
    };
});
