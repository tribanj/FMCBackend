var mongoose = require("mongoose");

let Schema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  mobile: { type: String },
  street: { type: String },
  state: { type: String },
  zip: { type: String },
  country: { type: String },
  level: { type: String },
  stream: { type: String },
  course: { type: String },
});

const collection = new mongoose.model("get-more-college-options", Schema);

insert = async (
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
) => {
  try {
    const options = new collection({
      name: name,
      email: email,
      mobile: mobile,
      street: street,
      state: state,
      zip: zip,
      country: country,
      level: level,
      stream: stream,
      course: course,
    });
    await options.save();
    return { status: 200, message: "Details saved!" };
  } catch (err) {
    return { status: 404, message: err };
  }
};

module.exports = {
  insert: insert,
};
