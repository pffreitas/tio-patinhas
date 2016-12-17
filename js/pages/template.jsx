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

            <div className="sv-row">
              <div className="sv-column">
                {this.props.children}
              </div>
            </div>
          </div>
        );
    }

}

export default Template;
