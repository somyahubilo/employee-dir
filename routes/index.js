const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const shortId = require('short-id');
const moment = require("moment")


const { User } = require("./../models/users");
const { Customer } = require("./../models/customer");
const { Activity } = require("./../models/activity");



/* GET home page. */
router.get('/', async function(req, res, next) {
  // const data = await User.find({});
  // console.log("data",data);
  // res.render('index', { title: data[0].emailAddress });
  if(req.session.user){
    res.render('index');

  }else{
    res.render('login');

  }
});
router.get('/login',  function(req, res, next) {
  
  res.render('login');
});
router.get('/signup',  function(req, res, next) {
  
  res.render('signup');
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  req.session = null;
  res.redirect("/");
});

router.post("/signup",(req,res)=>{
  console.log("req body==", req.body);
  User(req.body)
    .save()
    .then(user => {
      console.log(user);
      res.send({ code: 1, message: "success", data: user });
    })
    .catch(err => {
      console.log(err);
      if (err.code == 11000) {
        res.send({ code: 0, message: "Company Id already exists" }); 
      } else {
        res.send({ code: 0, message: "Addition of user failed" });
      }
    });
})

router.post("/login",(req,res)=>{
  console.log("req body==", req.body);
  delete req.session.user;
  //console.log(req.body);
  User.findOne({ companyId: req.body.companyId})
    .then(doc => {
      if (doc) {
        //compare password
        bcrypt.compare(req.body.password, doc.password, (err, resp) => {
          if (resp) {
            req.session.user = doc;
            console.log("admin", doc);
            res.send({ code: 1, message: "Logged in sucessfully" });
          } else {
            res.send({ code: 0, message: "Password incorrect !" });
          }
        });
      } else {
        res.send({ code: 0, message: "Invalid credentials" });
      }
    })
    .catch(err => {
      res.send({ code: 0, message: "Invalid credentials" });
    });
});

router.get('/customer',  function(req, res, next) {
  Customer.find({})
      .sort({ createdAt: -1 })
      .then(customer => {
        res.render("customer", { customer });
      })
      .catch(err => {
        console.log(err);
      });
});
router.get('/activity',  async function(req, res, next) {

  var activity = await Activity.find({}).sort({ createdAt: -1 });
  if(activity.length >0){
    activity.forEach(a=>{
      a.createdAt = moment(a.createdAt).format("DD-MM-YYYY hh:mm");
    })
    res.render("activity",{ activity })
  }else{
    res.render("activity", { activity :[] });
  }
});

router.post("/addCustomer",(req,res)=>{
  console.log("req body==", req.body);
  req.body.customerId = shortId.generate();
  Customer(req.body)
    .save()
    .then(user => {
      console.log(user);
      res.send({ code: 1, message: "success", data: user });
    })
    .catch(err => {
      console.log(err);
      if (err.code == 11000) {
        res.send({ code: 0, message: "Email Id already exists" }); 
      } else {
        res.send({ code: 0, message: "Addition of customer failed" });
      }
    });
})

router.post("/addActivity",(req,res)=>{
  console.log("req body==", req.body);
  req.body.userId = req.session.user.companyId;
  Activity(req.body)
    .save()
    .then(user => {
      console.log(user);
      res.send({ code: 1, message: "success", data: user });
    })
    .catch(err => {
      console.log(err);
      if (err.code == 11000) {
        res.send({ code: 0, message: "Email Id already exists" }); 
      } else {
        res.send({ code: 0, message: "Addition of activity failed" });
      }
    });
})

router.get("/getCutomers",async (req,res)=>{
var customers = await Customer.find({});
res.send(customers);

})
module.exports = router;
