HomeModule.controller("UsersController", function ($scope, $state, $timeout, Data, RoutingService, ListUsersListService, AddUsersService, DeleteUserService, LocalStorageInformationService, imageUpload, baseUrl) {
    RoutingService.goToLogin(RoutingService.checkIfLoggedIn());
    var logList = Data.getUser();
    $scope.imageUrl = baseUrl.imageGetUrl;
    $scope.UsersList = [];
    $scope.msgText = 'loading...';
    $('#addUser').attr('disabled', 'disabled');
    $scope.$emit('LOAD');
    var profilePic = '';

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };
    getUsers(logList);

    function getUsers(logList) {
        $scope.msgText = 'loading...';
        var getUsersListPromise = ListUsersListService.doGetUsersList(logList);
        getUsersListPromise.then(function (data) {
            angular.forEach(data, function (value, key) {
                if (data[key] != 'success') {
                    if (data[key].picture == null || data[key].picture == '') {
                        data[key].picture = '/images/user.jpg';
                    } else if (data[key].picture == 'f:/test/picture') {
                        data[key].picture = '/images/user.jpg';
                    }
                    $scope.UsersList.push(data[key]);
                }
            });
            console.log($scope.UsersList);
            $scope.$emit('UNLOAD');
        }, function (error) {
            var msg = 'Check Server Connections! ...';
            $scope.showMessage = true;
            $scope.msgText = msg;
            $scope.showNotification(msg);
        });
    }


    /**
     * Create User
     **/
    $scope.createUser = function (user) {
        var userDetails = user;
        var userBucket = angular.extend(userDetails, logList);
        console.log(userBucket);

        var uploadStatus = $('#uploadUserPic').data('disablestat');
        console.log(uploadStatus);
        if (uploadStatus == true) {
            var createUserPromise = AddUsersService.doCreateUser(userBucket);
            createUserPromise.then(function (data) {
                var UserPromise = ListUsersListService.doGetUsersList(logList);
                UserPromise.then(function (data) {
                    $('#new_user').modal('hide');
                    $scope.UsersList = data;
                    //                    $state.reload();
                }, function (error) {
                    var msg = 'NetWork Error! Check Network Connectivity';
                    $scope.showNotification(msg);
                });
            }, function (error) {
                var msg = 'NetWork Error! Check Network Connectivity';
                $scope.showNotification(msg);
            });
        }
    }


    /**
     * get Detailed User information
     **/
    $scope.userDetailed = [];
    $scope.userDetail = function (userInfo) {
        var info = 'userInfo';
        LocalStorageInformationService.setInformation(info, userInfo);
        $scope.userDetailed.push(userInfo);
        $state.go('home.usersDetailedView');
    }


    /**********
     **** Upload picture
     **********/
    $scope.upload = function (files) {
        var file = files.file;
        var uploadUrl = baseUrl.imageUrl + 'profilepicture';
        console.log(uploadUrl);
        var uploadPromise = imageUpload.doUpload(file, uploadUrl);
        uploadPromise.then(function (data) {
            if (data.status == "success") {
                $('#uploadClientPic').attr('disabled', 'disabled');
                $('#uploadClientPic').attr('data-disablestat', "true");
                $('#addClient').removeAttr('disabled');
                profilePic = data.file_path;
                console.log(profilePic);
            } else {
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



    /**********
     **** Delete User
     **********/
    $scope.deleteUser = function (ul, index) {
        var userid = {
            'userid': ul.userid
        };
        var userToDelete = angular.extend(userid, logList);
        var userDeleteListPromise = DeleteUserService.doDeleteUser(userToDelete);
        userDeleteListPromise.then(function (data) {
            $scope.UsersList = [];
            //            $state.reload();
            //                   $timeout(getUsers(logList), 2000);
        }, function (error) {
            var msg = 'NetWork Error! Check Network Connectivity';
            $scope.showNotification(msg);
        });
    }

});
