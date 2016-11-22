angular.module('app.routes', []).config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    console.log("States");
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'app/login/partials/login.html'
        })

    .state('signup', {
        url: '/signup',
        templateUrl: 'app/signup/partials/signup.html'
    })

    .state('changePassword', {
        url: '/changePassword',
        templateUrl: 'app/login/partials/changePassword.html'
    })

    .state('home', {
        url: '/',
        templateUrl: 'app/home/partials/home.html',
        controller: 'AuditsController'
    })

    .state('home.auditDetailedView', {
        url: 'auditDetailedView',
        templateUrl: 'app/home/partials/home.auditDetailedView.html',
        controller: 'ObservationController'
    })

    .state('home.clients', {
        url: 'clients',
        templateUrl: 'app/home/partials/home.clients.html',
        controller: 'ClientsController'
    })

    .state('home.newClient', {
        url: 'newClient',
        templateUrl: 'app/home/partials/home.newClient.html',
        controller: 'ClientsController'
    })

    .state('home.editClient', {
        url: 'editClient',
        templateUrl: 'app/home/partials/home.editClient.html'
    })

    .state('home.clientsDetailedView', {
        url: 'clientsDetailedView',
        templateUrl: 'app/home/partials/home.clientsDetailedView.html',
        controller: 'ClientsDetailedViewController'
    })

    .state('home.users', {
        url: 'users',
        templateUrl: 'app/home/partials/home.users.html',
        controller: 'UsersController'
    })

    .state('home.usersDetailedView', {
        url: 'usersDetailedView',
        templateUrl: 'app/home/partials/home.usersDetailedView.html'
    })

    .state('home.settings', {
        url: 'settings',
        templateUrl: 'app/home/partials/home.settings.html'
    })

    .state('template', {
        url: '/printTemplate',
        templateUrl: 'app/printTemplate.html',
        controller: "app.print"
    })
});
