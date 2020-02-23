import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import UserInformation from './UserInformation';
import '../styles/navigation.css'

//This component creates links to the urls at which all the components are located
class Navigation extends Component {

    render() {
        let secret = "none";
        let antiSecret =  "block";
        let loginText = "Přihlásit se";
        if(localStorage.getItem('logged')) {
            secret = "block";
            antiSecret = "none";
            loginText = "Odhlásit se"
        }

        return (
            <div className="navigation-wrapper">
                <NavLink className="navigation-item" to="/createIngredient" style={{display: secret}}> Vytvořit ingredienci </NavLink>
                <NavLink className="navigation-item" to="/createMeal" style={{display: secret}}> Vytvořit jídlo </NavLink>
                <NavLink className="navigation-item" to="/createDiaryEntry" style={{display: secret}}> Vytvořit zápis dne </NavLink>
                <NavLink className="navigation-item" to="/viewDiaryEntries" style={{display: secret}}> Prohlédnout si zápis dne </NavLink>
                <NavLink className="navigation-item" to="/"> Vyhledat jídla </NavLink>
                <NavLink className="navigation-item" to="/login"> {loginText} </NavLink>
                <NavLink className="navigation-item" to="/register" style={{display: antiSecret}}> Zaregistrovat se </NavLink>
                <span style={{display: secret}}>{<UserInformation/>}</span>
            </div>
        )
    }
}

export default Navigation;