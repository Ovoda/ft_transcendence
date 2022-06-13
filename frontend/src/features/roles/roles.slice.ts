import { createSlice } from "@reduxjs/toolkit";
import UserRole from "src/shared/interfaces/role.interface";
import RolesSlice from "./interfaces/roles.interface";

const initialState: RolesSlice = {
    currentRole: null,
    roles: [],
}

const roles = createSlice({
    name: "roles",
    initialState,
    reducers: {
        updateCurrentRole(state, action): RolesSlice {
            return ({ ...state, currentRole: action.payload });
        },
        setRoles(state, action): RolesSlice {
            return ({ ...state, roles: action.payload });
        },
        addRole(state, action): RolesSlice {
            return ({
                ...state, roles: [...state.roles, action.payload],
            })
        }
    }
});

export const {
    updateCurrentRole,
    setRoles,
    addRole
} = roles.actions;
export default roles.reducer;