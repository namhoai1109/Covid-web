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
        },
        clearList: (state) => {
            state.length = 0
        },
        setStatus: (state, action) => {
            state[action.payload.index].status = action.payload.status
        }
    }
});

export const { addManager, removeManager, clearList, setStatus } = listManagerSlice.actions;
export default listManagerSlice.reducer;