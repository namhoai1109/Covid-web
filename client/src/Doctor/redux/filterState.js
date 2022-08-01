import { createSlice } from '@reduxjs/toolkit';

const filterState = createSlice({
    name: 'filterState',
    initialState: {
        filter: [],
    },
    reducers: {
        addFilter: (state, action) => {
            let isExist = false;
            state.filter.forEach((item) => {
                if (item === action.payload) {
                    isExist = true;
                }
            });

            if (!isExist) {
                state.filter.push(action.payload);
            }
        },
        deleteFilter: (state, action) => {
            let index = state.filter.indexOf(action.payload);
            state.filter.splice(index, 1);
        },
        setFilter: (state, action) => {
            state.filter = action.payload;
        },
        resetFilter: (state) => {
            state.filter = '';
        },
    },
});

export const { setFilter, resetFilter, addFilter, deleteFilter } = filterState.actions;
export default filterState.reducer;
