require('dotenv').config() //passed

//Imports
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app = express();
const router = express.Router();
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres@localhost:5432/riffy';
const ejwt = require('express-jwt');
const moment = require('moment');
const nodemailer = require('nodemailer');
const randomstring = require("randomstring");
const cors = require('cors');

// customized
const ENV = process.env.ENV || "development";

const pg = require('pg');

const knexConfig = require("./knexfile");
const knex = require('knex')(knexConfig[ENV]);


//Express Config
app.use(flash());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.set('superSecret', 'lkmaspokjsafpaoskdpa8asda0s9a'); // secret variable
const LocalStrategy = require('passport-local').Strategy;
const jwtSecret = 'lkmaspokjsafpaoskdpa8asda0s9a';

//NodeMailer config
var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: process.env.email, // Your email id
		pass: process.env.password // Your password
	}
});

//PASSPORT CONFIG
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {

    console.log('from passport.use = >username:', username);


    knex.select().from('users').where({ email: username })
    .then((result) => {
      // console.log(result);
      const user = result[0];
      if (!user) {
          return done("Incorrect credentials", false);
      } else {
        if (user.email == null) {
          return done("Incorrect credentials", false);
        }
        if (user.verified_email == null || user.verified_email == false) {
          return done("Please verify your email first. Check your inbox for our verification email.", false);
        }
        bcrypt.compare(password, user.password, function(err, res) {
        // res == true
          if (res == true) {
            return done(null, user);
          } else {
            return done("Incorrect credentials", false);
          }
        });
      }
    })
    .catch((err) =>{
      res.status(400).json(err);
    })
}));

// used to serialize the user for the session
passport.serializeUser((user, done) => {
	done(null, user.id);
	// where is this user.id going? Are we supposed to access this anywhere?
});

// used to deserialize the user
passport.deserializeUser((id, done) => {

	knex.select().from('users').where({id: id}).orderBy('id')
	.then((data) => {
		res.json(data);
	})
	.catch((err) => {
		res.status(400).json(err);
	});

});


// Admin User displaying Route
router.get('/users', ejwt({
		secret: app.get('superSecret')
	}), (req, res) => {

  if (!req.user) {
    return res.sendStatus(401)
  } else if (req.user.role == 'regular') {
    return res.status(400).json({ success: false, data: "Insufficient privileges" });
  } else {
    knex.select().from('users').orderBy('id')
    .then((data) => {
      // console.log(data);
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
  }
});

router.post('/auth/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) {
			return res.status(400).json({ error: err });
		} else {
			//user has authenticated correctly thus we create a JWT token
			var token = jwt.sign(user, app.get('superSecret'));

			console.log('auth/login-user toke =>: ', token);

			return res.json({ success: true, role: user.role, token: token });
		}
	})(req, res, next);
});

router.post('/auth/register', function(req, res, next) {
	const saltRounds = 10;
	var ranString = randomstring.generate({
		length: 12,
		charset: 'alphabetic'
	});
	const data = {
		email: req.body.email,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		password: bcrypt.hashSync(req.body.password, saltRounds),
		verify_token: ranString,
		role: 'regular'
	};
	// console.log('data:',data)

	const results = [];

	knex.select().from('users').where({ email: data.email }).then( function (result) {
    var user = result[0];
    // console.log(result[0])
		if (user) {
			return res.status(400).json({ success: false, data: 'User already exists. Please try again and again.' });
		} else {
			return knex('users').insert({
				email: data.email,
				password: data.password,
				first_name: data.firstName,
				last_name: data.lastName
			}).then( function (result) {
		    return res.json({ success: true, message: 'ok' });
	    }).catch(function (err) {
		    return res.status(500).json({ success: false, data: err });
		  });
		}
  });
	// >> TODO transporter.sendMail() is invoked after insert, we should make use of it in time!
});

router.post('/auth/reset', function(req, res) {
	var email = req.body.email;
	var expiryDate = moment().add(2, 'hours').format("YYYY-MM-DD HH:mm:ss");
	var ranString = randomstring.generate({
		length: 16,
		charset: 'alphabetic'
	});
	pg.connect(connectionString, (error, client) => {
		knex.select().from('users').where('email', email).then(function(err, result){
			console.log(result)
		})
		client.query("SELECT * FROM users WHERE email = '" + email + "'", function(err, result) {
			var user = result.rows[0];
			if (!user) {
				return res.status(400).json({ error: 'Email does not match to any account.' });
			} else {
				console.log('reached');
				client.query('UPDATE users SET resetpasstoken=($1), resetpassexpiry=($2) WHERE email=($3)',
    			[ranString, expiryDate, email], function(err, result) {
    				if (err) {console.log(err);}
					var mailOptions = {
						from: 'patrickbollenbachcc@gmail.com', // sender address
						to: 'patrick.bolle@hotmail.com', // list of receivers
						subject: 'Vue Boilerplate - ' + req.body.email + ' Password Reset', // Subject line
						text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
				          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
				          'http://' + req.headers.host + '/reset/' + ranString + '\n\n' +
				          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
					};
					transporter.sendMail(mailOptions, function(error, info) {
						if (error) {
							console.log('Error!!');
							return res.status(400).json({ error: error });
						} else {
							console.log('Message sent: ' + info.response);
							return res.json({ success: true, info: "Password reset email sent." });
						};
					});
    			});
			}
		});
	});
});

router.post('/auth/reset/:token', function(req, res) {
	console.log(req.body.password);
	var password = bcrypt.hashSync(req.body.password, 10);
	console.log(password);
	console.log(req.params.token);
	var token = req.params.token;
	pg.connect(connectionString, (error, client) => {
		client.query("SELECT * FROM users WHERE resetpasstoken = '" + token + "'", function(err, result) {
			var user = result.rows[0];
			if (!user) {
				return res.status(400).json({ error: 'Email does not match to any account.' });
			} else {
				client.query("UPDATE users SET password = '" + password + "', resetpasstoken = NULL, resetpassexpiry = NULL WHERE email = '" + user.email + "'");
				var mailOptions = {
					from: 'patrickbollenbachcc@gmail.com', // sender address
					to: user.email, // list of receivers
					subject: 'Vue Boilerplate - Your Password Has Been Changed', // Subject line
					text: 'Hello,\n\n' +
          			'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
				};
				transporter.sendMail(mailOptions, function(error, info) {
					if (error) {
						return res.status(400).json({ error: error });
					} else {
						console.log('Message sent: ' + info.response);
						return res.json({ success: true, info: "Password reset successful." });
					};
				});
			}
		});
	});
});

router.get('/auth/reset/:token', function(req, res) {
	var token = req.params.token;
	pg.connect(connectionString, (error, client) => {
		client.query('SELECT * FROM users WHERE resetpasstoken = ' + token + ' AND resetpassexpiry > ' + Date.now(), function(err, result) {
			var user = result.rows[0];
			if (!user) {
				return res.json({ success: false, message: 'Password reset token is invalid or has expired.' });
			} else {
				return res.json({ success: true, message: 'Please proceed to reset password page.' });
			}
			// disconnect the client
			client.end(function(err) {
				if (err) throw err;
			});
		});
	});
});

router.get('/verify/:id/:token', function(req, res) {
	var id = req.params.id;
	var token = req.params.token;

	pg.connect(connectionString, (error, client) => {
		client.query("SELECT * FROM users WHERE id = '" + id + "'", function(err, result) {
			var user = result.rows[0];
			if (!user) {
				return res.json({ success: false, message: 'ERROR: User does not exist or something went wrong.' });
			} else {
				if (user.verify_token == token) {
					client.query('UPDATE users SET verified_email = TRUE WHERE id = ' + id + '');
					return res.json({ success: true, message: 'Email is now verified. Please login to get started!' });
				}
			}
			// disconnect the client
			client.end(function(err) {
				if (err) throw err;
			});
		});
	});
});



// DATA ROUTES --> this is where pages are rendered
router.get('/main', (req, res) => {
	// const resultsArr = [];
	knex.select().from('users').then( function (result) {
		    // return res.json({ success: true, message: 'ok' });
		console.log('results from main: ', result)
		  // results.push(result)çc\\efsdafsfd
		return res.json(result);
	}).catch(function (err) {
		return res.status(500).json({ success: false, data: err });
	});
});

router.get('/notes/:note_id', (req, res) => {
	const results = [];
	// Grab data from the URL parameters
	var id = req.params.note_id;
	// Get a Postgres client from the connection pool
	pg.connect(connectionString, (err, client, done) => {
		// Handle connection errors
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({ success: false, data: err });
		}
		// SQL Query > Select Data
		const query = client.query("SELECT * FROM notes WHERE id = '" + id + "' ORDER BY id ASC");
		// Stream results back one row at a time
		query.on('row', (row) => {
			results.push(row);
		});
		// After all data is returned, close connection and return results
		query.on('end', function() {
			done();
			return res.json(results);
		});
	});
});

router.post('/notes', ejwt({ secret: 'lkmaspokjsafpaoskdpa8asda0s9a' }), (req, res, next) => {
	const results = [];
	// Grab data from http request
	const data = { text: req.body.text, title: req.body.title, createdBy: req.user.id, createdOn: moment() };
	// Get a Postgres client from the connection pool
	pg.connect(connectionString, (err, client, done) => {
		// Handle connection errors
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({ success: false, data: err });
		}
		client.query('INSERT INTO notes(title, text, createdby, createdon) values($1, $2, $3, $4)', [data.title, data.text, data.createdBy, data.createdOn],
			function(err, result) {
				if (err) throw err;
				// just print the result to the console
				return res.json(result);
				// disconnect the client
				client.end(function(err) {
					if (err) throw err;
				});
			});
	});
});

router.put('/notes/:note_id', (req, res, next) => {
	const results = [];
	// Grab data from the URL parameters
	const id = req.params.note_id;
	// Grab data from http request
	const data = { text: req.body.text, title: req.body.title };
	// Get a Postgres client from the connection pool
	pg.connect(connectionString, (err, client, done) => {
		// Handle connection errors
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({ success: false, data: err });
		}
		// SQL Query > Update Data
		client.query('UPDATE notes SET title=($1), text=($2) WHERE id=($3)', [data.title, data.text, id]);
		// SQL Query > Select Data
		const query = client.query("SELECT * FROM notes ORDER BY id ASC");
		// Stream results back one row at a time
		query.on('row', (row) => {
			results.push(row);
		});
		// After all data is returned, close connection and return results
		query.on('end', function() {
			done();
			return res.json(results);
		});
	});
});

router.delete('/notes/:note_id', (req, res, next) => {
	const results = [];
	// Grab data from the URL parameters
	const id = req.params.note_id;
	// Get a Postgres client from the connection pool
	pg.connect(connectionString, (err, client, done) => {
		// Handle connection errors
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({ success: false, data: err });
		}
		// SQL Query > Delete Data
		client.query('DELETE FROM notes WHERE id=($1)', [id]);
		// SQL Query > Select Data
		var query = client.query('SELECT * FROM notes ORDER BY id ASC');
		// Stream results back one row at a time
		query.on('row', (row) => {
			results.push(row);
		});
		// After all data is returned, close connection and return results
		query.on('end', () => {
			done();
			return res.json(results);
		});
	});
});

// Get user profile
router.get('/users/:user_id', ejwt({
    secret: app.get('superSecret')
  })
  , (req, res) => {
  console.log(req.params);
  // Grab data from the URL parameters
  let param_id = req.user.id;

  knex.select().from('users').where({id: param_id})
    .then((data) => {
      let userdata = data[0];
      if (param_id === userdata.id) {
        res.json(data);
      } else {
        res.status(400).redirect('/index')
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// PUT users/:id
// router.put('/edituser', ejwt({
//     secret: app.get('superSecret')
//   })
//   , (req, res) => {
//   console.log(req.params);
//   // Grab data from the URL parameters
//   let param_id = req.user.id;
//
//   // knex.select().from('users').where({id: param_id})
//   //   .then((data) => {
//   //     let userdata = data[0];
//   //     if (param_id === userdata.id) {
//   //       res.json(data);
//   //     } else {
//   //       res.status(400).redirect('/index')
//   //     }
//   //   })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// })

router.delete('/users/:id', (req, res) => {
  knex.select().from('users')
  .then((data) =>{
    res.json(data);
  })
})

// bands
router.get('/bands', (req, res) => {
  knex.select().from('bands')
  .then((data) =>{
    res.json(data);
  })
})

router.post('/bands/new', (req, res) => {
  res.send('this is POST /bands/new Page');
})

router.get('/bands/:band_id', ejwt({
    secret: app.get('superSecret')
  })
  , (req, res) => {
  console.log();
  // Grab data from the URL parameters
  let param_id = req.user.id;

  knex.select().from('bands').where({id: param_id})
    .then((data) => {
      let userdata = data[0];
      if (param_id === userdata.id) {
        res.json(data);
      } else {
        res.status(400).redirect('/index')
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.put('/bands/:id', (req, res) => {
  knex.select().from('bands')
  .then((data) =>{
    res.json(data);
  })
})


router.delete('/bands/:id', (req, res) => {
  knex.select().from('bands')
  .then((data) =>{
    res.json(data);
  })
})

// tracks
router.get('/tracks', (req, res) => {
  knex.select().from('tracks')
  .then((data) =>{
    res.json(data);
  })
})

/////
router.get('/search',
	// ejwt({ secret: app.get('superSecret')}),
	(req, res) => {
  console.log(req);
  // if (!req.user) {
  //   return res.sendStatus(401)
  // } else {

    knex.select().from('users').orderBy('id')
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
  // }
});


router.post('/tracks/new', (req, res) => {
  res.send('this is POST /tracks/new Page');
})

router.get('/tracks/:id', (req, res) => {
  knex.select().from('tracks')
  .then((data) =>{
    res.json(data);
  })
})

router.put('/tracks/:id', (req, res) => {
  knex.select().from('tracks')
  .then((data) =>{
    res.json(data);
  })
})

router.delete('/tracks/:id', (req, res) => {
  knex.select().from('tracks')
  .then((data) =>{
    res.json(data);
  })
})


//Server port
app.use('/api', router);
const port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Boilerplate server listening on port ' + port);
})

module.exports = app
