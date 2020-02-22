import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createFood} from "../action-creators/foodActionCreator";

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

    //Checks whether the user submitted all the necessary data and if that is the case then this function creates
    //an object from these data and calls function createFood from foodActionCreator with this object as a parameter
    handleSubmit = (event) => {
        event.preventDefault();
        let emptyCheck = this.state.name === "";
        //Checks whether the nutritional values are empty
        Object.entries(this.state.nutritionVal).forEach(nutritionVal => {
            if (nutritionVal[1] === "") {
                emptyCheck = true
            }
        });

        if (!emptyCheck) {
            //creates the object and calls the function
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
        }
    };

    render() {
        return (
            <div>
                <form>
                    <input placeholder="Name" className="name" onChange={this.changeInputText} value={this.state.name}/>
                    <div>
                        {"Nutritional values"}
                        <input placeholder="kcal" className="kcal" onChange={this.changeInputText}
                               value={this.state.nutritionVal.kcal}/>
                        <input placeholder="Protein" className="protein" onChange={this.changeInputText}
                               value={this.state.nutritionVal.protein}/>
                        <input placeholder="Carbohydrates" className="carbs" onChange={this.changeInputText}
                               value={this.state.nutritionVal.carbs}/>
                        <input placeholder="Fat" className="fat" onChange={this.changeInputText}
                               value={this.state.nutritionVal.fat}/>
                        <input placeholder="Fibre" className="fibre" onChange={this.changeInputText}
                               value={this.state.nutritionVal.fibre}/>
                    </div>
                    <input placeholder="Description" className="desc" onChange={this.changeInputText}
                           value={this.state.desc}/>
                    <button onClick={this.handleSubmit}>Submit</button>
                </form>
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