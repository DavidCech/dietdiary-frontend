import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createFood} from "../action-creators/foodActionCreator";
import SearchFood from "./SearchFood";

class CreateMeal extends Component {

    constructor(props) {
        super(props);
        this.changeInputText = this.changeInputText.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addIngredient = this.addIngredient.bind(this);
        this.generatePreview = this.generatePreview.bind(this);
    }

    state = {
        name: "",
        desc: "",
        grams: "",
        ingredients: [],
        previewHtml: <div/>,
    };

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

    addIngredient = (event) => {
        event.preventDefault();
        if (this.props.searchedFood !== null && this.state.grams !== "") {
            let newIngredients = [...this.state.ingredients, {food: this.props.searchedFood, grams: this.state.grams}];
            this.setState({ingredients: newIngredients});
            this.generatePreview(newIngredients);
        }

    };

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
        //console.log(food)
    };

    generatePreview = (ingredients) => {
        let previewHtml = [];
        let text;
        ingredients.forEach(ingredient => {
            text = ingredient.food.name + " " + ingredient.grams;
            previewHtml.push(<div>{text}</div>);
        });
        this.setState({previewHtml: previewHtml});
    };

    render() {
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
                    <button onClick={() => console.log(this.props.searchedFood)}>Debug</button>
                    <button onClick={this.handleSubmit}>Submit</button>
                </form>

                <div className="preview">
                    {this.state.previewHtml}
                </div>
            </div>
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