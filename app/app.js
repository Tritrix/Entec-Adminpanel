/**
 * Angular Application Initialization
 * Main module Entec
 **/

var app = angular.module('Entec', ['ui.router', 'app.routes', 'ui.date', 'angularMoment', 'ui.bootstrap', 'validation.match', 'xeditable', 'ngStorage', 'GlobalModule', 'HomeModule', 'LoginModule', 'LogoutModule', 'ngImageCompress']);

/**
 * Base Url
 **/
app.constant("baseUrl", {
    //    'Url': 'http://entecin.com/entec/public/api/v1/users/',
    //    'imageUrl': 'http://entecin.com/entec/public/api/v1/users/upload/'
    'Url': 'http://artiushealth.in/entec/public/api/v1/users/',
    'imageUrl': 'http://artiushealth.in/entec/public/api/v1/users/upload/',
    'imageGetUrl': 'http://artiushealth.in/entec/public/',
    'defaultImageUrl': 'images/user.jpg'
        //    'Url': 'http://entec/api/v1/users/',
        //    'imageUrl': 'http://entec/api/v1/users/upload/'
});

app.config(function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $httpProvider.interceptors.push(function ($rootScope) {
        return {
            request: function (config) {
                $rootScope.$broadcast('LOAD');
                //                console.log( $rootScope.$broadcast('LOAD'));
                return config
            },
            response: function (response) {
                $rootScope.$broadcast('UNLOAD');
                //                console.log($rootScope.$broadcast('UNLOAD'));
                return response
            }
        }
    })
});

//app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
//    cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Loading...</div>';
//    //    cfpLoadingBarProvider.latencyThreshold = 500;
//  }]);

app.directive('isActiveNav', ['$location', function ($location) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            scope.location = $location;
            scope.$watch('location.path()', function (currentPath) {
                if ('/#' + currentPath === element[0].attributes['ui-sref'].nodeValue) {
                    element.parent().addClass('active');
                } else {
                    element.parent().removeClass('active');
                }
            });
        }
    };
}]);

app.filter('custom', function () {
    return function (input, search) {

        if (!input) return input;
        if (!search) return input;
        var expected = ('' + search).toLowerCase();
        var result = {};
        angular.forEach(input, function (value, key) {
            var actual = ('' + value).toLowerCase();
            if (actual.indexOf(expected) !== -1) {
                result[key] = value;
            }
        });
        return result;
    }
});

app.directive('fileModel', ['$parse', function ($parse, $scope) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            var file = '';
            element.bind('change', function () {
                scope.$apply(function () {
                    file = element[0].files[0];
                    console.log(element[0].files[0]);
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);


app.service("imageUpload", function ($http, $q) {
    return {
        doUpload: function (file, uploadUrl) {
            // the $http API is based on the deferred/promise APIs exposed by the $q service
            // so it returns a promise for us by default
            var fd = new FormData();
            fd.append('files', file);
            console.log('fd ->' + file);

            return $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    },
                })
                .then(function (response) {
                    console.log(typeof response.data == 'object');
                    if (typeof response.data == 'object' && response.status == '200') {
                        return response.data;
                    } else {
                        // invalid response
                        console.log("response.data error");
                        return $q.reject(response.data);
                    }
                }, function (response) {
                    // something went wrong
                    console.log("error" + response.data);
                    return $q.reject(response.data);
                });
        }
    };
});

app.directive('showtab', function () {
    return {
        link: function (scope, element, attrs) {
            element.click(function (e) {
                e.preventDefault();
                $(element).tab('show');
            });
        }
    };
});

app.run(function (editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'

    //    return function ($scope, element, attrs) {
    //        $rootScope.$on('LOAD', function () {
    //            $scope.loading = true;
    //            if (element.hasClass("hidden")) {
    //                element.removeClass("hidden")
    //            }
    //            console.log($scope.loading);
    //        });
    //        $rootScope.$on('UNLOAD', function () {
    //            $scope.loading = false;
    //            if (!element.hasClass("hidden")) {
    //                element.addClass("hidden")
    //            }
    //            console.log($scope.loading);
    //        });
    //
    //    }
});
