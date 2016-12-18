import React from 'react';
import {Link} from 'react-router';
import {User} from '../components';

class Hamburguer extends React.Component{
	
	render(){
		let hambar = (
			<div className="hamb-bar">
				<i className="fa fa-bars" onClick={this.props.toggle} />
			</div>
		);

		let hamb = (
			<div className="hamb">
				<div>
				  <ul>
		            <li><Link to="/plan" onClick={this.props.toggle}>Planejamento</Link></li>
		            <li><Link to="/" onClick={this.props.toggle}>Lançamento</Link></li>
		            <li><Link to="/acompanhamento" onClick={this.props.toggle}>Acompanhamento</Link></li>
		          </ul>
				</div>
			</div>
		);

		return (
			<div>
				{hamb}
				{hambar}
			</div>
		);	
	}

}

export default Hamburguer;