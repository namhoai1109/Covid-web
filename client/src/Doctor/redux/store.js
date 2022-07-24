import { configureStore } from '@reduxjs/toolkit';
import listPatientReducer from './listPatientSlice';
import deleteStateReducer from './deleteStateSlice';
import currentCloseContactListReducer from './currentCloseContactList';
import currentNecessityReducer from './currentNecessity';

const store = configureStore({
    reducer: {
        listPatient: listPatientReducer,
        deleteState: deleteStateReducer,
        currentCloseContactList: currentCloseContactListReducer,
        currentNecessity: currentNecessityReducer,
    },
});

export default store;
