  import { 
    LayoutDashboard, 
    ClipboardList, 
    AlertTriangle, 
    Settings,
    ChevronRight,
    ChevronLeft,
    User
  } from "lucide-react";
  import { useState } from "react";
  import { useNavigate } from 'react-router-dom';
  import { useSelector } from 'react-redux';
  
  const Sidebar = ({ activePath = '/'}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const navigate = useNavigate()
    const { tasks, updateProfile, loading, error } = useSelector((state) => state.tickets);
  
    const menuItems = [
      { path: '/User', icon: LayoutDashboard, label: 'MyTicket' },
      // { path: '/User/MyTickets', icon: ClipboardList, label: 'RaiseTickets' },
      { path: '/User/RaiseTicket', icon: AlertTriangle, label: 'RaiseTickets' },
      { path: '/User/UserProfile', icon: User, label: 'Profile' },
      { path: '/User/settings', icon: Settings, label: 'Settings' }
    ];
  
    const isActive = (path) => activePath === path;
  
    const handleNavigation = (path) => {
      navigate(path); // Use navigate to change the route
    };
  




    return (
      <div 
        className={`

          fixed min-h-screen
          top-0 left-0 z-40
          bg-white dark:bg-gray-900
          transition-all duration-300 ease-in-out
          border-r border-gray-200 dark:border-gray-800
          ${isExpanded ? 'w-30' : 'w-20'}
          shadow-lg
        `}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-8 bg-blue-600 text-white
            rounded-full p-1 hover:bg-blue-700 transition-colors
            shadow-lg  md:block"
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
  
        {/* Logo Section */}
        <div className="p-4 flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800">
          {isExpanded ? (
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 
              bg-clip-text text-transparent">
            {updateProfile.name}
            </h1>
          ) : (
            <h1 className="text-2xl font-bold text-blue-600">B</h1>
          )}
        </div>
  
        {/* Menu Items */}
        <nav className="mt-6 px-2">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  flex items-center px-4 py-3 mb-2 w-full
                  rounded-lg transition-all duration-200
                  ${active 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800'
                  }
                  group
                `}
              >
                <item.icon 
                  size={24} 
                  className={`
                    ${active ? 'text-white' : 'text-gray-500 dark:text-gray-400'}
                    group-hover:scale-110 transition-transform duration-200
                  `}
                />
                {isExpanded && (
                  <span className="ml-4 font-medium transition-opacity duration-200">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
  
        {/* Footer - can be used for user info or additional controls */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-800">
          <div className={`
            flex items-center
            ${isExpanded ? 'justify-between' : 'justify-center'}
          `}>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-400" />
              {isExpanded && (
                <div>
                  <p className="text-sm font-medium dark:text-white">{ updateProfile.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">User</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Sidebar; 
