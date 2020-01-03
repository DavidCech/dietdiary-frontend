import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getAccountInformation} from "../action-creators/userActionCreator";

class UserInformation extends Component {

    componentDidUpdate() {
    }

    render() {
        return (
            <div>
                {this.props.userName + " " + this.props.userEmail}
                <button onClick={this.props.getUserInformation}>Click me</button>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    userName: state.userName,
    userEmail: state.email,
});

const mapDispatchToProps = dispatch => ({
    getUserInformation: () => {
        dispatch(getAccountInformation());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(UserInformation);