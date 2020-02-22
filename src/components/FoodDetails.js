import React, {Component} from 'react';
import {connect} from 'react-redux';

class FoodDetails extends Component {

    //receive props with a food object from STORE, show all of its details
    constructor(props) {
        super(props);

        this.keyCount = 0;
        this.getKey = this.getKey.bind(this);
        this.generateIngredientTable.bind(this);
    }

    state = {
        html: <div/>
    };

    componentDidMount() {
        this.generateIngredientTable(this.props.searchedFood.ingredients);
    }

    //Generates unique keys for html elements
    getKey = () => {
        return this.keyCount++;
    };

    generateIngredientTable = (ingredients) => {
        let previewHtml = [];
        let text;
        ingredients.forEach(ingredient => {
            text = ingredient.food.name + " " + ingredient.grams;
            previewHtml.push(<div key={this.getKey()}>{text}</div>);
        });
        this.setState({html: previewHtml});
    };

    render() {
        console.log(this.props.searchedFood.nutritionVal);
        return (
            <div style={{display: this.props.showSearchedFood}}>
                <div key={this.getKey()}><h3>{this.props.searchedFood.name}</h3></div>
                <div style={{display: this.props.searchedFood.ingredients.length > 0}}>
                    {this.state.html}
                </div>
                Kaloricke udaje na 100g
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
            </div>
        )
    }

}

//Ensures reception of the properties from React-Redux Store in props
const mapStateToProps = state => ({
    searchedFood: state.foodReducer.searchedFood,
});

//Connects the component to React-Redux Store
export default connect(mapStateToProps, null)(FoodDetails);