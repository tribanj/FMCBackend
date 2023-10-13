var mongoose = require("mongoose");

let Schema = new mongoose.Schema({
    image:{type:String},
    name:{type:String},
    email:{type:String},
    comment:{type:String},
    course:{type:String},
    AdmissionDetails:{type:String},
    exceldata:{type:String},
    bouchre:{type:String}
});


const collection = new mongoose.model("collegeinfo", Schema);

insert = async (
   image,
    name,
    email,
    comment,
    course,
    AdmissionDetails,
    exceldata,
    bouchre
) => {
  try {
    const options = new collection({
      image: image,
      name: name,
      email: email,
      comment: comment,
      course: course,
      AdmissionDetails: AdmissionDetails,
      exceldata:exceldata,
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

