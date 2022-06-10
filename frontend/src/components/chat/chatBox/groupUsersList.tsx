import Button from "assets/Button/Button";
import { RoleTypeEnum } from "enums/roleType.enum";
import UserData from "features/user/interfaces/user.interface";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllUsers, updateUserRole } from "services/api.service";
import { Store } from "src/app/store";
import UserRole from "src/shared/interfaces/role.interface";
import './groupUsersList.scss';

export default function GroupUserList() {

    /** Global data */
    const { chat } = useSelector((store: Store) => store);

    /** Variables */
    const [users, setUsers] = useState<any[]>([]);
    const [fetchTrigger, setFetchTrigger] = useState<boolean>(false);

    useEffect(() => {
        async function fetchAllUsers() {
            const response = await getAllUsers(10, 1);
            if (response.error !== "") {
                return;
            }
            setUsers(response.data);
        }
        fetchAllUsers();
    }, [fetchTrigger]);

    async function handleRoleChange(userId: string, newRole: RoleTypeEnum) {
        await updateUserRole(userId, chat.currentRole?.chatGroup.id as string, newRole);
        setFetchTrigger((trigger) => !trigger);
        return false;
    }

    function isMuted(user: UserData) {
        const userRole = user.roles.find((role: UserRole) => role.chatGroup.id === chat.currentRole?.chatGroup.id);
        if (!userRole) return false;
        return userRole?.role === RoleTypeEnum.MUTE;
    }

    function isBanned(user: UserData) {
        const userRole = user.roles.find((role: UserRole) => role.chatGroup.id === chat.currentRole?.chatGroup.id);
        if (!userRole) return false;

        return userRole?.role === RoleTypeEnum.BANNED;
    }

    return (
        <div className="group_users_list" >
            {
                users &&
                users.map((user: UserData, index: number) =>
                    <div key={index} className="group_users_list_item">
                        <img className="group_users_list_item_img" src={user.avatar} alt={user.login + "'s avatar"} />
                        <p>{user.login}</p>
                        {
                            isMuted(user) ?
                                <Button onClick={async () => { return await handleRoleChange(user.id, RoleTypeEnum.LAMBDA) }}>Unmute</Button>
                                :
                                <Button onClick={async () => { return await handleRoleChange(user.id, RoleTypeEnum.MUTE) }}>Mute</Button>
                        }
                        {
                            isBanned(user) ?
                                <Button onClick={async () => { return await handleRoleChange(user.id, RoleTypeEnum.LAMBDA) }}>Unban</Button>
                                :
                                <Button onClick={async () => { return await handleRoleChange(user.id, RoleTypeEnum.BANNED) }}>Ban</Button>
                        }
                        <Button onClick={async () => { return await handleRoleChange(user.id, RoleTypeEnum.ADMIN) }}>Admin</Button>
                    </div>
                )
            }
        </div >
    );
}