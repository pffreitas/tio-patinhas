import React from 'react';
import {User} from '../components';

class Template extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
          <div>
            <header>
              <User />
            </header>
            <section className='sv-container-horizontal'>
              {this.props.children}
            </section>
          </div>
        );
    }

}

export default Template;
