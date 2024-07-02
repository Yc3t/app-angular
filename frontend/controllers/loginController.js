// Controlador de inicio de sesión
app.controller('LoginController', function($scope, $location, AuthService) {
    // Manejar el intento de inicio de sesión
    $scope.login = function() {
        // Registrar el intento de inicio de sesión
        console.log("Intento de inicio de sesión para el usuario:", $scope.username);

        // Llamar al servicio de autenticación
        AuthService.login($scope.username, $scope.password)
            .then(function(data) {
                // Registro de inicio de sesión exitoso
                console.log("Inicio de sesión exitoso, datos recibidos:", data);
                console.log("Rol del usuario:", data.role);

                // Redireccionar basado en el rol del usuario
                if (data.role === 'admin') {
                    console.log("Usuario administrador detectado, redirigiendo a /admin");
                    $location.path('/admin');
                } else {
                    console.log("Usuario regular detectado, redirigiendo a /user");
                    $location.path('/user');
                }
            })
            .catch(function(error) {
                // Manejar errores de inicio de sesión
                console.error("Error de inicio de sesión:", error);
                $scope.error = 'Inicio de sesión fallido. Por favor, inténtelo de nuevo.';
            });
    };
});