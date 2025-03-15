import axios from "axios";

const ProductDetailService = {
  async createProductDetail(productDetailData) {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/product-details`,
        productDetailData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error creating product detail:", error);
      throw error;
    }
  },

  async generateProductDetails(generateModel) {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/product-details/generate`,
        generateModel,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error generating product details:", error);
      throw error;
    }
  },

  async getAllProductDetails(params) {
    try {
      // Chuyển đổi các danh sách (array) thành dạng query params đúng
      const formattedParams = {
        ...params,
        collarIds: params.collarIds ? params.collarIds.join(",") : undefined,
        colorIds: params.colorIds ? params.colorIds.join(",") : undefined,
        sizeIds: params.sizeIds ? params.sizeIds.join(",") : undefined,
        sleeveIds: params.sleeveIds ? params.sleeveIds.join(",") : undefined,
      };

      const response = await axios.get(
        `http://localhost:8080/api/product-details`,
        { params: formattedParams }
      );
      console.log("response", response);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  },

  async getProductDetailById(id) {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/product-details/${id}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching product detail by ID:", error);
      throw error;
    }
  },

  async updateProductDetail(id, updateData) {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/product-details/${id}`,
        updateData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error updating product detail:", error);
      throw error;
    }
  },

  async toggleProductDetailStatus(id) {
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/product-details/${id}/toggle-status`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error toggling product detail status:", error);
      throw error;
    }
  },
};

export default ProductDetailService;
