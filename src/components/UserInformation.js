import React, {Component} from 'react';

//This component shows information about the user that is currently logged in
class UserInformation extends Component {

    render() {
        let content = localStorage.getItem('logged') ? <p className="user-information-p">{localStorage.getItem('email')}</p> : "";
        return (
            <div>
                {content}
            </div>
        )
    }
}

export default UserInformation;