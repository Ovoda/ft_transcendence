import { setRelations } from "features/relations/relations.slice";
import { setRoles } from "features/roles/roles.slice";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../features/user/user.slice";
import { getAllRelations, getAllRoles, getUserData } from "../services/api.service";

export default function useFetchSession() {

    /** Tools */
    const dispatch = useDispatch();

    useEffect(() => {
        if (!Cookies.get("authentication")) return;

        async function fetchSession() {
            const userData = await getUserData();
            const userRelation = await getAllRelations();
            const userRoles = await getAllRoles();

            if (userData) {
                dispatch(updateUser(userData));
            }

            if (userRelation.data) {
                dispatch(setRelations(userRelation.data));
            }

            if (userRoles.data) {
                dispatch(setRoles(userRoles.data));
            }
        }
        fetchSession();
    }, []);
}