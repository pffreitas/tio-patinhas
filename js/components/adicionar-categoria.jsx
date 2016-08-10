import React from 'react';

class AdicionarCategoria extends React.Component {
	
	constructor(){
		super();
		this.state = {
			open: false,
			categoria: {}
		}

		this.open = this.open.bind(this);
		this.adicionar = this.adicionar.bind(this);
	}

	open(){
		this.setState({
			open: !this.state.open,
			categoria: {}
		})
	}

	handleChange(e, propName){
		this.state.categoria[propName] = e.target.value;
	}

	adicionar(){
		this.open();
		this.props.adicionar(this.props.parent, this.state.categoria);
	}

	render(){
		let newCat = "";

		if(this.state.open){
			newCat = (
				<form className="sv-form--inline">
					<div className="sv-container">
						<div className="sv-grid-8">
							<input type="text" className="full" value={this.state.categoria.name} onChange={(e) => {this.handleChange(e, "name")}}/>
						</div>

						<div className="sv-grid-2">
							<input type="text" className="full" value={this.state.categoria.ammount} onChange={(e) => {this.handleChange(e, "ammount")}}/>
						</div>
					</div>

					<div className="sv-container">
						<div className="sv-grid-10">
							<button type="button" className="sv-button primary" onClick={this.adicionar}>Adicionar</button>
							<button type="button" className="sv-button link" onClick={this.open}>Cancelar</button>
						</div>
					</div>
				</form>
			);
		}else{
			newCat = (
				<div className="sv-container">
					<div className="sv-grid-10 tp-cat-list-add" onClick={this.open}></div>
				</div>
			);
		}

		return newCat;
	}

}

export default AdicionarCategoria;