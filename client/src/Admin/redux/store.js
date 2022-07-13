import { configureStore } from "@reduxjs/toolkit";
import deleteReducer from "./deleteSlice";
import listManagerReducer from "./listManagerSlice";
import listFacilityReducer from './listFacilitySlice'

const store = configureStore({
    reducer: {
        delete: deleteReducer,
        listManager: listManagerReducer,
        listFacility: listFacilityReducer,
    }
})

export default store