import { Schema, model} from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        return next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

UserSchema.methods.comparePassword = async function(entredPassword){
    return await bcrypt.compare(entredPassword, this.password)
}

export default model('User', UserSchema)