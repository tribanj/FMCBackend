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

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.post("/register", async (req, resp) => {
  let { name, mobile, location } = req.body;
  let res = await register.insert(mobile, location, name);
  console.log(res);
  resp.send(res);
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
      console.log(result.message);
    } else {
      let db_password = await getPasswordFromUsername(username);
      let matched = await bcrypt.compare(password, db_password);
      if (!matched) {
        console.log("Entered wrong password!");
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
      console.log(result.message);
    } else {
      let db_password = await getPasswordFromEmail(email);
      let matched = await bcrypt.compare(password, db_password);
      if (!matched) {
        console.log("Entered wrong password!");
        resp.send("Entered wrong password!");
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
    street,
    state,
    zip,
    country,
    level,
    stream,
    course,
  } = req.body;

  const result = await options.insert(
    name,
    email,
    mobile,
    street,
    state,
    zip,
    country,
    level,
    stream,
    course
  );
  resp.send(result);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
