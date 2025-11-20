import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Drone.css';

const Drone = ({ url }) => {
    const [droneList, setDroneList] = useState([]); 

    const [showModal, setShowModal] = useState(false);
    const [editingDrone, setEditingDrone] = useState(null);
    
    const [formData, setFormData] = useState({
        serialNumber: '',
        lat: '',
        lng: ''
    });

    // 1. Lấy danh sách
    const fetchDroneList = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${url}/api/drone/list`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setDroneList(response.data.data);
            }
        } catch (error) {
            toast.error("Error fetching drone list.");
        }
    };
    
    // 2. Xóa Drone
    const removeDrone = async (droneId) => {
        if (!window.confirm("Are you sure you want to delete this drone?")) return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${url}/api/drone/remove`, { id: droneId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                toast.success("Drone deleted.");
                fetchDroneList();
            } else {
                toast.error("Failed to delete.");
            }
        } catch (error) {
            toast.error("Error deleting drone.");
        }
    }

    const handleEditClick = (drone) => {
        setEditingDrone(drone);
        setFormData({
            serialNumber: drone.serialNumber,
            lat: drone.location.lat,
            lng: drone.location.lng
        });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleChargeDrone = async (droneId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${url}/api/drone/charge`, { droneId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                toast.success("Drone charged successfully!");
                fetchDroneList();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error charging drone.");
        }
    };

    // SỬA HÀM SUBMIT: Gửi đúng dữ liệu mới lên Backend
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${url}/api/drone/update`, {
                droneId: editingDrone._id,
                serialNumber: formData.serialNumber, // Gửi tên mới
                lat: formData.lat,                   // Gửi vĩ độ mới
                lng: formData.lng                    // Gửi kinh độ mới
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success("Drone updated successfully!");
                setShowModal(false);
                fetchDroneList();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error updating drone.");
        }
    };

    useEffect(() => {
        fetchDroneList();
    }, []);

    return (
        <div className='drone-list-view'>
            <h2>Registered Drones ({droneList.length})</h2>
            
            <div className='drone-table'>
                <div className='drone-table-header'>
                    <b>Serial Number</b>
                    <b>Location</b>
                    <b>Battery</b>
                    <b>Status</b>
                    <b>Actions</b>
                </div>
                {droneList.map((drone) => (
                    <div key={drone._id} className='drone-table-row'>
                        <span>{drone.serialNumber}</span>
                        <span>{drone.location.lat.toFixed(4)}, {drone.location.lng.toFixed(4)}</span>
                        
                        {/* Hiển thị Pin có màu sắc */}
                        <span style={{color: drone.battery < 20 ? 'red' : 'green', fontWeight: 'bold'}}>
                            {drone.battery}%
                        </span>

                        {/* Hiển thị Trạng thái có màu sắc */}
                        <span className={`status-tag ${drone.status}`}>
                            {drone.status}
                        </span>
                        
                        <div className="action-buttons">
                            {/* Nút Edit mở Modal */}
                            <button className='btn-edit' onClick={() => handleEditClick(drone)}>Edit</button>
                            <button className='btn-delete' onClick={() => removeDrone(drone._id)}>Delete</button>
                            <button 
                                className='btn-charge' 
                                onClick={() => handleChargeDrone(drone._id)}
                                disabled={drone.battery >= 100} // Vô hiệu hóa nếu pin đã đầy
                            >
                                Charge
                            </button>
                        </div>
                    </div>
                ))}
                {droneList.length === 0 && <p className="no-data">No drones registered yet.</p>}
            </div>

            {/* --- MODAL UPDATE --- */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Edit Drone Info</h3>
                        <form onSubmit={handleUpdateSubmit}>
                            
                            {/* 1. Sửa Tên Drone */}
                            <div className="form-group">
                                <label>Serial Number (Name):</label>
                                <input 
                                    type="text" 
                                    name="serialNumber" 
                                    value={formData.serialNumber} 
                                    onChange={handleInputChange} 
                                    required
                                />
                            </div>

                            {/* 2. Sửa Tọa độ (Thủ công) */}
                            <div className="form-group">
                                <label>Latitude (Vĩ độ):</label>
                                <input 
                                    type="number" 
                                    step="any" // Cho phép số thập phân
                                    name="lat" 
                                    value={formData.lat} 
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>Longitude (Kinh độ):</label>
                                <input 
                                    type="number" 
                                    step="any"
                                    name="lng" 
                                    value={formData.lng} 
                                    onChange={handleInputChange}
                                    required 
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-save">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Drone;