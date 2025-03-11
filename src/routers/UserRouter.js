// import { Routes, Route } from "react-router-dom";
// import UserMain from "../UserLayout/UserMain";
// import HomePage from "../pages/Home";
// import AboutPage from "../pages/About";

// const UserRouter = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<UserMain />}>
//         <Route index element={<HomePage />} />
//         <Route path="about" element={<AboutPage />} />
//       </Route>
//     </Routes>
//   );
// };

// export default UserRouter;
import { Routes, Route } from "react-router-dom";
import UserMain from "../UserLayout/UserMain";
import HomePage from "../pages/Home";
import AboutPage from "../pages/About";
import ViewProductDetail from "../components/ViewProductDetail";
import SearchPage from "../pages/SearchPage"; // Import trang tìm kiếm

const UserRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<UserMain />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="san-pham/:id" element={<ViewProductDetail />} />
        <Route path="search" element={<SearchPage />} /> {/* Route tìm kiếm */}
      </Route>
    </Routes>
  );
};

export default UserRouter;
