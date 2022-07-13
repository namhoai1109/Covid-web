import { createSlice } from "@reduxjs/toolkit";

const listFacilitySlice = createSlice({
    name: "listFacility",
    initialState: [],
    reducers: {
        addFacility: (state, action) => {
            state.push(action.payload);
        },
        removeFacility: (state, action) => {
            state.splice(action.payload, 1);
        }
    }
});

export const { addFacility, removeFacility } = listFacilitySlice.actions;
export default listFacilitySlice.reducer;