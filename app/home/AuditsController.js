var HomeModule = angular.module("HomeModule", []);

HomeModule.controller("AuditsController", function ($scope, Data, $timeout, $filter, $state, RoutingService, GetAuditListService, AddAuditListService, DeleteAuditListService, DateTimeSplitterService, GetClientListService, LocalStorageInformationService, ListUsersListService, baseUrl) {
    console.log("Home Module Loaded");
    RoutingService.goToLogin(RoutingService.checkIfLoggedIn());

    var logList = Data.getUser();
    $scope.getClientInfo = [];
    $scope.getClientLocation = [];
    $scope.auditor = [];

    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        dateFormat: 'yy-mm-dd',
        yearRange: '1900:-0'
    };
    $scope.AuditList = '';
    $scope.search = '';
    $scope.showMessage = true;

    $scope.auditCredentials = {
        client_name: '',
        auditor: '',
        audit_location: '',
        audit_status: '',
        audit_date: '',
        audit_time: moment().second(0).milliseconds(0).toDate()
    }

    $scope.selectClient = function () {
        console.log($scope.auditCredentials.client_name);
        console.log($scope.auditCredentials.client_name.name);
    };

    /**
     * Audit List
     **/
    $scope.getAudits = [];
    var getAuditListPromise = GetAuditListService.doGetAuditsList(logList);
    $scope.$emit('LOAD');
    getAuditListPromise.then(function (data) {
        $scope.AuditList = DateTimeSplitterService.updateDateTimeList(data);
        //console.log(data);
        if (Object.keys(data).length != 1 && data.status !== 'success') {
            var msg = 'No Audits';
            $scope.showMessage = true;
            $scope.msgText = msg;
        } else {
            $scope.showMessage = false;
            angular.forEach(data, function (value, key) {
//                console.log(value);
                if (Object.keys(data).length != 1 && data[key] !== 'success') {
                    $scope.getAudits.push({
                        audit_id: data[key].audit_id,
                        audit_date: data[key].audit_date,
                        audit_time: data[key].audit_time,
                        audit_location: data[key].audit_location,
                        audit_status: data[key].audit_status,
                        auditor: data[key].auditor,
                        client_id: data[key].client_id,
                        client_name: data[key].client_name,
                        client_contact_person: data[key].client_contact_person,
                        client_mobile: data[key].client_mobile,
                        client_location: data[key].client_location,
                        client_address: data[key].client_address,
                        client_logo: data[key].client_logo,
                        user_name: data[key].username,
                        user_designation: data[key].designation,
                        user_mobile: data[key].mobile,
                    });
                }
            });
            $scope.$emit('UNLOAD');
        }
    }, function (error) {
        var msg = 'Check Server Connection! ...';
        $scope.showMessage = true;
        $scope.msgText = msg;
        $scope.showNotification(msg);
    });


    /**
     * Client List for the dropdown in the new audit modal
     **/
    var getClientListPromise = GetClientListService.doGetClientList(logList);
    getClientListPromise.then(function (data) {
        //console.log(data);
        angular.forEach(data, function (value, key) {
            if (data[key] !== 'success') {
                $scope.getClientInfo.push({
                    client_name: data[key].client_name,
                    client_id: data[key].client_id
                });
                $scope.getClientLocation.push({
                    location: data[key].client_location
                });
            }
        });
    }, function (error) {
        var msg = 'Client List not loaded...';
        $scope.showNotification(msg);
    });



    /**
     * Auditor List for the dropdown in the new audit modal
     **/
    var getUsersListPromise = ListUsersListService.doGetUsersList(logList);
    getUsersListPromise.then(function (data) {
        angular.forEach(data, function (value, key) {
            if (data[key] !== 'success') {
                $scope.auditor.push({
                    name: data[key].username,
                    id: data[key].userid
                });
            }
        });
    }, function (error) {
        var msg = 'Check Server Connection! ...';
        $scope.showMessage = true;
        $scope.msgText = msg;
        $scope.showNotification(msg);
    });





    /**
     * Param Values to state auditDetailedView
     **/
    $scope.Observation = [];
    $scope.observationDetail = function (auditInfo) {
        var info = 'observationInfo';
        LocalStorageInformationService.setInformation(info, auditInfo);
        $state.go('home.auditDetailedView');
    }




    /**
     * Add Audits 
     **/
    var auditList = {};
    $scope.addAudit = function (auditCredentials) {
        $scope.$emit('LOAD');

        var timeLocalString = auditCredentials.audit_time.toLocaleString();
        var convertedDate = new Date(timeLocalString);

        var clientName = auditCredentials.client_name;

        auditList['client_name'] = clientName.client_name;
        auditList['client_id'] = clientName.client_id;
        auditList['auditor'] = auditCredentials.auditor;
        auditList['audit_location'] = auditCredentials.audit_location;
        auditList['audit_status'] = auditCredentials.audit_status;
        auditList['audit_date'] = auditCredentials.audit_date;
        auditList['audit_time'] = auditCredentials.audit_time;
        auditList['audit_date'] = convertDateToString(auditCredentials.audit_date);

        console.log("=================" + auditList);

        var checkInputValidity = checkInputValidityResponse(auditCredentials);

        if (checkInputValidity.isValid) {

            var auditBucket = angular.extend(auditList, logList);
            console.log("=================" + JSON.stringify(auditBucket));

            var addAuditListPromise = AddAuditListService.doAddAuditsList(auditBucket);
            addAuditListPromise.then(function (data) {
                $scope.AuditList = data;
                if (data.errorCode == "501") {
                    var msg = 'Please Select Audit Time. Audit Time Should not be empty';
                    $scope.showNotification(msg);
                }
            }, function (error) {
                var msg = 'Error Updating!' + 'Check Server Connections';
                $scope.showNotification(msg);
            });
            addAuditListPromise.then(function () {
                return $timeout(function () {
                    $('#new_audit').removeClass('fade').modal('hide');
                    $state.go('.', {}, {
                        reload: true
                    });
                }, 100);
            });
        } else {
            var msg = 'Fill all the Details';
            $scope.showNotification(msg);
            $scope.$emit('UNLOAD');
        }
    }


    /**
     * Delete Audit 
     **/
    $scope.deleteAudit = function (al) {

        $scope.$emit('LOAD');
        var deleteAuditBucket = logList;
        deleteAuditBucket.audit_id = al.audit_id;

        var deleteAuditListPromise = DeleteAuditListService.doDeleteAuditsList(deleteAuditBucket);
        deleteAuditListPromise.then(function (data) {
            $scope.$emit('UNLOAD');
            $state.reload();
        }, function (error) {
            var msg = 'Error Updating!' + 'Check Server Connections';
            $scope.showNotification(msg);
        });
    }


    /**
     * Converts date object to date string yyyy-mm-dd
     **/

    function convertDateToString(audit_date) {
        console.log('DATE TYPE: ' + typeof audit_date);
        console.log("STRING DATE: " + audit_date.getFullYear() + "-" + (audit_date.getMonth() + 1) + "-" + audit_date.getDate());
        return audit_date.getFullYear() + "-" + (audit_date.getMonth() + 1) + "-" + audit_date.getDate();
    }

    /**
     * Audit Validation
     **/
    function checkInputValidityResponse(auditCredentials) {
        var errValidation = {
            isValid: false,
            msg: ""
        };
        if (!auditCredentials.client_name === '' || auditCredentials.client_name === '') {
            errValidation.msg = "First Name is invalid";
            return errValidation;
        }
        if (!auditCredentials.auditor === '' || auditCredentials.auditor === '') {
            errValidation.msg = "First Name is invalid";
            return errValidation;
        }
        if (!auditCredentials.audit_location === '' || auditCredentials.audit_location === '') {
            errValidation.msg = "First Name is invalid";
            return errValidation;
        }
        if (!auditCredentials.audit_status === '' || auditCredentials.audit_status === '') {
            errValidation.msg = "First Name is invalid";
            return errValidation;
        }
        if (!auditCredentials.audit_date === '' || auditCredentials.audit_date === '') {
            errValidation.msg = "First Name is invalid";
            return errValidation;
        }
        if (auditCredentials.audit_time === '') {
            errValidation.msg = "First Name is invalid";
            return errValidation;
        }

        errValidation.isValid = true;
        return errValidation;
    }

})
