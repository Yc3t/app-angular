var app = angular.module('multimediaApp', ['ngRoute']);

app.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .when('/admin', {
            templateUrl: 'views/admin.html',
            controller: 'AdminController',
            resolve: {
                auth: function(AuthService) {
                    return AuthService.checkAuth();
                }
            }
        })
        .when('/user', {
            templateUrl: 'views/user.html',
            controller: 'UserController',
            resolve: {
                auth: function(AuthService) {
                    return AuthService.checkAuth();
                }
            }
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.run(function($rootScope, $location, AuthService) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (next.templateUrl === 'views/admin.html' && !AuthService.isAdmin()) {
            $location.path('/user');
        }
    });
});