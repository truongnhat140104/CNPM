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

    // Lấy ID từ state được truyền qua navigate
    const [id] = useState(location.state?.id); 

    const [image,setImage] = useState(false); 
    const [previewUrl, setPreviewUrl] = useState(assets.upload_area);

    const [data,setData] = useState({
      name:"",
      description:"",
      category:"Gato",
      price:""
    })

    // 1. Dùng useEffect để lấy dữ liệu khi ở chế độ EDIT
    useEffect(() => {
      if (id) {
        // --- Chế độ EDIT ---
        const fetchFoodData = async () => {
          try {
            const response = await axios.get(`${url}/api/food/get/${id}`);
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
              toast.error("Không thể tải dữ liệu sản phẩm.");
            }
          } 
          catch (err) {
            toast.error("Lỗi server khi tải dữ liệu.");
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
        formData.append("id", id); // Thêm ID để backend biết update item nào
        // Chỉ thêm ảnh nếu người dùng chọn ảnh mới
        if (image) {
          formData.append("image", image);
        }
        response = await axios.post(`${url}/api/food/update`, formData);

      } else {
        formData.append("image", image);
        response = await axios.post(`${url}/api/food/add`, formData);
      }

      // Xử lý kết quả
      if(response.data.success){
        toast.success(response.data.message);
        if (!id) {
          // Nếu là ADD, reset form
          setData({
            name:"",
            description:"",
            category:"Gato",
            price:""
          });
          setImage(false);
          setPreviewUrl(assets.upload_area);
        }
        // Tùy chọn: Tự động quay về trang list
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
            {/* 4. Cập nhật src cho preview */}
            <img src={previewUrl} alt="" />
          </label>
          <input 
            onChange={onImageChange} 
            type="file" 
            id="image" 
            hidden 
            // 5. Chỉ 'required' khi thêm mới (không 'required' khi edit)
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
              <option value="Gato">Gato</option>
              <option value="Cupcake">Cupcake</option>
              <option value="Tart">Tart</option>
              <option value="Donut">Donut</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p> {/* Đã sửa "Product Type" thành "Product Price" */}
            <input onChange={(e) => setData({...data, price: e.target.value})} value={data.price} type="Number" name="price" placeholder='$20' required />
          </div>
        </div>
        {/* 6. Thay đổi text của Button */}
        <button type="submit" className='add-btn'>
          {id ? "UPDATE" : "ADD"}
        </button>

      </form>
    </div>
  )
}

export default Update