const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // match a valid email using a regex
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    thoughts:[{
        type: Schema.Types.ObjectId,
        ref: 'Thought'
    }]
},
    {
        toJSON: {
            virtuals: true
        },
        id: false
    }
);

UserSchema.virtual('friendsCount').get(function(){
    return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User;