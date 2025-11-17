import React, { useEffect, useState } from 'react'
import './Update.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from 'react-router-dom';

const Update = ({url}) => {

    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [id] = useState(location.state?.id); 

    const [image,setImage] = useState(false); 
    const [previewUrl, setPreviewUrl] = useState(assets.upload_area);

    const [data,setData] = useState({
      name:"",
      description:"",
      category:"Main course",
      price:""
    })

    useEffect(() => {
      if (id) {
        const fetchFoodData = async () => {
          try {
            const response = await axios.get(`${url}/api/food/get/${id}`, {headers: { Authorization: `Bearer ${token}` }});
            if (response.data.success) {
              const foodData = response.data.data;
              setData({
                name: foodData.name,
                description: foodData.description,
                category: foodData.category,
                price: foodData.price
              });
              setPreviewUrl(`${url}/images/${foodData.image}`);
            } 
            else {
              toast.error("Cannot fetch food data.");
            }
          } 
          catch (err) {
            toast.error("Server error while fetching data.");
          }
        };
        fetchFoodData();
      } 
      else {
        setData({
          name:"",
          description:"",
          category:"Gato",
          price:""
        });
        setImage(false);
        setPreviewUrl(assets.upload_area);
      }
    }, [id, url]);
    // 2. Cập nhật hàm xử lý thay đổi ảnh
    const onImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImage(file); // Lưu file mới
        setPreviewUrl(URL.createObjectURL(file)); // Cập nhật preview
      }
    }

    // 3. Cập nhật hàm Submit
    const onSubmitHandler = async (e) =>{
      e.preventDefault();
      const formData = new FormData();
      
      // Thêm các trường dữ liệu
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("price", Number(data.price));

      let response;

      if (id) {
        formData.append("id", id);
        if (image) {
          formData.append("image", image);
        }
        response = await axios.post(`${url}/api/food/update`, formData, {headers: { Authorization: `Bearer ${token}` }});

      } else {
        formData.append("image", image);
        response = await axios.post(`${url}/api/food/add`, formData, {headers: { Authorization: `Bearer ${token}` }});
      }

      if(response.data.success){
        toast.success(response.data.message);
        if (!id) {
          setData({
            name:"",
            description:"",
            category:"Main course",
            price:""
          });
          setImage(false);
          setPreviewUrl(assets.upload_area);
        }
        navigate('/list'); 
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
            <img src={previewUrl} alt="" />
          </label>
          <input 
            onChange={onImageChange} 
            type="file" 
            id="image" 
            hidden 
            required={!id} 
          />
        </div> 

        <div className='add-product-name flex-col'>
          <p>Product Name</p>
          <input onChange={(e) => setData({...data, name: e.target.value})} value={data.name} type="text" name='name' placeholder='Type here' required />
        </div>

        <div className='add-product-desc flex-col'>
          <p>Product Description</p>
          <textarea onChange={(e) => setData({...data, description: e.target.value})} value={data.description} name="description" rows="6" placeholder='Write content here' required></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select onChange={(e) => setData({...data, category: e.target.value})} value={data.category} name='category'>
              <option value="Maincourse">Main course</option>
              <option value="Bakery">Bakery</option>
              <option value="Dessert">Dessert</option>
              <option value="Drinks">Drinks </option>
              <option value="Fastfood">Fast Food</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input onChange={(e) => setData({...data, price: e.target.value})} value={data.price} type="Number" name="price" placeholder='$20' required />
          </div>
        </div>
        <button type="submit" className='add-btn'>
          {id ? "UPDATE" : "ADD"}
        </button>

      </form>
    </div>
  )
}

export default Update