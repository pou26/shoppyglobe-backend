import mongoose from "mongoose"

const userSchema=new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"], 
        trim: true
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"], 
        trim: true
    },
    hobby: {
        type: String,
        required: [true, "Hobby is required"], 
        trim: true
    },
    password:{
        type: String,
        required:true
    }
})

const userModel= mongoose.model("users",userSchema)

export default userModel;