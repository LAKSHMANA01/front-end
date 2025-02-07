import React from 'react'
import {FaBox, FaCog, FaShoppingCart, FaTachometerAlt, FaUser} from 'react-icons/fa'

const Card =({ icon, title , value})=>{
  return (
   <><div  className='bg-white  text-dark p-4 shadow-md items-center space-x-5 dark:text-red-400'>
     <div className=' text-2xl text-gray-500'>{icon}</div>
     <div className='text-lg font-semibold'><h2>{title}</h2>
     <p className=' text-xl'> {value}</p></div>
   </div>
    

   </>
  
  )
}
export default Card