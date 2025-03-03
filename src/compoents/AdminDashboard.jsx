
import Navbar from "./Navbar";
import Dashbord from "./Dashbord";


function AdminDashboard() {
  return (
    <>
        {/* <Route path="/" element={<Home></Home>}/> */}
        <div className="flex">
          <div className="grow ml-16 md:ml-64 h-full lg:h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white ">
            <Navbar />
            <Dashbord />
          </div>
        </div>
    </>
  );
}
export default AdminDashboard;

