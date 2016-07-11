
import * as types from '../constants/ActionTypes';

export function setEditQuestionID(ID) {
    return {
        type: types.SET_EDITQUESTIONID,
        editQuestionID: ID
    };
}
