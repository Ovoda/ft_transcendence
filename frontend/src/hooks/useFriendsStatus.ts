import { useContext, useEffect } from "react";
import { mainSocketContext } from "src";

export default function useFriendsStatus() {

    /** Global data */
    const mainSocket = useContext(mainSocketContext);

    useEffect(() => {
        mainSocket?.on("NewClientConnection", (userId: string) => {
            console.log(userId);
        });
    }, []);
}