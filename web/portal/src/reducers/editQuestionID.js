
import * as types from '../constants/ActionTypes';

export default function editQuestionID(state = '', action) {
    switch (action.type) {
    case types.SET_EDITQUESTIONID:
        return action.editQuestionID;
    default:
        return state;
    }
}
