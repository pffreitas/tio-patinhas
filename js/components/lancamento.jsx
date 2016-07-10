import React from 'react';
import ReactDOM from 'react-dom';
import {LancamentosStore} from '../store';
import {ClientActions} from '../actions';
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
    ReactDOM.findDOMNode(this).addEventListener("paste", this.handlePaste);
    LancamentosStore.addChangeListener(this._onChange);
  }

  componentWillUnmount(){
    ReactDOM.findDOMNode(this).removeEventListener("paste", this.handlePaste);
    LancamentosStore.removeChangeListener(this._onChange);
  }

  render(){
    let lancamentos = this.state.lancamentos.map((l, i) => {
      return (
        <li key={`key-${i}`}>
          <span>{l.data}</span>
          <span>{l.descricao}</span>
          <span>{l.valor}</span>
        </li>
      );
    })

    return(
      <div>
        <div contentEditable="true">
        </div>

        <ul>
          {lancamentos}
        </ul>
      </div>
    );
  }

}


export default Lancamento
