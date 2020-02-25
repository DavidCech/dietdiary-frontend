import React, {Component} from 'react';
import {connect} from 'react-redux';
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

    //This function generates a div with the name of the ingredient for every ingredient the given food has as well
    //as label with additional information for the user
    generateIngredientTable = (ingredients) => {
        let previewHtml = [];
        let text;

        if(ingredients.length>0){
            previewHtml.push(<span className="food-details-label" key={this.getKey()}>{"Ingredience: "}</span>);
        }
        ingredients.forEach(ingredient => {
            text = ingredient.food.name + " " + ingredient.grams;
            previewHtml.push(<span className="food-details-ingredient" key={this.getKey()}>{text}</span>);
        });

        this.setState({html: previewHtml});
    };

    //If its the user who calls this function, it calls the deleteFood function from foodActionCreator with the given food
    deleteFood = () => {
        if(this.props.deleteFood && this.props.searchedFood){
            this.props.deleteFood(this.props.searchedFood);
        }
    };

    render() {
        //If it is the author of the food who views it, this code generates a button which allows the user to delete the
        //food also changes the style of description depending on whether the food has description or not and the style
        //of the wrapper depending on whether the food has any ingredients
        let conditionalDelete = <div />;
        let descriptionName = "food-details-no-description";
        let styleWithIngredients = {};
        if(this.props.searchedFood){
            if(this.props.searchedFood.authorUsername){
                let deleteButton = <button className="delete-button" onClick={this.deleteFood}>X</button>;
                conditionalDelete = localStorage.getItem('username')===this.props.searchedFood.authorUsername ? deleteButton : <div />;
            }
            if(this.props.searchedFood.desc!=="No description" && this.props.searchedFood.desc!=="Bez popisu" ){
                descriptionName = "food-details-description";
            }
            if(this.props.searchedFood.ingredients.length>0){
                styleWithIngredients = {height: "40%", top: "23%"}
            }
        }

        styleWithIngredients = {...styleWithIngredients, display: this.props.showSearchedFood};

        return (
            <div className="food-details-wrapper" style={styleWithIngredients}>
                <h3 className="food-details-header">{this.props.searchedFood.name}</h3>
                <div style={{display: this.props.searchedFood.ingredients.length > 0}}>
                    {this.state.html}
                </div>
                <span className="food-details-label">Kalorické údaje na 100g</span>
                <table className="food-details-table">
                    <tbody>
                    <tr>
                        <th className="food-details-table-header">kcal</th>
                        <th className="food-details-table-header">protein</th>
                        <th className="food-details-table-header">carbs</th>
                        <th className="food-details-table-header">fibre</th>
                        <th className="food-details-table-header">fat</th>
                    </tr>
                    <tr>
                        <td className="food-details-table-cell">{this.props.searchedFood.nutritionVal.kcal}</td>
                        <td className="food-details-table-cell">{this.props.searchedFood.nutritionVal.protein}g</td>
                        <td className="food-details-table-cell">{this.props.searchedFood.nutritionVal.carbs}g</td>
                        <td className="food-details-table-cell">{this.props.searchedFood.nutritionVal.fibre}g</td>
                        <td className="food-details-table-cell">{this.props.searchedFood.nutritionVal.fat}g</td>
                    </tr>
                    </tbody>
                </table>
                <div key={this.getKey()} className={descriptionName}>{this.props.searchedFood.desc}</div>
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