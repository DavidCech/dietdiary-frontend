import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createFood} from "../action-creators/foodActionCreator";
import SearchFood from "./SearchFood";
import '../styles/createmeal.css';

//This component serves as GUI for creating meals
class CreateMeal extends Component {

    //Initializes functions, variable keyCount in this class and initial state
    constructor(props) {
        super(props);

        this.keyCount = 0;
        this.getKey = this.getKey.bind(this);
        this.changeInputText = this.changeInputText.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addIngredient = this.addIngredient.bind(this);
        this.generatePreview = this.generatePreview.bind(this);
        this.removeIngredient = this.removeIngredient.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.previousStep = this.previousStep.bind(this);
    }

    //Initializes state property of the component
    state = {
        name: "",
        desc: "",
        grams: "",
        ingredients: [],
        previewHtml: <div/>,
        createdMessage: "",
        step: 1,
    };

    //Removes ingredient from the ingredients array in state at an index given by the ingredientIndex argument
    removeIngredient = (ingredientIndex) => {
        let reducedIngredients = this.state.ingredients;
        reducedIngredients.splice(ingredientIndex, 1);
        this.generatePreview(reducedIngredients);
        this.setState({ingredients: reducedIngredients})
    };


    //Changes properties of state to data from their respective input fields
    changeInputText = (event) => {
        if (event.target.className === "name" || event.target.className === "desc") {
            this.setState({
                [event.target.className]: event.target.value
            })
        } else {
            if (Number(event.target.value) || event.target.value === "") {
                this.setState({grams: event.target.value});
            }
        }
    };

    //Generates unique keys for html elements
    getKey = () => {
        return this.keyCount++;
    };

    //Adds ingredient the the array of ingredients in state, it requires the user to search for the ingredient and submit
    //how many grams of the given ingredient the meal contains
    addIngredient = (event) => {
        event.preventDefault();
        if (this.props.searchedFood !== null && this.state.grams !== "") {
            let newIngredients = [...this.state.ingredients, {food: this.props.searchedFood, grams: this.state.grams}];
            this.setState({ingredients: newIngredients});
            this.generatePreview(newIngredients);
        }

    };

    //Adds 1 to the step property of state which determines rendering of the html elements
    nextStep = (event) => {
        event.preventDefault();
        if (this.state.step < 3) {
            this.setState({step: this.state.step + 1})
        }
    };

    //Subtracts 1 from the step property of state which determines rendering of the html elements
    previousStep = (event) => {
        event.preventDefault();
        if (this.state.step > 1) {
            this.setState({step: this.state.step - 1})
        }
    };

    //Checks whether the user submitted all the necessary data and if that is the case then this function creates
    //an object from these data and calls function createFood from foodActionCreator with this object as a parameter
    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.ingredients.length !== 0 && this.state.name !== "") {
            const food = {
                name: this.state.name,
                desc: this.state.desc,
                ingredients: this.state.ingredients,
            };
            this.props.createFood(food);
            this.setState({createdMessage: "Úspěšně vytvořeno"})
        } else {
            this.setState({
                createdMessage: "Nesprávné údaje: Musíte zadat jméno a alespoň jednu ingredienci s gramy"
            })
        }
    };

    //This function generates a preview of the ingredients user has added to their meal
    generatePreview = (ingredients) => {
        let previewHtml = [];
        let text;
        let i = 0;
        ingredients.forEach(ingredient => {
            text = ingredient.food.name + " " + ingredient.grams;
            previewHtml.push(
                <div key={this.getKey()} className={"create-meal-ingredient"}>
                    {text}<RemoveIngredientButton ingredientIndex={i} onClick={this.removeIngredient}/>
                </div>
            );
            i++;
        });
        this.setState({previewHtml: previewHtml});
    };

    render() {
        //Renders message only when there is one and hides the form if the submit was successful
        let displayForm = "block";
        let displayMessage = "none";
        if (this.state.createdMessage !== "") {
            displayMessage = "block";
            if (this.state.createdMessage === "Úspěšně vytvořeno") {
                displayForm = "none";
            }
        }

        //Determines whether html elements for adding ingredient will be shown or not
        let renderSearchedFood = "none";
        let searchedFoodName="";
        if(this.props.searchedFood && this.state.step===2){
            renderSearchedFood = "block";
            searchedFoodName = this.props.searchedFood.name;
        }

        //Defines the style of the html elements which assures rendering only some of them each step
        let renderStepOne = "block";
        let renderStepTwo = "none";
        let renderStepThree = "none";
        if (this.state.step === 2) {
            renderStepOne = "none";
            renderStepTwo = "block";
            renderStepThree = "none";
        } else if (this.state.step === 3) {
            renderStepOne = "none";
            renderStepTwo = "none";
            renderStepThree = "block";
        }

        //Determines whether the buttons for switching steps will be rendered or not and how they will be rendered
        //(centered or next to one another)
        let singleButtonStyle = {
            "display": "block",
            "msTransform": "translate(-50%, -50%)",
            "transform": "translate(-50%, -50%)",
            "left": "50%",
            "top": "20%"
        };
        let renderNext = {display: "block"};
        let renderPrevious = {display: "none"};
        if (this.state.step >= 3) {
            if (this.state.step === 3) {
                renderPrevious = singleButtonStyle;
            }
            renderNext = {display: "none"};
        } else if (this.state.step >= 1) {
            if (this.state.step === 1) {
                renderNext = singleButtonStyle;
            } else {
                renderPrevious = {display: "block"};
            }
        }

        return (
            <div>
                <div className="create-meal-form-wrapper" style={{display: displayForm}}>
                    <form className="create-meal-form">
                        <span className="create-meal-step">{"Krok " + this.state.step + "/3"}</span>
                        <span className="create-meal-searched-food" style={{display:renderSearchedFood}}>{searchedFoodName}</span>
                        <input placeholder="Zadejte jméno pokrmu" style={{display: renderStepOne}} className="name"
                               onChange={this.changeInputText}
                               value={this.state.name}/>
                        <textarea placeholder="Popis" style={{display: renderStepOne}} className="desc"
                                  onChange={this.changeInputText}
                                  value={this.state.desc}/>
                        <div className="create-meal-add-ingredient-wrapper">
                            <SearchFood addMode={true} disabled={renderStepTwo === "none"}/>
                            <input placeholder={"Gramy"} className="grams" onChange={this.changeInputText}
                                   style={{display:renderSearchedFood}} value={this.state.grams}
                                   disabled={this.props.searchedFood === null}/>
                            <button className="create-meal-add-ingredient" style={{display:renderSearchedFood}}
                                    onClick={this.addIngredient}>
                                {"Přidat ingredienci"}
                            </button>
                        </div>
                        <button className="create-meal-button create-meal-next" style={renderNext}
                                onClick={this.nextStep}>{"Další krok"}</button>
                        <button className="create-meal-button create-meal-previous" style={renderPrevious}
                                onClick={this.previousStep}>{"Předchozí krok"}</button>
                        <button className="create-meal-submit" style={{display: renderStepThree}}
                                onClick={this.handleSubmit}>Potvrdit
                        </button>
                    </form>
                    <div className="create-meal-preview" style={{display: renderStepThree}}>
                        {this.state.previewHtml}
                    </div>
                </div>
                <span className="create-meal-message"
                      style={{display: displayMessage}}>{this.state.createdMessage}</span>
            </div>
        )
    }
}

//Button for removing ingredients from the preview, receives arguments ingredientIndex and onClick, ingredientIndex is
//the index of the ingredient which is to be removed from the preview, onClick is the function that is to be called on
//click
class RemoveIngredientButton extends Component {
    handleClick = () => {
        this.props.onClick(this.props.ingredientIndex);
    };

    render() {
        return (
            <button onClick={this.handleClick}>X</button>
        )
    }
}

//Ensures reception of the properties from React-Redux Store in props
const mapStateToProps = state => ({
    searchedFood: state.foodReducer.searchedFood,
});

//Ensures reception of the functions from actionCreators in props
const mapDispatchToProps = (dispatch) => ({
    createFood: (food) => {
        dispatch(createFood(food))
    },
});

//Connects the component to React-Redux Store
export default connect(mapStateToProps, mapDispatchToProps)(CreateMeal);