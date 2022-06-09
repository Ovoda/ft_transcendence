import { addMessage } from "features/chat/chat.slice";
import { addRelation, setRelations } from "features/relations/relations.slice";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRelations } from "services/api.service";
import { mainSocketContext } from "src";
import { Store } from "src/app/store";
import Message from "src/shared/interfaces/Message";


export default function useWebsockets() {

    /** Global data */
    const { chat, user } = useSelector((store: Store) => store);
    const mainSocket = useContext(mainSocketContext);

    /** Tools */
    const dispatch = useDispatch();

    const serverMessageCallback = (message: Message) => {
        console.log(message);
        if (message.relation.id === chat?.currentRelation?.id) {
            dispatch(addMessage(message));
        }
    }

    const friendConnectionCallback = async (userId: string) => {
        const userRelations = await getAllRelations();
        if (userRelations.data) {
            dispatch(setRelations(userRelations.data));
        }
    }

    const friendDisconnectionCallback = async (userId: string) => {
        const userRelations = await getAllRelations();
        if (userRelations.data) {
            dispatch(setRelations(userRelations.data));
        }
    }

    const newFriendCallback = (data: any) => {
        dispatch(addRelation(data));
    }

    useEffect(() => {
        if (user.login !== "" && mainSocket) {
            mainSocket.chat = chat;
            mainSocket.dispatch = dispatch;
            mainSocket.init(user.id);
            mainSocket.on("ServerMessage", serverMessageCallback);
            mainSocket.on("FriendConnection", friendConnectionCallback);
            mainSocket.on("FriendDisconnection", friendDisconnectionCallback);
            mainSocket.on("NewFriend", newFriendCallback);

            return () => {
                mainSocket.off("ServerMessage", serverMessageCallback);
                mainSocket.off("FriendConnection", friendConnectionCallback);
                mainSocket.off("FriendDisconnection", friendDisconnectionCallback);
                mainSocket.off("NewFriend", newFriendCallback);
            };
        }

    }, [user, chat]);
}