import React from 'react';
import {User} from '../components';
import {Menu} from '../components';
import classnames from 'classnames';

class Template extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            opened: false
        }

        this.toggle = this.toggle.bind(this);
    }

    toggle(){
        this.setState({
            opened: !this.state.opened
        })
    }

    render() {
        let wrapperClasses = classnames("wrapper", {"show-menu": this.state.opened});

        return (
            <div className={wrapperClasses}>
                <div className="canvas">
                    <Menu toggle={this.toggle} opened={this.state.opened} />
                    <div className="conteudo">
                    {this.props.children}
                    </div>
                </div>
            </div>
        );
    }

}

export default Template;
