import React from 'react';
import {ClientActions} from '../actions';
import {SheetStore} from '../store';
import accounting from 'accounting';
import firebase from 'firebase';
import Lancamento from '../components/lancamento.jsx';

class HomePage extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      saidas: SheetStore.getSaidas(),
      categorias: SheetStore.getCategorias(),
      saidasPorCategoria: SheetStore.getSaidasPorCategoria(),
      categoriaCorrente: SheetStore.getCategoriaCorrente(),
      planejamento: SheetStore.getPlanejamento()
    };

    this._onChange = this._onChange.bind(this);

    ClientActions.getSaidas();
    ClientActions.fetchPlanejamento();
  }

  componentDidMount() {
    SheetStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    SheetStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState({
      saidas: SheetStore.getSaidas(),
      categorias: SheetStore.getCategorias(),
      saidasPorCategoria: SheetStore.getSaidasPorCategoria(),
      categoriaCorrente: SheetStore.getCategoriaCorrente(),
      planejamento: SheetStore.getPlanejamento()
    });
  }

  setCategoriaCorrente(categoria){
    ClientActions.setCategoriaCorrente(categoria);
  }

  setMesCorrente(mes){
    ClientActions.setMesCorrente(mes);
  }

  formatMoney(valor){
    return accounting.formatMoney(valor, 'R$', 2, '.', ',')
  }

  render(){
    let meses = ["3/2016", "4/2016", "5/2016", "6/2016", "7/2016"].map((o, k) => {
      return(
        <li key={`item-${k}`}>
          <a href="#" onClick={() => this.setMesCorrente(o)}>{o}</a>
        </li>
      )
    });

    let categorias = this.state.categorias.map((o, k) =>{
      let saidasPorCategoria = null
      if(this.state.categoriaCorrente == o.categoria){
        saidasPorCategoria = this.state.saidasPorCategoria.map((o, k) =>{
          return(
            <li key={`item-${k}`}>
              {o.descricao} - {o.data} - {this.formatMoney(o.valor)}
            </li>
          )
        });
      }
      let totalCategoria = SheetStore.getTotalPorCategoria(o.categoria);
      return(
        <li key={`item-${k}`}>
          <a href="#" onClick={() => this.setCategoriaCorrente(o.categoria)}>{o.categoria} - {this.formatMoney(totalCategoria)}</a>
          <ul>
          {saidasPorCategoria}
          </ul>
        </li>
      )
    });



    return(
      <div>
        <h1>Home</h1>
        <div>
          <Lancamento />
        </div>
        <ul>
          {meses}
        </ul>
        <div>
          <ul>
          {categorias}
          </ul>
        </div>
        </div>
    );
  }

}

export default HomePage;
