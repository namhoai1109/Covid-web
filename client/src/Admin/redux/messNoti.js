import { createSlice } from '@reduxjs/toolkit';

const messNoti = createSlice({
    name: 'messNoti',
    initialState: {
        mess: '',
        type: '',
    },
    reducers: {
        setMess: (state, action) => {
            state.mess = action.payload.mess;
            state.type = action.payload.type;
        },
        clearMess: (state) => {
            state.mess = '';
            state.type = '';
        },
    },
});

export const { setMess, clearMess } = messNoti.actions;
export default messNoti.reducer;
