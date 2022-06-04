
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import Auth from "../../features/auth/interfaces/auth.interface";
import "./TfaRegistration.scss";
import useDigitInput from 'react-digit-input';
import UiState from "../../features/uiState/interfaces/UiState";
import { updateUser } from "../../features/user/user.slice";
import UserData from "../../features/user/interfaces/user.interface";
import { loginTfa } from "../../services/auth.service";
import { getUserData } from "../../services/api.service";
import { useNavigate } from "react-router-dom";


export default function TfaLogin() {

    /** Global data */
    const store: Store = useSelector((store: Store) => store);
    const auth: Auth = store.auth;
    const user: UserData = store.user;
    const uiState: UiState = store.uiState;

    /** Tools */
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [code, setCode] = useState<string>("");
    const [codeValidity, setCodeValidity] = useState<boolean | undefined>(undefined);

    const digits = useDigitInput({
        acceptedCharacters: /^[0-9]$/,
        length: 6,
        value: code,
        onChange: setCode,
    });

    useEffect(() => {
        async function callTfaEnabling() {
            const res = await loginTfa(code);

            if (res) {
                const userData = await getUserData();
                if (userData) {
                    dispatch(updateUser(userData));
                }
                setCode("");
                navigate("/");
            } else {
                setCodeValidity(false);
            }
        }

        if (code[code.length - 1] !== " " && code[code.length - 1] !== undefined) {
            callTfaEnabling();
        }
    }, [code]);

    // if (uiState.showTfaLogin) {
    return (
        <div id="tfa_registration_container">
            <div id="tfa_registration">
                <h2>Enter the code</h2>
                <div id="tfa_registration_digits">
                    <input inputMode="decimal" autoFocus {...digits[0]} />
                    <input inputMode="decimal" {...digits[1]} />
                    <input inputMode="decimal" {...digits[2]} />
                    <input inputMode="decimal" {...digits[3]} />
                    <input inputMode="decimal" {...digits[4]} />
                    <input inputMode="decimal" {...digits[5]} />
                </div>
                <p>{codeValidity ? "code valid" : "code invalid"}</p>
            </div>
        </div >
    );
    // }
    // return (<></>);
}