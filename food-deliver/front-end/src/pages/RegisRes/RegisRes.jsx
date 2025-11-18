import React, { useState, useContext } from 'react'
import './RegisRes.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { StoreContext } from '../../context/StoreContext' 
import { useNavigate } from 'react-router-dom'

const RegisRes = () => {
    const { url } = useContext(StoreContext);
    const token = localStorage.getItem("token");

    const [data, setData] = useState({
        name: "",
        address: "",
        phone: "",
        description: "",
        // image: "" 
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                `${url}/api/restaurant/create`,
                data,
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success("Created restaurant successfully!");
                window.location.href = `http://localhost:5175/?token=${token}&role=${role}`;

            } else {
                toast.error("Create restaurant failed. Please try again."); 
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred, please try again.");
        }
    }

    return (
        <div className='regis-res-container'>
            <form className='regis-res-form' onSubmit={onSubmitHandler}>
                <h2>Register for Restaurant Partnership</h2>
                
                <p>Fill in the information to register for a restaurant partnership.</p>

                <div className="form-group">
                    <p>Restaurant Name</p>
                    <input 
                        type="text" 
                        name="name" 
                        onChange={onChangeHandler} 
                        value={data.name} 
                        // placeholder="Ví dụ: Quán Cơm Bụi" 
                        required 
                    />
                </div>

                <div className="form-group">
                    <p>Address</p>
                    <input 
                        type="text" 
                        name="address" 
                        onChange={onChangeHandler} 
                        value={data.address} 
                        // placeholder="Số 123, Đường ABC, Quận 1, TP. HCM" 
                        required 
                    />
                </div>

                <div className="form-group">
                    <p>Phone Number</p>
                    <input 
                        type="text" 
                        name="phone" 
                        onChange={onChangeHandler} 
                        value={data.phone} 
                        // placeholder="090xxxxxxx" 
                        required 
                    />
                </div>

                {/* <div className="form-group">
                    <p>Ảnh đại diện (URL)</p>
                    <input 
                        type="text" 
                        name="image" 
                        onChange={onChangeHandler} 
                        value={data.image}
                        placeholder="https://example.com/image.jpg" 
                    />
                </div> */}

                <div className="form-group">
                    <p>Short Description</p>
                    <textarea 
                        name="description" 
                        onChange={onChangeHandler} 
                        value={data.description} 
                        rows="4"
                        // placeholder="Mô tả về nhà hàng của bạn..."
                    ></textarea>
                </div>

                <button type="submit" className='regis-res-btn'>Submit Registration</button>
            </form>
        </div>
    )
}

export default RegisRes