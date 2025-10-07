import React, { useEffect, useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Add = ({url}) => {

    const [image,setImage] = useState(false);

    const [data,setData] = useState({
      name:"",
      desc:"",
      category:"Salad",
      price:""
    })

    const onChangeHandler = (e)=>{
      setData({...data,[e.target.name]:e.target.value})
    }

    const onSubmitHandler = async (e) =>{
      e.preventDefault();
      const formData = new FormData();
      formData.append("image",image);
      formData.append("name",data.name);
      formData.append("desc",data.desc);
      formData.append("category",data.category);
      formData.append("price",Number(data.price));
      const response = await axios.post(`${url}/api/food/add`, formData);

      if(response.data.success){
        setData({
          name:"",
          desc:"",
          category:"Salad",
          price:""
        });
        setImage(false);
        toast.success(response.data.message);
      }
      else{
        toast.error(response.data.message);
      }
    }
 
  return (
    <div className='add'>
      <form action="" className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload img</p>
          <label htmlFor="image">
            <img src={image?URL.createObjectURL(image):assets.upload_area} alt="" />
          </label>
          <input onChange={(e)=>setImage(e.target.files[0])} type="file" name="" id="image" hidden required />
        </div> 

        <div className='add-product-name flex-col'>
          <p>Product Name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' />
        </div>

        <div className='add-product-desc flex-col'>
          <p>Product Description</p>
          <textarea onChange={onChangeHandler} value={data.desc} name="desc" rows="6" placeholder='Write content here'></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select onChange={onChangeHandler} value={data.category} name='category'>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Type</p>
            <input onChange={onChangeHandler} value={data.price} type="Number" name="price" placeholder='$20' />
          </div>
        </div>
        <button type="submit" className='add-btn'>ADD</button>

      </form>
    </div>
  )
}

export default Add