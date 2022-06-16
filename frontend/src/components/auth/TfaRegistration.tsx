
import { MouseEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import Auth from "../../features/auth/interfaces/auth.interface";
import "./TfaRegistration.scss";
import useDigitInput from 'react-digit-input';
import UiState from "../../features/uiState/interfaces/UiState";
import { closeTfaRegistration } from "../../features/uiState/uiState.slice";
import { enableTfa } from "../../services/tfa.service";
import { updateTfaEnabled } from "../../features/user/user.slice";
import UserData from "../../features/user/interfaces/user.interface";
import Button from "assets/Button/Button";


export default function TfaRegistration() {

    /** Global data */
    const store: Store = useSelector((store: Store) => store);
    const auth: Auth = store.auth;
    const user: UserData = store.user;
    const uiState: UiState = store.uiState;

    /** Tools */
    const dispatch = useDispatch();

    const [image, setImage] = useState("");

    const [code, setCode] = useState<string>("");
    const [codeValidity, setCodeValidity] = useState<boolean | undefined>(undefined);

    const digits = useDigitInput({
        acceptedCharacters: /^[0-9]$/,
        length: 6,
        value: code,
        onChange: setCode,
    });

    useEffect(() => {
        setImage(auth.qrCode);
    }, [auth]);

    useEffect(() => {
        async function callTfaEnabling() {
            const res = await enableTfa(code);
            if (res) {
                setCode("");
                dispatch(closeTfaRegistration());
                dispatch(updateTfaEnabled(true));
            } else {
                setCodeValidity(false);
            }
        }

        if (code[code.length - 1] !== " " && code[code.length - 1] !== undefined) {
            callTfaEnabling();
        }
    }, [code]);

    function cancelTfaRegistration(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        setCode("");
        dispatch(closeTfaRegistration());
        dispatch(updateTfaEnabled(user.tfaEnabled));
    }

    if (uiState.showTfaRegistration) {
        return (
            <div id="tfa_registration_container">
                <div id="tfa_registration">
                    <h2>1. Scan the QR code</h2>
                    <img src={image} />
                    <h2>2. Enter the code</h2>
                    <div id="tfa_registration_digits">
                        <input inputMode="decimal" autoFocus {...digits[0]} />
                        <input inputMode="decimal" {...digits[1]} />
                        <input inputMode="decimal" {...digits[2]} />
                        <input inputMode="decimal" {...digits[3]} />
                        <input inputMode="decimal" {...digits[4]} />
                        <input inputMode="decimal" {...digits[5]} />
                    </div>
                    <p>{codeValidity ? "code valid" : "code invalid"}</p>
                    {
                        (code[code.length - 1] === " " || code[code.length - 1] === undefined) &&
                        <Button onClick={cancelTfaRegistration}>close</Button>
                    }
                </div>
            </div >
        );
    }
    return (<></>);
}