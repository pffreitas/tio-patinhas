import firebase from 'firebase';
import {dispatch, register} from '../core/dispatcher';
import {EventEmitter} from 'events';
import ActionTypes from '../constants/action-types';
import _ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';

const CHANGE_EVENT = 'change';

let _planejamento = [];


var PlanejamentoStore = Object.assign({}, EventEmitter.prototype, {

  getPlanejamento(){
    return _planejamento;
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
      case ActionTypes.ADD_CATEGORIA:
        addCategoria(action.parent, action.categoria);
        break;
      case ActionTypes.FETCH_PLANEJAMENTO:
        fetchPlan();
        break;        
      default:
      // Do nothing
    }
  })

});

function fetchPlan(){
  firebase.database().ref('plan').once("value").then((snapshot)=> {
    _planejamento = snapshot.val();
    PlanejamentoStore.emitChange();
  });
}

function addCategoria(parent, categoria){
  if(parent.nested){
      parent.nested.push(categoria);
  }else{
      parent.nested = [categoria];
  }

  firebase.database().ref('plan').set(_planejamento);
  PlanejamentoStore.emitChange();
}


export default PlanejamentoStore;
