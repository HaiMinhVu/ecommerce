const mongoose = require('mongoose');
const crypto = require('crypto');
const {v1: uuidv1} = require('uuid');

const userSchema = new mongoose.Schema({
		name: {
			type: String,
			trim: true,
			required: true,
			maxlength: 64
		},
		email: {
			type: String,
			trim: true,
			required: true,
			unique: 64
		},
		hashed_password: {
			type: String,
			required: true,
		},
		about: {
			type: String,
			trim: true,
		},
		salt: String,
		role: {
			type: Number,
			default: 0
		},
		history: {
			type: Array,
			default: []
		}
	}, 
	{ timestamps: true }
);

// virtual field
userSchema.virtual('password')
.set(function(password){
	this._password = password;
	this.salt = uuidv1();
	this.hashed_password = this.encryptPassword(password)
})
.get(function(){
	return this._password;
});

userSchema.methods = {
	encryptPassword: function(password){
		if(!password) return '';
		try{
			return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
		}
		catch(err){
			return '';
		}
	},

	authenticate: function(userInputPassword){
		return this.encryptPassword(userInputPassword) == this.hashed_password;
	}
}

module.exports = mongoose.model('User', userSchema);