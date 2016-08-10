import React from 'react';

import {PlanejamentoStore} from '../store';
import {ClientActions} from '../actions';
import AdicionarCategoria from '../components/adicionar-categoria.jsx';
import accounting from 'accounting';

class PlanejamentoPage extends React.Component{
	
	constructor(){
		super();
		this.state = {
			planejamento: PlanejamentoStore.getPlanejamento(),
			categoria: {}
		}

		this._onChange = this._onChange.bind(this);
		this.addCategoria = this.addCategoria.bind(this);
	}

	_onChange(){
		this.setState({
		  planejamento: PlanejamentoStore.getPlanejamento()
		});
	}

	componentDidMount(){
		PlanejamentoStore.addChangeListener(this._onChange);
	}

	componentWillUnmount(){
		PlanejamentoStore.removeChangeListener(this._onChange);
	}

	addCategoria(parent, cat){
		ClientActions.addCategoria(parent, cat);
	}

	catList(cats){
		if(!cats){
			return;
		}

		return cats.map((cat, i)=> {
			return(
				<ul className="tp-cat-list">
					<li>
						<div className="sv-container">
							<div className="sv-grid-8">{cat.name}</div>
							<div className="sv-grid-2 sv-text-right">{accounting.formatMoney(cat.ammount, 'R$', 2, '.', ',')}</div>
						</div>
						
						<AdicionarCategoria adicionar={this.addCategoria} parent={cat} />
						
						{this.catList(cat.nested)}
					</li>
				</ul>
			);
		});
	}

	render(){
		let categorias = this.catList(this.state.planejamento);

		return(
			<div>
				<h2 className="thin">Planejamento</h2>
				<div>
				{categorias}
				</div>
			</div>
		);
	}


}

export default PlanejamentoPage;