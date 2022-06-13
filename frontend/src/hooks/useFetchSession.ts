import { closeChat } from "features/chat/chat.slice";
import { setRelations } from "features/relations/relations.slice";
import { setRoles } from "features/roles/roles.slice";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import UserRole from "src/shared/interfaces/role.interface";
import { updateUser } from "../features/user/user.slice";
import { getAllRelations, getAllRoles, getUserData } from "../services/api.service";

export default function useFetchSession() {

    /** Global data */
    const { roleSlice, chat }: Store = useSelector((store: Store) => store);

    /** Tools */
    const dispatch = useDispatch();

    useEffect(() => {
        if (!Cookies.get("authentication")) return;

        async function fetchSession() {
            const { userData } = await getUserData();
            if (!userData) return;
            dispatch(updateUser(userData));

            const { userRelations } = await getAllRelations();
            if (!userRelations) return;
            dispatch(setRelations(userRelations));

            const { userRoles } = await getAllRoles();
            if (!userRoles) return;
            dispatch(setRoles(userRoles));

        }
        fetchSession();
    }, []);

    useEffect(() => {
        const isCurrentRoleValid = roleSlice.roles.find((role: UserRole) => role.id === chat.currentRole?.id);
        if (!isCurrentRoleValid) {
            dispatch(closeChat());
        }

    }, [roleSlice.roles]);
}