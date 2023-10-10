var mongoose = require("mongoose");

let usersSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const userCollection = new mongoose.model("users", usersSchema);

insert = async (username, name, email, password) => {
  try {
    const newUser = new userCollection({
      username: username,
      name: name,
      email: email,
      password: password,
    });
    await newUser.save();
    return { status: 200, message: "User Inserted successfully" };
  } catch (err) {
    return { status: 404, message: err };
  }
};

emailExist = async (email) => {
  try {
    const obj = await userCollection.findOne({ email: email });
    if (obj) {
      return { status: 200, message: "Email Exists" };
    } else return { status: 404, message: "Email not exist" };
  } catch (err) {
    return { status: 500, message: err };
  }
};

usernameExist = async (username) => {
  try {
    const obj = await userCollection.findOne({ username: username });
    if (obj) {
      return { status: 200, message: "Username Exists" };
    } else return { status: 404, message: "Username not exist" };
  } catch (err) {
    return { status: 500, message: err };
  }
};

verifyPasswordFromUsername = async (username, password) => {
  try {
    const obj = await userCollection.find(
      { username: username },
      { password: 1 }
    );
    if (obj[0].password != password) {
      return { status: 404, message: "Password mismatched!!" };
    } else {
      return { status: 200, message: "Password matched!!" };
    }
  } catch (err) {
    return err;
  }
};

getPasswordFromUsername = async (username) => {
  try {
    const obj = await userCollection.find(
      { username: username },
      { password: 1 }
    );
    return obj[0].password;
  } catch (err) {
    return err;
  }
};

getPasswordFromEmail = async (email) => {
  try {
    const obj = await userCollection.find({ email: email }, { password: 1 });
    return obj[0].password;
  } catch (err) {
    return err;
  }
};

module.exports = {
  insert: insert,
  emailExist: emailExist,
  usernameExist: usernameExist,
  getPasswordFromUsername: getPasswordFromUsername,
  getPasswordFromEmail: getPasswordFromEmail,
};
