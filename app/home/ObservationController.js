HomeModule.controller("ObservationController", function ($scope, $modal, $state, $stateParams, $timeout, $location, Data, RoutingService, getObservationInformationListService, ObservationListService, GetClientListService, LocalStorageInformationService, imageUpload, baseUrl) {

    RoutingService.goToLogin(RoutingService.checkIfLoggedIn());

    $scope.ObservationList = [];
    $scope.clientList = [];
    var logList = Data.getUser();
    console.log(logList);
    var picFilePath = '';
    //    $scope.observationPicture = 'observation/1475766951_client_logo.jpg';

    $('#addObservation').attr('disabled', 'disabled');

    /*** observation status ***/
    $scope.observationStatus = {
        availableOptions: [
            {
                id: 'Completed',
                name: 'Completed'
            },
            {
                id: 'Incomplete',
                name: 'In complete'
            },
            {
                id: 'Inprogress',
                name: 'In progress'
            }
    ],
        observation_status: {
            id: 'Inprogress',
            name: 'In progress'
        } //This sets the default value of the select in the ui
    };

    /*** Responsibility status ***/
    $scope.observationResponsibility = {
        availableOptions: [
            {
                id: 'client',
                name: 'client'
            },
            {
                id: 'entec',
                name: 'entec'
            }
        ]
    };
    /*** Priority status ***/
    $scope.observationPriority = {
        availableOptions: [
            {
                id: 'high',
                name: 'high'
            },
            {
                id: 'medium',
                name: 'medium'
            },
            {
                id: 'low',
                name: 'low'
            }
        ]
    };


    /*** getStored observation details ***/
    var observations = LocalStorageInformationService.getInformation('observationInfo');
    var auditId = observations.audit_id;
    var clientId = observations.client_id;

    /**
     * List Observations
     **/
    if (observations.valueOf() != '') {
        var observationDetails = {};
        observationDetails.audit_id = auditId;
        observationDetails.client_id = clientId;
        observationDetails.id = logList.id;
        observationDetails.token = logList.token;
        if (auditId != null || clientId != null) {
            getObservationDetailedInfo();
        }
    } else {
        console.log(LocalStorageInformationService.getInformation('info'));
    }
    console.log(logList);

    /**
     * Get Observation details and corresponding client information
     **/
    function getObservationDetailedInfo() {
        $scope.ObservationList = [];
        $scope.clientList = [];
        var getInformationListPromise = getObservationInformationListService.dogetInformationList(observationDetails);
        getInformationListPromise.then(function (data) {
            var observations = data.observations;
            var audit = data.audit;
            console.log(data);
            if (data.status == 'failure') {
                var msg = data.errorMessage;
                $scope.showNotification(msg);
                $scope.showMessage = true;
                $scope.msgText = msg;
            } else {
                if (observations.length == 0) {
                    var msg = 'No observations found';
                    $scope.showMessage = true;
                    $scope.msgText = msg;
                } else {
                    angular.forEach(observations, function (value, key) {
                        $scope.ObservationList.push({
                            audit_title: value.audit_title,
                            audit_id: value.audit_id,
                            observation_id: value.observation_id,
                            observation_location: value.observation_location,
                            observation_description: value.observation_description,
                            observation_responsibility: value.observation_responsibility,
                            observation_priority: value.observation_priority,
                            observation_status: value.observation_status,
                            observation_image: baseUrl.imageGetUrl + value.observation_image
                        });
                    });
                }

                angular.forEach(audit, function (value, key) {
                    if (value.client_logo == null) {
                        var imageUrl = '/entec_ui/img/user.jpg';
                    } else {
                        imageUrl = baseUrl.imageGetUrl + value.client_logo;
                    }
                    $scope.clientList.push({
                        client_name: value.client_name,
                        client_location: value.client_location,
                        client_contact_person: value.client_contact_person,
                        client_mobile: value.client_mobile,
                        client_email: value.client_email,
                        client_address: value.client_address,
                        client_logo: imageUrl
                    });
                });
            }
        }, function (error) {
            var msg = 'Check Server Connections! ...';
            $scope.showNotification(msg);
            $scope.showMessage = true;
            $scope.msgText = msg;
        });
    }

    getClient(logList);
    /**
     * Get Client detailed information
     **/
    function getClient(logList) {
        //        delete logList.audit_id;
        var getClientListPromise = GetClientListService.doGetClientList(logList);
        getClientListPromise.then(function (data) {
            angular.forEach(data, function (value, key) {
                //                        console.log(JSON.stringify(data[key].client_id) + clientParam);
                if (data[key].client_id == observations.client_id) {
                    //                          console.log(JSON.stringify(data[key]) + data[key].client_id  );
                    $scope.clientsDetail = data[key];
                }
            });
        }, function (error) {
            var msg = 'Error Updating!' + 'Check Server Connections';
            $scope.showNotification(msg);
        });
    }

    /**
     * Upload Observation Image
     **/
    $scope.uploadObservation = function (files) {
            var file = files;
            console.log(file);
            console.log(files);
            if (file == undefined) {
                var msg = 'Choose file to upload';
                $scope.showNotification(msg);
            } else {
                var uploadUrl = baseUrl.imageUrl + 'observation';
                var uploadPromise = imageUpload.doUpload(file, uploadUrl);
                uploadPromise.then(function (data) {
                    console.log(data);
                    if (data.status == "success") {
                        $('#uploadObservationPic').attr('disabled', 'disabled');
                        $('#uploadObservationPic').attr('data-disablestat', "true");
                        $('#addObservation').removeAttr('disabled');
                        $scope.observationPicture = data.file_path;
                        picFilePath = data.file_path;
                    } else if (data.status == "failure") {
                        var msg = data.errorMessage;
                        $scope.showNotification(msg);
                        $('#uploadObservationPic').attr('data-disablestat', "false");
                        $('#uploadObservationPic').removeAttr('disabled');
                        $('#addObservation').attr('disabled', 'disabled');
                    }
                }, function (error) {
                    var msg = 'NetWork Error! Check Network Connectivity';
                    $scope.showNotification(msg);
                });
            }
        }
        /**
         * Update Observation 
         **/
    $scope.updateObservation = function (ol, index) {
        if (picFilePath != '') {
            ol.observation_image = picFilePath;
        }
        console.log(ol);
        var observationToUpdate = angular.extend(ol, logList);
        var updatedObservationListPromise = ObservationListService.doUpdateObservationList(observationToUpdate);
        updatedObservationListPromise.then(function (data) {
            getObservationDetailedInfo();
        }, function (error) {
            var msg = 'NetWork Error! Check Network Connectivity';
            $scope.showNotification(msg);
        });
    }

    /**
     * Add Observation 
     **/
    $scope.addObservation = function (obCredentials) {
        var uploadStatus = $('#uploadObservationPic').data('disablestat');
        console.log(uploadStatus);
        if (uploadStatus == true) {
            var addObservation = obCredentials;
            addObservation.audit_id = auditId;
            addObservation.observation_image = picFilePath;

            var observationBucket = angular.extend(addObservation, logList);
            console.log("=================" + JSON.stringify(observationBucket));

            var addObservationPromise = ObservationListService.doAddObservationList(observationBucket);
            addObservationPromise.then(function (data) {
                console.log("=================");
                $('#observation').removeClass('fade').modal('hide');
                $state.reload('home.auditDetailedView');
            }, function (error) {
                var msg = 'Error Updating!' + 'Check Server Connections';
                $scope.showNotification(msg);
            });
        }
    }




    /**
     * Delete Observation 
     **/
    $scope.deleteObservation = function (ol, index) {
        var observationId = {
            'observation_id': ol.observation_id
        };
        var observationToDelete = angular.extend(observationId, logList);
        var observationDeletePromise = ObservationListService.doDeleteObservationList(observationToDelete);
        observationDeletePromise.then(function (data) {
            getObservationDetailedInfo();
        }, function (error) {
            var msg = 'NetWork Error! Check Network Connectivity';
            $scope.showNotification(msg);
        });
    }


    $scope.printObservation = function () {
        $state.go('template');
        //        var modalInstance = $modal.open({
        //            templateUrl: 'auditReport',
        //            size: 'lg',
        //            controller: 'app.print',
        //            controllerAs: 'ctrl'
        //        });
    }
    var url = $location.absUrl();
    alert(url);
});
