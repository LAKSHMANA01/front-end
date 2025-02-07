import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



export const fetchcards = createAsyncThunk('admin/cards/list', async( opens, {rejectwithvalue})=>{
  console.log(" open card in admin card")
  try{
    const response = await axios('https://localhost:8000/api/', )
    console.log('card inside comeing dispatch', response.data)
    return response.data
  }catch(error){
    if(!error.response){
      throw error;
    }
    return rejectwithvalue(error.response.data)
  }
})

const adminTaskSlice = createSlice(
  {
     name: 'adminTasks',
     initialState:{
      cards: [],
      loadig: false,
      error: null,

     },
     reducers :{},
     extraReducers: (builder)=>{
      builder.addCase(fetchcards.pending,
        (state)=>{
          state.loadig = true;
          state.error = null
        }
      )
     }
    



  }
)