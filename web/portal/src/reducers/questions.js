
import * as types from '../constants/ActionTypes';

export default function questions(state = [], action) {
    switch (action.type) {
    case types.ADD_QUESTION:
        const len = state.length;
        const idx = action.idx - 1;
        let survey = {};
        if (len >= action.idx) {
            // if this page already existed
            // edit this page content
            survey = state[idx];
            survey.question = [
                ...survey.question,
                action.questions
            ];
            return [
                ...state.slice(0, idx),
                survey,
                ...state.slice(idx + 1)
            ];
        }
        // if this page didn't exist
        survey = {
            page: action.idx,
            description: 'Untitle Page',
            question: [action.questions]
        };
        return [
            ...state,
            survey
        ];
    // case types.ADD_PAGE:
    //     return [
    //         ...state,
    //         action.questions
    //     ];
    default:
        return state;
    }
}
