import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../features/user/user.slice";
import { getUserData } from "../services/api.service";


export default function useFetchSession() {

    /** Tools */
    const dispatch = useDispatch();

    useEffect(() => {
        const token = Cookies.get("access_token");

        console.log(window.location.href);

        if (token && window.location.href === process.env.REACT_APP_BACKEND_URL as string) {
            fetchUserData();
        }

        async function fetchUserData() {
            const userData = await getUserData();

            if (userData) {
                dispatch(updateUser(userData));
            }
        }
    }, []);
}