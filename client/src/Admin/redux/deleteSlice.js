import { createSlice } from "@reduxjs/toolkit";

const deleteSlide = createSlice({
    name: "delete",
    initialState: {
        isShow: false
    },
    reducers: {
        setDelete: (state, action) => {
            state.isShow = action.payload;
        }// => type action { type: dataCore/setDataCore}
    }
});

export const { setDelete } = deleteSlide.actions;
export default deleteSlide.reducer;