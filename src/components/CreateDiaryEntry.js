import React, {Component} from 'react';
import Calendar from 'react-calendar';

class CreateDiaryEntry extends Component {

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
        //console.log(date);
        this.setState({date})
    };

    handleCheckbox = () => {
        this.setState({multipleSelection: !this.state.multipleSelection})
    };

    handleSubmit = () => {
        if (Array.isArray(this.state.date)) {
            let begining = this.state.date[0];
            let end = this.state.date[1];
            console.log(begining + "\n" + end);
        } else if (this.state.date instanceof Date) {
            let singleDay = this.state.date;
            console.log(singleDay);
        } else {
            console.log("Musite zvolit datum nebo data v kalendari")
        }
    };

    render() {
        return (
            <div>
                Select more than one day <input type="checkbox" onClick={this.handleCheckbox}/>
                <Calendar onChange={this.handleChange} selectRange={this.state.multipleSelection}/>
                <button onClick={this.handleSubmit}>Submit</button>
            </div>
        )
    }
}

export default CreateDiaryEntry;