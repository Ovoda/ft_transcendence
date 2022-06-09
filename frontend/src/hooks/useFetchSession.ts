import { setRelations } from "features/relations/relations.slice";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../features/user/user.slice";
import { getAllRelations, getUserData } from "../services/api.service";

export default function useFetchSession() {

    /** Tools */
    const dispatch = useDispatch();

    useEffect(() => {
        if (!Cookies.get("authentication")) return;

        async function fetchSession() {
            const userData = await getUserData();
            const userRelations = await getAllRelations();

            if (userData) {
                dispatch(updateUser(userData));
            }
            if (userRelations.data) {
                dispatch(setRelations(userRelations.data));
            }
        }
        fetchSession();
    }, []);
}