import { dispatch, register } from '../core/dispatcher';
import ActionTypes from '../constants/action-types';

export default {

  fetchLancamentos() {
    dispatch({
      type: ActionTypes.FETCH_LANCAMENTOS
    });
  },

  fetchPlanejamento() {
    dispatch({
      type: ActionTypes.FETCH_PLANEJAMENTO
    });
  },

  savePlanejamento(planejamento) {
    dispatch({
      type: ActionTypes.SAVE_PLANEJAMENTO,
      planejamento: planejamento
    });
  },

  setCategoriaCorrente(categoria) {
    dispatch({
      type: ActionTypes.SET_CATEGORIA_CORRENTE,
      categoriaCorrente: categoria
    });
  },

  setMesCorrente(mes) {
    dispatch({
      type: ActionTypes.SET_MES_CORRENTE,
      mesCorrente: mes
    });
  },

  addLancamentos(lancamentos) {
    dispatch({
      type: ActionTypes.ADD_LANCAMENTOS,
      lancamentos: lancamentos
    });
  },

  addCategoria(categoria){
    dispatch({
      type: ActionTypes.ADD_CATEGORIA,
      categoria: categoria
    });
  },

  setCategoria(lancamento, categoria){
    dispatch({
      type: ActionTypes.SET_CATEGORIA,
      lancamento: lancamento,
      categoria: categoria
    });
  },


  fetchConfig() {
    dispatch({
      type: ActionTypes.FETCH_CONFIG
    });
  },

  setMeioPagamento(lancamento, meioPagamento){
    dispatch({
      type: ActionTypes.SET_MEIO_PAGAMENTO,
      lancamento: lancamento,
      meioPagamento: meioPagamento
    });
  },

  fetchAcompanhamento() {
    dispatch({
      type: ActionTypes.FETCH_ACOMPANHAMENTO
    });
  }  
  
};
