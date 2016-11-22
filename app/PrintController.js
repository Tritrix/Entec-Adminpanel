HomeModule.controller('app.print', ['$scope', 'Data', 'RoutingService', 'LocalStorageInformationService', 'getObservationInformationListService', 'DateTimeSplitterService', 'baseUrl', printCtrl]);

function printCtrl($scope, Data, RoutingService, LocalStorageInformationService, getObservationInformationListService, DateTimeSplitterService, baseUrl) {
    RoutingService.goToLogin(RoutingService.checkIfLoggedIn());

    var ctrl = this;
    console.log(ctrl);
    $scope.ObservationList = [];
    $scope.clientList = [];
    var logList = Data.getUser();

    var observations = LocalStorageInformationService.getInformation('observationInfo');
    console.log(observations);
    ctrl.items = observations;

    var auditId = observations.audit_id;
    var clientId = observations.client_id;

    /** * List Observations **/
    if (auditId != '' || clientId != '') {
        var observationDetails = {};
        console.log(logList);
        observationDetails.audit_id = auditId;
        observationDetails.client_id = clientId;
        observationDetails.id = logList.id;
        observationDetails.token = logList.token;
        if (auditId != null || clientId != null) {
            getObservationDetailedInfo();
        }
    } else {
        console.log(LocalStorageInformationService.getInformation('info'));
        RoutingService.goToLogin(false);
    }

    /** * Get Observation details and corresponding client information **/
    function getObservationDetailedInfo() {
        $scope.ObservationList = [];
        $scope.clientList = [];
        var getInformationListPromise = getObservationInformationListService.dogetInformationList(observationDetails);
        getInformationListPromise.then(function (data) {
            var observations = data.observations;
            var audit = data.audit;
            console.log(data);
            if (observations.status == 'failure') {
                var msg = observations.errorMessage;
                $scope.showNotification(msg);
                $scope.showMessage = true;
                $scope.msgText = msg;
                RoutingService.goToLogin(false);
            } else {
                if (observations.length == 0) {
                    var msg = 'No observations found';
                    $scope.showMessage = true;
                    $scope.msgText = msg;
                } else {
                    angular.forEach(observations, function (value, key) {
                        $scope.ObservationList.push({
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

                    $scope.auditName = audit[0].audit_title;
                    $scope.audit_date = audit[0].audit_date;
                    $scope.audit_time = audit[0].audit_time;
                    $scope.audit_location = audit[0].audit_location;

                    $scope.designation = audit[0].designation;
                    $scope.user_name = audit[0].username;
                    $scope.emergency_contact = audit[0].emergencycontact;

                    $scope.client_name = audit[0].client_name;
                    $scope.client_city = audit[0].client_city;
                    $scope.client_state = audit[0].client_state;
                    $scope.client_location = audit[0].client_location;
                    $scope.client_contact_person = audit[0].client_contact_person;
                    $scope.client_mobile = audit[0].client_mobile;
                    $scope.client_email = audit[0].client_email;
                    $scope.client_address = audit[0].client_address;

                    $scope.username = audit[0].username;
                    $scope.email = audit[0].email;
                }
            }
        }, function (error) {
            var msg = 'Check Server Connections! ...';
            $scope.showNotification(msg);
            $scope.showMessage = true;
            $scope.msgText = msg;
        });
    }

    /** * Print Function **/
    $scope.print = function () {
        var printContents = document.getElementById('divName').innerHTML;
        var originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    };
}
