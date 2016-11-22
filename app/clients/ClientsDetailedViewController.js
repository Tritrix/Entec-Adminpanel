HomeModule.controller("ClientsDetailedViewController", function ($scope, $state, $timeout, Data, RoutingService, GetAuditListByClientService, DeleteClientsService, UpdateClientsService, DateTimeSplitterService, LocalStorageInformationService, imageUpload, baseUrl) {

    var profilePic = '';
    var imageUrl = baseUrl.imageUrl;
    var defaultImageUrl = baseUrl.defaultImageUrl;
    var logList = Data.getUser();

    /*** getStored Client details ***/
    var clients = LocalStorageInformationService.getInformation('clientDetailedInfo');

    if (clients.client_logo == null) {
        clients.client_logo = baseUrl.defaultImageUrl;
    } else {
        clients.client_logo = clients.client_logo;
    }
    
    
    $scope.clientsDetail = clients;
    var clientId = clients.client_id;

    if (clientId != null) {
        $scope.msgText = 'loading...';
        var clientsDetail = {};
        clientsDetail.client_id = clientId;
        clientsDetail.id = logList.id;
        clientsDetail.token = logList.token;
        $scope.AuditList = [];

        $scope.$emit('LOAD');
        var getClientInfoPromise = GetAuditListByClientService.doGetAuditsListByClient(clientsDetail);
        getClientInfoPromise.then(function (data) {
                    var msg = 'No Audits found';
                    $scope.msgText = msg;
                if (data.status == 'failure') {
                    $scope.showMessage = true;
                } else {
                    if (Object.keys(data).length == 1 && data.status == 'success') {                           
                        console.log(data);
                        $scope.showMessage = true;
                    } else {
                        angular.forEach(data, function (value, key) {
//                            console.log(value);
                            if (value != 'success') {
                                $scope.showMessage = false;
                                if (value.client_logo == null || value.client_logo == '/entec_ui/img/user.jpg') {
                                    var image = baseUrl.defaultImageUrl;
                                } else {
                                    image = value.client_logo;
                                }
                                $scope.AuditList.push({
                                    audit_id: value.audit_id,
                                    audit_date: value.audit_date,
                                    audit_time: value.audit_time,
                                    audit_location: value.audit_location,
                                    audit_status: value.audit_status,
                                    auditor: value.auditor,
                                    client_id: value.client_id,
                                    client_name: value.client_name,
                                    client_contact_person: value.client_contact_person,
                                    client_mobile: value.client_mobile,
                                    client_location: value.client_location,
                                    client_address: value.client_address,
                                    client_logo: value.client_logo,
                                    client_email: value.client_email,
                                    user_name: value.username,
                                    user_designation: value.designation,
                                    user_mobile: value.mobile,
                                });
                            } else if (value == 'success') {
                                var msg = 'No Audits found';
                                $scope.showMessage = true;
                                $scope.msgText = msg;
                            }
                        });
                        $scope.showMessage = false;
                        $scope.$emit('UNLOAD');
                    }
                }
            },
            function (error) {
                var msg = 'Check Server Connections';
                $scope.showMessage = true;
                $scope.msgText = msg;
                $scope.showNotification(msg);
            });
    }


    /*** Param Values to state auditDetailedView **/
    $scope.Observation = [];
    $scope.observationDetail = function (al) {
        var info = 'ObservationDetailInfo';
        LocalStorageInformationService.setInformation(info, al);
        //        $scope.Observation.push(al);
        $state.go('home.auditDetailedView');
    }


    /*** delete client **/
    $scope.deleteClient = function () {
        var clientDetails = logList;
        clientDetails.client_id = clientId;
        var deleteClientPromise = DeleteClientsService.doDeleteClients(logList);
        deleteClientPromise.then(function (data) {
            console.log('clients detail' + JSON.stringify(data));
            return $timeout(function () {
                $('#confirmation').removeClass('fade').modal('hide');
                $state.go('home.clients');
            }, 100);
            var msg = 'Cient Deleted Succesfully!';
            $scope.showNotification(msg);
        }, function (error) {
            var msg = 'Error Updating!' + 'Check Server Connections';
            $scope.showNotification(msg);
        });
    }


});
