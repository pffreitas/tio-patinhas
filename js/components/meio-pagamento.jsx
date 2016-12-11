import React from 'react';

class MeioPagamento extends React.Component{
	
	constructor(){
		super();

		this.selectedValue = this.selectedValue.bind(this);
	}

	selectedValue(e){
		this.props.onChange(e.target.value);
	}

	render(){
		let options = null;

		if(this.props.meiosPagamento){
			options = this.props.meiosPagamento.map((mp, key) => {
				return (
					<option key={`key-${mp.id}`} value={mp.id}>
						{mp.name}
					</option>
				);
			});
		}

		return (
			<form className="sv-form">
				<label>
						<select className="full" onChange={this.selectedValue} value={this.props.value}>
							<option value="">Please, select</option>
							{options}
						</select>
				</label>
			</form>
		);
	}

}


export default MeioPagamento; 