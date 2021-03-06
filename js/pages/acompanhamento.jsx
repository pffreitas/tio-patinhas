import React from 'react';
import {AcompanhamentoStore} from '../store';
import {ClientActions} from '../actions';
import accounting from 'accounting';

class AcompanhamentoPage extends React.Component{
	
	
	constructor(){
		super();

		this.state = {
			topCategorias: []
		}

		ClientActions.fetchAcompanhamento();

		this._onChange = this._onChange.bind(this);
	}

	_onChange(){
		this.setState({
		  topCategorias: AcompanhamentoStore.getTopCategorias()
		});
	}

	componentDidMount(){
		AcompanhamentoStore.addChangeListener(this._onChange);
	}

	componentWillUnmount(){
		AcompanhamentoStore.removeChangeListener(this._onChange);
	}

	render(){
		let topCategoriaCards = this.state.topCategorias.map((v, k) => {
			return (
				<div className="sv-column sv-card cat-card" key={`key-${k}`}>
					<header>
						<h4>{v.categoria}</h4>
					</header>
					<main>
						<p>{accounting.formatMoney(v.valor, 'R$', 2, '.', ',')}</p>
					</main>
				</div>
			);
		});

		return (
			<div>
				<h2 className="thin page-title">Acompanhamento</h2>

				<section>
					<h3 className="thin section-title">Categorias</h3>
					<div className="sv-row">
					{topCategoriaCards}
					</div>
				</section>
			</div>
		);
	}
}

export default AcompanhamentoPage;