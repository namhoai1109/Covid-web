import { createSlice } from '@reduxjs/toolkit';

const currentListProductSlice = createSlice({
    name: 'currentListProduct',
    initialState: {
        list: [],
    },
    reducers: {
        setList: (state, action) => {
            state.list = action.payload;
        },
        addProduct: (state, action) => {
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
        deleteProduct: (state, action) => {
            state.list.splice(action.payload, 1);
        },
        resetList: (state) => {
            state.list = [];
        },
    },
});

export const { addProduct, deleteProduct, resetList, setList } = currentListProductSlice.actions;
export default currentListProductSlice.reducer;
