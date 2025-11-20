import React, { useState, useEffect } from 'react';
import './Drone.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- CẤU HÌNH ICON LEAFLET ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon, shadowUrl: iconShadow,
    iconSize: [25, 41], iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- CONST: VỊ TRÍ MẶC ĐỊNH ---
const DEFAULT_BASE_STATION = { lat: 10.762622, lng: 106.660172 };

function MapUpdater({ center }) {
    const map = useMap();
    map.flyTo(center, map.getZoom());
    return null;
}

function LocationMarker({ position, setLocation }) {
    useMapEvents({
        click(e) {
            setLocation(e.latlng);
        },
    });
    return position === null ? null : <Marker position={position}></Marker>;
}

const Drone = ({ url }) => {
    // STATE QUẢN LÝ TABS VÀ LIST
    const [activeTab, setActiveTab] = useState('create');
    const [droneList, setDroneList] = useState([]); 
    
    // STATE QUẢN LÝ FORM
    const [serialNumber, setSerialNumber] = useState("");
    const [location, setLocation] = useState(DEFAULT_BASE_STATION);
    const [searchQuery, setSearchQuery] = useState("");
    
    // --- HÀM LẤY DANH SÁCH DRONE ---
    const fetchDroneList = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${url}/api/drone/list`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setDroneList(response.data.data);
            } else {
                toast.error(response.data.message || "Failed to fetch drone list.");
            }
        } catch (error) {
            toast.error("Error fetching drone list.");
        }
    };
    
    // --- HÀM XỬ LÝ TÌM KIẾM ĐỊA CHỈ (Dùng OpenStreetMap) ---
    const handleSearch = async () => {
        if (!searchQuery) return;
        try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
            
            if (res.data && res.data.length > 0) {
                const { lat, lon } = res.data[0];
                const newLoc = { lat: parseFloat(lat), lng: parseFloat(lon) };
                setLocation(newLoc);
                toast.success("Found location!");
            } else {
                toast.error("Location not found!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error searching location");
        }
    };

    // --- HÀM RESET VỀ DEFAULT ---
    const handleSetDefault = (e) => {
        e.preventDefault();
        setLocation(DEFAULT_BASE_STATION);
        toast.info("Reset to Default Base Station");
    };

    // --- HÀM XỬ LÝ SUBMIT FORM ---
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const droneData = {
            serialNumber: serialNumber,
            location: location,
            baseStation: location
        };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${url}/api/drone/add`, droneData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setSerialNumber("");
                toast.success("Drone added successfully!");
                fetchDroneList(); 
                setActiveTab('list');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error adding drone");
        }
    }
    
    // --- HÀM XÓA DRONE ---
    const removeDrone = async (droneId) => {
         // Giả định endpoint xóa là /api/drone/remove
         try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${url}/api/drone/remove`, { id: droneId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                toast.success("Drone deleted.");
                fetchDroneList(); // Tải lại danh sách
            } else {
                toast.error(response.data.message || "Failed to delete drone.");
            }
        } catch (error) {
            toast.error("Error deleting drone.");
        }
    }

    // --- EFFECT: Tải danh sách khi chuyển sang tab 'list' ---
    useEffect(() => {
        if (activeTab === 'list') {
            fetchDroneList();
        }
    }, [activeTab]);


    return (
        <div className='drone-manager'>
            
            {/* --- THANH TAB --- */}
            <div className="tabs-container">
                <button 
                    className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('list')}
                >
                    List Drone ({droneList.length})
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('create')}
                >
                    Register New Drone
                </button>
            </div>
            
            <div className="tab-content">
                
                {/* A. VIEW TẠO MỚI */}
                {activeTab === 'create' && (
                    <div className='add-drone-form'>
                        <form className='flex-col' onSubmit={onSubmitHandler}>
                            <h2>Register New Drone</h2>
                            
                            {/* Serial Number Input */}
                            <div className="add-input-group">
                                <p>Drone Serial Number</p>
                                <input onChange={(e) => setSerialNumber(e.target.value)} value={serialNumber} type="text" placeholder='E.g., D-001' required />
                            </div>

                            <div className="add-input-group">
                                <p>Base Station Location</p>

                                {/* THANH CÔNG CỤ TÌM KIẾM & NÚT DEFAULT */}
                                <div className="map-controls">
                                    <div className="search-box">
                                        <input 
                                            type="text" 
                                            placeholder="Type address (e.g. Ben Thanh Market)" 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                                        />
                                        <button type="button" onClick={handleSearch} className="btn-search">🔍</button>
                                    </div>
                                    
                                    <button type="button" onClick={handleSetDefault} className="btn-default">
                                        Reset to Default
                                    </button>
                                </div>

                                {/* BẢN ĐỒ */}
                                <div className="map-container">
                                    <MapContainer center={DEFAULT_BASE_STATION} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <MapUpdater center={location} />
                                        <LocationMarker position={location} setLocation={setLocation} />
                                    </MapContainer>
                                </div>
                                
                                <div className="coords-display">
                                    <span>Lat: {location.lat.toFixed(6)}</span>
                                    <span>Lng: {location.lng.toFixed(6)}</span>
                                </div>
                            </div>

                            <button type='submit' className='add-btn'>ADD DRONE</button>
                        </form>
                    </div>
                )}
                
                {/* B. VIEW DANH SÁCH */}
                {activeTab === 'list' && (
                    <div className='drone-list-view'>
                        <h2>Registered Drones ({droneList.length})</h2>
                        <div className='drone-table'>
                            {/* Header */}
                            <div className='drone-table-header'>
                                <b>Serial Number</b>
                                <b>Location (Lat/Lng)</b>
                                <b>Status</b>
                                <b>Actions</b>
                            </div>
                            {/* Rows */}
                            {droneList.map((drone) => (
                                <div key={drone._id} className='drone-table-row'>
                                    <span>{drone.serialNumber}</span>
                                    <span>{drone.location.lat.toFixed(6)}, {drone.location.lng.toFixed(6)}</span>
                                    <span>{drone.status || 'Active'}</span>
                                    <button className='btn-delete' onClick={() => removeDrone(drone._id)}>Delete</button>
                                </div>
                            ))}
                            {droneList.length === 0 && <p style={{textAlign:'center', padding: '20px'}}>No drones registered yet.</p>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Drone