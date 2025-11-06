import React from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'react-toastify'; // Phải import toast

const Verify = () => {

    const [searchParams,setSearchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const {url} = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        try {
            // Dòng này của bạn đã đúng
            const response = await axios.post(url + "/api/order/verify", { success, orderId });

            // Nếu backend trả về {success: true}
            if (response.data.success) {
                toast.success("Thanh toán đã được xác minh!");
                navigate("/myorders"); // <-- NÓ SẼ TỰ ĐỘNG CHUYỂN BẠN TỚI ĐÂY
            } 
            // Nếu backend trả về {success: false}
            else {
                toast.error("Xác minh thanh toán thất bại.");
                navigate("/"); // Chuyển về trang chủ
            }
        } catch (error) {
            // Nếu API bị lỗi (500, 404, v.v.)
            console.error("Lỗi khi xác minh thanh toán:", error);
            toast.error("Xác minh thanh toán thất bại.");
            navigate("/"); // Chuyển về trang chủ
        }
    };

    useEffect(()=>{
        verifyPayment();
    },[]) // useEffect chỉ chạy 1 lần
    
  return (
    // Bạn sẽ thấy cái spinner này trong vài giây
    <div className='verify'>
        <div className="spinner"></div>
    </div>
  )
}

export default Verify