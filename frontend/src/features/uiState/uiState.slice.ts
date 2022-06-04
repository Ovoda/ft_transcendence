import { createSlice } from "@reduxjs/toolkit";
import UiState from "./interfaces/UiState";

const initialState: UiState = {
    openedSettings: false,
    logged: false,
    showTfaRegistration: false,
    showTfaLogin: false,
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
        openTfaLogin(state) {
            return { ...state, showTfaLogin: true };
        },
        closeTfaLogin(state) {
            return { ...state, showTfaLogin: false };
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
    openTfaLogin,
    closeTfaLogin,
    openChat,
    closeChat,
} = uiState.actions;

export default uiState.reducer;