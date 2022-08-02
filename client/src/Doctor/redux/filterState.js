import { createSlice } from '@reduxjs/toolkit';

const filterState = createSlice({
    name: 'filterState',
    initialState: {
        sort: {},
        search: '',
        filter: [],
        valueFilter: {},
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
                state.valueFilter[action.payload] = '';
            }
        },
        deleteFilter: (state, action) => {
            let index = state.filter.indexOf(action.payload);
            state.filter.splice(index, 1);
            delete state.valueFilter[action.payload];
        },
        setValue: (state, action) => {
            state.valueFilter[action.payload.filter] = action.payload.value;
        },
        setSearchValue: (state, action) => {
            state.search = action.payload;
        },
        setSort: (state, action) => {
            state.sort = action.payload;
        },
        deleteSort: (state) => {
            state.sort = {};
        },
    },
});

export const { setValue, addFilter, deleteFilter, setSearchValue, setSort, deleteSort } = filterState.actions;
export default filterState.reducer;
