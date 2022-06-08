import { useContext, useEffect } from "react";
import { mainSocketContext } from "../App";

export default function useFriendsStatus() {

    /** Global data */
    const mainSocket = useContext(mainSocketContext);

    useEffect(() => {
        mainSocket?.on("NewClientConnection", (userId: string) => {
            console.log(userId);
        });
    }, []);
}