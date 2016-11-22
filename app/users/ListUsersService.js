HomeModule.service("ListUsersListService", function ($http, $q, baseUrl) {
    return {
        doGetUsersList: function (logList) {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default

            return $http.post(baseUrl.Url + 'listuser', logList)
                .then(function (response) {
                    if (typeof response.data == 'object' && response.status == '200') {
                        //                        console.log(typeof response.data);
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
