HomeModule.service("getObservationInformationListService", function ($http, $q, baseUrl) {

    // get observation list based on audit information
    return {
        dogetInformationList: function (logList) {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default
            return $http.post(baseUrl.Url + 'listobservation', logList)
                .then(function (response) {
                    if (typeof response.data == 'object' && response.status == '200') {
                        return response.data;
                    } else {
                        // invalid response
                        console.log(response);
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

HomeModule.service("ObservationListService", function ($http, $q, baseUrl) {

    // add observation list based on audit information
    return {
        doAddObservationList: function (observationBucket) {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default

            return $http.post(baseUrl.Url + 'addobservation', observationBucket)
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
        },
        doUpdateObservationList: function (observationToUpdate) {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default
            return $http.post(baseUrl.Url + 'updateobservation', observationToUpdate)
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
        },
        doDeleteObservationList: function (observationToDelete) {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default
            return $http.post(baseUrl.Url + 'deleteobservation', observationToDelete)
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
