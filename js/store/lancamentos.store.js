import firebase from 'firebase';
import {dispatch, register} from '../core/dispatcher';
import {EventEmitter} from 'events';
import ActionTypes from '../constants/action-types';
import _ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';

const CHANGE_EVENT = 'change';

let _lancamentos = [];

var LancamentosStore = Object.assign({}, EventEmitter.prototype, {

  getLancamentos(){
    return _lancamentos;
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
      case ActionTypes.ADD_LANCAMENTOS:
        addLancamentos(action.lancamentos);
        break;
      case ActionTypes.FETCH_LANCAMENTOS:
        fetchLancamentos();
        break;
      default:
      // Do nothing
    }
  })

});

function fetchLancamentos(){
  firebase.database().ref("lancamentos").once("value").then((snapshot) => {
    _lancamentos = [];

    _.forOwn(snapshot.val(), (value, key) => {
      value['key'] = key;
      _lancamentos.push(value);
    });
    
    LancamentosStore.emitChange();
  });
}

function addLancamentos(lancamentos){
  lancamentos = lancamentos.map((l) => {
    return {
      data: moment(l[0], "DD/MM").toJSON(),
      descricao: l[1],
      valor: accounting.unformat(l[2], ',')
    }
  });

  lancamentos.forEach((l)=>{
    l['key'] = firebase.database().ref("lancamentos").push(l).key;
    _lancamentos.push(l);
  })
  
  LancamentosStore.emitChange();
}


export default LancamentosStore;
