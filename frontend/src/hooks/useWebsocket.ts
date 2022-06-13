import { addMessage } from "features/chat/chat.slice";
import { setRelations } from "features/relations/relations.slice";
import { setRoles } from "features/roles/roles.slice";
import { setNotification } from "features/uiState/uiState.slice";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRelations, getAllRoles } from "services/api.service";
import { mainSocketContext } from "src";
import { Store } from "src/app/store";
import Dm from "src/shared/interfaces/dm.interface";
import GroupMessage from "src/shared/interfaces/groupMessage.interface";


export default function useWebsockets() {

    /** Global data */
    const { chat, user } = useSelector((store: Store) => store);
    const mainSocket = useContext(mainSocketContext);

    /** Tools */
    const dispatch = useDispatch();

    const serverMessageCallback = (message: Dm) => {
        if (message.relation.id === chat?.currentRelation?.id) {
            dispatch(addMessage(message));
        }
    }

    const serverGroupMessageCallback = (message: GroupMessage) => {
        if (message.role.chatGroup.id === chat.currentRole?.chatGroup.id) {
            dispatch(addMessage(message));
        }
    }

    const reFetchRelations = async (userId: string) => {
        const { userRelations } = await getAllRelations();
        if (userRelations) {
            dispatch(setRelations(userRelations));
        }
    }

    const reFetchRoles = async (notification: any) => {
        const { userRoles } = await getAllRoles();
        if (userRoles) {
            dispatch(setRoles(userRoles));
        }
        if (notification)
            dispatch(setNotification(notification));
    }

    useEffect(() => {
        if (user.login !== "" && mainSocket) {
            mainSocket.on("ServerMessage", serverMessageCallback);
            mainSocket.on("ServerGroupMessage", serverGroupMessageCallback);
            mainSocket.on("UpdateUserRelations", reFetchRelations);
            mainSocket.on("UpdateUserRoles", reFetchRoles);

            return () => {
                mainSocket.off("ServerMessage", serverMessageCallback);
                mainSocket.off("ServerGroupMessage", serverGroupMessageCallback);
                mainSocket.off("UpdateUserRelations", reFetchRelations);
                mainSocket.off("UpdateUserRoles", reFetchRoles);
            };
        }

    }, [user, chat]);

    useEffect(() => {
        if (user.login !== "" && mainSocket) {
            mainSocket.init(user.id);
        }
    }, [user.login]);
}