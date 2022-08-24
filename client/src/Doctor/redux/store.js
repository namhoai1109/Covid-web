import { configureStore } from '@reduxjs/toolkit';
import listPatientReducer from './listPatientSlice';
import deleteStateReducer from './deleteStateSlice';
import currentCloseContactListReducer from './currentCloseContactList';
import currentNecessityReducer from './currentNecessity';
import currentListProductReducer from './currentListProduct';
import currentPackageSlice from './currentPackage';
import filterStateSlice from './filterState';
import messNotiSlice from './messNoti';

const store = configureStore({
    reducer: {
        listPatient: listPatientReducer,
        deleteState: deleteStateReducer,
        currentCloseContactList: currentCloseContactListReducer,
        currentNecessity: currentNecessityReducer,
        currentListProduct: currentListProductReducer,
        currentPackage: currentPackageSlice,
        filterState: filterStateSlice,
        messNoti: messNotiSlice,
    },
});

export default store;
