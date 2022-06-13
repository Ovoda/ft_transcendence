import UserRole from "src/shared/interfaces/role.interface";
import UserRelation from "src/shared/interfaces/userRelation";

export default interface RolesSlice {
    currentRole: UserRole | null;
    roles: UserRole[];
}