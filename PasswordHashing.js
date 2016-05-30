
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");


var UserSchema = new mongoose.Schema({
    userName   : {type: String, unique: true, required: true},
    password:   {type : String, required: true}
});

// Serial pre-hook for saving the hasked password.
UserSchema.pre("save",function(next){
    var user = this;
    if (this.isModified('password') || this.isNew) {

        //genSalt(rounds, callback)
        //Rounds is number of rounds to process the data, default is 10.
        //Callback will be fired when the salt has been generated.
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {return next(err);}

            //hash(data, salt, progess, callback(error, hashResult)
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) { return next(err);}
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function(passw,callback){

    //compare(data, encrypted, callback(error, comparedResult)
    bcrypt.compare(passw,this.password, function (err, isMatch) {
        if(err){return callback(err);}

        //If no error, first argument is null
        callback(null,isMatch);
    });
};

//Export the module so it can be imported into other projects.
module.exports = mongoose.model('User', UserSchema);