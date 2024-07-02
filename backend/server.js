const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;
const SECRET_KEY = '1231244321';  


app.use(cors());
app.use(bodyParser.json());

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./multimedia.db', (err) => {
  if (err) {
    console.error('Error al abrir la base de datos', err);
  } else {
    console.log('Conectado a la base de datos SQLite.');
    initDb();
  }
});

// Función para inicializar la base de datos
function initDb() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Verificar si existe la tabla de usuarios
      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, table) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!table) {
          // Si la tabla no existe, crearla con todas las columnas
          db.run(`CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            email TEXT UNIQUE,
            role TEXT CHECK( role IN ('admin','user') ) NOT NULL DEFAULT 'user'
          )`, (err) => {
            if (err) reject(err);
          });
        } else {
          // Si la tabla existe, verificar si existe la columna de rol
          db.all("PRAGMA table_info(users)", (err, rows) => {
            if (err) {
              reject(err);
              return;
            }
            
            const roleColumnExists = rows.some(row => row.name === 'role');
            if (!roleColumnExists) {
              // Agregar la columna de rol si no existe
              db.run("ALTER TABLE users ADD COLUMN role TEXT CHECK( role IN ('admin','user') ) NOT NULL DEFAULT 'user'", (err) => {
                if (err) reject(err);
              });
            }
          });
        }
      });

      // Crear otras tablas (categorías y videos) como antes
      db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE
      )`, (err) => {
        if (err) reject(err);
      });

      db.run(`CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        url TEXT,
        category_id INTEGER,
        FOREIGN KEY (category_id) REFERENCES categories (id)
      )`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

// Middleware para verificar el token JWT
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send({ auth: false, message: 'No se proporcionó token.' });
  
  jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, message: 'Error al autenticar el token.' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
}

// Middleware para verificar si el usuario es administrador
function isAdmin(req, res, next) {
  if (req.userRole !== 'admin') {
    return res.status(403).send({ message: '¡Se requiere rol de Administrador!' });
  }
  next();
}

// Ruta de inicio de sesión
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).send('Error en el servidor.');
    if (!user) return res.status(404).send('Usuario no encontrado.');
    
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: 86400 });
    res.status(200).send({ auth: true, token: token, role: user.role });
  });
});

// CRUD de Usuarios (solo para Admin)
app.get('/api/users', [verifyToken, isAdmin], (req, res) => {
  db.all('SELECT id, username, email, role FROM users', (err, users) => {
    if (err) return res.status(500).send('Error en el servidor.');
    res.status(200).send(users);
  });
});

app.post('/api/users', [verifyToken, isAdmin], (req, res) => {
  const { username, password, email, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  db.run('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)', 
    [username, hashedPassword, email, role || 'user'], function(err) {
    if (err) return res.status(500).send('Error en el servidor.');
    res.status(200).send({ id: this.lastID });
  });
});

app.put('/api/users/:id', [verifyToken, isAdmin], (req, res) => {
  const { username, email, role } = req.body;
  db.run('UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?', 
    [username, email, role, req.params.id], (err) => {
    if (err) return res.status(500).send('Error en el servidor.');
    res.status(200).send({ message: 'Usuario actualizado con éxito.' });
  });
});

app.delete('/api/users/:id', [verifyToken, isAdmin], (req, res) => {
  db.run('DELETE FROM users WHERE id = ?', req.params.id, (err) => {
    if (err) return res.status(500).send('Error en el servidor.');
    res.status(200).send({ message: 'Usuario eliminado con éxito.' });
  });
});

// CRUD de Categorías (solo Admin para crear, actualizar, eliminar)
app.get('/api/categories', verifyToken, (req, res) => {
  db.all('SELECT * FROM categories', (err, categories) => {
    if (err) return res.status(500).send('Error en el servidor.');
    res.status(200).send(categories);
  });
});

app.post('/api/categories', [verifyToken, isAdmin], (req, res) => {
  const { name } = req.body;
  db.run('INSERT INTO categories (name) VALUES (?)', [name], function(err) {
    if (err) return res.status(500).send('Error en el servidor.');
    res.status(200).send({ id: this.lastID });
  });
});

app.put('/api/categories/:id', [verifyToken, isAdmin], (req, res) => {
  const { name } = req.body;
  db.run('UPDATE categories SET name = ? WHERE id = ?', [name, req.params.id], (err) => {
    if (err) return res.status(500).send('Error en el servidor.');
    res.status(200).send({ message: 'Categoría actualizada con éxito.' });
  });
});

app.delete('/api/categories/:id', [verifyToken, isAdmin], (req, res) => {
  db.run('DELETE FROM categories WHERE id = ?', req.params.id, (err) => {
    if (err) return res.status(500).send('Error en el servidor.');
    res.status(200).send({ message: 'Categoría eliminada con éxito.' });
  });
});

// CRUD de Videos (solo Admin para crear, actualizar, eliminar)
app.get('/api/videos', verifyToken, (req, res) => {
  db.all('SELECT videos.*, categories.name as category_name FROM videos JOIN categories ON videos.category_id = categories.id', (err, videos) => {
    if (err) return res.status(500).send('Error en el servidor.');
    res.status(200).send(videos);
  });
});

app.post('/api/videos', [verifyToken, isAdmin], (req, res) => {
  const { name, url, category_id } = req.body;
  db.run('INSERT INTO videos (name, url, category_id) VALUES (?, ?, ?)', [name, url, category_id], function(err) {
    if (err) return res.status(500).send('Error en el servidor.');
    res.status(200).send({ id: this.lastID });
  });
});

app.put('/api/videos/:id', [verifyToken, isAdmin], (req, res) => {
  const { name, url, category_id } = req.body;
  db.run('UPDATE videos SET name = ?, url = ?, category_id = ? WHERE id = ?', [name, url, category_id, req.params.id], (err) => {
    if (err) return res.status(500).send('Error en el servidor.');
    res.status(200).send({ message: 'Video actualizado con éxito.' });
  });
});

app.delete('/api/videos/:id', [verifyToken, isAdmin], (req, res) => {
  db.run('DELETE FROM videos WHERE id = ?', req.params.id, (err) => {
    if (err) return res.status(500).send('Error en el servidor.');
    res.status(200).send({ message: 'Video eliminado con éxito.' });
  });
});

// Obtener videos por categoría
app.get('/api/videos/category/:id', verifyToken, (req, res) => {
  db.all('SELECT * FROM videos WHERE category_id = ?', [req.params.id], (err, videos) => {
    if (err) return res.status(500).send('Error en el servidor.');
    res.status(200).send(videos);
  });
});

// Inicializar la base de datos y agregar datos iniciales
initDb()
  .then(() => {
    console.log("Base de datos inicializada con éxito");
    
    // Iniciar el servidor después de la inicialización de la base de datos y la adición de datos
    app.listen(port, () => {
      console.log(`Servidor ejecutándose en el puerto ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error al inicializar la base de datos:", err);
  });