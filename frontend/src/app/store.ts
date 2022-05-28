import { AnyAction, configureStore } from "@reduxjs/toolkit";
import { Reducer } from "react";
import UserData from "src/features/user/interfaces/user.interface";
import UserDataReducer from "../features/user/userSlice";

export interface Store {
    user: UserData;
}

export default configureStore({
    reducer: {
        user: UserDataReducer,
    }
})

