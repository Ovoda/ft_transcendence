import { createSlice } from "@reduxjs/toolkit";
import Auth from "./interfaces/auth.interface";

const initialState: Auth = {
    qrCode: "",
}

const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        updateQrCode(state, action) {
            return { ...state, qrCode: action.payload };
        },
    }
})

export const { updateQrCode } = auth.actions;
export default auth.reducer;