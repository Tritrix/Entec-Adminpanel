HomeModule.controller("ClientsController", function ($scope, $state, Data, $http, $timeout, RoutingService, AddClientsService, GetClientListService, DeleteClientsService, LocalStorageInformationService, UpdateClientsService, imageUpload, baseUrl) {
    //, fileUpload

    $scope.imageUrl = baseUrl.imageGetUrl;

    $scope.addCredentials = {
        clientname: '',
        contactperson: '',
        mobile: '',
        landline: '',
        email: '',
        engagement_type: '',
        contact_period_from: '',
        contact_period_to: '',
        address: '',
        location: '',
        city: '',
        state: 'TamilNadu',
        country: 'India'
    };

    var picFilePath = '';

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };


    $('#addClient').attr('disabled', 'disabled');

    $scope.myList = [];
    $scope.$emit('LOAD');
    var logList = Data.getUser();
    console.log(logList);

    /*** List Client **/
    getClient(logList);

    function getClient(logList) {
        $scope.msgText = 'loading...';
        delete logList['client_id'];
        var getClientListPromise = GetClientListService.doGetClientList(logList);
        getClientListPromise.then(function (data) {
            angular.forEach(data, function (value, key) {
                if (data[key] != 'success') {
                    if (data[key].client_logo == null || data[key].client_logo == '/entec_ui/img/user.jpg') {
                        var image = baseUrl.defaultImageUrl;
                    } else {
                        image = data[key].client_logo;
                    }
//                                        console.log(data[key]);
                    $scope.myList.push({
                        client_area: data[key].client_area,
                        client_city: data[key].client_city,
                        client_contact_period_from: data[key].client_contact_period_from,
                        client_contact_period_to: data[key].client_contact_period_to,
                        client_contact_person: data[key].client_contact_person,
                        client_country: data[key].client_country,
                        client_email: data[key].client_email,
                        client_engagement_type: data[key].client_engagement_type,
                        client_id: data[key].client_id,
                        client_landline: data[key].client_landline,
                        client_location: data[key].client_location,
                        client_mobile: data[key].client_mobile,
                        client_logo: image,
                        client_name: data[key].client_name,
                        client_pincode: data[key].client_pincode,
                        client_address: data[key].client_address,
                        client_state: data[key].client_state,
                        client_id: data[key].client_id
                    });
                }
            });
            $scope.$emit('UNLOAD');
        }, function (error) {
            var msg = 'Check Server Connections! ...';
            $scope.showMessage = true;
            $scope.msgText = msg;
            $scope.showNotification(msg);
        });
    }


    /*** Clients detailed view **/
    $scope.clientsDetailedView = function (clientInfo) {
        var info = 'clientDetailedInfo';
        console.log(clientInfo);
        LocalStorageInformationService.setInformation(info, clientInfo);
        $state.go('home.clientsDetailedView');
    };

    $scope.fileNameChanged = function () {
        $('#uploadClientPic').attr('data-disablestat', "true");
        $('#uploadClientPic').removeAttr('disabled');
        $('#saveClientPic').attr('disabled', 'disabled');
    };

    /******* Upload picture **********/
    $scope.upload = function (files) {
        console.log(files);
        var file = files.file;
        var uploadUrl = baseUrl.imageUrl + 'client';
        var uploadPromise = imageUpload.doUpload(file, uploadUrl);
        uploadPromise.then(function (data) {
            if (data.status == "success") {
                $('#uploadClientPic').attr('disabled', 'disabled');
                $('#uploadClientPic').attr('data-disablestat', "true");
                $('#saveClientPic').removeAttr('disabled');

                picFilePath = data.file_path;
                console.log(picFilePath);
                $scope.showNotification('Logo Updated');
            } else {
                var msg = data.errorMessage;
                $scope.showNotification(msg);
                $('#uploadClientPic').attr('data-disablestat', "false");
                $('#uploadClientPic').removeAttr('disabled');
                $('#saveClientPic').attr('disabled', 'disabled');
            }
        }, function (error) {
            var msg = 'NetWork Error! Check Network Connectivity';
            $scope.showNotification(msg);
        });
    };
    /*** Update client**/
    var updateList = {};
    $scope.updateClient = function (clientsDetail) {
        var clients = LocalStorageInformationService.getInformation('clientDetailedInfo');
        console.log(picFilePath);
        console.log(clientsDetail.client_logo);
        console.log(clients.client_logo);
        if (picFilePath != '' || picFilePath != null || picFilePath != undefined) {
            clientsDetail.client_logo = picFilePath || clientsDetail.client_logo;
        }

        console.log(clientsDetail.client_logo);
        clientsDetail.id = logList.id;
        clientsDetail.token = logList.token;
        clientsDetail.client_logo = clients.client_logo;
        console.log(JSON.stringify(clientsDetail));
        var updateClientPromise = UpdateClientsService.doUpdateClients(clientsDetail);
        updateClientPromise.then(function (data) {
            console.log('clients edit detail ' + JSON.stringify(data));
            var msg = 'Cient Updated Succesfully!';
            $scope.showNotification(msg);

        }, function (error) {
            var msg = 'Error Updating!' + 'Check Server Connections';
            $scope.showNotification(msg);
        });
    };

    /*** submit client form data **/
    $scope.addClient = function (addCredentials) {
        addCredentials.client_logo = picFilePath;
        addCredentials.id = logList.id;
        addCredentials.token = logList.token;

        console.log(JSON.stringify(addCredentials));
        var uploadStatus = $('#uploadClientPic').data('disablestat');
        if (uploadStatus == true) {
            var checkInputValidity = checkInputValidityResponse(addCredentials);
            if (checkInputValidity.isValid) {
                var addClientPromise = AddClientsService.doAddClients(addCredentials);
                addClientPromise.then(function (data) {
                    $state.go('home.clients');
                    var msg = 'Client Added Succesfully!';
                    $scope.showNotification(msg);
                }, function (error) {
                    var msg = 'NetWork Error! Check Network Connectivity';
                    $scope.showNotification(msg);
                });

                addClientPromise.then(function () {
                    return $timeout(function () {
                        $('#new_client').removeClass('fade').modal('hide');
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
    };

    /*** delete client**/
    $scope.deleteClient = function (cl, index) {
        var userId = {
            'client_id': cl.client_id
        };
        var ClientsToDelete = angular.extend(userId, logList);
        var clientDeleteListPromise = DeleteClientsService.doDeleteClients(ClientsToDelete);
        clientDeleteListPromise.then(function (data) {
            $scope.myList = [];
            $timeout(getClient(logList), 2000);
        }, function (error) {
            var msg = 'NetWork Error! Check Network Connectivity';
            $scope.showNotification(msg);
        });
    };


    /*** Audit Validation **/
    function checkInputValidityResponse(addCredentials) {
        var errValidation = {
            isValid: false,
            msg: ""
        };
        if (!addCredentials.clientname === '' || addCredentials.clientname === '') {
            errValidation.msg = "Client Name is invalid";
            return errValidation;
        }
        if (!addCredentials.contactperson === '' || addCredentials.contactperson === '') {
            errValidation.msg = "Contact Person is invalid";
            return errValidation;
        }
        if (!addCredentials.mobile === '' || addCredentials.mobile === '') {
            errValidation.msg = "Mobile is invalid";
            return errValidation;
        }
        if (!addCredentials.landline === '' || addCredentials.landline === '') {
            errValidation.msg = "landline is invalid";
            return errValidation;
        }
        if (!addCredentials.email === '' || addCredentials.email === '') {
            errValidation.msg = "Email is invalid";
            return errValidation;
        }
        if (!addCredentials.engagementType === '' || addCredentials.engagementType === '') {
            errValidation.msg = "Engagement Type is invalid";
            return errValidation;
        }
        if (!addCredentials.StartContractDate === '' || addCredentials.StartContractDate === '') {
            errValidation.msg = "Start Contract Date is invalid";
            return errValidation;
        }
        if (!addCredentials.EndContractDate === '' || addCredentials.EndContractDate === '') {
            errValidation.msg = "End Contract Date is invalid";
            return errValidation;
        }
        if (!addCredentials.address === '' || addCredentials.address === '') {
            errValidation.msg = "address is invalid";
            return errValidation;
        }
        if (!addCredentials.location === '' || addCredentials.location === '') {
            errValidation.msg = "location is invalid";
            return errValidation;
        }
        if (!addCredentials.city === '' || addCredentials.city === '') {
            errValidation.msg = "city is invalid";
            return errValidation;
        }
        if (!addCredentials.state === '' || addCredentials.state === '') {
            errValidation.msg = "state is invalid";
            return errValidation;
        }
        if (!addCredentials.country === '' || addCredentials.country === '') {
            errValidation.msg = "country is invalid";
            return errValidation;
        }
        errValidation.isValid = true;
        return errValidation;
    }
});
