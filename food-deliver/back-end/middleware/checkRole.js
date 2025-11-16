/**
 * Middleware phân quyền (Role-Based Access Control).
 * Nó nhận vào một mảng các vai trò (roles) được phép.
 * Và trả về một middleware function để kiểm tra.
 *
 * @param {Array<String>} allowedRoles
 */
const checkRole = (allowedRoles) => {
  
  // Trả về middleware function
  return (req, res, next) => {
    
    // Kiểm tra xem req.user (đã được checkAuth đính vào) có tồn tại
    // và role của user có nằm trong mảng allowedRoles không.
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      
      // 403 Forbidden: Bạn đã đăng nhập, nhưng bạn không có quyền
      return res.status(403).json({ 
        message: 'Access denied: You do not have permission for this action.' 
      });
    }

    // Nếu role hợp lệ, cho đi tiếp
    next();
  };
};

export default checkRole;