var mongoose = require("mongoose");

let Schema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  mobile: { type: String },
  bouchre: {type:String}
});


const collection = new mongoose.model("collegeinfo", Schema);

insert = async (
  name,
  email,
  mobile,
  bouchre
) => {
  try {
    const options = new collection({
      name: name,
      email: email,
      mobile: mobile,
      bouchre:bouchre
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

