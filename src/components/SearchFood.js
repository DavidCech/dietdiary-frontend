import React, {Component} from 'react';
import {getFoods, searchedFoodToState} from "../action-creators/foodActionCreator";
import {debounce} from 'lodash';
import {connect} from 'react-redux';

class SearchFood extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.debouncedDispatch = this.debouncedDispatch.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.showFoodDetails = this.showFoodDetails.bind(this);

        this.debouncedDispatch = debounce(this.debouncedDispatch, 500);
    }

    state = {
        foodInput: "",
        currentPage: 0
    };

    handleChange = (event) => {
        let foodInput = event.target.value;
        this.setState({ foodInput });

        this.debouncedDispatch(foodInput, 0)
    };

    debouncedDispatch = (input, page) => {
        this.props.getFood(input, page);
    };

    //Prevents calling the action when user leaves the url after typing into the search bar
    componentWillUnmount(){
        this.debouncedDispatch.cancel();
    }

    nextPage = () => {
        if(!this.props.last){
            this.props.getFood(this.state.foodInput, this.state.currentPage+1);
            this.setState({currentPage: this.state.currentPage+1});
        }
    };

    previousPage = () => {
        if(this.state.currentPage > 0){
            this.props.getFood(this.state.foodInput, this.state.currentPage-1);
            this.setState({currentPage: this.state.currentPage-1});
        }
    };

    showFoodDetails = (event) =>{
      console.log(event.target.getAttribute('food-id'));
      this.props.foods.forEach(food => {
          if(food._id === event.target.getAttribute('food-id')){
              this.props.searchedFoodToState(food);
              console.log(food.name)
          }
      })
    };

    render() {
        let names = <div>Vyhledejte jidlo</div>;
        if(this.props.empty){
            names = <div>Jidlo s takovym nazvem se v databazi nenachazi</div>;
        } else if(this.props.foods.length !== 0){
            names = this.props.foods.map(food => (
                <FoodClickable key={food._id} food={food} searchedFoodToState={this.props.searchedFoodToState}/>
            ));
        }

        let nextPageDisplay = "none";
        let previousPageDisplay = "none";
        if(!this.props.last && this.props.foods.length !== 0){
            nextPageDisplay = "block"
        } else if (this.state.currentPage > 0 && this.props.foods.length !== 0){
            previousPageDisplay = "block"
        }

        return (
            /*Show searched food dependant on props CreateDE will pass false*/
            <div>
                <button style={{display: nextPageDisplay}} className="next-page-button" onClick={this.nextPage}> Next </button>
                <button style={{display: previousPageDisplay}} className="previous-page-button" onClick={this.previousPage}> Previous </button>
                <input onChange={this.handleChange}/>
                <button onClick={() => console.log(this.props.searchedFood)}> Ahoj</button>
                {names}
            </div>
        )
    }
}

class FoodClickable extends Component {
    handleClick = () =>{
        this.props.searchedFoodToState(this.props.food)
    };

    render(){
        return(
            <div onClick={this.handleClick}>
                {this.props.food.name}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    foods: state.foods,
    last: state.last,
    empty: state.empty,
    searchedFood: state.searchedFood,
});

const mapDispatchToProps = (dispatch) => ({
    getFood: (name, page) => {
        dispatch(getFoods(name, page));
    },
    searchedFoodToState: (food) =>{
        dispatch(searchedFoodToState(food));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchFood);