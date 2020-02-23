import React, {Component} from 'react';
import {logIn, logOut, loginCleanUp} from '../action-creators/authActionCreator';
import {connect} from 'react-redux';

//This component takes care of logging in and out of the users
class Login extends Component {

    //Initializes functions
    constructor(props) {
        super(props);

        this.updateInputValue = this.updateInputValue.bind(this);
        this.submit = this.submit.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    //Initializes state property of the component
    state = {
        email:  "",
        password: "",
    };

    //This function updates properties of the state with data from input fields
    updateInputValue = (event) =>{
        this.setState({
            [event.target.className]: event.target.value
        });
    };


    //This function calls the logIn function from authActionCreator
    submit = (event) =>{
        event.preventDefault();
        let credentials = {email: this.state.email, password: this.state.password};
        this.props.history.push("/");
        this.props.logIn(credentials);
    };

    //This function calls the logOut function from authActionCreator
    logOut = (event) => {
        event.preventDefault();
        if(this.props.logOut){
            this.props.history.push("/");
            this.props.logOut();
        }
    };

    //Clears the login message in Store should the component unmount
    componentWillUnmount(){
        if(this.props.loginCleanUp){
            this.props.loginCleanUp();
        }
    }

    render() {
        //If the user is logged in already this code renders a log out button
        let logOutButton = <button className="log-out" onClick={this.logOut}>Log Out</button>;
        let logOut = localStorage.getItem('logged') ? logOutButton : <div/>;
        return (
            <div>
                <form>
                    <input placeholder="E-mail" value={this.state.email} onChange={this.updateInputValue} className="email"/>
                    <input placeholder="Password" value={this.state.password} onChange={this.updateInputValue} className="password"/>
                    <button onClick={this.submit}>Confirm</button>
                    {logOut}
                </form>
                <span>{this.props.loginMessage}</span>
            </div>
        )
    }
}

//Ensures reception of the properties from React-Redux Store in props
const mapStateToProps = state => ({
    loggedIn: state.authReducer.loggedIn,
    loginMessage: state.authReducer.loginMessage,
});

//Ensures reception of the functions from actionCreators in props
const mapDispatchToProps = (dispatch) => ({
    logIn : (credentials) => {
        dispatch(logIn(credentials))
    },
    logOut: () => {
        dispatch(logOut())
    },
    loginCleanUp: () => {
        dispatch(loginCleanUp())
    }
});

//Connects the component to React-Redux Store
export default connect(mapStateToProps, mapDispatchToProps)(Login);