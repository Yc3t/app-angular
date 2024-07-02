// Controlador de navegación
app.controller('NavController', function($scope, $location, AuthService) {
    // Verificar si el usuario está autenticado
    $scope.isLoggedIn = AuthService.isAuthenticated;

    // Verificar si el usuario es administrador
    $scope.isAdmin = AuthService.isAdmin;

    // Función para cerrar sesión
    $scope.logout = function() {
        // Llamar al servicio de autenticación para cerrar sesión
        AuthService.logout();

        // Redirigir al usuario a la página principal
        $location.path('/');
    };
});