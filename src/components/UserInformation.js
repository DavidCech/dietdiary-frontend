import React, {Component} from 'react';

//This component shows information about the user that is currently logged in
class UserInformation extends Component {

    render() {
        let content = localStorage.getItem('logged') ? localStorage.getItem('email') + " " + localStorage.getItem('username') : "";
        return (
            <div>
                {content}
            </div>
        )
    }
}

export default UserInformation;