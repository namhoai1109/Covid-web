import { configureStore } from '@reduxjs/toolkit';
import listPatientReducer from './listPatientSlice';
import deleteStateReducer from './deleteStateSlice';
import currentCloseContactListReducer from './currentCloseContactList';
import currentNecessityReducer from './currentNecessity';
import currentListProductReducer from './currentListProduct';
import currentPackageSlice from './currentPackage';
import filterStateSlice from './filterState';

const store = configureStore({
    reducer: {
        listPatient: listPatientReducer,
        deleteState: deleteStateReducer,
        currentCloseContactList: currentCloseContactListReducer,
        currentNecessity: currentNecessityReducer,
        currentListProduct: currentListProductReducer,
        currentPackage: currentPackageSlice,
        filterState: filterStateSlice,
    },
});

export default store;
