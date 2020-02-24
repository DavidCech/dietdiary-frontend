import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import UserInformation from './UserInformation';
import '../styles/navigation.css';

//This component creates links to the urls at which all the components are located
class Navigation extends Component {

    render() {
        let secret = "none";
        let antiSecret =  "inline-block";
        let loginText = "Přihlásit se";
        let leftMargin = "28.57%";
        if(localStorage.getItem('logged')) {
            secret = "block";
            antiSecret = "none";
            leftMargin="0";
            loginText = "Odhlásit se"
        }

        return (
            <div className="navigation-wrapper">
                <NavLink className="navigation-item" to="/createIngredient" style={{display: secret, left: leftMargin}}> Vytvořit ingredienci </NavLink>
                <NavLink className="navigation-item" to="/createMeal" style={{display: secret, left: leftMargin}}> Vytvořit jídlo </NavLink>
                <NavLink className="navigation-item" to="/createDiaryEntry" style={{display: secret, left: leftMargin}}> Vytvořit zápis dne </NavLink>
                <NavLink className="navigation-item" to="/viewDiaryEntries" style={{display: secret, left: leftMargin}}> Prohlédnout si zápis dne </NavLink>
                <NavLink className="navigation-item" to="/" style={{left: leftMargin}}> Vyhledat jídla </NavLink>
                <NavLink className="navigation-item" to="/login" style={{left: leftMargin}}> {loginText} </NavLink>
                <NavLink className="navigation-item" to="/register" style={{display: antiSecret, left: leftMargin}}> Zaregistrovat se </NavLink>
                <span style={{display: secret}}>{<UserInformation/>}</span>
            </div>
        )
    }
}

export default Navigation;