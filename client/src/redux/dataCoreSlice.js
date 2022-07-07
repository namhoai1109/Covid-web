import { createSlice } from "@reduxjs/toolkit"

const dataCoreSlice = createSlice({
    name: "dataCore",
    initialState: {
        _id: '',
        role: '',
        token: '',
    },
    reducers: {
        setDataCore: (state, action) => {
            state._id = action.payload._id;
            state.role = action.payload.role;
            state.token = action.payload.token;
        },// => type action { type: dataCore/setDataCore}
        resetDataCore: (state) => {
            state._id = '';
            state.role = '';
            state.token = '';
        }
    }
})

export const { setDataCore, resetDataCore } = dataCoreSlice.actions
export default dataCoreSlice.reducer