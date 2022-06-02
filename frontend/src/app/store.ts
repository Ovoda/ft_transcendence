import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import UserData from "src/features/user/interfaces/user.interface";
import UserDataReducer from "../features/user/user.slice";
import UiStateReducer from "../features/uiState/uiState.slice";
import UiState from "src/features/uiState/interfaces/UiState";
import AuthReducer from "../features/auth/auth.slice";
import Auth from "src/features/auth/interfaces/auth.interface";

export interface Store {
    user: UserData;
    uiState: UiState;
    auth: Auth;
}

export default configureStore({
    reducer: {
        user: UserDataReducer,
        uiState: UiStateReducer,
        auth: AuthReducer,
    }
})
