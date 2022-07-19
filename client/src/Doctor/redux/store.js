import { configureStore } from '@reduxjs/toolkit';
import listPatientReducer from './listPatientSlice';
import deleteStateReducer from './deleteStateSlice';
import currentCloseContactListReducer from './currentCloseContactList';

const store = configureStore({
    reducer: {
        listPatient: listPatientReducer,
        deleteState: deleteStateReducer,
        currentCloseContactList: currentCloseContactListReducer,
    },
});

export default store;
