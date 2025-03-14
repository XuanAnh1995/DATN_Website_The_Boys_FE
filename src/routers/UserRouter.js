import { lazy } from "react";

const ViewProductDetail = lazy(
  () => import("../pages/Users/ViewProductDetail.jsx")
);

const PersonalPage = lazy(() => import("../pages/Users/PersonalPage.jsx"));
const SearchPage = lazy(() => import("../pages/Users/SearchPage.jsx"));
const Cart = lazy(() => import("../pages/Users/Cart.jsx"));
const Products = lazy(() => import("../pages/Users/Products.jsx"));
const userRouter = [
  { path: "products", components: Products, role: "user" },
  { path: "view-product/:id", components: ViewProductDetail, role: "user" },
  { path: "personal", components: PersonalPage, role: "user" },
  { path: "search", components: SearchPage, role: "user" },
  { path: "cart", components: Cart, role: "user" },
];
export default userRouter;
