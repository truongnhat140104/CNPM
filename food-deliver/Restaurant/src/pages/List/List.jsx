import React, {useEffect, useState} from 'react'
import './List.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

const List = ({url}) => {

  const [list, setList] = useState([])
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchList = async () => {
    if (!token) {
      toast.error("Cannot fetch food list. No token found.");
      return;
    }
    try {
      const response = await axios.get(`${url}/api/food/list`, { headers: { token } });
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching food list");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while fetching food list");
    }
  };


  useEffect(() => {
    fetchList()
  }, [])

  const removeFood = async (id) => {
    if (!token) {
      toast.error("No token found. Please log in again.");
      return;
    }
    
    console.log(id);
    
    const response = await axios.post(
      `${url}/api/food/remove/`,
      { id: id },
      { headers: { token } }
    );
    
    await fetchList();
    if(response.data.success){
      toast.success("Food removed successfully");
    }
    else{
      toast.error("Error removing food");
    }
  
  }

  return (
    <div className='list add flex-col'>
      <p>All food</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item,index)=>{
          return (
            <div key = {index} className="list-table-format">
              <img src={`${url}/images/`+item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p onClick={()=>removeFood(item._id)} className='cursor'>X</p>
              <p 
                onClick={() => navigate('/update', { state: { id: item._id } })} 
                className='cursor'
              >
                Edit
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List