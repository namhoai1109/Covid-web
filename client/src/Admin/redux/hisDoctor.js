import { createSlice } from '@reduxjs/toolkit';

const hisDoctorSlice = createSlice({
    name: 'hisDoctor',
    initialState: {
        id: '',
    },
    reducers: {
        setId: (state, action) => {
            state.id = action.payload;
        },
        deleteId: (state) => {
            state.id = '';
        },
    },
});

export const { setId, deleteId } = hisDoctorSlice.actions;
export default hisDoctorSlice.reducer;
