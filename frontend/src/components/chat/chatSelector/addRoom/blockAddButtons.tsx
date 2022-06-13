import Button from "assets/Button/Button";
import { RelationTypeEnum } from "enums/relationType.enum";
import UserData from "features/user/interfaces/user.interface";
import { userInfo } from "os";
import { useSelector } from "react-redux";
import { addBlocked, addFriend, deleteRelation, updateRelation } from "services/api.service";
import { Store } from "src/app/store";
import UserRelation from "src/shared/interfaces/userRelation";

interface Props {
    selectedUser: UserData;
}

export function BlockAddButtons({ selectedUser }: Props) {

    const { relations, user } = useSelector((store: Store) => store);

    async function addRelation(userId: string, status: RelationTypeEnum) {
        if (status === RelationTypeEnum.FRIEND)
            await addFriend(userId);
        else if (status === RelationTypeEnum.BLOCKED)
            await addBlocked(userId);
        return false;
    }

    async function handleDeleteRelation(userId: string) {
        const relation = relations.all.find((relation: UserRelation) =>
            relation.counterPart.id === userId
        )
        await deleteRelation(relation?.id as string);
        return false;
    }

    function blockedSelectedUser(focusdUser: UserData) {
        const relation = relations.blocked.find((relation: UserRelation) =>
            relation.counterPart.id === focusdUser.id
        )
        if (relation?.users[0].id === user.id) return true;
        return false;
    }

    function blockedBySelectedUser(focusdUser: UserData) {
        const relation = relations.blocked.find((relation: UserRelation) =>
            relation.counterPart.id === focusdUser.id
        )
        if (relation?.users[1].id === user.id) return true;
        return false;
    }

    function friendWithCurrentuser(focusdUser: UserData) {
        const relation = relations.friends.find((relation: UserRelation) =>
            relation.counterPart.id === focusdUser.id
        )

        if (relation) return true;
        return false;
    }

    return (
        <>
            {
                friendWithCurrentuser(selectedUser) &&
                <>
                    <Button onClick={async () => { return handleDeleteRelation(selectedUser.id) }}>Unfriend</Button>
                </>
            }
            {
                blockedSelectedUser(selectedUser) &&
                <Button onClick={async () => { return handleDeleteRelation(selectedUser.id) }}>Unblock</Button>
            }
            {
                blockedBySelectedUser(selectedUser) &&
                <p>Blocked you</p>
            }
            {
                (!blockedSelectedUser(selectedUser) && !blockedBySelectedUser(selectedUser) && !friendWithCurrentuser(selectedUser)) &&
                <>
                    <Button onClick={async () => { return addRelation(selectedUser.id, RelationTypeEnum.FRIEND) }}>Add</Button>
                    <Button onClick={async () => { return addRelation(selectedUser.id, RelationTypeEnum.BLOCKED) }}>Block</Button>
                </>
            }
        </>
    );
}