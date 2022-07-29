import { createSlice } from '@reduxjs/toolkit';

const currentPackageSlice = createSlice({
    name: 'currentPackage',
    initialState: {
        current: {},
    },
    reducers: {
        setCurrentPackage: (state, action) => {
            state.current = action.payload;
        },
        deleteCurrentPackage: (state, action) => {
            state.current = {};
        },
    },
});

export const { setCurrentPackage, deleteCurrentPackage } = currentPackageSlice.actions;
export default currentPackageSlice.reducer;
