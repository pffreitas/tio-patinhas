import { dispatch, register } from '../core/dispatcher';
import ActionTypes from '../constants/action-types';

export default {

  getSaidas() {
    dispatch({
      type: ActionTypes.FETCH
    });
  },

  fetchPlanejamento() {
    dispatch({
      type: ActionTypes.FETCH_PLANEJAMENTO
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
  }
  
};
