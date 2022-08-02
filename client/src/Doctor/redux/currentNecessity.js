import { createSlice } from '@reduxjs/toolkit';

const currentNecessity = createSlice({
    name: 'currentNecessity',
    initialState: {
        curr: {},
    },
    reducers: {
        setCurr: (state, action) => {
            state.curr = action.payload;
        },
        removeCurr: (state) => {
            state.curr = {};
        },
    },
});

export const { setCurr, removeCurr } = currentNecessity.actions;
export default currentNecessity.reducer;
