import foodModel from "../models/foodModel.js";
import fs from 'fs';

// add food item
const addFood = async(req,res)=>{

    const image_filename = req.file.filename;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        image: image_filename,
    });
    try{
        await food.save();
        res.json({success:true, message: "Food item added"});
    } catch(error){
        console.log(error);
        res.json({success:false, message: "Something went wrong"});
    }
}

//all food list
const listFood = async(req,res)=>{
    try{
        const foods = await foodModel.find({});
        res.json({success:true, data: foods});
    } catch(error){
        console.log(error);
        res.json({success:false, message: "Something went wrong"});
    }
}

//remove food item
const removeFood = async(req,res)=>{
    try{
        const food = await foodModel.findById(req.body.id);
        fs.unlink('./uploads/${food.image}',()=>{});

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message: "Food item removed"});

    } catch(error){
        console.log(error);
        res.json({success:false, message: "Something went wrong"});
    }
}

//edit food item
const updateFood = async(req,res)=>{
    try{
        const foodId = req.body.id;
        const updateData = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
        };

        if (req.file) {
            const food = await foodModel.findById(foodId);
            fs.unlink(`./uploads/${food.image}`, () => {});

            updateData.image = req.file.filename;
        }

        await foodModel.findByIdAndUpdate(foodId, updateData);
        res.json({ success: true, message: "Food item updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong" });
    }
}

const getFoodById = async (req, res) => {
    try {
        const food = await foodModel.findById(req.params.id); 
        
        if (food) {
            res.json({ success: true, data: food });
        } else {
            res.json({ success: false, message: "Food not found" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong" });
    }
}

export {addFood, listFood, removeFood, updateFood, getFoodById};