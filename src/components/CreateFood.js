import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {createFood} from "../action-creators/foodActionCreator";

class CreateFood extends Component {

    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        name: "",
        nutritionVal: {
            kcal: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            fibre: 0,
        },
        desc: "",
        ingredients: [],
    };

    handleChange = (event) => {
        if(event.target.className === "name" || event.target.className === "desc") {
            this.setState({
                [event.target.className]: event.target.value
            })
        } else {
            this.setState({
                nutritionVal: {
                    ...this.state.nutritionVal,
                    [event.target.className]: event.target.value
                }
            })
        }
    };

    handleSubmit = (event) =>{
        event.preventDefault();
        const food = {
            name: this.state.name,
            nutritionVal: {
                kcal: this.state.nutritionVal.kcal,
                protein: this.state.nutritionVal.protein,
                carbs: this.state.nutritionVal.carbs,
                fat: this.state.nutritionVal.fat,
                fibre: this.state.nutritionVal.fibre,
            },
            desc: this.state.desc,
            ingredients: this.state.ingredients,
        };
        this.props.createFood(food);
    };

    render(){
        return(
            <div>
                <form>
                    <input placeholder="Name" className="name" onChange={this.handleChange}/>
                    <div>
                        {"Nutritional values"}
                        <input placeholder="kcal" className="kcal" onChange={this.handleChange}/>
                        <input placeholder="protein" className="protein" onChange={this.handleChange}/>
                        <input placeholder="carbohydrates" className="carbs" onChange={this.handleChange}/>
                        <input placeholder="fat" className="fat" onChange={this.handleChange}/>
                        <input placeholder="fibre" className="fibre" onChange={this.handleChange}/>
                    </div>
                    <input placeholder="Description" className="desc" onChange={this.handleChange}/>
                    <input placeholder="Search for ingredients" className="ingredients"/>
                    <button onClick={this.handleSubmit}>Submit</button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = (dispatch) => ({
    createFood: (food) => {
        dispatch(createFood(food))
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(CreateFood);