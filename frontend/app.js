// módulo principal de la aplicación
var app = angular.module('multimediaApp', ['ngRoute']);

// Filtro para confiar en URLs de recursos
app.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);

// Configuración de rutas
app.config(function($routeProvider) {
    $routeProvider
        // Ruta para la página de inicio de sesión
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        // Ruta para la página de administrador
        .when('/admin', {
            templateUrl: 'views/admin.html',
            controller: 'AdminController',
            resolve: {
                // Verificar autenticación antes de cargar la vista
                auth: function(AuthService) {
                    return AuthService.checkAuth();
                }
            }
        })
        // Ruta para la página de usuario
        .when('/user', {
            templateUrl: 'views/user.html',
            controller: 'UserController',
            resolve: {
                // Verificar autenticación antes de cargar la vista
                auth: function(AuthService) {
                    return AuthService.checkAuth();
                }
            }
        })
        // Redirigir a la página de inicio para rutas no definidas
        .otherwise({
            redirectTo: '/'
        });
});

// Configuración de ejecución de la aplicación
app.run(function($rootScope, $location, AuthService) {
    // Interceptar cambios de ruta
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        // Redirigir a la página de usuario si un no-admin intenta acceder a la página de admin
        if (next.templateUrl === 'views/admin.html' && !AuthService.isAdmin()) {
            $location.path('/user');
        }
    });
});