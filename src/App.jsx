import "./App.css";
// In App.jsx
// import Sidebar from "./components/Sidebar";
// import Navbar from "./components/Navbar";
// import Dashbord from "./components/Dashbord";
import Dashbord from "./page/Admin/Dashbord";
// import ThemeContextProvider from "./ContextAPI/ContextAPI";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./page/Home/Homepage";

import Login from "./page/login/Login";
import Signup from "./page/login/Signup";
import ForgotPwd from "./page/login/ForgotPwd";
import Tickets from "./page/Admin/Tickets"; // Your task management page
import AdminLayout from "./page/Admin/AdminLayout";
import UserticketList from "./page/user/UserTickets";
import MyTickets from "./page/user/MyTickets";
import RaiseTicket from "./page/user/RaiseTicket";
import UserProfile from "./page/user/UserProfile";
import UserLayout from "./page/user/UserLayout";
import EngineerDashboard from "./page/Engineer/EngineerDashboard";
import AssignedTasks from "./page/Engineer/AssignedTasks";
import Hazards from "./page/Engineer/Hazards";
import EngineerProfile from "./page/Engineer/EngineerProfile";
// import Engineers from "./page/Admin/Engineers"
import PagaeNotFound from "./compoents/PageNotFound";
import Engineers from "./page/Admin/AdminEngineerList";
import AdminTaskList from "./page/Admin/AdminTaskList";
import AdminUserList from "./page/Admin/AdminUserList";
import AdminCompletedTasks from "./page/Admin/AdminCompletedTasks";
import AdminEngineerList from "./page/Admin/AdminEngineerList";
import AdminDeferredTasks from "./page/Admin/AdminDeferredTasks";
import AdminEngineerTasks from "./page/Admin/AdminEngineerTasks";
import Search from "./compoents/Searchbar";
import RaiseEngineerTickes from "./page/Engineer/HazardsTicket";
import AdminEngineerApproval from "./page/Admin/AdminEngineerApproval";
import ProtectedRoute from "./utils/protectedRoute";
import Logout from "./utils/logout";

import HazardsAdmin from "././page/Admin/AdminHazards";
import Hazardtickets from "././page/Admin/AdminHazardsTickets";
import Dashboard from "././page/user/Dashbord";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Homepage />} />

          {/* Login Page */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/reset" element={<ForgotPwd />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<PagaeNotFound />} />

          <Route
            path="/User"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            {/* Default route for Admin with Sidebar, Navbar, and Dashbord */}
            <Route index element={<Dashboard />} />
            <Route path="tickets" element={<UserticketList />} />

            {/* Tickets route (this will only render Sidebar and TicketsCreate) */}
            {/* <Route path="MyTickets" element={<MyTickets />} /> */}
            <Route path="RaiseTicket" element={<RaiseTicket />} />
            <Route path="UserProfile" element={<UserProfile />} />
            {/* <Route path="UserProfile" element={<UserProfile />} /> */}
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Default route for Admin with Sidebar, Navbar, and Dashbord */}
            <Route index element={<Dashbord />} />
            <Route path="tasks" element={<AdminTaskList />} />
            <Route path="users" element={<AdminUserList />} />
            {/* Tickets route (this will only render Sidebar and TicketsCreate) */}
            {/* <Route path="Tickets" element={<Tickets />} /> */}
            <Route path="/admin/engineers" element={<AdminEngineerList />} />
            <Route
              path="engineer-approval"
              element={<AdminEngineerApproval />}
            />
            <Route path="completed-tasks" element={<AdminCompletedTasks />} />
            <Route path="deferred" element={<AdminDeferredTasks />} />
            <Route path="engineer/:email" element={<AdminEngineerTasks />} />
            <Route path="hazards" element={<HazardsAdmin />} />
            <Route path="hazardsTickets" element={<Hazardtickets />} />
          </Route>

          {/* Engineer Dashboard */}
          <Route path="/engineer" element={<EngineerDashboard />}>
            {/* Nested Routes (these will be rendered inside EngineerDashboard) */}
            <Route index element={<Dashboard />} />
            <Route  element={<AssignedTasks />} />{" "}
            {/* Default route inside EngineerDashboard */}
            <Route path="AssignedTasks" element={<AssignedTasks />} />
            <Route path="Hazards" element={<Hazards />} />
            <Route path="Profile" element={<EngineerProfile />} />
            <Route path="RiseTickets" element={<RaiseEngineerTickes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
