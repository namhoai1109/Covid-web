import { createSlice } from '@reduxjs/toolkit';

const currentCloseContactList = createSlice({
    name: 'currentCloseContactList',
    initialState: {
        list: [],
    },
    reducers: {
        add: (state, action) => {
            let isExist = false;
            state.list.forEach((item) => {
                if (item._id === action.payload._id) {
                    isExist = true;
                }
            });

            if (!isExist) {
                state.list.push(action.payload);
            }
        },
        reset: (state) => {
            state.list.length = 0;
        },
        deleteItem: (state, action) => {
            state.list.splice(action.payload, 1);
        },
    },
});

export const { add, reset, deleteItem } = currentCloseContactList.actions;
export default currentCloseContactList.reducer;
