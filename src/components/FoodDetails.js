import React, {Component} from 'react';
import {connect} from 'react-redux';
import {deleteFood} from "../action-creators/foodActionCreator";

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

    //This function generates a div with the name of the ingredient for every ingredient the given food has
    generateIngredientTable = (ingredients) => {
        let previewHtml = [];
        let text;
        ingredients.forEach(ingredient => {
            text = ingredient.food.name + " " + ingredient.grams;
            previewHtml.push(<div key={this.getKey()}>{text}</div>);
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
        //food
        let conditionalDelete = <div />;
        if(this.props.searchedFood){
            if(this.props.searchedFood.authorUsername){
                let deleteButton = <button className="delete-button" onClick={this.deleteFood}>X</button>;
                conditionalDelete = localStorage.getItem('username')===this.props.searchedFood.authorUsername ? deleteButton : <div />;
            }
        }

        return (
            <div style={{display: this.props.showSearchedFood}}>
                <div key={this.getKey()}><h3>{this.props.searchedFood.name}</h3></div>
                <div style={{display: this.props.searchedFood.ingredients.length > 0}}>
                    {this.state.html}
                </div>
                <span>Kalorické údaje na 100g</span>
                <table>
                    <tbody>
                    <tr>
                        <th>kcal</th>
                        <th>protein</th>
                        <th>carbs</th>
                        <th>fibre</th>
                        <th>fat</th>
                    </tr>
                    <tr>
                        <td>{this.props.searchedFood.nutritionVal.kcal}</td>
                        <td>{this.props.searchedFood.nutritionVal.protein}g</td>
                        <td>{this.props.searchedFood.nutritionVal.carbs}g</td>
                        <td>{this.props.searchedFood.nutritionVal.fibre}g</td>
                        <td>{this.props.searchedFood.nutritionVal.fat}g</td>
                    </tr>
                    </tbody>
                </table>
                <div key={this.getKey()}>{this.props.searchedFood.desc}</div>
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