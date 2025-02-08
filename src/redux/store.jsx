import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './Slice/taskSlice';
import ticketReducer from './Slice/UserSlice';
import engineerTaskReducer from './Slice/engineerTaskSlice';
import  RaiseTickets from "./Slice/raiseticke"
import adminReducer from "./Slice/AdminSlice";

const store = configureStore({
  reducer: {
    tasks: taskReducer,
    tickets: ticketReducer,
    engineerTasks: engineerTaskReducer,
    RaiseTicket :  RaiseTickets,
    admin: adminReducer
     
  },
});

export default store;
