import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import '../styles/navigation.css';

//This component creates links to the urls at which all the components are located
class Navigation extends Component {

    render() {
        //Shows some links only if the user is logged in by changing their css
        let secret = "none";
        let antiSecret = "inline-block";
        let loginText = "Přihlásit se";
        let leftMargin = "28.57%";
        if (localStorage.getItem('logged')) {
            secret = "block";
            antiSecret = "none";
            leftMargin = "0";
            loginText = "Odhlásit se"
        }

        //The link at whose url the user is currently changes color for better clarity of the application
        let paths = ["/", "/login", "/register", "/viewDiaryEntries", "/createDiaryEntry", "/createMeal", "/createIngredient", "/user"];
        let currentUrlDisplay = ["#0400CA", "#0400CA", "#0400CA", "#0400CA", "#0400CA", "#0400CA", "#0400CA", "#0400CA"];
        if (this.props.history) {
            for (let i = 0; i < currentUrlDisplay.length; i++) {
                if (this.props.history.location.pathname === paths[i]) {

                    currentUrlDisplay[i] = "#030144";
                } else {
                    currentUrlDisplay[i] = "#0400CA";
                }
            }
        }

        return (
            <div className="navigation-wrapper">
                <NavLink className="navigation-item" to="/createIngredient"
                         style={{display: secret, left: leftMargin, backgroundColor: currentUrlDisplay[6]}}> Vytvořit
                    ingredienci </NavLink>
                <NavLink className="navigation-item" to="/createMeal"
                         style={{display: secret, left: leftMargin, backgroundColor: currentUrlDisplay[5]}}> Vytvořit
                    pokrm </NavLink>
                <NavLink className="navigation-item" to="/createDiaryEntry"
                         style={{display: secret, left: leftMargin, backgroundColor: currentUrlDisplay[4]}}> Vytvořit
                    zápis dne </NavLink>
                <NavLink className="navigation-item long-nav-item" to="/viewDiaryEntries"
                         style={{display: secret, left: leftMargin, backgroundColor: currentUrlDisplay[3]}}> Prohlédnout
                    si zápis dne </NavLink>
                <NavLink className="navigation-item" to="/"
                         style={{left: leftMargin, backgroundColor: currentUrlDisplay[0]}}> Vyhledat jídla </NavLink>
                <NavLink className="navigation-item" to="/login"
                         style={{left: leftMargin, backgroundColor: currentUrlDisplay[1]}}> {loginText} </NavLink>
                <NavLink className="navigation-item" to="/register"
                         style={{
                             display: antiSecret,
                             left: leftMargin,
                             backgroundColor: currentUrlDisplay[2]
                         }}> Zaregistrovat se </NavLink>
                <NavLink className="navigation-item" to="/user"
                         style={{display: secret, left: leftMargin, backgroundColor: currentUrlDisplay[7]}}> {"Profil"} </NavLink>
            </div>
        )
    }
}

export default Navigation;