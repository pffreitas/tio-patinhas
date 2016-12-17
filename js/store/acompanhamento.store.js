import firebase from 'firebase';
import {dispatch, register} from '../core/dispatcher';
import {EventEmitter} from 'events';
import ActionTypes from '../constants/action-types';
import _ from 'lodash';
import moment from 'moment';
import {database} from '../database';

const CHANGE_EVENT = 'change';

let _topCategorias = [];


var AcompanhamentoStore = Object.assign({}, EventEmitter.prototype, {

  getTopCategorias(){
    return _topCategorias;
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
      case ActionTypes.FETCH_ACOMPANHAMENTO:
        fetchAcompanhamento();
        break;
      default:
      // Do nothing
    }
  })

});


function fetchAcompanhamento(){
  let start = moment().startOf("month").utc().format();
  let end = moment().endOf("month").utc().format();

  _topCategorias = [];

  firebase.database()
  .ref('lancamentos')
  .orderByChild("data")
  .startAt(start)
  .endAt(end)
  .once("value").then((snapshot)=> {

    let _lancamentos = snapshot.val();

    _.chain(_lancamentos)
     .groupBy("categoria")
     .map((v, k) => {
        return {categoria: k, valor: _.sumBy(v, "valor")}  
      })
     .orderBy(["valor"], ["desc"])
     .slice(0, 4)
     .map((cat) => {
        database.planejamento.findCategoriaById(cat.categoria, (c) => {
          _topCategorias.push({categoria: c.name, valor: cat.valor});
          AcompanhamentoStore.emitChange();
        });
     })
     .value();

  });
}

export default AcompanhamentoStore;
