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
  { path: "dashboard", component: Dashboard, role: "admin" },
  {path: "salePOS", component: POS, role: "admin"},
  { path: "customer", component: Customer, role: "admin" },
  { path: "employee", component: Employee, role: "admin" },
  { path: "product", component: Product, role: "admin" },
  { path: "product/:productCode", component: ProductDetail, role: "admin" },
  { path: "product/create", component: CreateProduct, role: "admin" },
  { path: "brand", component: Brand, role: "admin" },
  { path: "material", component: Material, role: "admin" },
  { path: "category", component: Category, role: "admin" },
  { path: "attribute/collar", component: Collar, role: "admin" },
  { path: "attribute/color", component: Color, role: "admin" },
  { path: "attribute/size", component: Size, role: "admin" },
  { path: "attribute/sleeve", component: Sleeve, role: "admin" },
  { path: "attribute/promotion", component: Promotion, role: "admin" },
  { path: "order", component: Order, role: "admin" },
  { path: "order/:id/details", component: OrderDetail, role: "admin" },
  { path: "voucher", component: Voucher, role: "admin" },
  { path: "statistics", component: Statistic, role: "admin" }
];

export default adminRoutes;