import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import BrandService from "../../../services/BrandService";

function Brand() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Hàm lấy danh sách thương hiệu từ backend
  const fetchBrands = async () => {
    try {
      const response = await BrandService.getAllBrands();
      console.log("Response data:", response.data);
      // Giả sử dữ liệu trả về nằm trong response.data.data (theo cấu trúc ApiResponse)
      setBrands(response.data.data.content || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching brands:", err); 
      setError("Đã xảy ra lỗi khi tải dữ liệu thương hiệu");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Danh sách Thương hiệu</h1>
      {brands.length === 0 ? (
        <p>Không có dữ liệu thương hiệu.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên thương hiệu</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id}>
                <td>{brand.id}</td>
                <td>{brand.name}</td>
                <td>{brand.active ? "Kích hoạt" : "Không kích hoạt"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

ReactDOM.render(<Brand />, document.getElementById("root"));
