import React, {Component} from 'react';
import {createUserGoal, getUserInformation} from "../action-creators/authActionCreator";
import connect from "react-redux/es/connect/connect";

//This component shows information about the user that is currently logged in
class UserInformation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state
        };

        this.keyCount = 0;
        this.getKey = this.getKey.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.changeScene = this.changeScene.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleSexSelect = this.toggleSexSelect.bind(this);
    }

    state = {
        userInfo: false,
        sceneOne: true,
        age: "",
        height: "",
        weight: "",
        sex: "",
        sexText: "Pohlaví",
        activity: "",
        activityText: "Míra aktivity",
        errorMessage: "",
        sexHtml: <div/>,
        activityHtml: <div/>
    };

    componentDidMount() {
        this.props.getUserInformation();
    }

    //Generates unique keys for html elements
    getKey = () => {
        return this.keyCount++;
    };

    handleInput = (event) => {
        if (Number(event.target.value) || event.target.value === "") {
            if (event.target.className === "user-age") {
                this.setState({
                    age: event.target.value,
                })
            } else if (event.target.className === "user-height") {
                this.setState({
                    height: event.target.value,
                })
            } else {
                this.setState({
                    weight: event.target.value,
                })
            }
        }
    };

    handleSubmit = (event) => {
        if (this.state.age !== "" && this.state.weight !== "" && this.state.height !== "" && this.state.sex !== "" && this.state.activity !== "") {
            if (this.props.createUserGoal) {
                let userGoal = {
                    age: this.state.age,
                    height: this.state.height,
                    weight: this.state.weight,
                    sex: this.state.sex,
                    activity: this.state.activity
                };
                this.props.createUserGoal(userGoal);
            }
        } else {
            this.setState({
                erroMessage: "Musíte zadat věk, výšku, váhu, pohlaví a míru aktivity",
            })
        }
    };

    toggleSexSelect = () => {
        if (this.state.sexHtml.type === 'div') {
            let html = [
                <div key={this.getKey()} onClick={() => this.setState({sex: "male", sexText: "Muž", sexHtml: <div/>})}>
                    {"Muž"}</div>,
                <div key={this.getKey()}
                     onClick={() => this.setState({sex: "female", sexText: "Žena", sexHtml: <div/>})}>
                    {"Žena"}</div>
            ];
            this.setState({
                sexHtml: html
            })
        }
    };

    handleActivitySelect = (event) => {
        let activities = ["Sedentary", "Lightly active", "Moderately active", "Very active", "Extra active"];
        let activityNames = ["Sedavý způsob života", "Lehká aktivita", "Střední aktivita", "Vysoká aktivita", "Extrémní aktivita"];
        for (let i = 0; i < activities.length; i++) {
            if (event.target.className === activities[i]) {
                this.setState({activity: activities[i], activityText: activityNames[i], activityHtml: <div/>});
            }
        }
    };

    toggleActivitySelect = () => {
        if (this.state.activityHtml.type === 'div') {
            let html = [
                <div key={this.getKey()} className="Sedentary" onClick={this.handleActivitySelect}>
                    {"Sedavý způsob života"}</div>,
                <div key={this.getKey()} className="Lightly active" onClick={this.handleActivitySelect}>
                    {"Lehká aktivita"}</div>,
                <div key={this.getKey()} className="Moderately active" onClick={this.handleActivitySelect}>
                    {"Střední aktivita"}</div>,
                <div key={this.getKey()} className="Very active" onClick={this.handleActivitySelect}>
                    {"Vysoká aktivita"}</div>,
                <div key={this.getKey()} className="Extra active" onClick={this.handleActivitySelect}>
                    {"Extrémní aktivita"}</div>
            ];
            this.setState({
                activityHtml: html
            })
        }
    };

    changeScene = (event) => {
        this.setState({
            sceneOne: !this.state.sceneOne
        })
    };

    render() {
        console.log(this.state.activity);
        let displayForm = !this.state.sceneOne ? "block" : "none";
        let displayInfo = !this.state.sceneOne ? "none" : "block";
        let changeInfoText = "Nastavit cíl";
        if (!this.props.userGoal) {
            changeInfoText = "Nastavit cíl";
        } else if (this.state.sceneOne) {
            changeInfoText = "Změnit cíl";
        }
        if (!this.state.sceneOne) {
            changeInfoText = "Zpět";
        }

        let grid = <div/>;
        if (this.props.userGoal) {
            grid =
                <div className="userinfo-goal-grid">
                    <div className="userinfo-goal-grid-item">{"Váš cíl: "}</div>
                    <div className="userinfo-goal-grid-item">{"Kilokalorie: " + this.props.userGoal.kcal}</div>
                    <div className="userinfo-goal-grid-item">{"Bílkoviny: " + this.props.userGoal.protein}</div>
                    <div className="userinfo-goal-grid-item">{"Sacharidy: " + this.props.userGoal.carbs}</div>
                    <div className="userinfo-goal-grid-item">{"Tuky: " + this.props.userGoal.fat}</div>
                    <div className="userinfo-goal-grid-item">{"Vláknina: " + this.props.userGoal.fibre}</div>
                </div>
        } else {
            grid = <div className="userinfo-goal-grid">{"Nemáte vytvořený žádný cíl"}</div>
        }

        return (
            <div>
                <div className="userinfo-scene-one" style={{display: displayInfo}}>
                    <span className="userinfo-username">{"Přihlášen jako " + this.props.username}</span>
                    <span className="userinfo-email">{"Email: " + this.props.email}</span>
                    {grid}
                </div>
                <div className="userinfo-scene-two" style={{display: displayForm}}>
                    <div className="user-goal-guide">
                        {"Vysvětlivka: Výška se zadává v centimetrech, váha v kilogramech a věk v letech. " +
                        "Sedavý způsob života nezahrnuje skoro žádnou fyzickou aktivitu, lehká aktivita zahrnuje lehkou " +
                        "fyzickou zátěž maximálně třikrát týdně, střední aktivita zahrnuje střední fyzickou zátěž většinu" +
                        " dní v týdnu, vysoká aktivita počítá s velkou fyzickou zátěží každý den a extrémní aktivita značí " +
                        "velkou fyzickou zátěž více než jednou denně. K výpočtu kalorického cíle je využívána " +
                        "tzv. Rovnice Mifflin-St Jeor."}
                    </div>
                    <input onChange={this.handleInput} className="user-height" placeholder="Výška"
                           value={this.state.height}/>
                    <input onChange={this.handleInput} className="user-weight" placeholder="Váha"
                           value={this.state.weight}/>
                    <input onChange={this.handleInput} className="user-age" placeholder="Věk" value={this.state.age}/>
                    <div onClick={this.toggleSexSelect} style={{position: "absolute", paddingTop: "100px"}}>
                        {this.state.sexText}
                        {this.state.sexHtml}
                    </div>
                    <div onClick={this.toggleActivitySelect} style={{position: "absolute"}}>
                        {this.state.activityText}
                        {this.state.activityHtml}
                    </div>
                    <button onClick={this.handleSubmit} style={{marginTop: "20px"}}>{"Potvrdit"}</button>
                </div>
                <button onClick={this.changeScene}>{changeInfoText}</button>
            </div>
        )
    }
}

//Ensures reception of the properties from React-Redux Store in props
const mapStateToProps = state => ({
    goalMessage: state.authReducer.goalMessage,
    username: state.authReducer.username,
    userGoal: state.authReducer.userGoal,
    email: state.authReducer.email,
});

//Ensures reception of the functions from actionCreators in props
const mapDispatchToProps = (dispatch) => ({
    getUserInformation: () => {
        dispatch(getUserInformation());
    },
    createUserGoal: (userGoal) => {
        dispatch(createUserGoal(userGoal));
    },
});

//Connects the component to React-Redux Store
export default connect(mapStateToProps, mapDispatchToProps)(UserInformation);