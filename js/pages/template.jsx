import React from 'react';
import {User} from '../components';
import {Menu} from '../components';

class Template extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
          <div>
            <Menu />
            {this.props.children}
          </div>
        );
    }

}

export default Template;
