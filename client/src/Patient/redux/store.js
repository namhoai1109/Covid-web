import { configureStore } from '@reduxjs/toolkit';
import currentPackageSlice from './currentPackage';
import currentNecessitySlice from './currentNecessity';

const store = configureStore({
    reducer: {
        currentPackage: currentPackageSlice,
        currentNecessity: currentNecessitySlice,
    },
});

export default store;
