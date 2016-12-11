import React from 'react';
import {LancamentosStore, PlanejamentoStore} from '../store';
import {ClientActions} from '../actions';
import _ from 'lodash';

class Categoria extends React.Component{
	
	constructor(){
		super();

		this.selectedValue = this.selectedValue.bind(this);
	}

	selectedValue(e){
		this.props.onChange(e.target.value);
	}

	render(){
		let grouped = _.groupBy(this.props.categorias, 'group');

		let optgroup = _.map(grouped, (val, key) => {
			let options = val.map((c) => {
				return (
					<option key={`key-${c.id}`} value={c.id}>
						{c.name}
					</option>
				)
			});

			return (
				<optgroup key={`key-${key}`} label={key}>
					{options}
				</optgroup>
			);
		})

		return (
			<form className="sv-form">
				<label>
						<select className="full" onChange={this.selectedValue} value={this.props.value}>
							<option value="">Please, select</option>
							{optgroup}
						</select>
				</label>
			</form>
		);
	}
}

export default Categoria;