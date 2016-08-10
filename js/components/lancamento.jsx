import React from 'react';
import ReactDOM from 'react-dom';
import {LancamentosStore} from '../store';
import {ClientActions} from '../actions';

import moment from 'moment';
import accounting from 'accounting';

class Lancamento extends React.Component{

  constructor(){
    super();
    this.state = {
      lancamentos:  []
    }

    this._onChange = this._onChange.bind(this);
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

  _onChange(){
    this.setState({
      lancamentos: LancamentosStore.getLancamentos()
    });
  }

  componentDidMount(){
    window.addEventListener("paste", this.handlePaste);
    LancamentosStore.addChangeListener(this._onChange);
  }

  componentWillUnmount(){
    window.removeEventListener("paste", this.handlePaste);
    LancamentosStore.removeChangeListener(this._onChange);
  }

  render(){
    let lancamentos = this.state.lancamentos.map((l, i) => {
      return (
        <tr key={`key-${i}`}>
          <td>{moment(l.data).format("DD/MM/YYYY")}</td>
          <td>{l.descricao}</td>
          <td>{accounting.formatMoney(l.valor, 'R$', 2, '.', ',')}</td>
        </tr>
      );
    })

    return(
      <div>
        <table className="sv-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Valor</th>
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
