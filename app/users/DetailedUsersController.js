HomeModule.controller("DetailedUsersController", function ($scope, $state, $stateParams, $timeout, Data, RoutingService, UpdateUsersService, LocalStorageInformationService, baseUrl, imageUpload) {

    var profilePic = '';
    var logList = Data.getUser();
    $scope.imageUrl = baseUrl.imageGetUrl;
    
    $scope.userDetailed = [];
    $('#saveUser').attr('disabled');

    $scope.start = new Date();
    $scope.end = new Date();

    //$scope.minStartDate = 0; //fixed date
    //$scope.maxStartDate = $scope.end; //init value
    $scope.minEndDate = $scope.start; //init value
    $scope.maxEndDate = $scope.end; //fixed date same as $scope.maxStartDate init value

    $scope.$watch('start', function (v) {
        $scope.minEndDate = v;
    });
    
    $scope.$watch('$data', function (v) {
        console.log(v);
        $scope.maxEndDate = v;
    });

//    $scope.openStart = function () {
//        $timeout(function () {
//            $scope.startOpened = true;
//        });
//    };

    $scope.openEnd = function () {
        $timeout(function () {
            $scope.endOpened = true;
        });
    };

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };


    $scope.openedDOB = {};
    $scope.openDOB = function ($event, elementOpened) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.openedDOB[elementOpened] = !$scope.openedDOB[elementOpened];
    };

    $scope.openedDOJ = {};
    $scope.openDOJ = function ($event, elementOpened) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.openedDOJ[elementOpened] = !$scope.openedDOJ[elementOpened];
    };


    /*** getStored observation details ***/
    var users = LocalStorageInformationService.getInformation('userInfo');
    if (users.picture == null || users.picture == '') {
        users.picture = '/images/user.jpg';
    } else {
        users.picture = users.picture;
    }
    $scope.userDetail = users;
    console.log(users);



    /**********
     **** Upload picture
     **********/
    $scope.upload = function (files) {
        var file = files.file;
        console.log(file);
        var uploadUrl = baseUrl.imageUrl + 'profilepicture';
        console.log(uploadUrl);

        var uploadPromise = imageUpload.doUpload(file, uploadUrl);
        uploadPromise.then(function (data) {
            if (data.status == "success") {
                $('#uploadUsersPic').attr('disabled', 'disabled');
                $('#uploadUsersPic').attr('data-disablestat', "true");
                $('#saveUser').removeAttr('disabled');
                profilePic = data.file_path;
                console.log(profilePic);
            } else {
                var msg = data.errorMessage;
                $scope.showNotification(msg);
                $('#uploadUsersPic').attr('data-disablestat', "false");
                $('#uploadUsersPic').removeAttr('disabled');
                $('#saveUser').attr('disabled', 'disabled');
            }
        }, function (error) {
            var msg = 'NetWork Error! Check Network Connectivity';
            $scope.showNotification(msg);
        });
    }

    /***
     **** Update Users ****
     ***/
    $scope.updateUsers = function (userDetail) {
        var userUpdateList = {};
//        userUpdateList.userid = userDetail.userid;
//        userUpdateList.username = userDetail.username;
//        userUpdateList.designation = userDetail.designation;
//        userUpdateList.dob = userDetail.dob;
//        userUpdateList.email = userDetail.email;
//        userUpdateList.address = userDetail.address;
//        userUpdateList.gender = userDetail.gender;
//        userUpdateList.mobile = userDetail.mobile;
//        userUpdateList.doj = userDetail.doj;
//        userUpdateList.picture = profilePic;
//        userUpdateList.emergencycontact = userDetail.emergencycontact;
        
        console.log(JSON.stringify(userDetail.picture));
        if (profilePic != '' || profilePic != null || profilePic != undefined) {
            userDetail.picture = profilePic || userDetail.picture;
        } 

        userDetail.id = logList.id;
        userDetail.token = logList.token;
        console.log(JSON.stringify(userDetail));
        var updateClientPromise = UpdateUsersService.doUpdateUsers(userDetail);
        updateClientPromise.then(function (data) {
            var msg = 'User Updated Succesfully!';
            $scope.showNotification(msg);
        }, function (error) {
            var msg = 'Error Updating!' + '\n Check Server Connections';
            $scope.showNotification(msg);
        });
    }
});
