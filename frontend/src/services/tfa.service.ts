import axios from "axios";
import { updateTfaEnabled } from "../features/user/user.slice";
import { updateQrCode } from "../features/auth/auth.slice";
import { openTfaRegistration } from "../features/uiState/uiState.slice";
import { api } from "./api.service";
import { DisableTfaProps } from "./interfaces/DisableTfaProps.interface";
import { GenerateTfaProps } from "./interfaces/GenerateTfaProps.interface";
import { ToggleTfaProps } from "./interfaces/ToggleTfaProps.interface";
import { config } from "../app/config";


export async function enableTfa(tfaCode: string): Promise<boolean> {
    try {
        await api.post("/auth/tfa/enable", {
            tfaCode
        });
        return true;
    } catch (err) {
        return false;
    }
}

export async function toggleTfa({ dispatch, uiTfaEnabled }: ToggleTfaProps) {
    if (uiTfaEnabled === true) {
        generateTfa({ dispatch });
    } else {
        disableTfa({ dispatch });
    }
}

export async function generateTfa({ dispatch }: GenerateTfaProps) {
    const res = await axios.get(config.getValue("REACT_APP_BACKEND_URL") + "/auth/tfa/generate", {
        responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));

    dispatch(updateQrCode(url));
    dispatch(openTfaRegistration());
}

export async function disableTfa({ dispatch }: DisableTfaProps) {
    try {
        const res = await api.get("/auth/tfa/disable");
        dispatch(updateTfaEnabled(false));
        console.log(res);
    } catch (error: any) {
        console.log(error.response);
    }
}