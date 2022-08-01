import { createSlice } from '@reduxjs/toolkit';

const filterState = createSlice({
    name: 'filterState',
    initialState: {
        filter: [],
        value: {},
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
                state.value[action.payload] = '';
            }
        },
        deleteFilter: (state, action) => {
            let index = state.filter.indexOf(action.payload);
            state.filter.splice(index, 1);
            delete state.value[action.payload];
        },
        setValue: (state, action) => {
            state.value[action.payload.filter] = action.payload.value;
        },
    },
});

export const { setValue, addFilter, deleteFilter } = filterState.actions;
export default filterState.reducer;
