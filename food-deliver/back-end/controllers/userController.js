import userModel from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Login user
const loginUser = async (req, res) => {
}

// Register user
const registerUser = async (req, res) => {
    const {name,password,email} = req.body;
    try {
        const exists = await userModel.findOne({email});
        //Checking is exist
        if (exists){
            return res.json({sucess:false, message: "User already exist"})
        }

        // Validate
    } 
    catch(error){

    }
}

export { loginUser, registerUser };
