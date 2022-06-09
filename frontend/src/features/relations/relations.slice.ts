import { createSlice } from "@reduxjs/toolkit";
import RelationSlice from "./interfaces/relations.interface";

const initialState: RelationSlice = {
    currentRelation: null,
    relations: [],
}

const relations = createSlice({
    name: "relations",
    initialState,
    reducers: {
        updateCurrentRelation(state, action) {
            return ({ ...state, currentRelation: action.payload.currentRelation });
        },
        setRelations(state, action) {
            return ({ ...state, relations: action.payload });
        },
        addRelation(state, action) {
            return ({
                ...state, relations: [...state.relations, action.payload],
            })
        }
    }
});

export const {
    updateCurrentRelation,
    setRelations,
    addRelation
} = relations.actions;
export default relations.reducer;