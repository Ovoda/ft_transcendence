import { createSlice } from "@reduxjs/toolkit";
import { RelationTypeEnum } from "enums/relationType.enum";
import UserRelation from "src/shared/interfaces/userRelation";
import RelationSlice from "./interfaces/relations.interface";

const initialState: RelationSlice = {
    currentRelation: null,
    friends: [],
    blocked: [],
    all: [],
}

const relations = createSlice({
    name: "relations",
    initialState,
    reducers: {
        updateCurrentRelation(state, action) {
            return ({ ...state, currentRelation: action.payload.currentRelation });
        },
        setRelations(state, action) {
            return ({
                ...state,
                all: action.payload,
                friends: action.payload.filter((relation: UserRelation) => relation.status === RelationTypeEnum.FRIEND),
                blocked: action.payload.filter((relation: UserRelation) => relation.status === RelationTypeEnum.BLOCKED),
            });
        },
        addFriendRelation(state, action) {
            return ({
                ...state, relations: [...state.friends, action.payload],
            })
        },
    }
});

export const {
    updateCurrentRelation,
    setRelations,
    addFriendRelation
} = relations.actions;
export default relations.reducer;