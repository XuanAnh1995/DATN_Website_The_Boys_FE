import { lazy } from "react";

// 📌 Dashboard
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));

// 📌 Bán hàng tại quầy: POS
const POS = lazy(() => import("../pages/admin/POS"));

// 📌 Quản lý khách hàng, nhân viên
const Customer = lazy(() => import("../pages/admin/Customer"));
const Employee = lazy(() => import("../pages/admin/Employee"));

// 📌 Quản lý sản phẩm và chi tiết
const Product = lazy(() => import("../pages/admin/Product"));
const CreateProduct = lazy(() => import("../pages/admin/CreateProduct/index"));
const ProductDetail = lazy(() => import("../pages/admin/ProductDetail/index"));

// 📌 Quản lý thuộc tính sản phẩm
const Brand = lazy(() => import("../pages/admin/Brand"));
const Material = lazy(() => import("../pages/admin/Material"));
const Collar = lazy(() => import("../pages/admin/Attribute/Collar"));
const Color = lazy(() => import("../pages/admin/Attribute/Color"));
const Size = lazy(() => import("../pages/admin/Attribute/Size"));
const Sleeve = lazy(() => import("../pages/admin/Attribute/Sleeve"));
const Promotion = lazy(() => import("../pages/admin/Attribute/Promotion"));

// 📌 Quản lý hóa đơn, voucher
const Order = lazy(() => import("../pages/admin/Order"));
const OrderDetail = lazy(() => import("../pages/admin/Order/OrderDetail"));
const Voucher = lazy(() => import("../pages/admin/Voucher"));

// 📌 Quản lý danh mục, thống kê
const Category = lazy(() => import("../pages/admin/Category"));
const Statistic = lazy(() => import("../pages/admin/Statistics"));


const adminRoutes = [
  { path: "dashboard", component: Dashboard, role: "ADMIN" },
  {path: "salePOS", component: POS, role: "ADMIN"},
  { path: "customer", component: Customer, role: "ADMIN" },
  { path: "employee", component: Employee, role: "ADMIN" },
  { path: "product", component: Product, role: "ADMIN" },
  { path: "product/:productCode", component: ProductDetail, role: "ADMIN" },
  { path: "product/create", component: CreateProduct, role: "ADMIN" },
  { path: "brand", component: Brand, role: "ADMIN" },
  { path: "material", component: Material, role: "ADMIN" },
  { path: "category", component: Category, role: "ADMIN" },
  { path: "attribute/collar", component: Collar, role: "ADMIN" },
  { path: "attribute/color", component: Color, role: "ADMIN" },
  { path: "attribute/size", component: Size, role: "ADMIN" },
  { path: "attribute/sleeve", component: Sleeve, role: "ADMIN" },
  { path: "attribute/promotion", component: Promotion, role: "ADMIN" },
  { path: "order", component: Order, role: "ADMIN" },
  { path: "order/:id/details", component: OrderDetail, role: "ADMIN" },
  { path: "voucher", component: Voucher, role: "ADMIN" },
  { path: "statistics", component: Statistic, role: "ADMIN" }
];

export default adminRoutes;