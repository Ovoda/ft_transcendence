import axios from "axios";
import { updateTfaEnabled } from "../features/user/user.slice";
import { updateQrCode } from "../features/auth/auth.slice";
import { openTfaRegistration } from "../features/uiState/uiState.slice";
import { api } from "./api.service";
import { DisableTfaProps } from "./interfaces/DisableTfaProps.interface";
import { GenerateTfaProps } from "./interfaces/GenerateTfaProps.interface";
import { ToggleTfaProps } from "./interfaces/ToggleTfaProps.interface";
import { config } from "../app/config";

/**
 * Attempts to enable TFA on current user
 * @param tfaCode tfa code verification
 * @returns true if code is valid, false otherwise
 */
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

/**
 * Toggles TFA on current user
 * @param props.dispatch useDisptach() return object from redux
 * @param props.uiTfaEnabled redux global data tfa enabled checker value
 */
export async function toggleTfa({ dispatch, uiTfaEnabled }: ToggleTfaProps) {
    if (uiTfaEnabled === true) {
        generateTfa({ dispatch });
    } else {
        disableTfa({ dispatch });
    }
}

/**
 * Generates TFA QRCode for current user
 * @param props.dispatch useDisptach() return object from redux
 */
export async function generateTfa({ dispatch }: GenerateTfaProps) {

    try {
        const res = await api.get("/auth/tfa/generate", { responseType: "blob", });
        const url = window.URL.createObjectURL(new Blob([res.data]));

        dispatch(updateQrCode(url));
        dispatch(openTfaRegistration());
    } catch (err: any) {
    }
}

/**
 * Disables TFA for current user
 * @param props.dispatch useDisptach() return object from redux 
 */
export async function disableTfa({ dispatch }: DisableTfaProps) {
    try {
        await api.get("/auth/tfa/disable");
        dispatch(updateTfaEnabled(false));
    } catch (error: any) {
    }
}