import React, { createContext, useEffect, useState } from "react";
export const ThemeContext = createContext(); //step 1

const ThemeContextProvider = ({ children }) => { // here step 2 children
  const [theme, setTheme] = useState(()=>{
  // here writeing code because of light 
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
 console.log("them comeing or not checking", theme)
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem('them', theme)
  }, [theme]);
  
  const toggleThem = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      <ThemeContext.Provider value={{ theme, toggleThem }}>
        {children}
      </ThemeContext.Provider>
    </>
  );
};
export default ThemeContextProvider;
