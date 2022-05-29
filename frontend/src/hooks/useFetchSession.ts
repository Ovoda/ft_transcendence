import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import UserData from "src/features/user/interfaces/user.interface";
import { updateUser } from "../features/user/user.slice";
import { getUserData } from "../services/api.service";


export default function useFetchSession() {

    /** Tools */
    const dispatch = useDispatch();

    useEffect(() => {
        const token = Cookies.get("access_token");
        if (token) {
            localStorage.setItem("access_token", token);
        }

        async function fetchUserData() {
            const userData = await getUserData();

            if (userData) {
                dispatch(updateUser(userData));
            }
        }
        fetchUserData();
    }, []);
}