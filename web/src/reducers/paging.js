import * as types from '../constants/ActionTypes';

export default function paging(state = 1, action) {
    switch (action.type) {
    case types.GO_TO_PAGE:
        return action.index;
    default:
        return state;
    }
}
