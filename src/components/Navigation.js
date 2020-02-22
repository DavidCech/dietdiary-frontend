import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';

//This component creates links to the urls at which all the components are located
class Navigation extends Component {

    render() {
        let secret = localStorage.getItem('logged') ? "block" : "none";
        return (
            <div>
                <NavLink to="/login"> Login </NavLink>
                <NavLink to="/register"> Register </NavLink>
                <NavLink to="/user" style={{display: secret}}> User Information </NavLink>
                <NavLink to="/createIngredient" style={{display: secret}}> Create Ingredient </NavLink>
                <NavLink to="/createMeal" style={{display: secret}}> Create Meal </NavLink>
                <NavLink to="/createDiaryEntry" style={{display: secret}}> Create DiaryEntry </NavLink>
                <NavLink to="/viewDiaryEntries" style={{display: secret}}> View DiaryEntries </NavLink>
                <NavLink to="/"> Search </NavLink>
            </div>
        )
    }
}

export default Navigation;