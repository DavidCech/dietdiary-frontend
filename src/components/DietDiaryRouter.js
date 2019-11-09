import React, {Component} from 'react';
import {Route} from "react-router-dom";
import SearchFood from "./SearchFood";
import Register from "./Register";
import Login from "./Login";
import Navigation from "./Navigation";
import UserInformation from "./UserInformation";
import CreateFood from "./CreateFood";
import CreateDiaryEntry from "./CreateDiaryEntry";


class ForumRouter extends Component {

    render() {
        return (
            <div>
                <Route path="/" component={Navigation}/>
                <Route path="/" exact component={SearchFood}/>
                <Route path="/createDiaryEntry" exact component={CreateDiaryEntry}/>
                <Route path="/register" exact component={Register}/>
                <Route path="/login" exact component={Login}/>
                <Route path="/user" exact component={UserInformation}/>
                <Route path="/createFood" exact component={CreateFood}/>
            </div>
        );
    }
}

export default ForumRouter;