
import * as types from '../constants/ActionTypes';

export function addQuestion(page, data) {
    return {
        type: types.ADD_QUESTION,
        idx: page,
        questions: data
    };
}
