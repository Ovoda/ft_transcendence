import { createSlice } from "@reduxjs/toolkit";
import { UdpateUserAction } from "./interfaces/updateUserAction.interface";
import UserData from "./interfaces/user.interface";

const initialState: UserData = {
	id: "",
	login: "",
	avatar: "",
	username: "",
	tfaEnabled: false,
	roles: [],
	victories: 0,
	defeats: 0,
	relations: []
}

const UserDataSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		updateUserData(state, action: UdpateUserAction) {
			return { ...state, ...action.payload };
		},
		updateTfaEnabled(state, action) {
			return { ...state, tfaEnabled: action.payload };
		}
	}
})

export const {
	updateUserData,
	updateTfaEnabled,
} = UserDataSlice.actions;
export default UserDataSlice.reducer;