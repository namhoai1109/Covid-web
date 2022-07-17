import { configureStore } from '@reduxjs/toolkit';
import listPatientReducer from './listPatientSlice';
import deleteStateReducer from './deleteStateSlice';

const store = configureStore({
    reducer: {
        listPatient: listPatientReducer,
        deleteState: deleteStateReducer,
    },
});

export default store;
