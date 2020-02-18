import React, {Component} from 'react';
import {logIn} from '../action-creators/authActionCreator';
import {connect} from 'react-redux';

class Login extends Component {

    state = {
        email:  "",
        password: "",
    };

    componentDidUpdate(){
        console.log(this.props.loggedIn)
    }

    updateInputValue = (event) =>{
        this.setState({
            [event.target.className]: event.target.value
        });
    };


    submit = (event) =>{
        event.preventDefault();
        let credentials = {email: this.state.email, password: this.state.password};
        this.props.logIn(credentials);
    };


    render() {
        return (
            <div>
                <form>
                    <input placeholder="E-mail" value={this.state.email} onChange={this.updateInputValue} className="email"/>
                    <input placeholder="Password" value={this.state.password} onChange={this.updateInputValue} className="password"/>
                    <button onClick={this.submit}>Confirm</button>
                </form>
            </div>
        )
    }
}

//Ensures reception of the properties from React-Redux Store in props
const mapStateToProps = state => ({
    loggedIn: state.loggedIn
});

//Ensures reception of the functions from actionCreators in props
const mapDispatchToProps = (dispatch) => ({
    logIn : (credentials) => {
        dispatch(logIn(credentials))
    }
});

//Connects the component to React-Redux Store
export default connect(mapStateToProps, mapDispatchToProps)(Login);