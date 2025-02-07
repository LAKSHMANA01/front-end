import { useEffect, useState } from "react";
import logo from "./photo.png";
import { Link } from "react-router-dom";
import { TiThMenu  } from "react-icons/ti";
import { FaBars} from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

function Navbar() {
  const [isMenu, setMenu] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  // Set toggle
  const toggleMenu = () => {
    setMenu(!isMenu);
  };

  useEffect(() => {
    const handleScroller = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroller);
    return () => {
      window.removeEventListener("scroll", handleScroller); // Fix the cleanup
    };
  }, []); // Empty dependency array to run only once when component mounts

  const navItems = [
    { link: "Home", path: "home" },
    { link: "Service", path: "service" },
    { link: "About", path: "about" }, // "About"
    { link: "Products", path: "products" },
    { link: "FAQ", path: "faq" },
  ];

  return (
    // <header className="w-full bg-white md-transparent fixed top-0 left-0 right-0">
    //   <nav>
    //     <div className="flex justify-between items-center text-base gap-8">
    //       <div>
    //         <a
    //           href=""
    //           className="text-2xl font-semibold flex items-center space-x-3"
    //         >
    //           <img
    //             src={logo}
    //             alt=""
    //             className="w-10 inline-block items-center"
    //           />
    //           <span className="text-[#263238]">Telcome</span>
    //         </a>

    //         {/* Large devices menu  here spy why check that that how you writter that */}
    //         <ul className="md:flex space-x-12 hidden">
    //           {navItems.map(({ link, path }) => {
    //             return (
    //               <Link
    //                 to={path}
    //                 className="block text-base text-gray-900 hover:text-green-300"
    //               >
    //                 {link}
    //               </Link>
    //             );
    //           })}
    //         </ul>
    //         {/* { btm for large divice?} */}
    //         <div className="'space-x-12 hidden sm:flex items-center">
    //           <a
    //             href="/"
    //             className="  bg-green-300 text-white px-4 hover:text-gray-900 transition-all duration-300 rounded-xl hover:bg-red"
    //           >
    //             Login
    //           </a>
    //           <button className="bg-green-300 text-white py-1 px-2 transition-all duration-300 rounded-xl hover:bg-red">
    //             {" "}
    //             Sign Up
    //           </button>
    //         </div>
    //         {/* this one mobile responsivie  */}
    //         <div className="md:hidden">
    //           <button>
    //             {isMenu ? (
    //               <FaXmaark className="h-6 w-6 text-gray-600 " />
    //             ) : (
    //               <FaBars className="h-6 w-6 text-gray-600" />
    //             )}
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </nav>
    // </header>
    <header className="w-full bg-[#fbfcdb] md-transparent fixed top-0 left-0 right-0">
  <nav className={`py-4 lg:px-14 px-4 ${isSticky ? "sticky top-0 left-0 right-0 border-b bg-white duration-300" :""}`}>
    <div className="flex justify-between items-center text-base gap-8">
      <div className="flex items-center">
        <a href="" className="text-2xl font-semibold flex items-center space-x-3">
          <img src={logo} alt="" className="w-10 inline-block" />
          <span className="text-[#263238]">Brillio</span>
        </a>
      </div>

      {/* Large devices menu */}
      <ul className="md:flex space-x-12 hidden">
        {navItems.map(({ link, path }) => {
          return (
            <li key={path}>
              <Link
                to={path}
                className="block text-base text-gray-900 hover:text-green-300"
              >
                {link}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Buttons for large devices */}
      <div className="space-x-12 hidden sm:flex items-center">
        <a
         
          className="bg-green-300 text-white px-4 hover:text-gray-900 transition-all duration-300 rounded-xl hover:bg-red-500"
        >
         <Link to="/login" >login</Link>
        </a>
        <button className="bg-green-300 text-white py-1 px-2 transition-all duration-300 rounded-xl hover:bg-red-500">
        <Link to="/register" >SignUp</Link>
        </button>
      </div>

      {/* Mobile responsive menu */}
      <div className="md:hidden flex items-center">
        <button
        onClick={toggleMenu}>
          {isMenu ? (
            <FaXmark  className="h-6 w-6 text-gray-600" />
          ) : (
            <FaBars className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div> 
      
    </div>
    <div className={ `hidden lg: bg-amber-300 space-y-4 placeholder-gray-700mt-16  ${isMenu ? " fixed  left-0 right-0  mt-5": "hidden"}`}>
  {navItems.map(({ link, path }) => {
          return (
         
              <Link
                to={path}
                className="block text-base text-gray-900 hover:text-green-300"
              >
                {link}
              </Link>
            
          );
        })}
  </div>
  </nav>
 {/* here mobile responsible device h */}
 
</header>


  );
}

export default Navbar;
