import React, {Component} from 'react';
import {register} from '../action-creators/authActionCreator';
import {connect} from 'react-redux';

class Register extends Component {

    state = {
        email: "",
        username: "",
        password: "",
        repassword: "",
    };

    updateInputValue = (event) => {
        this.setState({
            [event.target.className]: event.target.value
        });
    };

    submit = (event) => {
        event.preventDefault();
        let credentials = {email: this.state.email, password: this.state.password, repassword: this.state.repassword, username: this.state.username};
        this.props.register(credentials);
    };

    render() {
        return (
            <div>
                <form>
                    <input placeholder="E-mail" value={this.state.email} onChange={this.updateInputValue}
                           className="email"/>
                    <input placeholder="Username" value={this.state.username} onChange={this.updateInputValue}
                           className="username"/>
                    <input placeholder="Password" value={this.state.password} onChange={this.updateInputValue}
                           className="password"/>
                    <input placeholder="Password again" value={this.state.repassword} onChange={this.updateInputValue}
                           className="repassword"/>
                    <button onClick={this.submit}>Confirm</button>
                </form>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    register: (credentials) => {
        dispatch(register(credentials))
    }
});

export default connect(null, mapDispatchToProps)(Register);