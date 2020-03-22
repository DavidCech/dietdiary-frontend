import React, {Component} from 'react';
import {createUserGoal, getUserInformation} from "../action-creators/authActionCreator";
import connect from "react-redux/es/connect/connect";
import '../styles/userinformation.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

//This component shows information about the user that is currently logged in
class UserInformation extends Component {

    //Initializes functions and loads the resolution of the window as well as variable keyCount in this class
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        };

        this.keyCount = 0;
        this.getKey = this.getKey.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.changeScene = this.changeScene.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleSexSelect = this.toggleSexSelect.bind(this);
    }

    //Initializes state and all its properties
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

    //After the component mounts call getUserInformation function from authActionCreator
    componentDidMount() {
        this.props.getUserInformation();
    }

    //Generates unique keys for html elements
    getKey = () => {
        return this.keyCount++;
    };

    //Receives input data from an html form, checks whether the input is a number or whether its an empty string
    //in which case changes state properties accordingly
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

    //Checks whether the user put in all the necessary information in order to send a request to the backend if that is
    //the case, it creates and object with these data and calls function createUserGoal from authActionCreator with the
    //object as a parameter. Otherwise creates and error message about the input for the user.
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
                errorMessage: "Musíte zadat věk, výšku, váhu, pohlaví a míru aktivity",
            })
        }
    };

    //Creates custom select element with two items and toggles between it being active and inactive
    toggleSexSelect = () => {
        if (this.state.sexHtml.type === 'div') {
            let html = [
                <div key={this.getKey()} className="userinfo-sex"
                     onClick={() => this.setState({sex: "male", sexText: "Muž", sexHtml: <div/>})}>
                    {"Muž"}</div>,
                <div key={this.getKey()} className="userinfo-sex"
                     onClick={() => this.setState({sex: "female", sexText: "Žena", sexHtml: <div/>})}>
                    {"Žena"}</div>
            ];
            this.setState({
                sexHtml: html
            })
        } else {
            this.setState({
                sexHtml: <div/>
            })
        }
    };

    //Triggers after the user clicks on one of the items in a custom select tag. Receives classname of the target in
    //event which it then parses to match one of the activities. The activity matching with the parsed classname is then
    //saved into the properties of state.
    handleActivitySelect = (event) => {
        let parseArray = event.target.className.split(" ");
        parseArray.pop();
        let parsedString = "";
        parseArray.forEach(string => {
            parsedString += string + " ";
        });
        parsedString = parsedString.slice(0, -1);

        let activities = ["Sedentary", "Lightly active", "Moderately active", "Very active", "Extra active"];
        let activityNames = ["Sedavý způsob života", "Lehká aktivita", "Střední aktivita", "Vysoká aktivita", "Extrémní aktivita"];
        for (let i = 0; i < activities.length; i++) {
            if (parsedString === activities[i]) {
                this.setState({activity: activities[i], activityText: activityNames[i], activityHtml: <div/>});
            }
        }
    };

    //Creates custom select element with five items and toggles between it being active and inactive
    toggleActivitySelect = () => {
        if (this.state.activityHtml.type === 'div') {
            let html = [
                <div key={this.getKey()} className="Sedentary userinfo-activity" onClick={this.handleActivitySelect}>
                    {"Sedavý způsob života"}</div>,
                <div key={this.getKey()} className="Lightly active userinfo-activity"
                     onClick={this.handleActivitySelect}>
                    {"Lehká aktivita"}</div>,
                <div key={this.getKey()} className="Moderately active userinfo-activity"
                     onClick={this.handleActivitySelect}>
                    {"Střední aktivita"}</div>,
                <div key={this.getKey()} className="Very active userinfo-activity" onClick={this.handleActivitySelect}>
                    {"Vysoká aktivita"}</div>,
                <div key={this.getKey()} className="Extra active userinfo-activity" onClick={this.handleActivitySelect}>
                    {"Extrémní aktivita"}</div>
            ];
            this.setState({
                activityHtml: html
            })
        } else {
            this.setState({
                activityHtml: <div/>
            })
        }
    };

    //Changes the sceneOne property of the state to its opposite value
    changeScene = (event) => {
        this.setState({
            sceneOne: !this.state.sceneOne
        })
    };

    render() {
        //Initializes variables responsible for showing/hiding div elements representing the two scenes of this component
        let displayForm = !this.state.sceneOne ? "block" : "none";
        let displayInfo = !this.state.sceneOne ? "none" : "block";

        //Sets the text and the position of the button which the user uses in order to move between the scenes
        let changeInfoText = "Nastavit cíl";
        let buttonStyle = {top: "78%"};
        if (!this.props.userGoal) {
            changeInfoText = "Nastavit cíl";
            buttonStyle = {top: "70%"};
            if(this.state.windowHeight<900){
                buttonStyle = {top: "74%"};
            }
        } else if (this.state.sceneOne) {
            changeInfoText = "Změnit cíl";
            if(this.state.windowHeight<900){
                buttonStyle = {top: "84%"};
            }
        }
        if (!this.state.sceneOne) {
            changeInfoText = "Zpět";
            buttonStyle = {top: "29%"};
            if(this.state.windowHeight<900){
                buttonStyle = {top: "18%"};
            }
        }

        //Sets the text and the style of the error message depending on the type of the error. If there isn't one it
        //doesn't show the div with the errorMessage.
        let errorText = "";
        let messageStyle = {
            display: "none",
            position: "absolute",
            msTransform: "translate(-50%, -50%)",
            transform: "translate(-50%, -50%)",
            left: "50%",
            color: "red",
            top: "24%"
        };
        if (this.state.errorMessage === "Musíte zadat věk, výšku, váhu, pohlaví a míru aktivity" && !this.state.sceneOne) {
            errorText = this.state.errorMessage;
            messageStyle = {...messageStyle, display: "block"};
        }

        if (this.props.goalMessage === "Bohužel došlo k chybě při hledání cíle") {
            errorText = this.props.goalMessage;
            messageStyle = {...messageStyle, display: "block"};
            if(this.state.windowHeight<900){
                messageStyle = {...messageStyle, display: "block", top: "18%"};
            }
            if (!this.props.userGoal) {
                messageStyle = {...messageStyle, display: "block", top: "33%"};
                if(this.state.windowHeight<900){
                    messageStyle = {...messageStyle, display: "block", top: "31%"};
                }
            }
        } else if (this.props.goalMessage === "Bohužel došlo k chybě při vytvoření cíle") {
            errorText = this.props.goalMessage;
            messageStyle = {...messageStyle, display: "block"};
        } else if (this.props.goalMessage === "Cíl úspěšně vytvořen") {
            errorText = this.props.goalMessage;
            messageStyle = {
                ...messageStyle,
                display: "block",
                top: "50%",
                left: "50%",
                color: "green",
                fontSize: "24px"
            };
            displayInfo = "none";
            displayForm = "none";
            buttonStyle = {display: "none"};
        }

        //If the user has a goal already set is renders it so that user knows what their goal is, if the user doesn't have
        //a goal it is a div with appropriate message instead
        let grid = <div/>;
        if (this.props.userGoal) {
            grid =
                <div className="userinfo-goal-grid">
                    <div className="userinfo-goal-grid-item">{"Váš nutriční cíl: "}</div>
                    <div className="userinfo-goal-grid-item">{"Kilokalorie: " + this.props.userGoal.kcal}</div>
                    <div className="userinfo-goal-grid-item">
                        {"Bílkoviny: " + this.props.userGoal.protein + handleInflection(this.props.userGoal.protein)}
                    </div>
                    <div className="userinfo-goal-grid-item">
                        {"Sacharidy: " + this.props.userGoal.carbs + handleInflection(this.props.userGoal.carbs)}
                    </div>
                    <div className="userinfo-goal-grid-item">
                        {"Tuky: " + this.props.userGoal.fat + handleInflection(this.props.userGoal.fat)}
                    </div>
                    <div className="userinfo-goal-grid-item">
                        {"Vláknina: " + this.props.userGoal.fibre + handleInflection(this.props.userGoal.fibre)}
                    </div>
                </div>
        } else {
            grid = <div className="userinfo-goal-grid">{"Nemáte vytvořený žádný cíl"}</div>
        }

        return (
            <div>
                <div style={messageStyle}>{errorText}</div>
                <div className="userinfo-scene-one" style={{display: displayInfo}}>
                    <div className="userinfo-username">{"Přihlášen jako " + this.props.username}</div>
                    <div className="userinfo-email">{"Email: " + this.props.email}</div>
                    {grid}
                </div>
                <div className="userinfo-scene-two" style={{display: displayForm}}>
                    <input onChange={this.handleInput} className="user-height" placeholder="Výška"
                           value={this.state.height}/>
                    <input onChange={this.handleInput} className="user-weight" placeholder="Váha"
                           value={this.state.weight}/>
                    <input onChange={this.handleInput} className="user-age" placeholder="Věk" value={this.state.age}/>
                    <div className="userinfo-sex-select" onClick={this.toggleSexSelect}>
                        <div className="userinfo-select-label">
                            {this.state.sexText}
                            <i className="fas fa-sort-down"/>
                        </div>
                        <div className="userinfo-list-wrapper">
                            {this.state.sexHtml}
                        </div>
                    </div>
                    <div className="userinfo-activity-select" onClick={this.toggleActivitySelect}>
                        <div className="userinfo-select-label">
                            {this.state.activityText}
                            <i className="fas fa-sort-down"/>
                        </div>
                        <div className="userinfo-list-wrapper">
                            {this.state.activityHtml}
                        </div>
                    </div>
                    <div className="user-goal-guide">
                        {"Vysvětlivka: Výška se zadává v centimetrech, váha v kilogramech a věk v letech. " +
                        "Sedavý způsob života nezahrnuje skoro žádnou fyzickou aktivitu, lehká aktivita zahrnuje lehkou " +
                        "fyzickou zátěž maximálně třikrát týdně, střední aktivita zahrnuje střední fyzickou zátěž většinu" +
                        " dní v týdnu, vysoká aktivita počítá s velkou fyzickou zátěží každý den a extrémní aktivita značí " +
                        "velkou fyzickou zátěž více než jednou denně. K výpočtu kalorického cíle je využívána " +
                        "tzv. Rovnice Mifflin-St Jeor."}
                    </div>
                    <button className="userinfo-submit" onClick={this.handleSubmit}>{"Potvrdit"}</button>
                </div>
                <button className="userinfo-change-scene" onClick={this.changeScene} style={buttonStyle}>
                    {changeInfoText}
                </button>
            </div>
        )
    }
}

//Deals with the inflection of the word grams in Czech language
const handleInflection = (number) => {
    let inflection;
    if (parseInt(number) === 1) {
        inflection = " gram";
    } else if (parseInt(number) > 1 && parseInt(number) < 5) {
        inflection = " gramy"
    } else {
        inflection = " gramů"
    }

    return inflection;
};

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