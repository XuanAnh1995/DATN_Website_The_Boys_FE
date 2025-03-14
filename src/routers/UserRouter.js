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
  { path: "home", component: Home, role: "user" },
  { path: "products", component: Products, role: "user" },
  { path: "view-product/:id", component: ViewProductDetail, role: "user" },
  { path: "personal", component: PersonalPage, role: "user" },
  { path: "search", component: SearchPage, role: "user" },
  { path: "cart", component: Cart, role: "user" },
];

export default userRouter;
