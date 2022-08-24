import { configureStore } from '@reduxjs/toolkit';
import deleteReducer from './deleteSlice';
import listManagerReducer from './listManagerSlice';
import listFacilityReducer from './listFacilitySlice';
import hisDoctorReducer from './hisDoctor';
import messNotiReducer from './messNoti';

const store = configureStore({
    reducer: {
        delete: deleteReducer,
        listManager: listManagerReducer,
        listFacility: listFacilityReducer,
        hisDoctor: hisDoctorReducer,
        messNoti: messNotiReducer,
    },
});

export default store;
