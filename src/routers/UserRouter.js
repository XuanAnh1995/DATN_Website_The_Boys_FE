import { lazy } from "react";

const ViewProductDetail = lazy(
  () => import("../pages/Users/ViewProductDetail.jsx")
);
const Home = lazy(() => import("../pages/Users/Home.jsx"));
const PersonalPage = lazy(() => import("../pages/Users/PersonalPage.jsx"));
const SearchPage = lazy(() => import("../pages/Users/SearchPage.jsx"));
const Cart = lazy(() => import("../pages/Users/Cart.jsx"));
const Products = lazy(() => import("../pages/Users/Products.jsx"));
const userRouter = [
  { path: "home", component: Home, role: "CUSTOMER" },
  { path: "products", component: Products, role: "CUSTOMER" },
  { path: "view-product/:id", component: ViewProductDetail, role: "CUSTOMER" },
  { path: "personal", component: PersonalPage, role: "CUSTOMER" },
  { path: "search", component: SearchPage, role: "CUSTOMER" },
  { path: "cart", component: Cart, role: "CUSTOMER" },
];

export default userRouter;
