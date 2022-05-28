import { createSlice } from "@reduxjs/toolkit";
import { UdpateUserAction } from "./interfaces/updateUserAction.interface";
import UserData from "./interfaces/user.interface";

const initialState: UserData = {
    login: "",
    avatar: "",
}

const UserDataSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser(state, action: UdpateUserAction) {
            return action.payload;
        }
    }
})

export const { updateUser } = UserDataSlice.actions;
export default UserDataSlice.reducer;