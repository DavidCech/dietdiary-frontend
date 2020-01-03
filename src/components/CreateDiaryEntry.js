import React, {Component} from 'react';
import Calendar from 'react-calendar';
import {connect} from 'react-redux';
import {createDiaryEntry} from "../action-creators/diaryEntryActionCreator";
import SearchFood from "./SearchFood";

class CreateDiaryEntry extends Component {

    constructor(props) {
        super(props);

        this.keyCount = 0;
        this.getKey = this.getKey.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.changeGrams = this.changeGrams.bind(this);
        this.addFood = this.addFood.bind(this);
        this.removeFood = this.removeFood.bind(this);
        this.changeActivity = this.changeActivity.bind(this);
    }

    state = {
        date: null,
        activities: {
            kcal: "",
            description: ""
        },
        addedFoods: {
            "breakfast": [],
            "morning_snack": [],
            "lunch": [],
            "afternoon_snack": [],
            "dinner": [],
            "other": []
        },
        mealName: "no_select",
        grams: "",
        tableHtml: <div/>
    };

    //Generates unique keys for html elements
    getKey = () => {
        return this.keyCount++;
    };

    //Generates empty table of meals upon mounting
    componentDidMount() {
        this.generateTable(Object.entries(this.state.addedFoods));
    }

    //Adds food to a given meal array in addedFoods attribute of state, requires mealName and grams to be assigned
    //values by the user through and html form
    addFood = (event) => {
        event.preventDefault();
        if (this.props.searchedFood !== null && this.state.grams !== "" && this.state.mealName !== "no_select") {
            let keys = Object.keys(this.state.addedFoods);
            let entries = Object.entries(this.state.addedFoods);
            keys.forEach(key => {
                if (key.toString() === this.state.mealName) {
                    entries[keys.indexOf(key)][1].push({food: this.props.searchedFood, grams: this.state.grams});
                }
            });
            this.generateTable(entries);
            this.setState({addedFoods: Object.fromEntries(entries)})
        } else {
            console.log("Tady nemam bejt");
        }
    };

    //Changes the number of grams of a food in state when user inputs grams in the html form
    changeGrams = (event) => {
        if(Number(event.target.value) || event.target.value === ""){
            this.setState({grams: event.target.value});
        }
    };

    //Changes attribute mealName in state when user selects one of the options in the html form
    handleSelect = (event) => {
        this.setState({mealName: event.target.value})
    };

    //Changes attribute date in state when user selects one of the dates in the html form
    changeDate = (date) => {
        this.setState({date: date});
    };

    //NEEEEEEEEEEEEEDSSSSS UPDAAAAAAATE
    //Checks whether user put in all necessary data, calls function xxx from diaryEntryActionCreator
    handleSubmit = () => {
        //Checks whether user put in some courses into the entry, if not isEmpty is true and vice versa
        let entries = Object.entries(this.state.addedFoods);
        let isEmpty = true;
        entries.forEach(entry => {
            if (entry[1].length > 0) {
                isEmpty = false;
            }
        });

        //Checks whether user selected a date
        if (this.state.date instanceof Date && !isEmpty) {
            let diaryEntry = {meals: this.state.addedFoods, date: this.state.date, activities: this.state.activities};
            this.props.createDiaryEntry(diaryEntry);
        } else {
            console.log("Musite zadat datum a alespon jedno jidlo")
        }
    };

    //Removes food from attribute addedFoods in state at an index given by the foodIndex argument
    removeFood = (foodIndex) => {
        let entries = Object.entries(this.state.addedFoods);
        entries[foodIndex[0]][1].splice(foodIndex[1], 1);
        this.generateTable(entries);
        this.setState({addedFoods: Object.fromEntries(entries)})
    };

    //Probably does nothing serves debugging purposes
    componentDidUpdate(prevProps, prevState) {
        console.log(this.state.mealName !== "no_select");
        console.log(this.props.searchedFood !== prevProps.searchedFood);
        if (this.props.searchedFood !== prevProps.searchedFood && this.state.mealName !== "no_select") {
            console.log(this.props.searchedFood, this.state.mealName);
        }
    }

    //Changes attributes kcal and description of state attribute activities to values inside the html form
    // input field named kcal and text area named description respectively
    changeActivity = (event) => {
        if(Number(event.target.value) || event.target.className !== "kcal"){
            this.setState({
                activities: {
                    ...this.state.activities,
                    [event.target.className]: event.target.value
                }
            })
        } else {
            console.log("Chyba v zadani aktivit")
        }
    };

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
                    <option value="other">Ostatni</option>
                </select>
                <SearchFood addMode={true} disabled={this.state.mealName === "no_select"}/>
                {/*Currently being added*/}
                <div>
                    {this.props.searchedFood ? this.props.searchedFood.name : "Ahoj"}
                    <form>
                        <input onChange={this.changeGrams} disabled={this.props.searchedFood === null}
                               placeholder="Zadejte gramy" value={this.state.grams}/>
                        <button onClick={this.addFood}>Add</button>
                        {this.state.tableHtml}
                        <h3>Denni aktivita</h3>
                        <input placeholder="Zadejte spalene kalorie" value={this.state.activities.kcal}
                               onChange={this.changeActivity} className="kcal"/>
                        <textarea placeholder="Popis aktivity... napr: jmeno, dodatecne informace pro vas"
                                  value={this.state.activities.description} onChange={this.changeActivity} className="description"/>
                    </form>
                </div>
                <button onClick={() => console.log(this.state.date)}>Debug</button>


            </div>
        )
    }

    // Generates an html table the columns and rows of which are set by the number of meals and number of elements inside
    // the arrays of those meals respectively, meals and their arrays are stored in addedFood attribute of state
    generateTable = (entries) => {
        console.log(entries, "Generuji");
        //Determines number of rows table will have
        let longest = -1;
        for (let i = 0; i < entries.length; i++) {
            if (entries[i][1].length > longest) {
                longest = entries[i][1].length
            }
        }

        let cells;
        let rows = [];
        let mealNames = ["Snidane", "Dopoledni svacina", "Obed", "Odpoledni svacina", "Vecere", "Ostatni"];

        //i represents number of columns rows and j number of columns, if the meals arrays are empty it generates a
        //placeholder instead
        for (let i = 0; i <= longest; i++) {
            cells = [];
            for (let j = 0; j < entries.length; j++) {
                if (i === 0) {
                    cells.push(<th key={this.getKey()}>{mealNames[j]}</th>);
                } else {
                    if (entries[j][1].length > i - 1) {
                        let inflection;
                        if(parseInt(entries[j][1][i - 1].grams) === 1){
                            inflection = "gram";
                        } else if(parseInt(entries[j][1][i - 1].grams) > 1 && parseInt(entries[j][1][i - 1].grams) < 5){
                            inflection = "gramy"
                        } else {
                            inflection = "gramu"
                        }

                        cells.push(
                            <td key={this.getKey()}>
                                {entries[j][1][i - 1].food.name + " " + entries[j][1][i - 1].grams + " " + inflection}
                                <RemoveFoodButton foodIndex={[j, i - 1]} onClick={this.removeFood}/>
                            </td>
                        )
                    } else if (i === 1) {
                        cells.push(<td key={this.getKey()}>{"Pridejte chod"}</td>)
                    } else {
                        cells.push(<td key={this.getKey()}/>)
                    }
                }
            }
            rows.push(<tr key={this.getKey()}>{cells}</tr>);

            //if the arrays are empty inserts a placeholder
            if (longest === 0) {
                cells = [];
                for (let j = 0; j < 6; j++) {
                    cells.push(<td key={this.getKey()}>{"Pridejte chod"}</td>)
                }
                rows.push(<tr key={this.getKey()}>{cells}</tr>);
            }
        }

        let table = <table>
            <tbody>{rows}</tbody>
        </table>;

        this.setState({tableHtml: table})
    }
}

//Button for removing foods from table, receives arguments foodIndex and onClick, foodIndex is the entry index of the
//food which is to be removed from addedFoods, onClick is the function that is to be called onClick
class RemoveFoodButton extends Component {
    handleClick = () => {
        this.props.onClick(this.props.foodIndex);
    };

    render() {
        return (
            <button onClick={this.handleClick}>X</button>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    createDiaryEntry: (diaryEntry) => {
        dispatch(createDiaryEntry(diaryEntry));
    },
});

const mapStateToProps = state => ({
    searchedFood: state.searchedFood,
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateDiaryEntry);