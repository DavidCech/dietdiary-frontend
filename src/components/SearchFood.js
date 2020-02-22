import React, {Component} from 'react';
import {getFoods, searchedFoodToState, foodCleanUp} from "../action-creators/foodActionCreator";
import {debounce} from 'lodash';
import {connect} from 'react-redux';
import FoodDetails from "./FoodDetails";

//This component serves as GUI for searching for foods
class SearchFood extends Component {

    //Initializes functions and debounce which ensures that there are not too many requests sent to backend
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.debouncedDispatch = this.debouncedDispatch.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);

        this.debouncedDispatch = debounce(this.debouncedDispatch, 500);
    }

    //Initializes state property of the component
    state = {
        foodInput: "",
        currentPage: 0
    };

    //Whenever user types into the input used for searching foods this function changes foodInput property of state and
    //calls debouncedDispatch
    handleChange = (event) => {
        if (!this.props.disabled) {
            let foodInput = event.target.value;
            this.setState({foodInput});

            this.debouncedDispatch(foodInput, 0)
        }
    };

    //Calls function getFood from foodActionCreator with parameters input and page
    debouncedDispatch = (input, page) => {
        this.props.getFood(input, page);
    };

    //Prevents calling the action when user leaves the url after typing into the search bar and calls the cleanUp function
    //from foodActionCreator
    componentWillUnmount() {
        if(this.props.cleanUp){
            this.props.cleanUp();
        }
        this.debouncedDispatch.cancel();
    }

    //Increases the currentPage attribute of state by one when user clicks on the given button and calls getFood
    //function from foodActionCreator with the appropriate page number
    nextPage = (event) => {
        event.preventDefault();
        if (!this.props.last) {
            this.props.getFood(this.state.foodInput, this.state.currentPage + 1);
            this.setState({currentPage: this.state.currentPage + 1});
        }
    };

    //Decreases the currentPage attribute of state by one when user clicks on the given button and calls getFood
    //function from foodActionCreator with the appropriate page number
    previousPage = (event) => {
        event.preventDefault();
        if (this.state.currentPage > 0) {
            this.props.getFood(this.state.foodInput, this.state.currentPage - 1);
            this.setState({currentPage: this.state.currentPage - 1});
        }
    };

    render() {
        //Shows div with searched data after searching or a placeholder text
        let names = <div>Vyhledejte jidlo</div>;
        if (this.props.empty) {
            names = <div>Jidlo s takovym nazvem se v databazi nenachazi</div>;
        } else if (this.props.foods.length !== 0) {
            names = this.props.foods.map(food => (
                <FoodClickable key={food._id} food={food} searchedFoodToState={this.props.searchedFoodToState}
                               addMode={this.props.addMode}/>
            ));
        }

        //Takes care of displaying next and previous page buttons only when there are such pages
        let nextPageDisplay = "none";
        let previousPageDisplay = "none";
        if (!this.props.last && this.props.foods.length !== 0) {
            nextPageDisplay = "block"
        } else if (this.state.currentPage > 0 && this.props.foods.length !== 0) {
            previousPageDisplay = "block"
        }

        //Shows the FoodDetails component for the particular food after user clicks on the name of the food
        let searchedFoodHtml = <div/>;
        let showSearchedFood = "none";
        if (this.props.searchedFood && !this.props.addMode) {
            showSearchedFood = "block";
            searchedFoodHtml = <FoodDetails showSearchedFood={showSearchedFood}/>;
        }

        //Disables the input when the user is not logged in
        let selectCheck = this.props.disabled ? true : false;

        return (
            /*Show searched food dependant on props CreateDE will pass false*/
            <div>
                <button style={{display: nextPageDisplay}} className="next-page-button" onClick={this.nextPage}> Next
                </button>
                <button style={{display: previousPageDisplay}} className="previous-page-button"
                        onClick={this.previousPage}> Previous
                </button>
                <input onChange={this.handleChange} disabled={selectCheck} placeholder={"Search for food"}/>
                <button onClick={() => console.log(this.state.foodInput)}> Ahoj</button>
                {names}
                <p/>
                {searchedFoodHtml}
            </div>
        )
    }
}

//Creates a component which on click fetches given food from backend
class FoodClickable extends Component {
    handleClick = () => {
        this.props.searchedFoodToState(this.props.food)
    };

    render() {
        return (
            <div onClick={this.handleClick}>
                {this.props.food.name}
            </div>
        )
    }
}

//Ensures reception of the properties from React-Redux Store in props
const mapStateToProps = state => ({
    foods: state.foodReducer.foods,
    last: state.foodReducer.last,
    empty: state.foodReducer.isEmpty,
    searchedFood: state.foodReducer.searchedFood,
});

//Ensures reception of the functions from actionCreators in props
const mapDispatchToProps = (dispatch) => ({
    getFood: (name, page) => {
        dispatch(getFoods(name, page));
    },
    searchedFoodToState: (food) => {
        dispatch(searchedFoodToState(food));
    },
    cleanUp: () => {
        dispatch(foodCleanUp());
    },
});

//Connects the component to React-Redux Store
export default connect(mapStateToProps, mapDispatchToProps)(SearchFood);