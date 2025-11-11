import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    status:{type:String,default:"active"},
    
    // --- Thêm dòng này ---
    role: {
        type: String,
        enum: ['customer', 'owner', 'admin'],
        default: 'customer'
    },
    // -------------------

    cartData:{type:Object,default:{}}
},{minimize:false})

const userModel = mongoose.models.user || mongoose.model("user",userSchema);
export default userModel;