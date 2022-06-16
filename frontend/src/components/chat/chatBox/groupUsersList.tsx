import Button from "assets/Button/Button";
import { RoleTypeEnum } from "enums/roleType.enum";
import { closeChat } from "features/chat/chat.slice";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserRole } from "services/api.service";
import { getGroup, kickFromGroup } from "services/group.api.service";
import ClientSocket from "services/websocket.service";
import { mainSocketContext } from "src";
import { Store } from "src/app/store";
import UserRole from "src/shared/interfaces/role.interface";
import './groupUsersList.scss';

export default function GroupUserList() {

    /** Global data */
    const { chat, user } = useSelector((store: Store) => store);

    /** Tools */
    //const dispatch = useDispatch();

    /** Variables */
    const [users, setUsers] = useState<UserRole[]>([]);
    const [fetchTrigger, setFetchTrigger] = useState<boolean>(false);

    const mainSocket: ClientSocket | null = useContext(mainSocketContext);

    useEffect(() => {
        async function fetchAllUsers() {
            const { group } = await getGroup(chat.currentRole?.chatGroup.id as string);
            if (!group) return;
            setUsers(group.users);
        }
        if (chat.currentRole) {
            fetchAllUsers();
        }
    }, [fetchTrigger, chat.openGroupSettings, chat.currentRole]);

    async function handleRoleChange(userId: string, newRole: RoleTypeEnum) {
        await updateUserRole(userId, chat.currentRole?.chatGroup.id as string, newRole);
        setFetchTrigger((trigger) => !trigger);
        if (newRole === RoleTypeEnum.BANNED) {
            mainSocket?.closingChat(userId);
        }
        mainSocket?.reloadRoles(userId);
        return false;
    }

    function isMuted(userRole: UserRole) {
        if (!userRole) return false;
        return userRole?.role === RoleTypeEnum.MUTE;
    }

    function isBanned(userRole: UserRole) {
        if (!userRole) return false;
        return userRole?.role === RoleTypeEnum.BANNED;
    }

    function isAdmin(userRole: UserRole) {
        if (!userRole) return false;
        return userRole?.role === RoleTypeEnum.ADMIN;
    }

    async function handleKick(role: UserRole) {
        await kickFromGroup(role.chatGroup.id, role.id);
        setFetchTrigger((trigger) => !trigger);
        mainSocket?.reloadRoles(role);
        return false;
    }

    return (
        <div className="group_users_list" >
            {
                users &&
                users.map((role: UserRole, index: number) => {
                    if (role.user.id !== user.id && role.role !== RoleTypeEnum.OWNER) {
                        return (
                            <div key={index} className="group_users_list_item">
                                <img className="group_users_list_item_img" src={role.user.avatar} alt={role.user.username + "'s avatar"} />
                                <div className="group_users_list_item_right">
                                    <p id="group_users_list_item_right_username">{role.user.username}</p>
                                    <div className="group_users_list_item_buttons">
                                        {
                                            isMuted(role) ?
                                                <p className="mute_ison" onClick={async () => { return await handleRoleChange(role.user.id, RoleTypeEnum.LAMBDA) }}>Mute</p>
                                                :
                                                <p onClick={async () => { return await handleRoleChange(role.user.id, RoleTypeEnum.MUTE) }}>Mute</p>
                                        }
                                        {
                                            isBanned(role) ?
                                                <p className="ban_ison" onClick={async () => { return await handleRoleChange(role.user.id, RoleTypeEnum.LAMBDA) }}>Ban</p>
                                                :
                                                <p onClick={async () => { return await handleRoleChange(role.user.id, RoleTypeEnum.BANNED) }}>Ban</p>
                                        }
                                        <p onClick={async () => { return await handleKick(role) }}>Kick</p>
                                        {
                                            isAdmin(role) ?
                                                <p className="admin_ison" onClick={async () => { return await handleRoleChange(role.user.id, RoleTypeEnum.LAMBDA) }}>Admin</p>
                                                :
                                                <p onClick={async () => { return await handleRoleChange(role.user.id, RoleTypeEnum.ADMIN) }}>Admin</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    return true;
                })
            }
        </div >
    );
}