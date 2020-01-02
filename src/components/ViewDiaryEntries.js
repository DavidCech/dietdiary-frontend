import React, {Component} from 'react';
import Calendar from "react-calendar";
import {connect} from 'react-redux';
import {getDiaryEntries} from "../action-creators/diaryEntryActionCreator";

class ViewDiaryEntries extends Component{
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    state = {
        date: null,
        multipleSelection: false,
    };

    handleChange = (date) => {
        console.log(date);
        this.setState({date})
    };

    handleCheckbox = () => {
        this.setState({
            multipleSelection: !this.state.multipleSelection,
            date: null
        })
    };

    handleSubmit = () => {
        if (this.state.date!==null) {
            this.props.getDiaryEntries(JSON.stringify(this.state.date));
        } else {
            console.log("Musite zvolit datum nebo data v kalendari")
        }
    };

    render() {
        return (
            <div>
                Select more than one day <input type="checkbox" onClick={this.handleCheckbox}/>
                <Calendar onChange={this.handleChange} selectRange={this.state.multipleSelection} value={this.state.date}/>
                <button onClick={this.handleSubmit}>Submit</button>
                <button onClick={()=>console.log(this.props.searchedDiaryEntries)}>Debug</button>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    getDiaryEntries: (date) => {
        dispatch(getDiaryEntries(date));
    },
});

const mapStateToProps = state => ({
    searchedDiaryEntries: state.searchedDiaryEntries,
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewDiaryEntries);