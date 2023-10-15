const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const cookie = require("cookie");
require("./database/connection.js");
const cookieParser = require("cookie-parser");
const db = require("./database/db.js");
const jwt = require("./helper/genJwtToken.js");
const bcrypt = require("./helper/getHashPass.js");
const mailer = require("./helper/mail.js");
const options = require("./database/get-more-college-options.js");
const register = require("./database/register.js");
const college = require('./database/registercollege.js')
const multer = require('multer')
const app = express();

const continueAuth = require('./database/continueAuth.js')

app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(cors());




const upload = multer({
  storage:multer.diskStorage({
    destination:function(req,file,cb)
    {
        cb(null,'./public/uploads')
    },
      filename:function(res,file,cb){
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
          cb(null, file.fieldname + '-' + uniqueSuffix+file.originalname)
      }
  })
});

app.post('/userprofile',async(req,res)=>{
  const getuser = await getUser(req.body.userid);
  if(getuser.status == 404)
  return res.status(404).send(getuser.message);
  else
  return res.status(200).send(getuser.message);
})
app.post('/collegeinfo',upload.fields([{name:'bouchre',maxCount:1},{name:'exceldata',maxCount:1}]),async(req,res,next)=>{
  const {
    image,
    name,
    email,
    comment,
    course,
    AdmissionDetails,
  } = req.body;

  const result = await college.insert(
    image,
    name,
    email,
    comment,
    course,
    AdmissionDetails,
    req.files['exceldata'][0].filename,
    req.files['bouchre'][0].filename,
  );
  res.send(result);
})

app.post("/register", async (req, resp) => {
  let { name, mobile, location } = req.body;
  let res = await register.insert(mobile, location, name);
  console.log(res);
  resp.send(res);
});
app.post("/googleAuth", async (req, resp) => {
  let { name, email, image } = req.body;
  const check = await isalreadyAuth(email);
  if(!check){
  check = await continueAuth.insert(name, email, image);
  }
  resp.json(check);
  // console.log(res);
  // resp.send(res);
});
app.post("/signup", async (req, resp) => {
  let { username, firstname, lastname, email, password, cpassword } = req.body;
  const name = firstname + " " + lastname;

  if (password == cpassword) {
    let emailExist = await db.emailExist(email);
    let usernameExist = await db.usernameExist(username);

    if (usernameExist.status == 200 || emailExist.status == 200) {
      console.log("Enter unique username and email");
      resp.send("Enter unique username and email");
    }

    if (usernameExist.status == 404 && emailExist.status == 404) {
      password = await bcrypt.create(password);
      let result = await db.insert(username, name, email, password);
      if (result.status == 200) console.log(result.message);
      else console.log(result.message);
    }
    resp.send({ status: 200, message: "Password Matched" });
  } else {
    resp.send({ status: 200, message: "Password is not matched" });
  }
});

function checkGmail(str) {
  return str.endsWith("@gmail.com");
}

app.post("/login", async (req, resp) => {
  let { UsernameorEmail, password } = req.body;
  let username, email;
  if (checkGmail(UsernameorEmail)) email = UsernameorEmail;
  else username = UsernameorEmail;

  if (typeof username !== "undefined") {
    //entered username
    let result = await usernameExist(username);
    if (result.status == 404) {
      return resp.status(404).send("Invalid creadentails");
    } else {
      let db_password = await getPasswordFromUsername(username);
      let matched = await bcrypt.compare(password, db_password);

      if (matched == false) {
        return resp.status(404).send("Entered wrong password!");
      } else {
        let data = { name: username };
        let token = await jwt.createToken(data);
        console.log(token);
        resp.send({ status: 200, jwtToken: token });
      }
    }
  } else {
    // entered email
    let result = await emailExist(email);
    if (result.status == 404) {
      return resp.status(404).send("Invalid creadentails");
    } else {
      let db_password = await getPasswordFromEmail(email);
      let matched = await bcrypt.compare(password, db_password);
      if (!matched) {
        return resp.status(404).send("Entered wrong password!");
      } else {
        let data = { name: username };
        let token = await jwt.createToken(data);
        resp.send({ status: 200, jwtToken: token });
      }
    }
  }
});

app.post("/forgetPassword", async (req, resp) => {
  const email = req.body.email;
  let emailExist = await db.emailExist(email);
  console.log(emailExist);
  if (emailExist.status == 404) {
    console.log(emailExist.message);
  } else if (emailExist.status == 200) {
    let subject = "FORGOT PASSWORD FROM NODEJS";
    let otp = Math.floor(Math.random() * 9000 + 1000);
    otp = otp.toString();
    let message = `Your OTP - ${otp}`;
    console.log(message);
    mailer.sendMail(email, subject, message);
  }
  resp.send({ status: 200 });
});

app.post("/get-more-college-options", async (req, resp) => {
  const {
    name,
    email,
    mobile,
    bouchre,
  } = req.body;

  const result = await options.insert(
    name,
    email,
    mobile,
    bouchre
  );
  resp.send(result);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
