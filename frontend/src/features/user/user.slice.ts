import { createSlice } from "@reduxjs/toolkit";
import { UdpateUserAction } from "./interfaces/updateUserAction.interface";
import UserData from "./interfaces/user.interface";
import UserRole from "./interfaces/userRole.interface";

const initialState: UserData = {
    id: "",
    login: "",
    avatar: "",
    tfaEnabled: false,
    roles: [],
    relations: [],
}

const UserDataSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser(state, action: UdpateUserAction) {
            return action.payload;
        },
        updateTfaEnabled(state, action) {
            return { ...state, tfaEnabled: action.payload };
        },
        setFriendConnected(state, action) {
        },
        setFriendDisconnected(state, action) {
        }
    }
})

export const {
    updateUser,
    updateTfaEnabled,
    setFriendConnected,
    setFriendDisconnected
} = UserDataSlice.actions;
export default UserDataSlice.reducer;