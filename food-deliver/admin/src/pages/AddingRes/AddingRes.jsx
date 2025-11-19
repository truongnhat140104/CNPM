import React, { useState } from 'react'
import './AddingRes.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddingRes = ({ url }) => {

  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    ownerName: "",
    email: "",     // Email đăng nhập (User Model)
    password: "",  // Mật khẩu (User Model)
    
    restaurantName: "", // Tên quán (Profile Model)
    address: "",        // Địa chỉ (Profile Model)
    phone: "",          // SĐT (Profile Model)
    description: ""     // Mô tả (Profile Model)
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    // Tạo FormData để gửi cả text và file ảnh
    const formData = new FormData();
    
    // 1. Thông tin Account
    formData.append("ownerName", data.ownerName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("role", "restaurant"); // Role cố định là restaurant

    // 2. Thông tin Profile
    formData.append("name", data.restaurantName); // Tên quán
    formData.append("address", data.address);
    formData.append("phone", data.phone);
    formData.append("description", data.description);
    formData.append("image", image);

    try {
      // Gọi API thêm nhà hàng (Bạn cần tạo API này ở Backend)
      const response = await axios.post(`${url}/api/user/register-restaurant`,formData, {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});

      if (response.data.success) {
        setData({
          ownerName: "",
          email: "",
          password: "",
          restaurantName: "",
          address: "",
          phone: "",
          description: ""
        });
        setImage(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error adding restaurant");
    }
  }

  return (
    <div className='add-res'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        
        {/* PHẦN 1: ẢNH ĐẠI DIỆN QUÁN */}
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            {/* Nếu chưa có ảnh thì hiện icon upload, có rồi thì hiện ảnh preview */}
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
        </div>

        <div className="add-product-name flex-col">
          <p>Restaurant Details</p>
          <div className="multi-fields">
             <input onChange={onChangeHandler} value={data.restaurantName} type="text" name='restaurantName' placeholder='Restaurant Name (Tên quán)' required />
             <input onChange={onChangeHandler} value={data.phone} type="text" name='phone' placeholder='Phone Number' required />
          </div>
          <input onChange={onChangeHandler} value={data.address} type="text" name='address' placeholder='Full Address' required />
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="4" placeholder='Restaurant Description (Mô tả quán)' required></textarea>
        </div>

        <hr className='divider'/>

        <div className="add-product-name flex-col">
          <p>Account Setup (For Login)</p>
          <div className="multi-fields">
            <input onChange={onChangeHandler} value={data.ownerName} type="text" name='ownerName' placeholder='Username' required />
            <input onChange={onChangeHandler} value={data.email} type="email" name='email' placeholder='Login Email' required />
          </div>
          <input onChange={onChangeHandler} value={data.password} type="password" name='password' placeholder='Password' required />
        </div>

        <button type='submit' className='add-btn'>CREATE RESTAURANT</button>
      </form>
    </div>
  )
}

export default AddingRes