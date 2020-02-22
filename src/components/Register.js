import React, {Component} from 'react';
import {register} from '../action-creators/authActionCreator';
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
        if(this.state.password!=="" && this.state.repassword!=="" && this.state.password===this.state.repassword && this.state.username!=="" && this.state.email!==""){
            let credentials = {
                email: this.state.email,
                password: this.state.password,
                repassword: this.state.repassword,
                username: this.state.username
            };
            this.props.register(credentials);
        }
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
                    <button onClick={this.handleSubmit}>Confirm</button>
                </form>
            </div>
        )
    }
}

//Ensures reception of the functions from actionCreators in props
const mapDispatchToProps = (dispatch) => ({
    register: (credentials) => {
        dispatch(register(credentials))
    }
});

//Connects the component to React-Redux Store
export default connect(null, mapDispatchToProps)(Register);