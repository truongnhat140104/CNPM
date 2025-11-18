// userModel.js (Cập nhật lại trường cartData)
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    status:{type:String,default:"active"},
    role: {type: String, enum: ['user', 'restaurant', 'admin'], default: 'user'},
    
    cartData: {
        type: Object, 
        default: {}
    }
},{minimize:false})

const userModel = mongoose.models.user || mongoose.model("user",userSchema);
export default userModel;