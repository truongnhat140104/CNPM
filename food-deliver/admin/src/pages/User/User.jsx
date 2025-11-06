import React, { useEffect, useState } from 'react';
import './User.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const User = ({ url }) => {
  const [users, setUsers] = useState([]);

  /**
   * Lấy danh sách người dùng từ backend
   */
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${url}/api/user/list`);
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        toast.error("Không thể tải danh sách người dùng");
      }
    } catch (err) {
      toast.error("Lỗi server khi tải danh sách");
    }
  };

  const statusHandeler = async (event, userId) => {
    console.log(event, userId);
    const response = await axios.post(`${url}/api/user/update-status`, {
      userId,
      status: event.target.value
    });
    if (response.data.success) {
      toast.success("Cập nhật trạng thái thành công!");
      await fetchUsers();
    } else {
      toast.error("Không thể cập nhật trạng thái");
    }
  }

  /**
   * Xử lý xóa người dùng
   */
  const removeUser = async (userId) => {
    // Thêm xác nhận trước khi xóa
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      return;
    }
    
    try {
      const response = await axios.post(`${url}/api/user/remove`, { id: userId });
      if (response.data.success) {
        toast.success("Người dùng đã được xóa");
        await fetchUsers();
      } else {
        toast.error("Không thể xóa người dùng");
      }
    } catch (err) {
      toast.error("Lỗi server khi xóa người dùng");
    }
  };

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    fetchUsers();
  }, [url]); // Thêm 'url' vào dependency array

  return (
    <div className='list add flex-col'>
      <p>All Users List</p>
      <div className="list-table">
        <div className="list-usertable-format title">
          <b>Name</b>
          <b>Email</b>
          <b>Status</b>
          <b>Action</b>
        </div>
        {users.length > 0 ? (
          users.map((user, index) => (
            <div key={index} className="list-usertable-format">
              <p>{user.name}</p>
              <p>{user.email}</p>
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
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default User;
