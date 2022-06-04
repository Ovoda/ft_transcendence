import { createSlice } from "@reduxjs/toolkit";
import UiState from "./interfaces/UiState";

const initialState: UiState = {
    openedSettings: false,
    logged: false,
    showTfaRegistration: false,
    showChat: false,
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
        openChat(state) {
            return { ...state, showChat: true }
        },
        closeChat(state) {
            return { ...state, showChat: false }
        }
    }
})

export const {
    updateUiState,
    closeSettingWindow,
    openSettingWindow,
    openTfaRegistration,
    closeTfaRegistration,
    openChat,
    closeChat,
} = uiState.actions;

export default uiState.reducer;