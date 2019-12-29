import React, {Component} from 'react';
import Calendar from 'react-calendar';
import {connect} from 'react-redux';
import {createDiaryEntry} from "../action-creators/diaryEntryActionCreator";
import SearchFood from "./SearchFood";

class CreateDiaryEntry extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.changeGrams = this.changeGrams.bind(this);
        this.addFood = this.addFood.bind(this);
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
        },
        addedFoods: {
            "breakfast": [],
            "morning_snack": [],
            "lunch": [],
            "afternoon_snack": [],
            "dinner": [],
            "others": [],
        },
        mealName: "no_select",
        grams: "",
        tableHtml: <div />,
    };


    addFood = (event) => {
        event.preventDefault();
        if (this.props.searchedFood !== null && this.state.grams !== "" && this.state.mealName !== "no_select") {
            console.log(this.state.grams, this.props.searchedFood.name, this.state.mealName);
            let keys = Object.keys(this.state.addedFoods);
            let entries = Object.entries(this.state.addedFoods);
            console.log(keys);
            keys.map(key => {
                if (key.toString() === this.state.mealName) {
                    console.log(keys.indexOf(key));
                    console.log(entries[keys.indexOf(key)][2]);
                    entries[keys.indexOf(key)][1].push({food: this.props.searchedFood, grams: this.state.grams});
                }
            });
            this.generateTable(entries);
            this.setState({addedFoods: Object.fromEntries(entries)})
        } else {
            console.log("Tady nemam bejt");
        }
    };

    changeGrams = (event) => {
        console.log(event.target.value);
        this.setState({grams: event.target.value});
    };

    //Meni atribut mealName ve state podle vyberu uzivatele
    handleSelect = (event) => {
        console.log(event.target.value);
        this.setState({mealName: event.target.value})
    };

    changeDate = (date) => {
        this.setState({date: date, diaryEntry: {...this.state.diaryEntry, date: date}});
        console.log(this.state.diaryEntry);
    };

    handleSubmit = () => {
        let diaryEntry = this.state.diaryEntry;
        if (diaryEntry.date instanceof Date) {
            let singleDay = diaryEntry.date;
            console.log(diaryEntry);
            createDiaryEntry(this.state.diaryEntry);
        } else {
            console.log("Musite zvolit datum nebo data v kalendari")
        }
    };

    componentDidUpdate(prevProps, prevState) {
        console.log(this.state.mealName !== "no_select");
        console.log(this.props.searchedFood !== prevProps.searchedFood);
        if (this.props.searchedFood !== prevProps.searchedFood && this.state.mealName !== "no_select") {
            console.log(this.props.searchedFood, this.state.mealName)
        }
    }

    render() {
        //Disabled will be probably changed to hidden

        return (
            <div>
                <Calendar onChange={this.changeDate}/>
                <button onClick={this.handleSubmit}>Submit</button>
                <select value={this.state.mealName} onChange={this.handleSelect}>
                    <option value="no_select" disabled hidden>Vyberte chod</option>
                    <option value="breakfast">Snidane</option>
                    <option value="morning_snack">Dopoledni svacina</option>
                    <option value="lunch">Obed</option>
                    <option value="afternoon_snack">Odpoledni svacina</option>
                    <option value="dinner">Vecere</option>
                    <option value="others">Ostatni</option>
                </select>
                <SearchFood addMode={true} disabled={this.state.mealName === "no_select"}/>
                {/*Currently being added*/}
                <div>
                    {this.props.searchedFood ? this.props.searchedFood.name : "Ahoj"}
                    <form>
                        <input onChange={this.changeGrams} disabled={this.props.searchedFood === null}
                               placeholder="Zadejte gramy" value={this.state.grams}/>
                        <button onClick={this.addFood}>Add</button>
                    </form>
                </div>
                <button onClick={() => console.log(this.state.addedFoods)}>Debug</button>

                {this.state.tableHtml}

            </div>
        )
    }

    generateTable = (entries) => {
        console.log(entries, "Generuji");
        let longest = -1;
        for(let i = 0; i < entries.length; i++){
            console.log(entries[i][1].length);
            if(entries[i][1].length > longest){
                longest = entries[i][1].length
            }
        }
        console.log(longest);

        let cells;
        let rows = [];
        //tr tag needed
        let mealNames = ["Breakfast", "Morning snack", "Lunch", "Afternoon snack", "Dinner", "Other"];

        for(let i = 0; i <= longest; i++){
            cells = [];
            for (let j = 0; j<entries.length; j++){
                if(i===0){
                    cells.push(<th>{mealNames[j]}</th>);
                } else {
                    if(entries[j][1].length > i-1) {
                        console.log(entries[j][1]);
                        cells.push(<td>{entries[j][1][i-1].grams}</td>)
                    } else{
                        cells.push(<td />)
                    }
                }
            }
            rows.push(<tr>{cells}</tr>)
        }
        let table = <table><tbody>{rows}</tbody></table>;

        console.log(cells);
        this.setState({tableHtml: table})
    }
}

const mapDispatchToProps = dispatch => ({
    createDiaryEntry: (diaryEntry) => {
        dispatch(createDiaryEntry(diaryEntry));
    },
});

//potentionally null
const mapStateToProps = state => ({
    searchedFood: state.searchedFood,
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateDiaryEntry);