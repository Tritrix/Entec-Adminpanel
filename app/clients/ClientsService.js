HomeModule.service("GetClientListService", function ($http, $q, baseUrl) {
    return {
        doGetClientList: function (getClientList) {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default
            return $http.post(baseUrl.Url + 'listclient', getClientList)
                //            return $http.post('http://entec/api/v1/users/listclient', getClientList)
                .then(function (response) {
                    //                console.log(response.data);
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


HomeModule.service("AddClientsService", function ($http, $q, baseUrl) {
    return {
        doAddClients: function (addCredentials) {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default

                console.log(addCredentials);
            return $http.post(baseUrl.Url + 'addclient', addCredentials)
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


HomeModule.service("EditClientsService", function ($http, $q, baseUrl) {
    return {
        doEditClients: function (logList) {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default

            return $http.post(baseUrl.Url + 'editclient', logList)
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

HomeModule.service("UpdateClientsService", function ($http, $q, baseUrl) {
    return {
        doUpdateClients: function (updateBucket) {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default

            return $http.post(baseUrl.Url + 'updateclient', updateBucket)
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

HomeModule.service("DeleteClientsService", function ($http, $q, baseUrl) {
    return {
        doDeleteClients: function (ClientsToDelete) {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default

            return $http.post(baseUrl.Url + 'deleteclient', ClientsToDelete)
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
