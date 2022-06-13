import Button from "assets/Button/Button";
import { RoleTypeEnum } from "enums/roleType.enum";
import { UserActivityStatusEnum } from "enums/userConnectionStatus.enum";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { mainSocketContext } from "src";
import { Store } from "src/app/store";
import settings_image from 'images/settings.png';
import { deleteGroup, leaveGroup } from "services/group.api.service";
import './chatBoxHeader.scss';

interface Props {
    setOpenSettings: Dispatch<SetStateAction<string>>;
}

export default function ChatBoxHeader({ setOpenSettings }: Props) {


    /** Global data */
    const { chat, user } = useSelector((store: Store) => store);
    const mainSocket = useContext(mainSocketContext);


    /** Variables */
    const [currentCounterPartId, setCurrentCounterPartId] = useState<string>("");


    /** Functions */
    function handleOpenSettings() {
        setOpenSettings((settings: string) => (settings === "") ? "chat_box_settings_container_open" : "");
    }

    async function handleWatchRequest() {
        mainSocket?.watchingRequest({ watched: currentCounterPartId, watcher: user.id, });
        return false;
    }

    async function handlePlayRequest() {
        mainSocket?.playingRequest({ userRequested: currentCounterPartId, userRequesting: user.id, });
        return false;
    }

    async function handleLeaveGroup() {
        if (!chat.currentRole) return false;
        await leaveGroup(chat.currentRole?.chatGroup.id, chat.currentRole.id);
        return false;
    }

    async function handleDeleteGroup() {
        if (!chat.currentRole) return false;
        await deleteGroup(chat.currentRole?.chatGroup.id, chat.currentRole.id);
        return false;
    }

    /** Effects */
    useEffect(() => {
        if (chat.currentRelation) {
            setCurrentCounterPartId(chat.currentRelation.counterPart.id);
        }
    }, [chat.currentRelation]);


    /** TSX */
    if (chat.currentRelation) {
        return (
            <div className={"chat_box_header"}>
                <p className="chat_box_header_title">{chat.currentRelation?.counterPart.username}</p>
                {
                    chat.currentRelation?.counterPart.activityStatus === UserActivityStatusEnum.PLAYING &&
                    <Button onClick={handleWatchRequest}>Watch</Button>
                }
                {
                    chat.currentRelation?.counterPart.activityStatus === UserActivityStatusEnum.CONNECTED &&
                    <Button onClick={handlePlayRequest}>Play</Button>
                }
            </div>
        )
    }
    if (chat.currentRole) {
        return (
            <div className={"chat_box_header"}>
                <p className="chat_box_header_title">{chat.currentRole.chatGroup.name}</p>
                {
                    chat.currentRole?.role === RoleTypeEnum.OWNER &&
                    <>
                        <Button id="delete_group_button" onClick={handleDeleteGroup}>Delete</Button>
                        <img onClick={handleOpenSettings} src={settings_image} alt="" />
                    </>
                }
                {
                    chat.currentRole?.role !== RoleTypeEnum.OWNER &&
                    <Button id="leave_group_button" onClick={handleLeaveGroup}>Leave</Button>
                }
            </div>
        );
    }
    return (<></>);
}