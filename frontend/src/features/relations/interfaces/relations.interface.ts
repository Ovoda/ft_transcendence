import UserRelation from "src/shared/interfaces/userRelation";

export default interface RelationSlice {
    currentRelation: UserRelation | null;
    friends: UserRelation[];
    blocked: UserRelation[];
    all: UserRelation[];
}