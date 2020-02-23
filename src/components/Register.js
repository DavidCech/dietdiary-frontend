import React, {Component} from 'react';
import {register, registerCleanUp} from '../action-creators/authActionCreator';
import {connect} from 'react-redux';

//This component serves as a form for creating new accounts in the database
class Register extends Component {

    //Initializes functions
    constructor(props) {
        super(props);

        this.updateInputValue = this.updateInputValue.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //Initializes state property of the component
    state = {
        email: "",
        username: "",
        password: "",
        repassword: "",
        inputError: ""
    };

    //Updates properties of state with the data from the input
    updateInputValue = (event) => {
        this.setState({
            [event.target.className]: event.target.value
        });
    };

    //Checks whether the user submitted all the required account details and if so calls register function from
    //authActionCreator with the submitted account details
    handleSubmit = (event) => {
        event.preventDefault();
        //Regular expression for validating email address
        //eslint-disable-next-line
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (this.state.password !== "" && this.state.repassword !== "" && this.state.password === this.state.repassword
            && this.state.username !== "" && this.state.email !== "" && re.test(String(this.state.email))) {
            let credentials = {
                email: this.state.email,
                password: this.state.password,
                repassword: this.state.repassword,
                username: this.state.username
            };
            this.props.register(credentials);
            this.setState({inputError: ""})
        } else {
            this.setState({inputError: "Špatné údaje: musíte vyplnit nezabrané uživatelské jméno, nezabranou validní" +
                    " emialovou adresu a hesla se musí shodovat"})
        }
    };

    //Cleans the message from Redux Store whenever the component dismounts
    componentWillUnmount() {
        if (this.props.registerCleanUp) {
            this.props.registerCleanUp()
        }
    }

    render() {
        //Changes the render from form to message about the outcome after the user submits credentials
        let displayForm = "block";
        let displayMess = "none";
        let messageText;
        if (this.props.registerMessage) {
            if (this.props.registerMessage !== "") {
                messageText = this.props.registerMessage;
                displayForm = "none";
                displayMess = "block";
            }
        } else if (this.state.inputError!==""){
            messageText = this.state.inputError;
            displayMess = "block";
        }

        return (
            <div className="register-wrapper">
                <div className="register-from-wrapper" style={{display: displayForm}}>
                    <form>
                        <input placeholder="E-mail" value={this.state.email} onChange={this.updateInputValue}
                               className="email"/>
                        <input placeholder="Uživatelské jméno" value={this.state.username} onChange={this.updateInputValue}
                               className="username"/>
                        <input placeholder="Heslo" value={this.state.password} onChange={this.updateInputValue}
                               className="password"/>
                        <input placeholder="Heslo znovu" value={this.state.repassword}
                               onChange={this.updateInputValue}
                               className="repassword"/>
                        <button onClick={this.handleSubmit}>Confirm</button>
                    </form>
                </div>
                <span className="register-message" style={{display: displayMess}}>{messageText}</span>
            </div>
        )
    }
}

//Ensures reception of the functions from actionCreators in props
const mapDispatchToProps = (dispatch) => ({
    register: (credentials) => {
        dispatch(register(credentials))
    },
    registerCleanUp: () => {
        dispatch(registerCleanUp())
    }
});

//Ensures reception of the properties from React-Redux Store in props
const mapStateToProps = state => ({
    registerMessage: state.authReducer.registerMessage,
});

//Connects the component to React-Redux Store
export default connect(mapStateToProps, mapDispatchToProps)(Register);