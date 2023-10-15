var mongoose = require("mongoose");

const TrustAuth = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String, required: true },
});

const authCollection = new mongoose.model("TrustAuth", TrustAuth);

insert = async (name, email, image) => {
  try {
    const newRegister = new authCollection({
      name: name,
      email: email,
      image: image,
    });
    await newRegister.save();
    return { status: 200, message: newRegister._id };
  } catch (err) {
    return { status: 404, message: err };
  }
};
isalreadyAuth = async(email)=>{
    try{
        const match  = await authCollection.findOne({email:email});
        if(match){
            return match
        }
        else{
            return false
        }
    }
    catch (err) {
        return false;
      }
}
getUser = async(userid)=>{
    try{
        const user  = await authCollection.findOne({_id:userid});
        if(!user)
            return  { status: 404, message: "Not Found" };
        else{
            return { status: 200, message: user };
        }
    }
    catch (err) {
        return { status: 404, message: err };
      }
}
module.exports = {
  insert: insert,
  isalreadyAuth:isalreadyAuth,
  getUser,getUser
};
