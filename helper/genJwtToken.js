const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();
let secretKey = process.env.jwtSecretKey;

createToken = (data)=>{
	const token = jwt.sign(data, secretKey, {expiresIn : '5d'});
	return token;
}

verifyToken = (token)=>{
	try{
		return {status : 200, data : jwt.verify(token, secretKey)};
	}catch{
		return {status : 404};
	}
}

module.exports = {
	createToken : createToken,
	verifyToken : verifyToken
}