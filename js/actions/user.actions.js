import { dispatch, register } from '../core/dispatcher';
import ActionTypes from '../constants/action-types';

export default {

  login() {
    dispatch({
      type: ActionTypes.LOGIN
    });
  },

  logout() {
    dispatch({
      type: ActionTypes.LOGOUT
    });
  }

};
