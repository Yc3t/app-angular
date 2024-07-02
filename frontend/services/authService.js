// Servicio de Autenticación
app.service('AuthService', function($http, $q) {
    var API_URL = 'http://localhost:3000/api';

    // Función de inicio de sesión
    this.login = function(username, password) {
        console.log("AuthService: Intentando iniciar sesión para", username);
        return $http.post(API_URL + '/auth/login', { username: username, password: password })
            .then(function(response) {
                console.log("AuthService: Respuesta de inicio de sesión recibida", response.data);
                if (response.data && response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('userRole', response.data.role);
                    console.log("AuthService: Token y rol almacenados en localStorage. Rol:", response.data.role);
                    return response.data;
                }
            });
    };

    // Función de cierre de sesión
    this.logout = function() {
        console.log("AuthService: Cerrando sesión del usuario");
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
    };

    // Verificar si el usuario está autenticado
    this.isAuthenticated = function() {
        var isAuth = !!localStorage.getItem('token');
        console.log("AuthService: isAuthenticated llamado, resultado:", isAuth);
        return isAuth;
    };

    // Verificar si el usuario es administrador
    this.isAdmin = function() {
        var role = localStorage.getItem('userRole');
        var isAdmin = role === 'admin';
        console.log("AuthService: isAdmin llamado, rol desde localStorage:", role, "esAdmin:", isAdmin);
        return isAdmin;
    };

    // Obtener el token de autenticación
    this.getToken = function() {
        return localStorage.getItem('token');
    };

    // Verificar la autenticación (para resolvers de ruta)
    this.checkAuth = function() {
        var deferred = $q.defer();
        if (this.isAuthenticated()) {
            console.log("AuthService: checkAuth - Usuario está autenticado");
            deferred.resolve();
        } else {
            console.log("AuthService: checkAuth - Usuario no está autenticado");
            deferred.reject();
        }
        return deferred.promise;
    };
});