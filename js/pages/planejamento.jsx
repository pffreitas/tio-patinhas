import React from 'react';

import {PlanejamentoStore} from '../store';
import {ClientActions} from '../actions';
import AdicionarCategoria from '../components/adicionar-categoria.jsx';
import accounting from 'accounting';
import classnames from 'classnames';
import _ from 'lodash';

class PlanejamentoPage extends React.Component{
	
	constructor(){
		super();
		this.state = {
			planejamento: PlanejamentoStore.getPlanejamento(),
			categoria: {}
		}

		ClientActions.fetchPlanejamento();

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

	addCategoria(cat){
		ClientActions.addCategoria(cat);
	}

	currentRow(cat){
		let catId = null;
		if(cat){
			catId = cat.id;
		}
		
		this.setState({
			hoveredRow: catId
		});
	}

	dragstart(e, parent, cat){
		e.dataTransfer.effectAllowed = 'move';

		this.setState({
			currentDragOver: {parent: parent, cat: cat}
		});
	}

	drop(e, targetParent, targetCat, type){

		if (e.stopPropagation) {
			e.stopPropagation();
		}

		let currentCat = this.state.currentDragOver;

		if(type === "nested"){
			if(!targetCat.nested){
				targetCat.nested = [];
			}

			targetCat.nested.push(currentCat.cat);
			_.remove(currentCat.parent.nested, currentCat.cat);
		}else if(type === "sibling"){

			if(targetParent.id != currentCat.parent.id){
				targetParent.nested.push(currentCat.cat);
				_.remove(currentCat.parent.nested, currentCat.cat);
			}
		}
		
		ClientActions.savePlanejamento(this.state.planejamento);

	}

	allowDrop(e){
		e.preventDefault();
	}

	dragenter(e){
		e.target.classList.add("dz-over");
	}

	dragexit(e){
		e.target.classList.remove("dz-over");
	}

	dragend(e){
	}

	catList(parent, cats){
		if(!cats){
			return;
		}

		return cats.map((cat, i)=> {
			let classes = classnames("fa fa-bars", {"sv-hidden": this.state.hoveredRow != cat.id})

			return(
				<li key={`key-${cat.id}`}>

					<div className="sv-container cat" 
						draggable="true"
						onMouseOver={(e) => {this.currentRow(cat)}} 
						onMouseOut={(e) => {this.currentRow()}}
						onDragStart={(e) => {this.dragstart(e, parent, cat)}}>
						<div className="sv-grid-10">
							<div className="drag">
								<i className={classes}></i>
							</div>
							<p>{cat.name}</p>
						</div>
						<div className="sv-grid-2 sv-text-right">{accounting.formatMoney(cat.ammount, 'R$', 2, '.', ',')}</div>
					</div>

					<div className="dz sibling" onDrop={(e) => {this.drop(e, parent, cat, 'sibling')}} onDragEnter={this.dragenter} onDragLeave={this.dragexit} onDragOver={this.allowDrop} onDragEnd={this.dragend}></div>
					
					<ul className="tp-cat-list">
						<li>
							<div className="dz nested" onDrop={(e) => {this.drop(e, parent, cat, 'nested')}} onDragEnter={this.dragenter} onDragLeave={this.dragexit} onDragOver={this.allowDrop} onDragEnd={this.dragend}></div>
						</li>

						{this.catList(cat, cat.nested)}
					</ul>
				</li>
			);
		});
	}

	render(){
		let root = {id: "root", name: "Root", nested: this.state.planejamento};
		let categorias = this.catList(root, root.nested);

		return(
			<div>
				<h2 className="thin">Planejamento</h2>
				<div>
					<ul className="tp-cat-list">
						{categorias}
					</ul>
				</div>

				<AdicionarCategoria adicionar={this.addCategoria} />
			</div>
		);
	}


}

export default PlanejamentoPage;