import { getDataAPI } from "../../utils/fetchData";
import { setAlert } from "./alertAction";

export const SUGGESTIONS_TYPES = {

    SUGGESTIONS_LOADING: 'SUGGESTIONS_LOADING',
    GET_SUGGESTIONS: 'GET_SUGGESTIONS'

}


export const getSuggestions = (auth, suggestionsLimit) => async (dispatch) => {

    dispatch({
        type: SUGGESTIONS_TYPES.SUGGESTIONS_LOADING,
        payload: true
    });


    try {

        suggestionsLimit = suggestionsLimit || 10;

        const url = `user/user-suggestions?suggestionsLimit=${suggestionsLimit}`;
        const res = await getDataAPI(url, auth.token);


        const { suggestions, result } = res.data;
        dispatch({
            type: SUGGESTIONS_TYPES.GET_SUGGESTIONS,
            payload: { users: suggestions, result }
        });


    } catch (err) {

        dispatch(setAlert({ suggestionsError: err.message }));
    }


    dispatch({
        type: SUGGESTIONS_TYPES.SUGGESTIONS_LOADING,
        payload: false
    });

}