import React from 'react';
import {ClientActions} from '../actions';
import firebase from 'firebase';
import Lancamento from '../components/lancamento.jsx';


class HomePage extends React.Component{

  constructor(props){
    super(props);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  _onChange() {
    this.setState({});
  }

  render(){
    return(
      <div>
        <h2 className="thin page-title">Lançamento</h2>
        <div>
          <Lancamento />
        </div>
      </div>
    );
  }

}

export default HomePage;
