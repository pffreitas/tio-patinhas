import React from 'react';
import ReactDOM from 'react-dom';
import {LancamentosStore} from '../store';
import {ClientActions} from '../actions';
import classnames  from 'classnames';

import moment from 'moment';
import accounting from 'accounting';

class Lancamento extends React.Component{

  constructor(){
    super();
    this.state = {
      lancamentos:  LancamentosStore.getLancamentos()
    }

    ClientActions.fetchLancamentos();

    this._onChange = this._onChange.bind(this);
    this.selectCell = this.selectCell.bind(this);
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

  selectCell(e){
    if(this.state.selectedCell){
      this.state.selectedCell.classList.remove("selected");
    }

    e.target.classList.add("selected");

    this.setState({
      selectedCell: e.target
    });
  }

  render(){


    let lancamentos = this.state.lancamentos.map((l) => {
      return (
        <tr key={`key-${l.key}`}>
          <td onClick={this.selectCell}>{moment(l.data).format("DD/MM/YYYY")}</td>
          <td onClick={this.selectCell}>{l.descricao}</td>
          <td onClick={this.selectCell}>{accounting.formatMoney(l.valor, 'R$', 2, '.', ',')}</td>
        </tr>
      );
    })

    return(
      <div>
        <table className="sv-table tp-lanc-table">
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
