import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createFood, searchedFoodCleanUp} from "../action-creators/foodActionCreator";
import SearchFood from "./SearchFood";
import '../styles/createmeal.css';
import FoodDetails from "./FoodDetails";

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
        this.handleGramInflection = this.handleGramInflection.bind(this);
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
        if (this.props.searchedFood && this.state.grams !== "" && this.props.searchedFoodCleanUp) {
            let newIngredients = [...this.state.ingredients, {food: this.props.searchedFood, grams: this.state.grams}];
            this.setState({ingredients: newIngredients, createdMessage: "Ingredience přidána", grams: ""});
            this.generatePreview(newIngredients);
            this.props.searchedFoodCleanUp();
        } else {
            this.setState({createdMessage: "Musíte zadat gramy jídla"});
        }

    };

    //Adds 1 to the step property of state which determines rendering of the html elements, resets some properties of the
    //state and if the user hasn't added any ingredients before going into step 3, it generates an error message
    nextStep = (event) => {
        event.preventDefault();
        if (this.state.step < 3 && this.props.searchedFoodCleanUp) {
            if (this.state.step === 2 && this.state.ingredients.length === 0) {
                this.setState({
                    step: this.state.step + 1,
                    grams: "",
                    createdMessage: "Musíte přidat alespoň jednu ingredienci",
                });
            } else {
                this.setState({
                    step: this.state.step + 1,
                    grams: "",
                    createdMessage: "",
                });
            }
            this.props.searchedFoodCleanUp();
        }
    };

    //Subtracts 1 from the step property of state which determines rendering of the html elements, resets some properties of the
    //state
    previousStep = (event) => {
        event.preventDefault();
        if (this.state.step > 1 && this.props.searchedFoodCleanUp) {
            this.setState({
                step: this.state.step - 1,
                grams: "",
                createdMessage: "",
            });
            this.props.searchedFoodCleanUp();
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

    //Deals with the inflection of the word grams in Czech language
    handleGramInflection = (number) => {
        let inflection;
        if (parseInt(number) === 1) {
            inflection = "gram";
        } else if (parseInt(number) > 1 && parseInt(number) < 5) {
            inflection = "gramy"
        } else {
            inflection = "gramů"
        }

        return inflection;
    };

    //This function generates a preview of the ingredients user has added to their meal
    generatePreview = (ingredients) => {
        let previewHtml = [];
        let text;
        let i = 0;
        ingredients.forEach(ingredient => {
            text = ingredient.food.name + " " + ingredient.grams + " " + this.handleGramInflection(ingredient.grams);
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
        //Determines whether html elements for adding ingredient will be shown or not and the styling of the message
        //which is shown to the user after he adds an ingredient to the meal
        let renderSearchedFood = "none";
        let renderSearchbar = true;
        let messageStyle = {display: "none"};
        if (this.props.searchedFood && this.state.step === 2) {
            renderSearchedFood = "block";
        } else if (this.state.step === 2) {
            renderSearchbar = false;
            messageStyle = {
                display: "block",
                color: "green",
                position: "fixed",
                top: "80%",
                left: "50%",
                msTransform: "translate(-50%, -50%)",
                transform: "translate(-50%, -50%)",
                fontSize: "20px",
            };
        }

        //Renders message only when there is one and hides the form if the submit was successful
        let displayForm = "block";
        if (this.state.createdMessage !== "" && this.state.step === 3) {
            if (this.state.createdMessage === "Úspěšně vytvořeno") {
                displayForm = "none";
                messageStyle = {
                    display: "block",
                    color: "green",
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    msTransform: "translate(-50%, -50%)",
                    transform: "translate(-50%, -50%)",
                    fontSize: "24px",
                };
            } else if (this.state.createdMessage === "Nesprávné údaje: Musíte zadat jméno a alespoň jednu ingredienci s gramy") {
                messageStyle = {
                    display: "block",
                    color: "red",
                    position: "fixed",
                    top: "20%",
                    left: "50%",
                    msTransform: "translate(-50%, -50%)",
                    transform: "translate(-50%, -50%)",
                    fontSize: "16px",
                };
            } else if (this.state.createdMessage === "Musíte přidat alespoň jednu ingredienci") {
                messageStyle = {
                    display: "block",
                    color: "red",
                    position: "fixed",
                    top: "35%",
                    left: "50%",
                    msTransform: "translate(-50%, -50%)",
                    transform: "translate(-50%, -50%)",
                    fontSize: "16px",
                };
            }
        } else if (this.state.createdMessage !== "" && this.state.step === 2){
            if (this.state.createdMessage === "Musíte zadat gramy jídla") {
                messageStyle = {
                    display: "block",
                    color: "red",
                    position: "fixed",
                    top: "69%",
                    left: "50%",
                    msTransform: "translate(-50%, -50%)",
                    transform: "translate(-50%, -50%)",
                    fontSize: "16px",
                };
            }
        }

        //Defines the style of the html elements which assures rendering only some of them each step as well as styling
        //of the elements which inform the user about what step they're at
        let renderStepOne = "block";
        let renderStepThree = "none";
        let stepStyle = {top: "24%"};
        let stepButtonStyle = {top: "29%"};
        if (this.state.step === 1) {
            renderStepOne = "block";
            messageStyle = {display: "none"};
        } else if (this.state.step === 2) {
            stepStyle = {top: "15%"};
            stepButtonStyle = {top: "17%"};
            renderStepOne = "none";
            renderStepThree = "none";
        } else if (this.state.step === 3) {
            if (this.state.ingredients.length > 0) {
                renderStepThree = "block";
            }
            renderStepOne = "none";
        }

        //Determines whether the buttons for switching steps will be rendered or not and how they will be rendered
        //(centered or next to one another)
        let singleButtonStyle = {
            "display": "block",
            "msTransform": "translate(-50%, -50%)",
            "transform": "translate(-50%, -50%)",
            "left": "50%",
            ...stepButtonStyle,
        };
        let renderNext = {display: "block"};
        let renderPrevious = {display: "none"};
        if (this.state.step >= 3) {
            if (this.state.step === 3) {
                renderPrevious = singleButtonStyle;
            }
            renderNext = {display: "none"};
        } else if (this.state.step >= 1) {
            renderNext = {...stepButtonStyle, display: "block"};
            if (this.state.step === 1) {
                renderNext = singleButtonStyle;
            } else {
                renderPrevious = {...stepButtonStyle, display: "block"};
            }
        }

        //Determines whether to render FoodDetails or an empty span
        let foodDetails = this.props.searchedFood ? <FoodDetails viewOnly={true}/> : <div style={{display: renderSearchedFood}}/>;

        return (
            <div className="create-meal-wrapper">
                <div className="create-meal-form-wrapper" style={{display: displayForm}}>
                    <form className="create-meal-form">
                        <span className="create-meal-step" style={stepStyle}>{"Krok " + this.state.step + "/3"}</span>
                        <input placeholder="Zadejte jméno pokrmu" style={{display: renderStepOne}} className="name"
                               onChange={this.changeInputText}
                               value={this.state.name}/>
                        <span className="create-ingredient-message voluntary"
                              style={{display: renderStepOne}}>{"Nepovinné pole"}</span>
                        <textarea placeholder="Popis" style={{display: renderStepOne}} className="desc"
                                  onChange={this.changeInputText}
                                  value={this.state.desc}/>
                        <SearchFood addMode={true} disabled={renderSearchbar}/>
                        <div className="create-meal-add-ingredient-wrapper" style={{display: renderSearchedFood}}>
                            {foodDetails}
                            <input placeholder={"Gramy"} className="grams" onChange={this.changeInputText}
                                   style={{display: renderSearchedFood}} value={this.state.grams}
                                   disabled={this.props.searchedFood === null}/>
                            <button className="create-meal-add-ingredient" style={{display: renderSearchedFood}}
                                    onClick={this.addIngredient}>
                                {"Přidat ingredienci"}
                            </button>
                        </div>
                        <button className="create-meal-button create-meal-next" style={renderNext}
                                onClick={this.nextStep}>{"Další krok"}</button>
                        <button className="create-meal-button create-meal-previous" style={renderPrevious}
                                onClick={this.previousStep}>{"Předchozí krok"}</button>
                    </form>
                    <div className="create-meal-preview" style={{display: renderStepThree}}>
                        <div className="create-meal-preview-table">{this.state.previewHtml}</div>
                        <button className="create-meal-submit" style={{display: renderStepThree}}
                                onClick={this.handleSubmit}>Potvrdit
                        </button>
                    </div>
                </div>
                <span className="create-meal-message"
                      style={messageStyle}>{this.state.createdMessage}</span>
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
            <i onClick={this.handleClick} className="far fa-trash-alt delete-button"/>
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
    searchedFoodCleanUp: () => {
        dispatch(searchedFoodCleanUp());
    }
});

//Connects the component to React-Redux Store
export default connect(mapStateToProps, mapDispatchToProps)(CreateMeal);