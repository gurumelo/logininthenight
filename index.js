var confi = require('./confi.json');
var validator = require('validator');
var argon2  = require('argon2');
var escape  = require('escape-htmlandmongo');
var fs  = require('fs');
var jsdecrypt = require('jsdecrypt');
var lallaveprivada  = fs.readFileSync('./privada.key', 'utf8');
var express = require('express');
var app = express();

var mongoose  = require('mongoose');
mongoose.connect('mongodb://'+ confi.mongo);
var Usuaris = require('./models/usuaris.js');


//curl -n -v http://localhost:1984/api/ubxDRS2uT4WNFfgL%2FtSlriXUqXHuqceSBj9EQVVwn7%2FtTm81YOSt1H3toFiixwu4bjVF6kjFONZy93J3MSuI%2BuO4YPC%2B5XTrtMtAYq0%2BsOr7IeVvRMh9340Bzgy52TF%2ByOWpuNFRT3vakcAMDFYxznxVFVK06%2FsfdAXObSIBrygjwNXFOddYfUz7aDNE9lzjIyESrg4J%2Bcqaxc756tC5yJmHd381hsODuyC5KWLbq5LG5a3D%2B1yPTKkyd2LY7hBGq9ToB2i5cPOVgNlX81CN4TPwtM4yCYoRA7vFStM7e4nrgsODs6rxe80d8dtoGmCXocaGwx2m8NVgn6cQaySe%2FJ%2FsGwCCsIHQtMbvzrwRYQRIY7Rnb0p41ke9DwhNvUocuUOnGE1FYslyDb0uyKjtqbURPEHppcbTcjfPTVbNjhTyeG5dW6brpGasS7PAAjPugpyt4%2F0jcoKo%2Fg08ND6Bs6Zw6kpbH0aRC%2BAvF1oHfsVc3o4%2FSx65%2BzUhCTy0In4JxkX7AJYr5lIIg1wfikJ3o4f1jZTexE2GXHN9eILF6LG9gFw3EkihVm3zrTYle8ojO3hZJ6aoCe9TMUd54MeinmOglwU6LBsY6xZBJCRVWCYWuBljbLYu5OIW%2Bc4H4g4%2Fx1Xi7s1zWq2Qg0%2B6TNWALYDWzQY%3D/FI%2FFICihmUHdPtiFt4iTaBtXwp%2F2YIXHJcrBPhP0M11%2F3He78Twmy8nDsmRl%2B8Fs74Z%2BT1PELJrO7dO%2FsFSq8WgZAoGWP%2FKeKJHUEDizPDLEaFuQZiZWmUSY9azM%2B%2F9QQovDZU6mczHcBc2cMNMmvjyeOyU1MGaCON23vLVrbIdvkspOX7bpcq0Dz1WYkOTNFyZzNrBjXxAs36k1r0FjbWXJTwt9VgoyveayRDCZ%2BfS%2BtmI1H5gey3S%2BH%2BjhaqbTpe23FJf%2B2MTFSt1NX%2F8yl09RKB8yymvKsR9bbDo3H2zM4bLiJ3ZC3GrGMeH9SggMEOJGRBP0JtqinuWYzKs9Je5v3MF7HM8KND8qRugNinuGPqwbSkrYlk0pNpYEszfBfec%2BYelVWgyda6hCM2SFyJCyQYxCsonO%2FRw93OypiNqGNI4x4ipcFFOqHgPdBqPa%2B5CqrClKo0%2FMk5ioLH3prhwtJ0AIfmehcbE8tlMoWEZCffVB8AtT0FYDB%2Bm6IQMrxGpw0nLmkWlOx0G6BQ1jkyjpQf91ldxtr%2FX9SB66nLnzvQcaDr8wsvkDYx5RridsLaVBX%2FXLwjHvAzCciqz6g2VZppaPgo4fVBX%2B5LBEW3DSQ4TsmmIjnAQuDoQXK%2BDFAoy1k%2BKxqh0P5x7YN02KaOeQBfton4qBp3BvEOMzYYg%3D

// Manejar Error cuando se hace una petición malformada con EncodeURI y no enviar rutas de sistema al cliente.

app.use(function(req, res, next) {
    var err = null;
    try {
        decodeURIComponent(req.path);
    }
    catch(e) {
        err = e;
    }
    if (err) {
        return res.status(404).end();
    }
    next();
});



// Autentificación: todas las peticiones GET que contengan correo y contraseña
app.param('correo', function(req, res, next, correo) {
	if ( validator.isBase64(correo) ) {
			// decodeURI
			console.log('entro');
			try {
				correodec = jsdecrypt.dec(lallaveprivada, correo);
				console.log(correodec);
			}
			catch(e) {
				res.status(404).end();
			}
			// Se escapan caracteres
			var correoesc = escape.esc(correodec);
			// Si es un email
			if ( validator.isEmail(correoesc) ) {
				// Se busca en mongo el usuari/correo electrónico
				Usuaris.findOne({ 'correo': correoesc }, function(err, resultado) {
					if (err) {
						// Si error 404
						res.status(404).end();
					} else {
						// Si devuelve un usuario
						if (resultado) {
							// Guardar el objeto en req para pasarlo al siguiente param.
							req.usuari = resultado;
							// Pasamos al siguiente app.param
							next();
						}
						else {
							// No existe usuario con ese correo
							res.status(404).end();
						}
					}
				});
			} // Si no es un email
			else {
				res.status(404).end();
			}
		} // No viene cifrado, ni en base 64
		else {
			res.status(404).end();
		}
});

app.param('contrasena', function(req, res, next, contrasena) {
		if ( validator.isBase64(contrasena) ) {
			try {
				contrasenadec = jsdecrypt.dec(lallaveprivada, contrasena);
			}
			catch(e) {
				res.status(404).end();
			}
			// Se escapan caracteres
			var contrasenaesc = escape.esc(contrasenadec);
			// Comparación de contraseña cifrada de mongo contra contraseña GET.
			argon2.verify(req.usuari.contrasena, contrasenadec).then(match => {
				if (match) {
					// La contraseña coincide pasamos a app.get
					next();
				} else {
					// La contraseña no coincide
					res.status(404).end();
				}
			}).catch(err => {
				// Fallo
				res.status(404).end();
			});
		}
		else {
				//No es base64
				res.status(404).end();
		}
});

app.get('/api/:correo/:contrasena', function (req, res) {
	console.log('entra, aquí código para alguien Autentificado');
	res.json({'respuesta': ':)'});
});

// Creación de prueba usuario: juan@juan.com , contraseña: juan
app.get('/crear', function(req, res) {
	var nuevousuari = new Usuaris({ 'correo': 'juan@juan.com', 'contrasena': '$argon2i$v=19$m=4096,t=3,p=1$bJy0ZsIgx90GiQ+xLuk/HjfxXp7M9y8dWmpcGO4RLtdBfyYEYH4hkwQM0Y802v7JZugm9ZCHhXNXQwIOXEZu07ONdU8k$kNI0qnyVD2qwWsz4YQEr3/RW0ICHYIZjoxDN2tEwsX4' });
	nuevousuari.save(function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log('meow');
			res.send(':)');
		}
	});
});





app.listen(confi.puerto, function() {
	console.log('La magia sucede en http://localhost:'+ confi.puerto);
});
