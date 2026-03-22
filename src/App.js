import "./App.css";
import {Routes,Route,Link} from "react-router-dom";
import Home from "./Pages/Home"
import Navbar from "./components/common/Navbar";
import Login from "./Pages/Login"
import OpenRoute from "./components/core/Auth/OpenRoute";
import Signup from "./Pages/Singup";
import About from "./Pages/About"
import VerifyEmail from "./Pages/VerifyEmail";
import ForgotPassword from "./Pages/ForgotPassword";
import UpdatePassword from "./Pages/UpdatePassword";
import Contact from "./Pages/Contact";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Dashboard from "./Pages/Dashboard";
import MyProfile from "./components/core/Dashboard/MyProfile";
import MainSettings from "./components/core/Dashboard/Settings/MainSettings";
import { ACCOUNT_TYPE } from "./utils/constant";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import { useSelector } from "react-redux";
import Cart from "./components/core/Dashboard/Cart/index"
import AddCourse from "./components/core/Dashboard/AddCourse/index";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse/index";
import Catalog from "./Pages/Catalog";
import CourseDetails from "./Pages/CourseDetails";
import ViewCourse from "./Pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails"
import Instructor from "./components/core/Dashboard/instructor";

function App() {

  const {user}=useSelector((state)=>state.profile);

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      {/* NavBar cmp*/}
      <Navbar />

    {/* Home cmp */}
      <Routes>

        <Route path="/" element={<Home/>} />
        <Route path="catalog/:catalogName" element={<Catalog/>} />
        <Route path="courses/:courseId" element={<CourseDetails/>} />

        <Route
          path="login"
          element={
            <OpenRoute>
              <Login/>
            </OpenRoute>
          }
        />

        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword/>
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword/>
            </OpenRoute>
          }
        />

        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup/>
            </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail/>
            </OpenRoute>
          }
        />

        <Route
          path="about"
          element={
            <OpenRoute>
              <About />
            </OpenRoute>
          }
        />  
        <Route path="/contact" element={<Contact />} />

        <Route
          element={
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile/>}/>
          <Route path="dashboard/settings" element={<MainSettings/>} />

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="dashboard/cart" element={<Cart />} />
                <Route path="dashboard/enrolled-courses" element={<EnrolledCourses/>} />
              </>
            )
          }

          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="dashboard/instructor" element={<Instructor />} />
                <Route path="dashboard/add-course" element={<AddCourse/>} />
                <Route path="dashboard/my-courses" element={<MyCourses/>} />
                <Route path="dashboard/edit-course/:courseId" element={<EditCourse/>}/>
              </>
            )
          }
        </Route>

        {/* For the watching course lectures */}
        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>



          
      </Routes>

    </div>
  );
}

export default App;
