import  page from "./page.jpg";

function Body() {
  return (
    <>
    <div className="flex items-center justify-center mt-20 p-6 rounded-lg ">
  <div className="text-center space-y-6">
    <h1 className="text-3xl font-semibold text-gray-800 leading-tight">
      Streamline Your Telecommunications Infrastructure Maintenance with Our Optimized Field Engineer Task Management System
    </h1>
    <button className="bg-green-500 text-white py-2 px-6 rounded-full transition duration-300 transform hover:bg-green-700 hover:scale-105">
      Get Started Today
    </button>
  </div>
  <img
    src={page}
    alt="Telecommunications"
    className="w-32 h-32 lg:w-58 lg:h-58 object-cover rounded-xl ml-8"
  />
</div>

     
    </>
  );
}

export default Body;
