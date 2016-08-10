import firebase from 'firebase';
import {dispatch, register} from '../core/dispatcher';
import {EventEmitter} from 'events';
import ActionTypes from '../constants/action-types';
import _ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';

const CHANGE_EVENT = 'change';

let _planejamento = [
  {name: "Moradia", nested:[
    {name: "Aluguel", ammount: 1300}, 
    {name: "Energia"},
    {name: "NET"}
  ]},
  {name: "Carro", nested:[
    {name: "Financiamento"},
    {name: "Licenciamento"}
  ]},
];

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
      default:
      // Do nothing
    }
  })

});

function addCategoria(parent, categoria){
  if(parent.nested){
      parent.nested.push(categoria);
  }else{
      parent.nested = [categoria];
  }
  
  PlanejamentoStore.emitChange();
}


export default PlanejamentoStore;
