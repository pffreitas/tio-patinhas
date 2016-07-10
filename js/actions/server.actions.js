import {dispatch, register} from '../core/dispatcher';
import ActionTypes from '../constants/action-types';

export default {

  fetched(messageObject) {
    dispatch({
      type: ActionTypes.FETCHED, messageObject
    });
  },

};
