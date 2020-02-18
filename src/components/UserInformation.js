import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getAccountInformation} from "../action-creators/userActionCreator";

//This component shows information about the user that is currently logged in
class UserInformation extends Component {

    render() {
        return (
            <div>
                {this.props.userName + " " + this.props.userEmail}
                <button onClick={this.props.getUserInformation}>Click me</button>
            </div>
        )
    }
}

//Ensures reception of the properties from React-Redux Store in props
const mapStateToProps = state => ({
    userName: state.userName,
    userEmail: state.email,
});

//Ensures reception of the functions from actionCreators in props
const mapDispatchToProps = dispatch => ({
    getUserInformation: () => {
        dispatch(getAccountInformation());
    }
});

//Connects the component to React-Redux Store
export default connect(mapStateToProps, mapDispatchToProps)(UserInformation);