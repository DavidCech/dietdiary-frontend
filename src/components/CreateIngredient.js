import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createFood} from "../action-creators/foodActionCreator";
import '../styles/createingredient.css';

//This component serves as GUI for creating ingredients
class CreateIngredient extends Component {

    //Initializes functions and in this class
    constructor(props) {
        super(props);
        this.changeInputText = this.changeInputText.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //Initializes state property of the component
    state = {
        name: "",
        nutritionVal: {
            kcal: "",
            protein: "",
            carbs: "",
            fat: "",
            fibre: "",
        },
        desc: "",
        errorMessage: "",
    };

    //Changes properties of state to data from their respective input fields
    changeInputText = (event) => {
        if (event.target.className === "name" || event.target.className === "desc") {
            this.setState({
                [event.target.className]: event.target.value
            })
        } else {
            if (Number(event.target.value) || event.target.value === "" || event.target.value === '0') {
                this.setState({
                    nutritionVal: {
                        ...this.state.nutritionVal,
                        [event.target.className]: event.target.value
                    }
                })
            }
        }
    };

    //Checks whether the user submitted all the necessary data and if the data are correct if that is the case then
    //this function creates an object from these data and calls function createFood from foodActionCreator with
    //this object as a parameter
    handleSubmit = (event) => {
        event.preventDefault();
        let incorrectInput = this.state.name === "";
        //Checks whether the nutritional values are empty and adds up all the nutritional values to check if their sum
        //isn't bigger than 100 (since they are per 100g they can't have bigger values)
        let nutriSum = (-this.state.nutritionVal.kcal);
        Object.entries(this.state.nutritionVal).forEach(nutritionVal => {
            if (nutritionVal[1] === "") {
                incorrectInput = true
            } else {
                nutriSum += parseInt(nutritionVal[1]);
            }
        });
        if (nutriSum > 100) {
            incorrectInput = true;
        }

        if (!incorrectInput) {
            //Creates the object and calls the function
            const food = {
                name: this.state.name,
                nutritionVal: {
                    kcal: this.state.nutritionVal.kcal,
                    protein: this.state.nutritionVal.protein,
                    fibre: this.state.nutritionVal.carbs,
                    fat: this.state.nutritionVal.fat,
                    carbs: this.state.nutritionVal.fibre,
                },
                desc: this.state.desc,
                ingredients: [],
            };
            this.props.createFood(food);
            this.setState({errorMessage: "Úspěšně vytvořeno"})
        } else {
            this.setState({
                errorMessage: "Nesprávné údaje: musíte vyplnit všechna " +
                    "pole kromě popisu a součet gramů sacharidů, bílkovin, tuků a vlákniny nesmí přesahovat 100"
            })
        }
    };

    render() {
        //Renders message only when there is one and hides the form if the submit was successful
        let displayForm = "block";
        let messageStyle = {display: "none", color: "red", top: "15%"};
        if (this.state.errorMessage !== "") {
            messageStyle = {...messageStyle, display: "block"};
            if (this.state.errorMessage === "Úspěšně vytvořeno") {
                messageStyle = {...messageStyle, fontSize: "24px", color: "green", top: "50%"};
                displayForm = "none";
            }
        }


        return (
            <div className="create-ingredient-wrapper">
                <form className="create-ingredient-form" style={{display: displayForm}}>
                    <input placeholder="Jméno ingredience" className="name" onChange={this.changeInputText} value={this.state.name}/>
                    <div className="create-ingredient-nutri-wrapper">
                        <span className="create-ingredient-label">{"Nutriční hodnoty na 100 gramů: "}</span>
                        <input placeholder="Kilokalorie" className="kcal" onChange={this.changeInputText}
                               value={this.state.nutritionVal.kcal}/>
                        <input placeholder="Bílkoviny" className="protein" onChange={this.changeInputText}
                               value={this.state.nutritionVal.protein}/>
                        <input placeholder="Sacharidy" className="carbs" onChange={this.changeInputText}
                               value={this.state.nutritionVal.carbs}/>
                        <input placeholder="Tuky" className="fat" onChange={this.changeInputText}
                               value={this.state.nutritionVal.fat}/>
                        <input placeholder="Vláknina" className="fibre" onChange={this.changeInputText}
                               value={this.state.nutritionVal.fibre}/>
                    </div>
                    <span className="create-ingredient-message voluntary">{"Nepovinné pole"}</span>
                    <textarea placeholder="Popis" className="desc" onChange={this.changeInputText}
                           value={this.state.desc}/>
                    <button className="create-ingredient-submit-button" onClick={this.handleSubmit}>Submit</button>
                </form>
                <span style={messageStyle} className="create-ingredient-message error">{this.state.errorMessage}</span>
            </div>
        )
    }
}

//Ensures reception of the properties from React-Redux Store in props
const mapStateToProps = state => ({});

//Ensures reception of the functions from actionCreators in props
const mapDispatchToProps = (dispatch) => ({
    createFood: (food) => {
        dispatch(createFood(food))
    },
});

//Connects the component to React-Redux Store
export default connect(mapStateToProps, mapDispatchToProps)(CreateIngredient);