import React,{Component} from 'react';
import {connect} from 'react-redux';

class FoodDetails extends Component{

    //receive props with a food object from STORE, show all of its details

    render(){
        return(
            <div style={{display: this.props.showSearchedFood}}>
                <div>{this.props.searchedFood.name}</div>
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
                            <td>{this.props.searchedFood.nutritionVal.calories}g</td>
                            <td>{this.props.searchedFood.nutritionVal.protein}g</td>
                            <td>{this.props.searchedFood.nutritionVal.carbs}g</td>
                            <td>{this.props.searchedFood.nutritionVal.fibre}g</td>
                            <td>{this.props.searchedFood.nutritionVal.fat}g</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

}

const mapStateToProps = state => ({
   searchedFood: state.searchedFood,
});

export default connect(mapStateToProps, null)(FoodDetails);