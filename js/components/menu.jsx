import React from 'react';
import {Link} from 'react-router';
import {User} from '../components';

class Menu extends React.Component{
	

	render(){
		return(
        <div className="sv-container tp-menu">
          <div className="sv-grid-8 sv-grid-1-offset">
            <ul>
              <li><Link to="/plan">Planejamento</Link></li>
              <li><Link to="/">Lançamento</Link></li>
              <li><Link to="/acompanhamento">Acompanhamento</Link></li>
            </ul>
          </div>
          <div className="sv-grid-2 sv-text-right">
            <User />
          </div>
        </div>
		);
	}

}

export default Menu;