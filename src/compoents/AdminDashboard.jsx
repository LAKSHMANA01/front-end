import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Dashbord from "./Dashbord";
import ThemeContextProvider from "../ContextAPI/ContextAPI";
import Footer from "./Footer"


function AdminDashboard() {
  return (
    <>
      <ThemeContextProvider>
      
        <div className="flex">
          <Sidebar />
          <div className="grow ml-16 md:ml-64 h-full lg:h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white ">
            <Navbar />
            <Dashbord />
          </div>
        </div>
      </ThemeContextProvider>
    </>
  );
}
export default AdminDashboard;

