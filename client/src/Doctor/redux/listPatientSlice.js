import { createSlice } from '@reduxjs/toolkit';

const listPatientSlice = createSlice({
    name: 'listPatient',
    initialState: {
        list: [],
        currentPatient: {},
    },
    reducers: {
        addPatient: (state, action) => {
            state.list.push(action.payload);
        },
        addCurrentPatient: (state, action) => {
            state.currentPatient = action.payload;
        },
        clearList: (state) => {
            state.list.length = 0;
        },
        deletePatient: (state, action) => {
            state.list.splice(action.payload, 1);
        },
        setListPatient: (state, action) => {
            state.list = action.payload;
        },
    },
});

export const { addPatient, clearList, deletePatient, addCurrentPatient, setListPatient } = listPatientSlice.actions;
export default listPatientSlice.reducer;
