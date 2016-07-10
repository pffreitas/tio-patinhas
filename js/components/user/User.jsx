import React from 'react';
import {UserStore} from '../../store';
import {UserActions} from '../../actions';

class User extends React.Component{

  constructor(props) {
      super(props);

      this.state = {
        user: {}
      }

      this._onChange = this._onChange.bind(this);
  }

  componentDidMount(){
    UserStore.addChangeListener(this._onChange);
  }

  componentWillUnmount(){
    UserStore.removeChangeListener(this._onChange);
  }

  _onChange(){
    this.setState({
      user: UserStore.getCurrentUser()
    });
  }

  render(){
    let signout = <p></p>
    if(this.state.user){
      signout = <p><a onClick={() => {UserActions.logout()}}>Logout</a></p>
    }

    return (
      <div>
      <img src={this.state.user.photoURL} ></img>
      {this.state.user.displayName}
      {signout}
      </div>
    );
  }

}

export default User;
