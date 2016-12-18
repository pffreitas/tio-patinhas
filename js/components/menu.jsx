import React from 'react';
import {Link} from 'react-router';
import {User} from '../components';
import Hamburguer from './hamburguer.jsx';

class Menu extends React.Component{
	
  constructor(){
    super();

    this.state = {
      menu: this.getMenuType(window.innerWidth)
    }

    this._onWindowResize = this._onWindowResize.bind(this);
    window.addEventListener("resize", this._onWindowResize);
  }

  getMenuType(width){
    if(width <= 735){
      return "HAMB";
    }else{
      return "REGULAR";
    }
  }

  _onWindowResize(e){
    let width = (e.srcElement || e.currentTarget).innerWidth;

    this.setState({
      menu: this.getMenuType(width)
    });
  }

	render(){
    let regular = (
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

    let menu = regular;
    if(this.state.menu === "HAMB"){
      menu = <Hamburguer toggle={this.props.toggle} opened={this.props.opened} />;
    }

		return menu;
	}

}

export default Menu;