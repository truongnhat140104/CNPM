import React, { useEffect, useState, useMemo } from 'react';
import './User.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const User = ({ url }) => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${url}/api/user/list`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        toast.error("Cannot fetch users");
      }
    } catch (err) {
      toast.error("Server error while fetching users");
    }
  };

  const statusHandeler = async (event, userId) => {
    const response = await axios.post(`${url}/api/user/update-status`,
      { userId, status: event.target.value, },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.success) {
      toast.success("Updated!");
      await fetchUsers();
    } else {
      toast.error("Cannot update status");
    }
  }

  const removeUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    
    try {
      const response = await axios.post(`${url}/api/user/remove`, { id: userId }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        toast.success("User has been deleted");
        await fetchUsers();
      } else {
        toast.error("Cannot delete user");
      }
    } catch (err) {
      toast.error("Server error while deleting user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [url]);

  const userList = useMemo(() => users.filter(user => user.role === 'user'), [users]);
  const restaurantList = useMemo(() => users.filter(user => user.role === 'restaurant'), [users]);

  const TableHeader = () => (
    <div className="list-usertable-format title">
      <b>Name</b>
      <b>Email</b>
      <b>Role</b>
      <b>Status</b>
      <b>Action</b>
    </div>
  );

  return (
    <div className='list add flex-col'>
      
      <div className="list-table">
        <p>Customer List</p>
        <TableHeader />
        {userList.length > 0 ? (
          userList.map((user, index) => (
            <div key={index} className="list-usertable-format">
              <p>{user.name}</p>
              <p>{user.email}</p>
              <p>{user.role}</p>
              
              <p>
                <select
                  className='select'
                  value={user.status}
                  onChange={(event) => statusHandeler(event, user._id)}
                >
                  <option value="active">Active</option>
                  <option value="deactive">Deactive</option>
                </select>
              </p>  
              <p onClick={() => removeUser(user._id)} className='cursor'>X</p>
            </div>
          ))
        ) : (
          <p>No customers found.</p>
        )}
      </div>

      <hr className='user-list-divider' />

      <div className="list-table">
        <p>Restaurant List</p>
        <TableHeader />
        {restaurantList.length > 0 ? (
          restaurantList.map((user, index) => (
            <div key={index} className="list-usertable-format">
              <p>{user.name}</p>
              <p>{user.email}</p>
              
              <p>{user.role}</p> 

              <p>
                <select
                  className='select'
                  value={user.status}
                  onChange={(event) => statusHandeler(event, user._id)}
                >
                  <option value="active">Active</option>
                  <option value="deactive">Deactive</option>
                </select>
              </p>  
              <p onClick={() => removeUser(user._id)} className='cursor'>X</p>
            </div>
          ))
        ) : (
          <p>No restaurants found.</p>
        )}
      </div>
    </div>
  );
};

export default User;