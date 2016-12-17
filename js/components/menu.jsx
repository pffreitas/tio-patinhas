import React from 'react';
import {Link} from 'react-router';
import {User} from '../components';

class Menu extends React.Component{
	

	render(){
		return(
        <div className="sv-row tp-menu">
          <div className="sv-column">
            <ul>
              <li><Link to="/plan">Planejamento</Link></li>
              <li><Link to="/">Lançamento</Link></li>
              <li><Link to="/acompanhamento">Acompanhamento</Link></li>
            </ul>
          </div>
          <div className="sv-column sv-text-right">
            <User />
          </div>
        </div>
		);
	}

}

export default Menu;