import {dispatch, register} from '../core/dispatcher';
import {EventEmitter} from 'events';
import ActionTypes from '../constants/action-types';
import SheetApi from '../api/sheet.api';
import _ from 'lodash';

const CHANGE_EVENT = 'change';

let _categoriaCorrente = null;
let _mesCorrente = null;

var SheetStore = Object.assign({}, EventEmitter.prototype, {

  emitChange(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback){
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback){
    this.removeListener(CHANGE_EVENT, callback);
  },

  setCategoriaCorrente(categoriaCorrente){
    _categoriaCorrente = categoriaCorrente
  },

  getCategoriaCorrente(){
    return _categoriaCorrente;
  },

  setMesCorrente(mesCorrente){
    _mesCorrente = mesCorrente
  },

  getSaidas() {
    return SheetApi.getSaidas();
  },

  getPlanejamento() {
    return SheetApi.getPlanejamento();
  },

  getCategorias(){
    return _.uniqBy(this.getSaidas(), 'categoria');
  },

  getSaidasPorCategoria(){
    return _.filter(this.getSaidas(), {categoria: _categoriaCorrente, mes_ano: _mesCorrente});
  },

  getTotalPorCategoria(categoria){
    return _.chain(this.getSaidas())
            .filter({'categoria': categoria, 'mes_ano': _mesCorrente})
            .sumBy('valor')
            .value();
  },

  dispatcherIndex: register(function (action) {
    switch (action.type) {

      case ActionTypes.FETCH:
        SheetApi.fetchSaidas();
        SheetStore.emitChange();
        break;

      case ActionTypes.FETCH_PLANEJAMENTO:
        SheetApi.fetchPlanejamento();
        SheetStore.emitChange();
        break;

      case ActionTypes.FETCHED:
        SheetStore.emitChange();
        break;

      case ActionTypes.SET_CATEGORIA_CORRENTE:
        SheetStore.setCategoriaCorrente(action.categoriaCorrente);
        SheetStore.emitChange();
        break;

      case ActionTypes.SET_MES_CORRENTE:
        SheetStore.setMesCorrente(action.mesCorrente);
        SheetStore.emitChange();
        break;

      default:
      // Do nothing
    }
  })

});

export default SheetStore;
