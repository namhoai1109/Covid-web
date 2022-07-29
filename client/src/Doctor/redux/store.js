import { configureStore } from '@reduxjs/toolkit';
import listPatientReducer from './listPatientSlice';
import deleteStateReducer from './deleteStateSlice';
import currentCloseContactListReducer from './currentCloseContactList';
import currentNecessityReducer from './currentNecessity';
import currentListProductReducer from './currentListProduct';
import currentPackageSlice from './currentPackage';

const store = configureStore({
    reducer: {
        listPatient: listPatientReducer,
        deleteState: deleteStateReducer,
        currentCloseContactList: currentCloseContactListReducer,
        currentNecessity: currentNecessityReducer,
        currentListProduct: currentListProductReducer,
        currentPackage: currentPackageSlice,
    },
});

export default store;
