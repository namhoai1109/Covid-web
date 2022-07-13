import { createSlice } from "@reduxjs/toolkit";

const listManagerSlice = createSlice({
    name: "listManager",
    initialState: [],
    reducers: {
        addManager: (state, action) => {
            state.push(action.payload);
        },
        removeManager: (state, action) => {
            state.splice(action.payload, 1);
        }
    }
});

export const { addManager, removeManager } = listManagerSlice.actions;
export default listManagerSlice.reducer;