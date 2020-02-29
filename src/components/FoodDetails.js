import React, {Component} from 'react';
import {connect} from 'react-redux';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {deleteFood} from "../action-creators/foodActionCreator";
import '../styles/fooddetails.css';

//This component displays given food in detail and allows the author of the food to delete it
class FoodDetails extends Component {

    //Initializes functions and variable keyCount in this class
    constructor(props) {
        super(props);

        this.keyCount = 0;
        this.getKey = this.getKey.bind(this);
        this.generateIngredientTable.bind(this);
        this.deleteFood = this.deleteFood.bind(this);
        this.handleGramInflection = this.handleGramInflection.bind(this);
    }

    //Initializes state property of the component
    state = {
        html: <div/>
    };

    //Upon mount of the component calls generateIngredientTable function
    componentDidMount() {
        this.generateIngredientTable(this.props.searchedFood.ingredients);
    }

    //Generates unique keys for html elements
    getKey = () => {
        return this.keyCount++;
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

    //This function generates a div with the name of the ingredient for every ingredient the given food has
    generateIngredientTable = (ingredients) => {
        let previewHtml = [];
        let text;

        ingredients.forEach(ingredient => {
            text = ingredient.food.name + " " + ingredient.grams + " " + this.handleGramInflection(ingredient.grams);
            previewHtml.push(<span className="food-details-ingredient" key={this.getKey()}>{text}</span>);
        });

        this.setState({html: previewHtml});
    };

    //If its the user who calls this function, it calls the deleteFood function from foodActionCreator with the given food
    deleteFood = () => {
        if (this.props.deleteFood && this.props.searchedFood) {
            this.props.deleteFood(this.props.searchedFood);
        }
    };

    render() {
        //If it is the author of the food who views it, this code generates a button which allows the user to delete the
        //food also changes the style of description depending on whether the food has description or not and the style
        //of the wrapper depending on whether the food has any ingredients
        let conditionalDelete = <div/>;
        let descriptionDisplay = "block";
        let styleWithIngredients = {};
        if (this.props.searchedFood) {
            if (this.props.searchedFood.authorUsername && !this.props.viewOnly) {
                let deleteButton = <i onClick={this.deleteFood} className="far fa-trash-alt delete-button"/>;
                conditionalDelete = localStorage.getItem('username') === this.props.searchedFood.authorUsername ? deleteButton :
                    <div/>;
            }
            if (this.props.searchedFood.desc === "No description" || this.props.searchedFood.desc === "Bez popisu") {
                styleWithIngredients = {top: "40%"};
                descriptionDisplay = "none";
            } else if (this.props.searchedFood.ingredients.length > 0) {
                if (this.props.searchedFood.ingredients.length <= 2) {
                    styleWithIngredients = {top: "27%"};
                } else {
                    styleWithIngredients = {top: "23%"};
                }
            }
            if (this.props.searchedFood.ingredients.length > 0 &&
                (this.props.searchedFood.desc === "No description" || this.props.searchedFood.desc === "Bez popisu")) {
                styleWithIngredients = {top: "31.2%"};
            } else if ((this.props.searchedFood.ingredients.length === 0 &&
                !(this.props.searchedFood.desc === "No description" || this.props.searchedFood.desc === "Bez popisu"))) {
                styleWithIngredients = {top: "32%"};
            }
        }

        let showIngredients = this.props.searchedFood.ingredients.length > 0 ? "block" : "none";
        styleWithIngredients = {...styleWithIngredients, display: this.props.showSearchedFood};

        return (
            <div className="food-details-wrapper" style={styleWithIngredients}>
                <h3 className="food-details-header">{this.props.searchedFood.name}</h3>
                <span className="food-details-label" style={{display: showIngredients}}
                      key={this.getKey()}>{"Ingredience: "}</span>
                <div className="food-details-ingredients-wrapper" style={{display: showIngredients}}>
                    {this.state.html}
                </div>
                <span className="food-details-label"
                      style={{textAlign: "center"}}>{"Kalorické údaje na 100 gramů"}</span>
                <table className="food-details-table">
                    <tbody>
                    <tr>
                        <th className="food-details-table-header">Kilokalorie</th>
                        <th className="food-details-table-header">Bílkoviny</th>
                        <th className="food-details-table-header">Sacharidy</th>
                        <th className="food-details-table-header">Vláknina</th>
                        <th className="food-details-table-header">Tuky</th>
                    </tr>
                    <tr>
                        <td className="food-details-table-cell">
                            {this.props.searchedFood.nutritionVal.kcal + " kcal"}
                        </td>
                        <td className="food-details-table-cell">
                            {this.props.searchedFood.nutritionVal.protein + " " +
                            this.handleGramInflection(this.props.searchedFood.nutritionVal.protein)}
                        </td>
                        <td className="food-details-table-cell">
                            {this.props.searchedFood.nutritionVal.carbs + " " +
                            this.handleGramInflection(this.props.searchedFood.nutritionVal.carbs)}
                        </td>
                        <td className="food-details-table-cell">
                            {this.props.searchedFood.nutritionVal.fibre + " " +
                            this.handleGramInflection(this.props.searchedFood.nutritionVal.fibre)}
                        </td>
                        <td className="food-details-table-cell">
                            {this.props.searchedFood.nutritionVal.fat + " " +
                            this.handleGramInflection(this.props.searchedFood.nutritionVal.fat)}
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div key={this.getKey()} style={{display: descriptionDisplay}}
                     className="food-details-description">{this.props.searchedFood.desc}</div>
                {conditionalDelete}
            </div>
        )
    }

}

//Ensures reception of the functions from actionCreators in props
const mapDispatchToProps = (dispatch) => ({
    deleteFood: (food) => {
        dispatch(deleteFood(food));
    }
});

//Ensures reception of the properties from React-Redux Store in props
const mapStateToProps = state => ({
    searchedFood: state.foodReducer.searchedFood,
});

//Connects the component to React-Redux Store
export default connect(mapStateToProps, mapDispatchToProps)(FoodDetails);