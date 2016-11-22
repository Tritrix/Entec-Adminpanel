HomeModule.service("GetAuditListService", function ($http, $q, baseUrl) {
    return {
        doGetAuditsList: function (logList) {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default

                        return $http.post(baseUrl.Url + 'listaudit', logList)
                            .then(function (response) {
            //                    console.log(response);
                                if (typeof response.data == 'object' && response.status == '200') {
                                    return response.data;
                                } else {
                                    // invalid response
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

HomeModule.service("GetAuditListByClientService", function ($http, $q, baseUrl) {
    return {
        doGetAuditsListByClient: function (clientsDetails) {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default
            //            console.log('service data' + JSON.stringify(clientsDetails));
            return $http.post(baseUrl.Url + 'listclientaudit', clientsDetails)
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

HomeModule.service("AddAuditListService", function ($http, $q, baseUrl) {
    return {
        doAddAuditsList: function (auditBucket) {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default

//            console.log(JSON.stringify(auditBucket));
            return $http.post(baseUrl.Url + 'addaudit', auditBucket)
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

HomeModule.service("DeleteAuditListService", function ($http, $q, baseUrl) {
    return {
        doDeleteAuditsList: function (deleteAuditBucket) {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default

            return $http.post(baseUrl.Url + 'deleteaudit', deleteAuditBucket)
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
