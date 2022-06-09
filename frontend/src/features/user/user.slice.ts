import { createSlice } from "@reduxjs/toolkit";
import { UdpateUserAction } from "./interfaces/updateUserAction.interface";
import UserData from "./interfaces/user.interface";
import UserRole from "./interfaces/userRole.interface";

const initialState: UserData = {
	id: "",
	login: "",
	avatar: "",
	victories: 0,
	defeats: 0,
	tfaEnabled: false,
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
		}
	}
})

export const {
	updateUser,
	updateTfaEnabled,
} = UserDataSlice.actions;
export default UserDataSlice.reducer;