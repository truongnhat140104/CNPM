import React, { useEffect, useState, useMemo } from 'react';
import './User.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const User = ({ url }) => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  // const role = localStorage.getItem("role");

  /**
   * Lấy danh sách người dùng từ backend
   */
  const fetchUsers = async () => {
       try {
      const response = await axios.get(`${url}/api/user/list`,{headers: { token }});
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        toast.error("Cannot fetch users");
      }
    } catch (err) {
      toast.error("Server error while fetching users");
    }
  };

  /** Update user status */
  const statusHandeler = async (event, userId) => {
    console.log(event, userId);
    const response = await axios.post(`${url}/api/user/update-status`,
      { userId, status: event.target.value,},
      { headers: { token }}
    );
    if (response.data.success) {
      toast.success("Updated!");
      await fetchUsers();
    } else {
      toast.error("Cannot update status");
    }
  }

  /**
   * Handle user removal
   */
  const removeUser = async (userId) => {
    // Add confirmation before deletion
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    
    try {
      const response = await axios.post(`${url}/api/user/remove`, { id: userId }, { headers: { token } });
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

  // Load data when component is mounted
  useEffect(() => {
    fetchUsers();
  }, [url]);

  const customers = useMemo(() => users.filter(user => user.role === 'customer'), [users]);
  const owners = useMemo(() => users.filter(user => user.role === 'owner'), [users]);

  return (
    <div className='list add flex-col'>
      <div className="list-table">
        <div className="list-usertable-format title">
          <b>Name</b>
          <b>Email</b>
          <b>Role</b>
          <b>Status</b>
          <b>Action</b>
        </div>
      </div>

      <br />
      <p>Customer List</p>
      <div className="list-table">
        {users.length > 0 ? (
          users.filter(user => user.role === 'customer').map((user, index) => (
            <div key={index} className="list-usertable-format">
              <p>{user.name}</p>
              <p>{user.email}</p>
              <p>{user.role === 'owner'}</p>
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
          <p>No customer found.</p>
        )}
      </div>
      
      <br/>
      <p>Owner List</p>
      <div className="list-table">
        {users.length > 0 ? (
          users.filter(user => user.role === 'owner').map((user, index) => (
            <div key={index} className="list-usertable-format">
              <p>{user.name}</p>
              <p>{user.email}</p>
              <p>{user.role === 'owner'}</p>
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
          <p>No customer found.</p>
        )}
      </div>
    </div>
  );
};

export default User;
