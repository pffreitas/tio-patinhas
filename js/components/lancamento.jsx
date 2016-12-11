import React from 'react';
import ReactDOM from 'react-dom';
import {LancamentosStore, PlanejamentoStore, ConfigStore} from '../store';
import {ClientActions} from '../actions';
import classnames  from 'classnames';
import Categoria from './categoria.jsx';
import MeioPagamento from './meio-pagamento.jsx';

import moment from 'moment';
import accounting from 'accounting';

class Lancamento extends React.Component{

  constructor(){
    super();
    this.state = {
      lancamentos:  LancamentosStore.getLancamentos(),
      planejamento: PlanejamentoStore.getPlanejamento(),
      config: ConfigStore.getConfig()
    }

    ClientActions.fetchLancamentos();
    ClientActions.fetchPlanejamento();
    ClientActions.fetchConfig();

    this._onChange = this._onChange.bind(this);
  }

  _onChange(){
    let cats = [];
    this._flat(null, null, PlanejamentoStore.getPlanejamento(), cats);

    this.setState({
      lancamentos: LancamentosStore.getLancamentos(),
      planejamento: cats,
      config: ConfigStore.getConfig()
    });
  }

  handlePaste(e){
    e.preventDefault();
    var data = (e.originalEvent || e).clipboardData;
    let html = data.getData("text/html");

    let document = new DOMParser().parseFromString(html, 'text/html');
    let trs = Array.from(document.getElementsByTagName("tr"));
    let rows = trs.map((tr) => {
      let tds = Array .from(tr.getElementsByTagName("td"));
      return tds.map((td) => {
        return td.textContent;
      });
    });

    ClientActions.addLancamentos(rows);
  }

  _flat(parent, group, nested, cats){
    nested.forEach((c) => {
      if(c.nested && c.nested.length > 0){

        let groupName = c.name;
        if (parent != null){
          groupName = parent.name + "/" + c.name;
        }

        this._flat(parent, groupName, c.nested, cats);
      }else{
        cats.push({id: c.id, name: c.name, group: group}); 
      }
    })
  }

  componentDidMount(){
    window.addEventListener("paste", this.handlePaste);
    LancamentosStore.addChangeListener(this._onChange);
    PlanejamentoStore.addChangeListener(this._onChange);
    ConfigStore.addChangeListener(this._onChange);
  }

  componentWillUnmount(){
    window.removeEventListener("paste", this.handlePaste);
    LancamentosStore.removeChangeListener(this._onChange);
    ConfigStore.removeChangeListener(this._onChange);
  }

  setCategoria(lancamentoId, catId){
    ClientActions.setCategoria(lancamentoId, catId);
  }

  setMeioPagamento(lancamentoId, mpId){
    ClientActions.setMeioPagamento(lancamentoId, mpId);
  }

  render(){
    let lancamentos = this.state.lancamentos.map((l) => {
      return (
        <tr key={`key-${l.key}`}>
          <td>{moment(l.data).format("DD/MM/YYYY")}</td>
          <td>{l.descricao}</td>
          <td>
            <Categoria value={l.categoria} categorias={this.state.planejamento} onChange={ (cId)=> {this.setCategoria(l.key, cId)}} />
          </td>
          <td>
            <MeioPagamento value={l.meioPagamento} meiosPagamento={this.state.config.meio_pagamento} onChange={ (mpId)=> {this.setMeioPagamento(l.key, mpId)}} />
          </td>
          <td className="currency">{accounting.formatMoney(l.valor, 'R$', 2, '.', ',')}</td>
        </tr>
      );
    })

    return(
      <div>
        <table className="sv-table tp-lanc-table">
          <thead>
            <tr>
              <th className="lancamento-data-col">Data</th>
              <th className="lancamento-descricao-col">Descrição</th>
              <th className="lancamento-categoria-col">Categoria</th>
              <th className="lancamento-meio-pagamento-col">Meio de Pagamento</th>
              <th className="currency lancamento-valor-col">Valor</th>
            </tr>
          </thead>
          <tbody>
            {lancamentos}
          </tbody>
        </table>

        <div contentEditable="true"></div>
      </div>
    );
  }

}


export default Lancamento
