import React from 'react';
import {Link} from 'react-router';

class Menu extends React.Component{
	

	render(){
		return(
			<div className="sv-container tp-menu">
              <div className="sv-grid-10 sv-grid-1-offset">
                <ul>
                  <li><Link to="/plan">Planejamento</Link></li>
                  <li><Link to="/">Lançamento</Link></li>
                  <li><Link to="/acompanhamento">Acompanhamento</Link></li>
                </ul>
              </div>
            </div>
		);
	}

}

export default Menu;