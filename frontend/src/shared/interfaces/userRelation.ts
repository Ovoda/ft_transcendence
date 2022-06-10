import { RelationTypeEnum } from "enums/relationType.enum";
import { UserActivityStatusEnum } from "enums/userConnectionStatus.enum";
import CounterPart from "src/shared/interfaces/counterPart.interface";
import UserData from "../../features/user/interfaces/user.interface";

export default interface UserRelation {
    id: string;
    users: UserData[];
    createdAt: string;
    counterPart: CounterPart;
    status: RelationTypeEnum;
    lastMessage: string | null;
}