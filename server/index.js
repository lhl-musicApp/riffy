require('dotenv').config() //passed

//Imports
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
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
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false, limit: '12mb' }));
app.use(bodyParser.json({ limit: '12mb' }));
app.use(passport.initialize());
app.use(passport.session());
app.set('superSecret', 'lkmaspokjsafpaoskdpa8asda0s9a'); // secret variable
const LocalStrategy = require('passport-local').Strategy;
const jwtSecret = 'lkmaspokjsafpaoskdpa8asda0s9a';
const upload = multer();
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
    // console.log(user);
    console.log('from passport.use = >username:', username);

    knex.select().from('users').where({ email: username })
    .then((result) => {
      console.log(result);
      const user = result[0];
      if (!user) {
          return done(null, false, { message: "Please login"});
      } else {
        if (!user.email) {
          return done(null, false, { message: "no email"});
        }
        if (!user.verified_email) {
          return done(null, false, { message: "Please verify your email first. Check your inbox for our verification email."});
        }
        bcrypt.compare(password, user.password, function(err, res) {
        // res == true
          if (res == true) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect credentials"});
          }
        });
      }
    })
    .catch((err) =>{
      res.status(400).json(err);
    })

///////////////
    // User.findOne({ email: username }, (err, user) => {
    //   // console.log(result);
    //   if (err) { return done(err); }
    //   if (!user) {
    //     return done(null, false, { message: 'Incorrect username.' });
    //   }
    //   if (!user.validPassword(password)) {
    //     return done(null, false, { message: 'Incorrect password.' });
    //   }
    //   return done(null, user);
    // });
//////////////
}));

// used to serialize the user for the session
passport.serializeUser((user, done) => {
	done(null, user.id);
	// where is this user.id going? Are we supposed to access this anywhere?
});

// used to deserialize the user
passport.deserializeUser((id, done) => {
  User.findById(id, function(err, user) {
    done(err, user);
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
			delete user.password;
      const token = jwt.sign(user, app.get('superSecret'));
      const user_id = user.id;
			// console.log('auth/login-user toke =>: ', token);
			return res.json({ user_id: user_id, role: user.role, token: token });
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
		role: 'regular',
    verified_email: true
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
		// knex.select().from('users').where('email', email).then(function(err, result){
		// 	// console.log(result)
		// })
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
  knex('users')
  .join('tracks', 'users.id', '=', 'tracks.user_id').whereNotNull('track_link')
  .select(
    'users.id as id',
    'users.first_name as first_name',
    'users.last_name as last_name',
    'users.user_city as user_city',
    'users.user_country as user_country',
    'tracks.track_name as track_name',
    'tracks.track_link as track_link',
    'users.image_link as image_link',
    'users.user_influence as user_influence',
    'users.instrument as instrument')
  .then( function (result) {
		    // return res.json({ success: true, message: 'ok' });
		console.log('results from main: ', result)
		  // results.push(result)çc\\efsdafsfd
		return res.send(result);
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
  }), (req, res) => {
  // console.log("I AM A TEST", req.params);
  // Grab data from the URL parameters
  let param_id = req.params.user_id;

  knex.select().from('users').where({id: param_id})
    .then((data) => {
      let userdata = data[0];
      if (!userdata) {
        res.status(400).redirect('/login')
      } else {
        res.json(data);
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

//get user current skills
router.get('/users/skills/:user_id', ejwt({
  	secret: app.get('superSecret')
  }), (req, res) => {
  let param_id = req.params.user_id;
	knex('skill_user')
  .join('skills', 'skill_user.skill_id', 'skills.id')
    .select('skill_user.skill_id as skill_id', 'skill_user.user_id as user_id', 'skills.skill_name as skill_name')
    .where({ user_id: param_id })
    .then((data) => {
      let userdata = data;
      if (!userdata) {
        res.status(400).redirect('/login')
      } else {
				console.log('get userskills: ', data);
				res.json(data); }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});


// TODO update skills query

// select skill_user.user_id as user_id, skills.skill_name as skill_name, skill_user.skill_rating as skill_rating, skill_user.skill_comment as skill_comment  from  skill_user join skills on skill_user.skill_id = skills.id;//

router.post('/users/skills/:user_id', ejwt({
    secret: app.get('superSecret')
  }), (req, res) => {
	let param_id = req.user.id;
	let skilluser_id = req.body.id;
	// TODO: why do we just trust the user so blindly about their uid?
	let skilladdition = {
		user_id: param_id,
		skill_id: skilluser_id
		// created_at:
	}
	knex('skill_user').insert(skilladdition)
	.catch((err) => {
		res.json(err);
	})

	// console.log("skillNamesToInsert:", skillNamesToInsert);
	// skillNamesToInsert.user_id = param_id

	// knex('skills').select('skill_name', 'id')
	// .then((skills_rows) => {
	// 	var skillMap = {};
	// 	skills_rows.forEach((row) => {
	// 		skillMap[row.skill_name] = row.id;
	// 	});
	//
		// var suObjectsToInsert = skillNamesToInsert.map((sn) => {
		// 	return {
		// 		user_id: param_id,
		// 		skill_id: skillMap[sn.skill_name]
		// 	}
		// });

		// return knex('skill_user')
		// 	.insert(skillNamesToInsert);
	// })
	// .then(() => {
	// 	// TODO: res response??
	// 	console.log("bored now");
	// 	res.send("DUDE IT IS FINE");
	// })
});

router.delete('/users/skills/:user_id', ejwt({
    secret: app.get('superSecret')
  }), (req, res) => {
		console.log('delete req params: ', req.params);
		console.log('delete req body: ', req.body);
		let userId = parseInt(req.params.user_id);
		let skillId = parseInt(req.body.skill_id);
		delete req.body.skill_name
		let canudelete = req.body;

		let deleteObj = {
			user_id: userId,
			skill_id: skillId
		}

		// console.log(deleteObj);
		console.log(canudelete);

		knex('skill_user')
		.where(canudelete)
		.del()


	});

	router.get('/skills', ejwt({ secret: app.get('superSecret') }), (req, res) => {
	  if (!req.user) {
	    return res.sendStatus(401)
	  } else {
	    knex.select().from('skills')
	    .then((data) => {
	      // console.log(data);
	      res.json(data);
	    })
	    .catch((err) => {
	      res.status(400).json(err);
	    });
	  }
	});
	// knex('skill_user')
	// .join('skills', 'skill_user.skill_id', 'skills.id')
	// 	.select('skills.skill_name as skill_name')
	// 	.where({ user_id: param_id })
	// 	.insert(skillNamesToInsert.skill_name)
	// 	.then((data) => {
	// 		let userdata = data;
	// 		if (!userdata) {
	// 			res.status(400).redirect('/login')
	// 		} else {
	// 			res.json(data); }
	// 	})
	// 	.catch((err) => {
	// 		res.status(400).json(err);
	// 	});


	//
	// var chunkSize = 1000;
	// knex.batchInsert('skill_user', rows, chunkSize)
  // .returning('user_id', 'skill_name')
  // .then((data) => {
	// 	res.json(data);
	// })
  // .catch((err) => {
	// 	res.status(400).json(err)
	// });

	// knex('skill_user')
  // .join('skills', 'skill_user.skill_id', 'skills.id')
  //   .select('skill_user.user_id as user_id', 'skills.skill_name as skill_name', 'skill_user.skill_rating as skill_rating', 'skill_user.skill_comment as skill_comment')
	// 	.returning('*')
	// 	.where({id: param_id})
	// 	.update(result)
	// 	.then((data) => {
	// 		console.log('router userskills data: ', data);
	// 		res.json(data[0]);
  //   })
  //   .catch((err) => {
  //     res.status(400).json(err);
  //   });





// Route for update form
router.post('/users/:id', ejwt({
    secret: app.get('superSecret')
  }), (req, res) => {

	let param_id = req.params.id;
  const result = req.body;
	knex('users').update(req.body)
	.where({ id: req.params.id})
	.returning('*')
		.then((data) => {
			console.log('post user data return:', data);
			res.json(data[0]);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
})

// THIS IS THE MESSAGES SECTION
router.post('/users/:id/message',
			ejwt({ secret: 'lkmaspokjsafpaoskdpa8asda0s9a' }),
	(req, res, next) => {
		console.log('profile_id: ', req.params.id )
		console.log('message content: ', req.body.content);
		console.log('message date: ', req.body.createdAt);
		console.log('message author_id: ', req.user.id);
	if (!req.user) {
    	return res.sendStatus(401)
  	} else {
			knex('messages').update('created_at', knex.fn.now())
			.insert({
				profile_id: req.params.id,
				author_id: req.user.id,
				content: req.body.content,
			})
	  	.then((data) => {
	      console.log(data);
	      res.json(data);
    	})
    	.catch((err) => {
      	res.status(400).json(err);
    	});
  	}
});

router.get('/users/:id/message', ejwt({ secret: 'lkmaspokjsafpaoskdpa8asda0s9a' }), (req, res, next) => {
	// console.log(res);
	console.log("I am the params: ", req.params);
	knex('messages')
	.join('users', 'messages.author_id', 'users.id')
	.select('messages.profile_id as profile_id',
					'messages.author_id as author_id',
					'users.first_name as first_name',
					'users.last_name as last_name',
					'messages.content as content',
					'messages.created_at as created_at')
	.where({
	 	profile_id: req.params.id
	})
	.orderBy('created_at', 'desc')
	.then((data) => {
		console.log(data);
		res.json(data);
	})
	.catch((err) => {
		res.status(400).json(err);
	});
})


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

// router.post('/upload', ejwt({ secret: 'lkmaspokjsafpaoskdpa8asda0s9a' }), (req, res, next) => {
//   // console.log(res);
//   console.log("uploads param", req.user.id);
// })
// //// ok


router.post('/upload/:id/image', ejwt({ secret: 'lkmaspokjsafpaoskdpa8asda0s9a' }), (req, res, next) => {
  var base64Data = req.body.imageObj.image;

    console.log('writing file...', base64Data);

    function decodeBase64Image(dataString) {
      var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }

      response.type = matches[1];
      response.data = new Buffer(matches[2], 'base64');

      return response;
    }

    var imageBuffer = decodeBase64Image(base64Data);
    console.log(imageBuffer);

    fs.writeFile(__dirname + "/upload/image-" + req.user.id +".jpg", imageBuffer.data, 'base64', function(err) {
      if (err){
        res.status(400).json(err);
      }
      else {
        knex('users').where({ id: req.user.id })
        .update({ image_link:  '//localhost:3000/uploads/image-' + req.user.id + '.jpg'})
        .then((data) => {
          res.status(200).send('created an image')
        })
      }
    });
})


// Audio Post
router.post('/upload/:id/audio', ejwt({ secret: 'lkmaspokjsafpaoskdpa8asda0s9a' }), (req, res, next) => {

  var base64Data = req.body.audioObj.audio;
  var trackName = req.body.audioObj.trackname;
  console.log('trackName:', trackName);
  console.log('req.user.id:', req.user.id);


  function decodeBase64Audio(data) {

    response = {};
    response.type = data[0];
    response.data = new Buffer(data[1], 'base64');
    console.log('response =>', response)
    return response;
  }

  var audioBuffer = decodeBase64Audio(base64Data);
  console.log('audioBuffer', audioBuffer);

  fs.writeFile(__dirname + '/upload/audio-' + req.user.id + '.mp3', audioBuffer.data, 'base64', function(err) {
    if (err){
      console.log(err);
    }
    else{

      var trackLink = '//localhost:3000/uploads/audio-' + req.user.id + '.mp3';
      res.send('/upload/audio-' + req.user.id + '.mp3')

      knex.select().from('tracks').where({ user_id: req.user.id })
      .then((data) => {
        console.log('audiopost=> ',data)
        if(!data[0]) {
          knex('tracks')
          .insert({ user_id: req.user.id, track_link: trackLink, track_name: trackName })
          .then((data) => {
            res.json(data[0]);
          })
          .catch((err) => {
            res.status(400).json(err);
          });
        }
        if(data[0]) {
          knex.select().from('tracks')
          .where({ user_id: req.user.id} ).update({ track_link: trackLink,  track_name: trackName })
          .then((data) => {
            res.json(data[0]);
          })
          .catch((err) => {
            res.status(400).json(err);
          });
          res.json(data[0]);
        }

      }).catch((err) => {
          res.status(400).json(err);
        });
      // knex.select().from('tracks').returning('*')
      //   .where({id}).update(trackLink)
      //   .then((data) => {
      //     res.json(data[0]);
      //   })
      //   .catch((err) => {
      //     res.status(400).json(err);
      //   });
    }
  });


  // const buffer = fs.createWriteStream(filename);
  // req.request.pipe(buffer);
})

// GET all bands info
router.get('/bands', ejwt({ secret: app.get('superSecret') }), (req, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  } else {
    knex.select().from('bands')
    .then((data) => {
      // console.log(data);
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
  }
});


// POST new band
router.post('/bands/new', ejwt({
    secret: app.get('superSecret')
  }), (req, res) => {
  const newBand = req.body;
  const newBandCreator = req.user.id;

  knex('bands').insert(newBand).returning('*')
  .then((data) => {
    knex('band_user')
    .insert({
      band_id: data[0].id,
      user_id: newBandCreator,
      isBandAdmin: true
    }).returning('*')
    .then((data) => {
      res.json(data[0]);
    })
    .catch((err) => {
      res.status(400).json(err);
    })
  });
})

// GET specific band info
router.get('/bands/:band_id', ejwt({
    secret: app.get('superSecret')
  })
  , (req, res) => {
  let param_id = req.params.band_id;

  knex.select().from('bands').where({ id: param_id })
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// GET all band with track information
router.get('/bandtracks/:band_id',
	ejwt({
    secret: app.get('superSecret')
  }),
	(req, res) => {
  let param_id = req.params.band_id;

  knex('bands')
  .join('tracks', 'bands.id', 'tracks.band_id')
    .select('tracks.id as track_id',
						'bands.id as band_id',
						'tracks.track_name as track_name',
						'tracks.isCreator as isCreator',
						'tracks.original_artist as original_artist',
						'tracks.youtube_link as youtube_link',
						'tracks.isPublished as isPublished')
    .where({ band_id: param_id })
    .then((data) => {
        res.json(data);
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
router.get('/tracks', ejwt({ secret: app.get('superSecret') }), (req, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  } else {
    knex.select().from('tracks')
    .then((data) => {
      // console.log(data);
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
  }
});

router.get('/tracks/:track_id', ejwt({
    secret: app.get('superSecret')
  })
  , (req, res) => {
  console.log("Req User check in Track Detail: ", req.user);
  console.log("Param in Get Track: ", req.params);

  // Grab data from the URL parameters
  let param_id = req.params.track_id;

  knex.select().from('tracks').where({ id: param_id })
    .then((data) => {
      console.log('track id data: ', data);
      // let banddata = data[0];
      // if (param_id === banddata.id) {
      //   console.log(data);
        res.json(data);
      // } else {
      //   res.status(400).redirect('/index')
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});


/////
router.get('/search',
	// ejwt({ secret: app.get('superSecret')}),
	(req, res) => {
  console.log(req.query);
  // if (!req.user) {
  //   return res.sendStatus(401)
  // } else {
	let city1 = req.query.user_city[0] // vancouver
	console.log(city1);
	let city2 = req.query.user_city[1];
	console.log(city2);

	let gender1 = req.query.instrument[0] // vancouver
	console.log(gender1);
	let gender2 = req.query.instrument[1];
	console.log(gender2);

	// AND
    // knex.select().from('users').where({ user_city: city1, gender: gender1})
		// .orWhere({ user_city: city2, gender: gender1})
	// multi - multi
		knex.select().from('users').where({ user_city: city1, gender: gender1})
		// .orWhere({ user_city: city1, gender: gender2})
		// .orWhere({ user_city: city2, gender: gender1})
		// .orWhere({ user_city: city2, gender: gender2})
		//
		// knex('skill_user')
		// .join('users', 'users.id', 'skill_user.user_id')
		// .join('skills', 'skills.id', 'skill_user.skill_id')
		// .where({ user_city: city1, gender: gender1})
		// .orWhere({ user_city: city2, gender: gender1})
    .then((data) => {
      // console.log(data);
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
  // }
});

//
router.post('/tracks/new', ejwt({
    secret: app.get('superSecret')
  }), (req, res) => {
  // console.log('new track - req user: ', req.user);
  // console.log('new track - req body: ', req.body);
  const userId = req.user.id;
  const trackInfo = req.body;
  trackInfo.userId;
  knex('tracks')
  .insert(trackInfo).returning('*')
  .then((data) => {
    console.log(data[0]);
    res.json(data[0]);
  })
  .catch((err) => {
    res.json(err);
  })
});


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

app.use('/uploads', express.static('upload'))
//Server port
app.use('/api', router);
const port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Boilerplate server listening on port ' + port);
})

module.exports = app
