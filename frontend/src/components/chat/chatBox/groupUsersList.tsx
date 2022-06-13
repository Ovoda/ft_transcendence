import Button from "assets/Button/Button";
import { RoleTypeEnum } from "enums/roleType.enum";
import UserData from "features/user/interfaces/user.interface";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllUsers, updateUserRole } from "services/api.service";
import { getGroup } from "services/group.api.service";
import { Store } from "src/app/store";
import Group from "src/shared/interfaces/group.interface";
import UserRole from "src/shared/interfaces/role.interface";
import './groupUsersList.scss';

export default function GroupUserList() {

    /** Global data */
    const { chat, user } = useSelector((store: Store) => store);

    /** Variables */
    const [users, setUsers] = useState<UserRole[]>([]);
    const [fetchTrigger, setFetchTrigger] = useState<boolean>(false);

    useEffect(() => {
        async function fetchAllUsers() {
            const { group, error } = await getGroup(chat.currentRole?.chatGroup.id as string);
            if (!group) return;
            setUsers(group.users);
        }
        fetchAllUsers();
    }, [fetchTrigger]);

    async function handleRoleChange(userId: string, newRole: RoleTypeEnum) {
        await updateUserRole(userId, chat.currentRole?.chatGroup.id as string, newRole);
        setFetchTrigger((trigger) => !trigger);
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

    return (
        <div className="group_users_list" >
            {
                users &&
                users.map((role: UserRole, index: number) => {
                    if (role.user.id !== user.id) {
                        return (
                            <div key={index} className="group_users_list_item">
                                <img className="group_users_list_item_img" src={role.user.avatar} alt={role.user.login + "'s avatar"} />
                                <p>{role.user.login}</p>
                                {
                                    isMuted(role) ?
                                        <Button onClick={async () => { return await handleRoleChange(role.user.id, RoleTypeEnum.LAMBDA) }}>Unmute</Button>
                                        :
                                        <Button onClick={async () => { return await handleRoleChange(role.user.id, RoleTypeEnum.MUTE) }}>Mute</Button>
                                }
                                {
                                    isBanned(role) ?
                                        <Button onClick={async () => { return await handleRoleChange(role.user.id, RoleTypeEnum.LAMBDA) }}>Unban</Button>
                                        :
                                        <Button onClick={async () => { return await handleRoleChange(role.user.id, RoleTypeEnum.BANNED) }}>Ban</Button>
                                }
                                <Button onClick={async () => { return await handleRoleChange(role.user.id, RoleTypeEnum.ADMIN) }}>Admin</Button>
                            </div>
                        )
                    }
                })
            }
        </div >
    );
}