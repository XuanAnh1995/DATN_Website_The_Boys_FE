import axios from "axios";

const ProductDetailService = {

    async createProductDetail(productDetailData) {
        try {
            const response = await axios.post(`http://localhost:8080/api/san-pham-chi-tiet`, productDetailData,
                {
                    headers: { 'Content-Type': 'application/json' }
                });
            return response.data.data;
        } catch (error) {
            console.error("Error creating product detail:", error);
            throw error;
        }
    },

    async generateProductDetails(generateModel) {
        try {
            const response = await axios.post(`http://localhost:8080/api/san-pham-chi-tiet/generate`, generateModel,
                {
                    headers: { 'Content-Type': 'application/json' }
                });
                
            console.log(response)
            return response.data.data;
        } catch (error) {
            console.error("Error generating product details:", error);
            throw error;
        }
    },


    async createSanPham(newSanPham) {
        try {
            const response = await axios.post(`http://localhost:8080/api/san-pham`, newSanPham,
                {
                    headers: { 'Content-Type': 'application/json' }
                });
            return response.data.data;
        } catch (error) {
            console.error("Error fetching product details:", error);
            throw error;
        }
    },

    async getSanPham(page = 0, size = 1000, search = '') {
        try {
            const response = await axios.get(`http://localhost:8080/api/san-pham`, {
                params: {
                    page,
                    size,
                    search,
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching product details:", error);
            throw error;
        }
    },

    async getThuongHieu(page = 0, size = 1000, search = '', sortKey = 'id', sortDirection = 'desc') {
        try {
            const response = await axios.get(`http://localhost:8080/api/thuong-hieu`, {
                params: {
                    page,
                    size,
                    search,
                    sort: `${sortKey},${sortDirection}`
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching product details:", error);
            throw error;
        }
    },

    async getChatLieu(page = 0, size = 1000, search = '', sortKey = 'id', sortDirection = 'desc') {
        try {
            const response = await axios.get(`http://localhost:8080/api/chat-lieu`, {
                params: {
                    page,
                    size,
                    search,
                    sort: sortKey,
                    direction: sortDirection
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching material:", error);
            throw error;
        }
    },

    async getCoAo(page = 0, size = 1000, search = '', sortKey = 'id', sortDirection = 'desc') {
        try {
            const response = await axios.get(`http://localhost:8080/api/co-ao`, {
                params: {
                    page,
                    size,
                    search,
                    sort: sortKey,
                    direction: sortDirection
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching collar types:", error);
            throw error;
        }
    },

    async getKichThuoc(page = 0, size = 1000, search = '', sortKey = 'id', sortDirection = 'desc') {
        try {
            const response = await axios.get(`http://localhost:8080/api/kich-thuoc`, {
                params: {
                    page,
                    size,
                    search,
                    sort: sortKey,
                    direction: sortDirection
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching sizes:", error);
            throw error;
        }
    },

    async getMauSac(page = 0, size = 1000, search = '', sortKey = 'id', sortDirection = 'desc') {
        try {
            const response = await axios.get(`http://localhost:8080/api/mau-sac`, {
                params: {
                    page,
                    size,
                    search,
                    sort: sortKey,
                    direction: sortDirection
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching colors:", error);
            throw error;
        }
    },

    async getTayAo(page = 0, size = 1000, search = '', sortKey = 'id', sortDirection = 'desc') {
        try {
            const response = await axios.get(`http://localhost:8080/api/tay-ao`, {
                params: {
                    page,
                    size,
                    search,
                    sort: `${sortKey},${sortDirection}`
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching sleeve types:", error);
            throw error;
        }
    },

    async getXuatXu(page = 0, size = 1000, search = '', sortKey = 'id', sortDirection = 'desc') {
        try {
            const response = await axios.get(`http://localhost:8080/api/xuat-xu`, {
                params: {
                    page,
                    size,
                    search,
                    sort: `${sortKey},${sortDirection}`
                },
            });
            return response.data.data.content;
        } catch (error) {
            console.error("Error fetching origins:", error);
            throw error;
        }
    },

    async addBrand(data) {
        try {
            const response = await axios.post(`http://localhost:8080/api/thuong-hieu`, data);
            return response.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    },

    async addCollar(data) {
        try {
            const response = await axios.post(`http://localhost:8080/api/co-ao`, data);
            return response.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    },

    async addColor(data) {
        try {
            const response = await axios.post(`http://localhost:8080/api/mau-sac`, data);
            return response.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    },

    async addMaterial(data) {
        try {
            const response = await axios.post(`http://localhost:8080/api/chat-lieu`, data);
            return response.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    },

    async addOrigin(data) {
        try {
            const response = await axios.post(`http://localhost:8080/api/xuat-xu`, data);
            return response.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    },

    async addSize(data) {
        try {
            const response = await axios.post(`http://localhost:8080/api/kich-thuoc`, data);
            return response.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    },

    async addSleeve(data) {
        try {
            const response = await axios.post(`http://localhost:8080/api/tay-ao`, data);
            return response.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    },
};

export default ProductDetailService;