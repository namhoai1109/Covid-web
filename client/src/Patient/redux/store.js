import { configureStore } from '@reduxjs/toolkit';
import currentPackageSlice from './currentPackage';
import currentNecessitySlice from './currentNecessity';
import filterStateSlice from '~/Doctor/redux/filterState';

const store = configureStore({
    reducer: {
        currentPackage: currentPackageSlice,
        currentNecessity: currentNecessitySlice,
        filterState: filterStateSlice,
    },
});

export default store;
