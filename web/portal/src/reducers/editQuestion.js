
import * as types from '../constants/ActionTypes';

export default function editQuestion(state = {}, action) {
    switch (action.type) {
    case types.SET_EDITQUESTION:
        return Object.assign({}, state, action.editQuestion);
    case types.STOP_EDITQUESTION:
        return {};
    default:
        return state;
    }
}