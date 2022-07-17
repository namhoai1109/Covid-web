import { createSlice } from '@reduxjs/toolkit';

const listPatientSlice = createSlice({
    name: 'listPatient',
    initialState: [],
    reducers: {
        addPatient: (state, action) => {
            state.push(action.payload);
        },
        clearList: (state) => {
            state.length = 0;
        },
        deletePatient: (state, action) => {
            state.splice(action.payload, 1);
        },
    },
});

export const { addPatient, clearList, deletePatient } = listPatientSlice.actions;
export default listPatientSlice.reducer;
