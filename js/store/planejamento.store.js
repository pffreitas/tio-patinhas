import firebase from 'firebase';
import {dispatch, register} from '../core/dispatcher';
import {EventEmitter} from 'events';
import ActionTypes from '../constants/action-types';
import _ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
import {v4} from 'node-uuid';

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
        addCategoria(action.categoria);
        break;
      case ActionTypes.FETCH_PLANEJAMENTO:
        fetchPlan();
        break;        
      case ActionTypes.SAVE_PLANEJAMENTO:
        savePlanejamento(action.planejamento);
        break;              
      default:
      // Do nothing
    }
  })

});

function fetchPlan(){
  firebase.database().ref('plan').once("value").then((snapshot)=> {
    _planejamento = snapshot.val();

    if(!_planejamento){
      _planejamento = [];
    }
    
    PlanejamentoStore.emitChange();
  });
}

function addCategoria(categoria){
  categoria['id'] = v4();

  _planejamento.push(categoria);
  firebase.database().ref('plan').set(_planejamento);
  PlanejamentoStore.emitChange();
}

function  _flat(parent, group, nested, cats){
  nested.forEach((c) => {
    if(c.nested && c.nested.length > 0){

      let groupName = c.name;
      if (parent != null){
        groupName = parent.name + "/" + c.name;
      }

      _flat(parent, groupName, c.nested, cats);
    }else{
      cats.push({id: c.id, name: c.name, group: group}); 
    }
  })
}

function _updateCategorias(){
  let cats = []
  _flat(null, null, _planejamento, cats);

  let _cats = {};
  cats.forEach((c) => {
    _cats[c.id] = c;
  });

  firebase.database().ref('categorias').set(_cats);
}

function savePlanejamento(_planejamento){
  _updateCategorias(_planejamento);

  firebase.database().ref('plan').set(_planejamento);
  PlanejamentoStore.emitChange(); 
}

export default PlanejamentoStore;
