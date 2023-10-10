var mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  location: { type: String, required: true },
});

const registerCollection = new mongoose.model("registrations", registerSchema);

insert = async (mobile, location, name) => {
  try {
    const newRegister = new registerCollection({
      name: name,
      mobile: mobile,
      location: location,
    });
    await newRegister.save();
    return { status: 200, message: "Registered Successfully" };
  } catch (err) {
    return { status: 404, message: err };
  }
};

module.exports = {
  insert: insert,
};
