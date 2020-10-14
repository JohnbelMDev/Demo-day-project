const mongoose = require('mongoose');
const fundModel = require('./models/fundModel');
var ObjectId = require('mongodb').ObjectID;
const multer = require('multer');
 // Add your Secret Key Here
 const key ='sk_test_51Ha6EUEsCFPlCMG1zxzWoFCMCkMdTEEnxmtsY54cDJ1ZCMebV8NwxX9V9IFrDojB0nhtXTdhk1EVVD1KDiUUPi9g00gVqMcbFl';

 const stripe = require('stripe')(key);


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + ".png")
  }
});
var upload = multer({
  storage: storage
});

// this is the whole object
// and it's being assigned
// this is for the server that handles
// Get --> for getting data ---> the responce should be an array with the properties
// post --> for creating data
// Put---> for updating data
// delete----> for deleting data
/* app is an object*/


//What the Submission endpoint contained
// forms
// title of the fundraisers
// Description of the fundraiserr
// How much they want to raise
// Date of submission


// Will grab the endpoint with a get handler
module.exports = function(app, passport, multer, db) {

  // app is an object
  // gets are the functions
  // show the home page (will also have our login links) because it's rendering the homepages
  app.get('/', function(req, res) {
    // db.collection('FundModel').find({}).toArray((err, result) => {
    //   res.render('index.ejs', {
    //     answer: result
    //   });
    //
    // });
    fundModel.find({}, function(err, docs) {

      if (err) {} else {
        // res.send(docs)
        res.render('index.ejs', {
          answer: docs
        });
      }




    });
    // console.log(result)
    // res.send("hello there")

  });


app.get('/logout', (req,res) =>{
req.logout();
res.redirect('/')

});


  // PROFILE SECTION =========================
  // each route represent a section
  // it's handling a req
  app.get('/myfundraiser', isLoggedIn, function(req, res) {
    var today = new Date();
    var hourNow = today.getHours();
    var greeting;
    if (hourNow > 18) {
      greeting = 'Good Evening'
    } else if (hourNow > 12) {
      greeting = 'Good Afternoon'

    } else if (hourNow > 0) {
      greeting = 'Good Morning'
    } else {
      greeting = 'Welcome';
    }
    db.collection('donation').find({
      //finding  all donation that is created by the user
      user: req.user
    }).toArray((err, result) => {
      // console.log(result);
      // console.log(result);
      res.render('myfundraiser.ejs', {
        // messages: result,
        greeting: greeting,
        result: result
      })
    });
  });


  app.get('/donationForm/:id', (req, res) => {
    // console.log(typeof(req.params.id));// //
    // console.log(req.params.id); // //

    var id = ObjectId(req.params.id);
    // console.log(id);
    fundModel.findOne({
      _id: id
    }, (err, result) => {
      // console.log("hello", result);
      res.render("donate.ejs", {
        answer: result
      });
    })
  })





  app.get('/viewdonation/:id', (req, res) => {
    // console.log(typeof(req.params.id));// //
    console.log(req.params.id); // //

    var id = ObjectId(req.params.id);
    // console.log(id);
    fundModel.findOne({
      _id: id

    },
    // console.log();
     (err, result) => {
      console.log("hello", result);
      res.render("viewdonation.ejs", {
        viewDonation: result
      });
    })
  })

// app.get('/campaignprofileNavigation',(req,res)=>{
//   res.redirect('/campaignprofile');
// })


  app.get('/campaignprofile', isLoggedIn,(req, res) => {
    var today = new Date();
    var hourNow = today.getHours();
    var greeting;
    if (hourNow > 18) {
      greeting = 'Good Evening'
    } else if (hourNow > 12) {
      greeting = 'Good Afternoon'

    } else if (hourNow > 0) {
      greeting = 'Good Morning'
    } else {
      greeting = 'Welcome';
    }

    fundModel.find({
        user: req.user.local.email
      },
      (err, result) => {
        // console.log(result);
        // console.log("hello I am",result);
        res.render('campaignprofile.ejs', {
          answer: result,
          greeting:greeting
        });

      });
    // res.render("campaignprofile")

  })

  app.delete('/deleteDonation', (req, responce) => {
    // console.log(req.body.id);
    db.collection('donation').findOneAndDelete({
      _id: new mongoose.mongo.ObjectID(req.body.id),
    }, (err, result) => {
      if (err) return console.log(err)
      // console.log('saved to databassssse')
      responce.json({
        message: "succes"
      })
    })

  });

  app.post('/fundRaiser', (req, responce) => {
    let date = new Date();
    let fund = parseInt(req.body.fund);

    db.collection('donation').save({
      // setting property for a specific users
      user: req.user,
      fund: fund,
      date: date.toString(10).split('T')[0]
    }, (err, result) => {
      if (err) return console.log(err)

    })
    responce.redirect('/myfundraiser')


  });

  app.post('/donatenow', (req, res) => {
    let fullName = req.body.fullName;
    let email = req.body.email;
    let phoneNumber = parseInt(req.body.fullName);
    let moneyAmount = parseInt(req.body.amount);
    let result = req.body.result;
    let itemDonated = req.body.itemDonated;


    fundModel.findOneAndUpdate({
      _id: new mongoose.mongo.ObjectID(result)
    }, {
      $inc: {
        currentGoal: moneyAmount
      },

        // add to an array
        $addToSet: {
          donation: {
            fullName: fullName,
            email: email,
            phoneNumber: phoneNumber,
            moneyAmount: moneyAmount,
            itemDonated:itemDonated
          }
        }

    },  {
      new: true
    }, function(err, response) {
      if (err) {
        res.redirect('/')
      } else {
        try {
          console.log( req.body);
          stripe.customers
            .create({

              name: req.body.name,
              email: req.body.email,
              source: req.body.stripeToken
            })
            .then(customer =>
              stripe.charges.create({
                amount: req.body.amount * 100,
                currency: "usd",
                customer: customer.id
              })
            )
            .then(() => res.redirect(`/viewdonation/${result}`))
            .catch(err => {console.log(err);
                console.log(err);
            })
        } catch (err) {
          res.send(err);
        }
      }
    })





  })

  app.post('/campaignSubmmision', (req, res) => {
    let num1 = req.body.num1
    let num2 = req.body.num2
    let num3 = req.body.num3
    let num4 = req.body.num4

    res.redirect("/campaignprofile")
    // res.send(num1 + "" + num2 + "" + num3 + "" + num4)
    // res.send(num2)
    // res.send(num3)
    // res.send(num4)




  });


  app.post('/submission', upload.single('file-to-upload'), (req, res, next) => {
    let email = req.user.local.email
    let title = req.body.title;
    let description = req.body.description;
    let amount = parseInt(req.body.amount); //parsing the number to have the databse collection name as a number
    let date = req.body.date;
    let category = req.body.category;
    let itemsTodonate = req.body.itemsTodonate;
    let homeAddress = req.body.homeAddress;
    let name = req.body.name;


    // let itemsTodonate = req.body.date;

    // console.log(req.sessionID);

    // console.log(req.user);
    //test and it works
    // db.collection('fundraiserForm').save({
    //   //
    //

    // })
    // creating fund
    // passing field as a contructor
    // creating an object
    let fund = new fundModel({
      _id: new mongoose.Types.ObjectId(),
      user: email,
      name:name,
      imgPath: 'images/uploads/' + req.file.filename,
      amount: amount,
      currentGoal: 0,
      title: title,
      description: description,
      date: date,
      itemsTodonate:itemsTodonate,
      category:category,
      homeAddress:homeAddress,
      donation: []

    })
    // saving the fund object to the databse
    fund.save((err) => {
      if (err) res.send('ERROR');
      else res.redirect('/campaignprofile');
    })
  })


   app.get("/completed", (req,res) =>{
     res.render("completed.ejs")
     // res.sed("yoyoyo")
   })
app.get('/test',(req,res) =>{
  res.render('test.ejs')
})

// creating post charge
//   app.post("/charge", (req, res) => {
//   try {
//     console.log( req.body);
//     stripe.customers
//       .create({
//
//         name: req.body.name,
//         email: req.body.email,
//         source: req.body.stripeToken
//       })
//       .then(customer =>
//         stripe.charges.create({
//           amount: req.body.amount * 100,
//           currency: "usd",
//           customer: customer.id
//         })
//       )
//       .then(() => res.redirect('completed'))
//       .catch(err => {console.log(err);
//           console.log(err);
//       })
//   } catch (err) {
//     res.send(err);
//   }
// });

  // app.get()
  // LOGOUT ==============================
  // grabs the logout path
  // get for getting data
  app.get('/logout', function(req, res) {
    // called on the functoin logout
    req.logout();
    // if the user logs out then redirect to the homepage
    res.redirect('/');
  });

  // this doesn't do anything right now
  app.delete('/deleteAction', (req, res) => {
    // defining name
    db.collection('donation').remove({
      _id: new mongoose.mongo.ObjectID(req.body.id),
    }, (err, result) => {
      if (err) return console.log(err)
      // console.log('saved to database')
      res.send('deleted')
    })
  })



  app.delete('/removeCampaign', (req, res) => {
    fundModel.findByIdAndRemove({
      _id: new mongoose.mongo.ObjectID(req.body._id),
    }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', {
      //req.flash is display once to the user
      message: req.flash('loginMessage')
    });
  });

  // process the login form
  // passport auntheticate with the local strategy
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/campaignprofile', // redirect to the secure profile section
    // this is saying that which route we should redirect if there is a failed login
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });


  app.get('/campaignform', function(req, res) {
    res.render("campaignform.ejs")

  });
  // process the signup formi
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/campaignform', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
      app.get('/unlink/local', isLoggedIn, function(req, res) {
        // registering user for user
          var fundRaiser            = req.fundRaiser;
          fundRaiser.local.email    = undefined;
          fundRaiser.local.password = undefined;
          fundRaiser.local.name = undefined;
          fundRaiser.save(function(err) {
              res.redirect('/profile');
          });
      });
  //
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
