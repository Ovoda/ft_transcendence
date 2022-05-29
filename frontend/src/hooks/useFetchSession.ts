import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { openTfaLogin } from "../features/uiState/uiState.slice";
import { updateUser } from "../features/user/user.slice";
import { getUserData } from "../services/api.service";


export default function useFetchSession() {

    /** Tools */
    const dispatch = useDispatch();

    useEffect(() => {
        const token = Cookies.get("access_token");
        const needsTfa = Cookies.get("needs_tfa");
        if (token !== null && token !== undefined) {

            if (!needsTfa) {
                fetchUserData();
            }
            else if (needsTfa) {
                dispatch(openTfaLogin());
            }
        }

        async function fetchUserData() {
            const userData = await getUserData();

            if (userData) {
                dispatch(updateUser(userData));
            }
        }
    }, []);
}