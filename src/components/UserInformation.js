import React, {Component} from 'react';

//This component shows information about the user that is currently logged in
class UserInformation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state
        };

        this.handleInput = this.handleInput.bind(this);
        this.changeScene = this.changeScene.bind(this);
    }

    state = {
        username: "",
        email: "",
        userInfo: false,
        sceneOne: true,
        age: "",
        height: "",
        weight: "",
        sex: "",
        activity: "",
    };

    componentDidMount(){
        this.setState({
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            // userInfo: localStorage.getItem('userInfo'),
        })
    }

    handleInput = (event) => {
        if(Number(event.target.value)) {
            if(event.target.className==="user-age"){
                this.setState({
                    age: event.target.value,
                })
            } else if (event.target.className==="user-height"){
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

    changeScene = (event) => {
        if(!this.state.sceneOne){

        }
        this.setState({
            sceneOne: !this.state.sceneOne
        })
    };

    render() {
        let displayInfo = !this.state.sceneOne ? "block" : "none";
        let changeInfoText = "Nastavit cíl";
        if(!this.state.userInfo){
            changeInfoText = "Nastavit cíl";
        } else if(this.state.sceneOne){
            changeInfoText = "Změnit cíl";
        }
        if (!this.state.sceneOne){
            changeInfoText = "Potvrdit";
        }

        return (
            <div>
                <span>{"Přihlášen jako " + this.state.username}</span>
                <span>{"Email: " + this.state.email}</span>
                <button onClick={this.changeScene}>{changeInfoText}</button>
                <div style={{display: displayInfo}}>
                    <div className="user-goal-guide">
                        {"Vysvětlivka: Výška se zadává v centimetrech, váha v kilogramech a věk v letech. " +
                        "Sedavý způsob života nezahrnuje skoro žádnou fyzickou aktivitu, lehká aktivita zahrnuje lehkou " +
                        "fyzickou zátěž maximálně třikrát týdně, střední aktivita zahrnuje střední fyzickou zátěž většinu" +
                        " dní v týdnu, vysoká aktivita počítá s velkou fyzickou zátěží každý den a extrémní aktivita značí " +
                        "velkou fyzickou zátěž více než jednou denně. K výpočtu kalorického cíle je využívána " +
                        "tzv. Rovnice Mifflin-St Jeor."}
                    </div>
                    <input onChange={this.handleInput} className="user-height" placeholder="Výška" value={this.state.height}/>
                    <input onChange={this.handleInput} className="user-weight" placeholder="Váha" value={this.state.weight}/>
                    <input onChange={this.handleInput} className="user-age" placeholder="Věk" value={this.state.age}/>
                    <div>{"Pohlaví"}</div>
                    <div>{"Míra aktivity"}</div>
                </div>
            </div>
        )
    }
}

export default UserInformation;