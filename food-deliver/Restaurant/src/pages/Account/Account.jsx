import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Account.css';
import { assets } from '../../assets/assets';

const Account = ({ url }) => {
    const token = localStorage.getItem("token");

    const [isCreateMode, setIsCreateMode] = useState(false);
    
    const [data, setData] = useState({
        name: "",
        address: "",
        phone: "",
        description: ""
    });
    
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${url}/api/restaurant/my-profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    const profile = response.data.data;
                    
                    if (!profile) {
                        toast.info("Profile not found. Please create one.");
                        setIsCreateMode(true);
                    } else {
                        setData({
                            name: profile.name || "",
                            address: profile.address || "",
                            phone: profile.phone || "",
                            description: profile.description || ""
                        });
                        if (profile.image) {
                            setImagePreview(`${url}/images/${profile.image}`);
                        }
                        setIsCreateMode(false);
                    }
                } else {
                    toast.error(response.data.message);
                    if (response.data.message.includes("Please create one")) {
                         setIsCreateMode(true);
                    }
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Error fetching profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token, url]);

    const onChangeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const onImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("address", data.address);
        formData.append("phone", data.phone);
        formData.append("description", data.description);
        if (image) {
            formData.append("image", image);
        }

        try {
            let response;
            
            if (isCreateMode) {
                response = await axios.post(`${url}/api/restaurant/create-profile`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Profile created successfully!");
            } else {
                response = await axios.put(`${url}/api/restaurant/update`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Profile updated successfully!");
            }

            if (response.data.success) {
                if (response.data.data.image) {
                    setImagePreview(`${url}/images/${response.data.data.image}`);
                }
                setIsCreateMode(false); 
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred.");
        }
    };

    if (loading) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="account-profile">
            <h2>{"Profile"}</h2>
            
            <form className="profile-form" onSubmit={onSubmitHandler}>
                
                <div className="form-group image-upload">
                    <label htmlFor="image">
                        <p>Avatar</p>
                        <img 
                            src={imagePreview || assets.upload_area}
                            alt="Profile Preview" 
                        />
                    </label>
                    <input 
                        onChange={onImageChange} 
                        type="file" 
                        id="image" 
                        hidden 
                    />
                </div>

                <div className="two-column-row">
                    <div className="form-group">
                        <label htmlFor="name">Restaurant Name</label>
                        <input 
                            onChange={onChangeHandler} 
                            value={data.name} 
                            type="text" 
                            name="name" 
                            placeholder="Your restaurant's name" 
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input 
                            onChange={onChangeHandler} 
                            value={data.phone} 
                            type="text" 
                            name="phone" 
                            placeholder="Contact phone" 
                        />
                    </div>
                </div>
                
                <div className="two-column-row">
                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <textarea 
                            onChange={onChangeHandler} 
                            value={data.address} 
                            name="address" 
                            rows="5"
                            placeholder="Street, City, Country"
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea 
                            onChange={onChangeHandler} 
                            value={data.description} 
                            name="description" 
                            rows="5"
                            placeholder="Tell customers about your restaurant"
                        ></textarea>
                    </div>
                </div>

                <button type="submit" className="btn-save">
                    {isCreateMode ? "Create Profile" : "Save Changes"}
                </button>
            </form>
        </div>
    );
};

export default Account;