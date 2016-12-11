import firebase from 'firebase';
import {dispatch, register} from '../core/dispatcher';
import {EventEmitter} from 'events';
import ActionTypes from '../constants/action-types';
import _ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
import {v4} from 'node-uuid';

const CHANGE_EVENT = 'change';

let _config = {};


var ConfigStore = Object.assign({}, EventEmitter.prototype, {

  getConfig(){
    return _config;
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
      case ActionTypes.FETCH_CONFIG:
        fetchConfig();
        break;        
      default:
      // Do nothing
    }
  })

});

function fetchConfig(){
  firebase.database().ref('config').once("value").then((snapshot)=> {
    _config = snapshot.val();

    if(!_config){
      _config = {};
    }
    
    ConfigStore.emitChange();
  });
}

export default ConfigStore;
