import { createSlice } from '@reduxjs/toolkit';

const listFacilitySlice = createSlice({
    name: 'listFacility',
    initialState: {
        listFacility: [],
    },
    reducers: {
        addFacility: (state, action) => {
            state.listFacility.push(action.payload);
        },
        removeFacility: (state, action) => {
            state.listFacility.splice(action.payload, 1);
        },
        setListFacility: (state, action) => {
            state.listFacility = action.payload;
        },
    },
});

export const { addFacility, removeFacility, setListFacility } = listFacilitySlice.actions;
export default listFacilitySlice.reducer;
