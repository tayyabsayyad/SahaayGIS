var express = require("express");
var pg = require("pg");
var path = require("path");
var bodyParser = require('body-parser');
var session = require('express-session');
//var nodemailer = require('nodemailer');

var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// HEROKU code
//const { Pool } = require('pg');
//const pool = new Pool({
//  connectionString: process.env.DATABASE_URL,
  //ssl: true
//});

//LOCALHOST code
 var config = {
   user: 'postgres',
   database: 'postgres',
   password: 'super',
   port: 5432,
   max: 10,
   idleTimeoutMillis: 30000,
 };
 var pool = new pg.Pool(config);

app.use(session({ secret: 'godisgreat', saveUninitialized: true, resave: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var sess;

app.use("/images", express.static(__dirname + "/public/images"));
app.use("/views", express.static(__dirname + "/views"));
app.use("/data", express.static(__dirname + "/public/data"));
app.use("/header", express.static(__dirname + "/public/pages/header.html"));
app.use("/userloggedinheader", express.static(__dirname + "/public/pages/userloggedinheader.html"));
app.use("/hospitalloggedinheader", express.static(__dirname + "/public/pages/hospitalloggedinheader.html"));
app.use("/ambulanceloggedinheader", express.static(__dirname + "/public/pages/ambulanceloggedinheader.html"));


app.get("/", function(req, res) {
  sess = req.session;
  if (sess.key) {
    if (sess.entity == "user") {
      res.sendFile(path.join(__dirname + "/public/pages/userdashboard.html"));
    } else if (sess.entity == "hospital") {
      res.sendFile(path.join(__dirname + "/public/pages/hospitaldashboard.html"));
    } else if (sess.entity == "ambulance") {
      res.sendFile(path.join(__dirname + "/public/pages/ambulancedashboard.html"));
    }

  } else {
    res.sendFile(path.join(__dirname + "/index.html"));
  }
});

app.get('/login', function(req, res) {
  sess = req.session;
  if (sess.key) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(__dirname + "/public/pages/login.html"));
  }
})

app.get('/signup', function(req, res) {
  sess = req.session;
  if (sess.key) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(__dirname + "/public/pages/signup.html"));
  }
});

app.get("/logout", function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

app.get("/hospital", function(req, res) {
  sess = req.session;
  if (sess.key) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(__dirname + "/public/pages/hospital.html"));
  }
});



app.get("/printuserprofile", function(req, res) {  
    res.sendFile(path.join(__dirname + "/views/printuserprofile.ejs"));
});
app.get("/printhospitalprofile", function(req, res) {  
    res.sendFile(path.join(__dirname + "/views/printhospitalprofile.ejs"));
});
app.get("/printambulanceprofile", function(req, res) {  
    res.sendFile(path.join(__dirname + "/views/printambulanceprofile.ejs"));
});

app.get("/ambulance", function(req, res) {
  sess = req.session;
  if (sess.key) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(__dirname + "/public/pages/ambulance.html"));
  }
});

app.get("/user", function(req, res) {
  sess = req.session;
  if (sess.key) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(__dirname + "/public/pages/user.html"));
  }
});

app.get("/nearesthospital", function(req, res) {
  sess = req.session;
  if (sess.entity == "user") {
    res.sendFile(path.join(__dirname + "/public/pages/nearesthospital.html"));
  } else {
    res.redirect('/');
  }
});

app.get("/tips", function(req, res) {
  sess = req.session;
  if (sess.entity == "user") {
    res.sendFile(path.join(__dirname + "/public/pages/tips.html"));
  } else {
    res.redirect('/');
  }
});

app.get("/edituserprofile", function(req, res) {
  sess = req.session;
  if (sess.entity == "user") {
    res.sendFile(path.join(__dirname + "/public/pages/edituserprofile.html"));
  } else {
    res.redirect('/');
  }
});

app.get("/nearestpharmacy", function(req, res) {
  sess = req.session;
  if (sess.entity == "user") {
    res.sendFile(path.join(__dirname + "/public/pages/nearestpharmacy.html"));
  } else {
    res.redirect('/');
  }
});

app.get("/nearestbloodbank", function(req, res) {
  sess = req.session;
  if (sess.entity == "user") {
    res.sendFile(path.join(__dirname + "/public/pages/nearestbloodbank.html"));
  } else {
    res.redirect('/');
  }
});

app.get("/history", function(req, res) {
  sess = req.session;
  if (sess.entity == "user") {
    res.sendFile(path.join(__dirname + "/public/pages/history.html"));
  } else {
    res.redirect('/');
  }
});

app.get("/track", function(req, res) {
  sess = req.session;
  if (sess.entity == "ambulance") {
    res.sendFile(path.join(__dirname + "/public/pages/trackambulance.html"));
  } else {
    res.redirect('/');
  }
});

app.get("/viewprofile", function(req, res) {
  sess = req.session;
  if (sess.entity == "user") {
    res.sendFile(path.join(__dirname + "/public/pages/viewuserprofile.html"));
  } else if (sess.entity == "hospital") {
    res.sendFile(path.join(__dirname + "/public/pages/viewhospitalprofile.html"));
  } else if (sess.entity == "ambulance") {
    res.sendFile(path.join(__dirname + "/public/pages/viewambulanceprofile.html"));
  } else {
    res.redirect('/');
  }
});

app.post('/usersignup', function(req, res) {
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Connection error: " + err);
      res.status(400).send(err);
    }
    client.query('INSERT INTO user_details(name,email,password,contact_no,emergency_contact_no, blood_group,dob,gender,height,weight,allergies, address,pincode,created_on) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())', [req.body.name, req.body.email, req.body.password, req.body.contact_no, req.body.emergency_contact_no, req.body.blood_group, req.body.dob, req.body.gender, req.body.height, req.body.weight, req.body.allergies, req.body.address, req.body.pincode], function(err, result) {
      done();
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      // res.status(200).send(result);
      res.redirect('/login');
    });
  });
});

app.post('/hospitalsignup', function(req, res) {
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Connection error: " + err);
      res.status(400).send(err);
    }
    client.query('INSERT INTO hospital_details(name,email,password,contact_no,category, address,latitude,longitude,services,timings,website, ratings,created_on) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())', [req.body.name, req.body.email, req.body.password, req.body.contact_no, req.body.category, req.body.address, req.body.latitude, req.body.longitude, req.body.services, req.body.timings, req.body.website, req.body.ratings], function(err, result) {
      done();
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      // res.status(200).send(result);
      res.redirect('/login');
    });
  });
});

app.post('/ambulancesignup', function(req, res) {
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Connection error: " + err);
      res.status(400).send(err);
    }
    client.query('INSERT INTO ambulance_details(operator_name,operator_contact_no,vehicle_no, password,type,first_aid_kit,oxygen_mask,created_on) VALUES($1, $2, $3, $4, $5, $6, $7, NOW())', [req.body.operator_name, req.body.operator_contact_no, req.body.vehicle_no, req.body.password, req.body.type, req.body.first_aid_kit, req.body.oxygen_mask], function(err, result) {
      done();
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      // res.status(200).send(result);
      res.redirect('/login');
    });
  });
});

app.route('/servicefeedback')
  .get((req, res) => {
    sess = req.session;
    if (sess.key) {
      res.sendFile(path.join(__dirname + "/public/pages/servicefeedback.html"));
    } else {
      res.redirect('/');
    }
  })
  .post((req, res) => {
    pool.connect(function(err, client, done) {
      if (err) {
        console.log("Connection error: " + err);
        res.status(400).send(err);
      }
      client.query('INSERT INTO service_feedback(user_id, initiative, ratings, liking, suggestions, recommend, submitted_on) VALUES((SELECT user_id from user_details where email=$1), $2, $3, $4, $5, $6, NOW())', [sess.key, req.body.initiative, req.body.ratings, req.body.liking, req.body.suggestions, req.body.recommend], function(err, result) {
        done();
        if (err) {
          console.log(err);
          res.status(400).send(err);
        }
        // res.status(200).send(result);
        res.redirect('/');
      });
    });
  });

app.route('/hospitalfeedback')
  .get((req, res) => {
    sess = req.session;
    if (sess.key) {
      res.sendFile(path.join(__dirname + "/public/pages/hospitalfeedback.html"));
    } else {
      res.redirect('/');
    }
  })
  .post((req, res) => {
    pool.connect(function(err, client, done) {
      if (err) {
        console.log("Connection error: " + err);
        res.status(400).send(err);
      }
      client.query('INSERT INTO hospital_feedback(user_id, hospital_name, cleanliness_rating, availability_rating, preparedness_rating, overall_rating, recommend, comments, submitted_on) VALUES((SELECT user_id from user_details where email=$1), $2, $3, $4, $5, $6, $7, $8, NOW())', [sess.key, req.body.hospital_name, req.body.cleanliness_rating, req.body.availability_rating, req.body.preparedness_rating, req.body.overall_rating, req.body.recommend, req.body.comments], function(err, result) {
        done();
        if (err) {
          console.log(err);
          res.status(400).send(err);
        }
        // res.status(200).send(result);
        res.redirect('/');
      });
    });
  });

app.post('/sub', function(req, res) {
  const accountSid = 'AC0b9cb8dfa9cb0760245f16d22f685d50';
  const authToken = '9405cc05c122a6e81159f9d96f302079';
  client = require('twilio')(accountSid, authToken);
  client.messages
    .create({
      body: 'Emergency!!' + sess.key,
      from: '+12012988944',
      to: '+917506108340'
    })
    .then(message => console.log(message.sid));
});

app.post('/gohospital', function(req, res) {
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Connection error: " + err);
      res.status(400).send(err);
    }
    client.query('INSERT INTO user_history(user_id, hospital_name, visited_on) VALUES((SELECT user_id from user_details where email=$1), $2, NOW())', [sess.key, req.body.hospital_name], function(err, result) {
      done();
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      // res.status(200).send(result);
      res.redirect('/');
    });
  });
});

app.post('/trackmeasambulance', function(req, res) {
  var latitude = req.body.lat;
  var longitude = req.body.lng;
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Connection error: " + err);
      res.status(400).send(err);
    }
    client.query('UPDATE user_ambulance_tracking set ambulancelklat=$1,ambulancelklong=$2, status=$3, last_updated_on=NOW() where ambulance_id=(SELECT ambulance_id from ambulance_details where vehicle_no=$4)', [latitude, longitude, "Ready", sess.key], function(err, result) {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else if (result.rowCount == 0) {
        client.query('INSERT INTO user_ambulance_tracking(ambulance_id, ambulancelklat,ambulancelklong, status, last_updated_on) VALUES((SELECT ambulance_id from ambulance_details where vehicle_no=$1), $2, $3, $4, NOW())', [sess.key, latitude, longitude, "Ready"], function(error, result) {
          done();
          if (error) {
            console.log(error);
            res.status(400).send(error);
          }
        });
      } else {
        done();
        res.status(200);
      }
    });
  });
});

app.post('/userlogin', function(req, res) {
  pool.connect(function(err, client, done) {
    client.query('SELECT email,password FROM user_details WHERE email = $1 AND password =$2', [req.body.email, req.body.password], function(error, results) {
      if (error) {
        res.send({
          "code": 400,
          "failed": "Error ocurred"
        })
      } else if (results.rowCount == 1) {
        sess = req.session;
        sess.key = req.body.email;
        sess.entity = "user";
        done();
        res.redirect('/');
      } else {
        res.send({
          "code": 204,
          "success": "Email and password does not match"
        });
      }
    });
  });
});

app.post('/hospitallogin', function(req, res) {
  pool.connect(function(err, client, done) {
    client.query('SELECT email,password FROM hospital_details WHERE email = $1 AND password =$2', [req.body.email, req.body.password], function(error, results) {
      if (error) {
        res.send({
          "code": 400,
          "failed": "Error ocurred"
        })
      } else if (results.rowCount == 1) {
        sess = req.session;
        sess.key = req.body.email;
        sess.entity = "hospital";
        done();
        res.redirect('/');
      } else {
        res.send({
          "code": 204,
          "success": "Email and password does not match"
        });
      }
    });
  });
});


app.post('/ambulancelogin', function(req, res) {
  pool.connect(function(err, client, done) {
    client.query('SELECT vehicle_no,password FROM ambulance_details WHERE vehicle_no = $1 AND password =$2', [req.body.vehicle_no, req.body.password], function(error, results) {
      if (error) {
        res.send({
          "code": 400,
          "failed": "Error ocurred"
        })
      } else if (results.rowCount == 1) {
        sess = req.session;
        sess.key = req.body.vehicle_no;
        sess.entity = "ambulance";
        done();
        res.redirect('/');
      } else {
        res.send({
          "code": 204,
          "success": "Ambulance vehicle no and password does not match"
        });
      }
    });
  });
});

app.get('/viewuserprofile', function(req, res) {
  pool.query('SELECT * FROM user_details where email=$1',[sess.key], function(err, result) {
      if (err) {
        console.log(err);
        throw err;
      } 
			res.render('printuserprofile', {result});
	});
  });

app.get('/viewhospitalprofile', function(req, res) {
  pool.query('SELECT * FROM hospital_details where email=$1',[sess.key], function(err, result) {
      if (err) {
        console.log(err);
        throw err;
      } 
			res.render('printhospitalprofile', {result});
	});
  });  

app.get('/viewambulanceprofile', function(req, res) {
  pool.query('SELECT * FROM ambulance_details where vehicle_no=$1',[sess.key], function(err, result) {
      if (err) {
        console.log(err);
        throw err;
      } 
			res.render('printambulanceprofile', {result});
	});
  });

/* 
// Email Feature
 var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mediassistancegis@gmail.com',
    pass: 'GIS18&19'
  }
});

var mailOptions = {
  from: 'mediassistancegis@gmail.com',
  to: 'atashi.khatua@gmail.com,jenniferrodriques2697@gmail.com,pawarpremlata@gmail.com,madhulikatadas@rediffmail.com',
  subject: 'Sending Email using Node.js',
  text: 'Feedback!! '
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
 */
 
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);

console.log("Running at http://localhost:" + port);