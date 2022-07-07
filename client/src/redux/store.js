import { configureStore } from "@reduxjs/toolkit";
import reducer from "./dataCoreSlice.js";

const store = configureStore({
    reducer: reducer
})

export default store;