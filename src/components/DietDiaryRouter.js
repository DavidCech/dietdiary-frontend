import React, {Component} from 'react';
import {Route} from "react-router-dom";
import SearchFood from "./SearchFood";
import Register from "./Register";
import Login from "./Login";
import Navigation from "./Navigation";
import UserInformation from "./UserInformation";
import CreateIngredient from "./CreateIngredient";
import CreateMeal from "./CreateMeal";
import CreateDiaryEntry from "./CreateDiaryEntry";
import ViewDiaryEntries from "./ViewDiaryEntries";

//This component assigns which components should be displayed at various urls
class DietDiaryRouter extends Component {

    render() {
        return (
            <div>
                <Route path="/" component={Navigation}/>
                <Route path="/" exact component={SearchFood}/>
                <Route path="/createDiaryEntry" exact component={CreateDiaryEntry}/>
                <Route path="/register" exact component={Register}/>
                <Route path="/login" exact component={Login}/>
                <Route path="/user" exact component={UserInformation}/>
                <Route path="/createIngredient" exact component={CreateIngredient}/>
                <Route path="/createMeal" exact component={CreateMeal}/>
                <Route path="/viewDiaryEntries" exact component={ViewDiaryEntries}/>
            </div>
        );
    }
}

export default DietDiaryRouter;