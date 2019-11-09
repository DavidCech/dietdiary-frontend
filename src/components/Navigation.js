import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';

class Navigation extends Component {

    render(){
        let secret = localStorage.getItem('logged') ? "block" : "none";
        return(
            <div>
                <NavLink to="/login"> Login </NavLink>
                <NavLink to="/register"> Register </NavLink>
                <NavLink to="/user" style={{display: secret}}> User Information </NavLink>
                <NavLink to="/createFood" style={{display: secret}}> Create food </NavLink>
                <NavLink to="/createDiaryEntry" style={{display: secret}}> Create DiaryEntry </NavLink>
                <NavLink to="/"> Search </NavLink>
            </div>
        )
    }
}

export default Navigation;