import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createFood} from "../action-creators/foodActionCreator";
import SearchFood from "./SearchFood";

//This component serves as GUI for creating meals
class CreateMeal extends Component {

    //Initializes functions and variable keyCount in this class
    constructor(props) {
        super(props);

        this.keyCount = 0;
        this.getKey = this.getKey.bind(this);
        this.changeInputText = this.changeInputText.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addIngredient = this.addIngredient.bind(this);
        this.generatePreview = this.generatePreview.bind(this);
        this.removeIngredient = this.removeIngredient.bind(this);
    }

    //Initializes state property of the component
    state = {
        name: "",
        desc: "",
        grams: "",
        ingredients: [],
        previewHtml: <div/>,
    };

    //Removes ingredient from the ingredients array in state at an index given by the ingredientIndex argument
    removeIngredient = (ingredientIndex) => {
        let reducedIngredients = this.state.ingredients;
        reducedIngredients.splice(ingredientIndex,1);
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
        }
    };

    //This function generates a preview of the ingredients user has added to their meal
    generatePreview = (ingredients) => {
        let previewHtml = [];
        let text;
        let i = 0;
        ingredients.forEach(ingredient => {
            text = ingredient.food.name + " " + ingredient.grams;
            previewHtml.push(<div key={this.getKey()}>{text}<RemoveIngredientButton ingredientIndex={i} onClick={this.removeIngredient}/></div>);
            i++;
        });
        this.setState({previewHtml: previewHtml});
    };

    render() {
        console.log(this.state.ingredients);
        return (
            <div>
                <form>
                    <input placeholder="Name" className="name" onChange={this.changeInputText} value={this.state.name}/>
                    <input placeholder="Description" className="desc" onChange={this.changeInputText}
                           value={this.state.desc}/>
                    <div>
                        <SearchFood addMode={true}/>
                        <input placeholder={"Grams"} className="grams" onChange={this.changeInputText}
                               value={this.state.grams} disabled={this.props.searchedFood === null}/>
                        <button onClick={this.addIngredient}>Add to ingredients</button>
                    </div>
                    <button onClick={() =>{console.log(this.state.ingredients)}}>Debug</button>
                    <button onClick={this.handleSubmit}>Submit</button>
                </form>

                <div className="preview">
                    {this.state.previewHtml}
                </div>
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