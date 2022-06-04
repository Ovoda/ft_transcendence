import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../features/user/user.slice";
import { getUserData } from "../services/api.service";


export default function useFetchSession() {

    /** Tools */
    const dispatch = useDispatch();

    useEffect(() => {

        // if (window.location.href === process.env.REACT_APP_FRONTEND_URL as string) {
        fetchUserData();
        // }

        async function fetchUserData() {
            const userData = await getUserData();

            if (userData) {
                dispatch(updateUser(userData));
            }
        }
    }, []);
}