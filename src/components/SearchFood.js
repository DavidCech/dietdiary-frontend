import React, {Component} from 'react';
import {getFoods} from "../action-creators/foodActionCreator";
import {debounce} from 'lodash';
import {connect} from 'react-redux';

class SearchFood extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.debouncedDispatch = this.debouncedDispatch.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);

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

    render() {
        let names = "";
        if(this.props.empty){
            names = "Jidlo s takovym nazvem se v databazi nenachazi";
        } else if(this.props.foods !== undefined){
            this.props.foods.forEach(food => {
                names += food.name + ", ";
            });
        }

        let nextPageDisplay = "none";
        let previousPageDisplay = "none";
        if(!this.props.last && this.props.foods.length !== 0){
            nextPageDisplay = "block"
        } else if (this.state.currentPage > 0 && this.props.foods.length !== 0){
            previousPageDisplay = "block"
        }

        return (
            <div>
                <button style={{display: nextPageDisplay}} className="next-page-button" onClick={this.nextPage}> Next </button>
                <button style={{display: previousPageDisplay}} className="previous-page-button" onClick={this.previousPage}> Previous </button>
                {names}
                <input onChange={this.handleChange}/>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    foods: state.foods,
    last: state.last,
    empty: state.empty,
});

const mapDispatchToProps = (dispatch) => ({
    getFood: (name, page) => {
        dispatch(getFoods(name, page))
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchFood);