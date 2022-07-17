import { createSlice } from '@reduxjs/toolkit';

const deleteStateSlice = createSlice({
    name: 'deleteState',
    initialState: {
        state: false,
    },
    reducers: {
        setDelete: (state, action) => {
            state.state = action.payload;
        },
    },
});

export const { setDelete } = deleteStateSlice.actions;
export default deleteStateSlice.reducer;
