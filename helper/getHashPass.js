const bcrypt = require('bcrypt');

create = async (password)=>{
    const salt = 10;
    return await bcrypt.hash(password, salt);
}

compare = async(password, db_password)=>{
    return await bcrypt.compare(password, db_password);
}

module.exports = {
	create : create,
	compare : compare
}