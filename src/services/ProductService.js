import axios from "axios";

const ProductService = {
    async getAllProducts(page = 0, size = 10, keyword = '', status = null, sortBy = 'id', sortDirection = 'asc') {
        try {
            const response = await axios.get(`http://localhost:8080/api/products`, {
                params: {
                    page,
                    size,
                    keyword,
                    status,
                    sortBy,
                    sortDirection
                },
            });
            return response.data.data;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    },

    async getProductById(id) {
        try {
            const response = await axios.get(`http://localhost:8080/api/products/${id}`);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching product data:", error);
            throw error;
        }
    },

    async createProduct(productData) {
        try {
            const response = await axios.post(`http://localhost:8080/api/products`, productData);
            return response.data.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    },

    async updateProduct(id, productData) {
        try {
            const response = await axios.put(`http://localhost:8080/api/products/${id}`, productData);
            return response.data.data;
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    },

    async deleteProduct(id) {
        try {
            const response = await axios.delete(`http://localhost:8080/api/products/${id}`);
            return response.data.data;
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    },

    async toggleProductStatus(id) {
        try {
            const response = await axios.patch(`http://localhost:8080/api/products/${id}/toggle-status`);
            return response.data.data;
        } catch (error) {
            console.error("Error toggling product status:", error);
            throw error;
        }
    },
};

export default ProductService;