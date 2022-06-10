import { createSlice } from "@reduxjs/toolkit";
import UiState from "./interfaces/UiState";

const initialState: UiState = {
	openedSettings: false,
	logged: false,
	showTfaRegistration: false,
	showGameOptions: false,
	notification: "",
}

const uiState = createSlice({
	name: "uiState",
	initialState,
	reducers: {
		updateUiState(state, action) {
			return action.payload;
		},
		closeSettingWindow(state) {
			return { ...state, openedSettings: false };
		},
		openSettingWindow(state) {
			return { ...state, openedSettings: true };
		},
		openTfaRegistration(state) {
			return { ...state, showTfaRegistration: true };
		},
		closeTfaRegistration(state) {
			return { ...state, showTfaRegistration: false };
		},
		setNotification(state, action) {
			return { ...state, notification: action.payload };
		},
		openGameOptions(state) {
			return { ...state, showGameOptions: true }
		},
		closeGameOptions(state) {
			return { ...state, showGameOptions: false }
		},
	}
})

export const {
	updateUiState,
	closeSettingWindow,
	openSettingWindow,
	openTfaRegistration,
	closeTfaRegistration,
	setNotification,
	openGameOptions,
	closeGameOptions,
} = uiState.actions;

export default uiState.reducer;