import firebase from 'firebase';
import {dispatch, register} from '../core/dispatcher';
import {EventEmitter} from 'events';
import ActionTypes from '../constants/action-types';
import _ from 'lodash';

const CHANGE_EVENT = 'change';

let _user = null;

var UserStore = Object.assign({}, EventEmitter.prototype, {

  getCurrentUser(){
    return _user;
  },

  emitChange(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback){
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback){
    this.removeListener(CHANGE_EVENT, callback);
  },


  dispatcherIndex: register(function (action) {
    switch (action.type) {
      case ActionTypes.LOGIN:
        auth();
        break;
      case ActionTypes.LOGOUT:
        logout();
        break;
      default:
      // Do nothing
    }
  })

});

function auth(){
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/plus.login');

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      _user = user;
      UserStore.emitChange();
    } else {
      firebase.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
        _user = user;
        UserStore.emitChange();
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;

        console.log(email);

        _user = null
        UserStore.emitChange();
      });
    }
  });
}

function logout(){
  firebase.auth().signOut().then(function() {
    _user = {};
    UserStore.emitChange();
  }, function(error) {
    // An error happened.
  });
}

export default UserStore;
