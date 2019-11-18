import React, {Component} from 'react';
import Calendar from 'react-calendar';
import {connect} from 'react-redux';
import {createDiaryEntry} from "../action-creators/diaryEntryActionCreator";

class CreateDiaryEntry extends Component {

    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    state = {
        date: null,
        diaryEntry: {
            date: "1995-12-21T03:24:00",
            activities: {
                kcal: 15,
                description: "Jogging"
            },
            //meals: will have just idies of foods
            meals: [{
                kcal: 1,
                protein: 2,
                carbs: 3,
                fat: 4,
                fibre: 5,
                _id: "5dcd8e26c36dd53338b62f9a",
                name: "breakfast",
                contents: ""
            },
                {
                    kcal: 5,
                    protein: 4,
                    carbs: 3,
                    fat: 2,
                    fibre: 1,
                    _id: "5dcd8e26c36dd53338b62f9b",
                    name: "morning_snack",
                    contents: ""
                }, {
                    kcal: 2,
                    protein: 3,
                    carbs: 2,
                    fat: 3,
                    fibre: 2,
                    _id: "5dcd8e26c36dd53338b62f9c",
                    name: "lunch",
                    contents: ""
                },
                {
                    kcal: 9,
                    protein: 6,
                    carbs: 5,
                    fat: 4,
                    fibre: 3,
                    _id: "5dcd8e26c36dd53338b62f9d",
                    name: "afternoon_snack",
                    contents: ""
                }, {
                    kcal: 8,
                    protein: 4,
                    carbs: 1,
                    fat: 4,
                    fibre: 9,
                    _id: "5dcd8e26c36dd53338b62f9e",
                    name: "dinner",
                    contents: ""
                },
                {
                    kcal: 6,
                    protein: 6,
                    carbs: 6,
                    fat: 6,
                    fibre: 6,
                    _id: "5dcd8e26c36dd53338b62f9f",
                    name: "others",
                    contents: ""
                }
            ],
        }
    };

    handleChange = (date) => {
        this.setState({diaryEntry: {...this.state.diaryEntry , date: date}});
        console.log(this.state.diaryEntry);
    };

    handleSubmit = () => {
        if (this.state.date instanceof Date) {
            let singleDay = this.state.date;
            console.log(singleDay);
            createDiaryEntry(this.state.diaryEntry);
        } else {
            console.log("Musite zvolit datum nebo data v kalendari")
        }
    };

    render() {
        //Implement some kind of assignment of searched foods to meals
        return (
            <div>
                <Calendar onChange={this.handleChange}/>
                <button onClick={this.handleSubmit}>Submit</button>
                Dropdown/Popup, Searchbar, Grams
                <table>
                    <tbody>
                        <tr>
                            <th>Breakfast</th>
                            <th>Morning Snack</th>
                            <th>Lunch</th>
                            <th>Afternoon Snack</th>
                            <th>Dinner</th>
                            <th>Others</th>
                        </tr>
                        <tr>
                            <td>Pridejte potravinu</td>
                            <td>Pridejte potravinu</td>
                            <td>Pridejte potravinu</td>
                            <td>Pridejte potravinu</td>
                            <td>Pridejte potravinu</td>
                            <td>Pridejte potravinu</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch =>({
    createDiaryEntry: (diaryEntry) => {
        dispatch(createDiaryEntry(diaryEntry));
    },
});

//potentionally null
const mapStateToProps = state =>{

};

export default connect(mapStateToProps, mapDispatchToProps)(CreateDiaryEntry);