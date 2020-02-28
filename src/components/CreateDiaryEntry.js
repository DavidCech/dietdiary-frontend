import React, {Component} from 'react';
import Calendar from 'react-calendar';
import {connect} from 'react-redux';
import {createDiaryEntry, messageCleanUp} from "../action-creators/diaryEntryActionCreator";
import SearchFood from "./SearchFood";
import {searchedFoodCleanUp} from "../action-creators/foodActionCreator";
import '../styles/creatediaryentry.css';
import FoodDetails from "./FoodDetails";

//This component serves as GUI for creating dietDiaryEntries
class CreateDiaryEntry extends Component {

    //Initializes functions and variable keyCount in this class
    constructor(props) {
        super(props);

        this.keyCount = 0;
        this.getKey = this.getKey.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.changeGrams = this.changeGrams.bind(this);
        this.addFood = this.addFood.bind(this);
        this.removeFood = this.removeFood.bind(this);
        this.changeActivity = this.changeActivity.bind(this);
        this.nextMeal = this.nextMeal.bind(this);
        this.previousMeal = this.previousMeal.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.previousStep = this.previousStep.bind(this);
    }

    //Initializes state property of the component
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
        step: 1,
        mealName: "breakfast",
        mealIndex: 0,
        grams: "",
        tableHtml: <div/>,
        createdMessage: "",
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
    //values by the user through an html form and then it clears seachedFood from Store for rendering purposes
    addFood = (event) => {
        event.preventDefault();
        if (this.props.searchedFood !== null && this.state.grams !== "" && this.props.searchedFoodCleanUp) {
            let keys = Object.keys(this.state.addedFoods);
            let entries = Object.entries(this.state.addedFoods);
            keys.forEach(key => {
                if (key.toString() === this.state.mealName) {
                    entries[keys.indexOf(key)][1].push({food: this.props.searchedFood, grams: this.state.grams});
                }
            });
            this.setState({addedFoods: Object.fromEntries(entries), createdMessage: "Jídlo přidáno"});
            this.props.searchedFoodCleanUp();
        } else {
            this.setState({createdMessage: "Nejprve musíte zadat gramy"});
        }
    };

    //Changes the number of grams of a food in state when user inputs grams in the html form
    changeGrams = (event) => {
        if (Number(event.target.value) || event.target.value === "") {
            this.setState({grams: event.target.value});
        }
    };

    //Changes the meal to which the user is adding their meals to the one after the current one
    nextMeal = (event) => {
        let mealNames = ["breakfast", "morning_snack", "lunch", "afternoon_snack", "dinner", "other"];
        for (let i = 0; i < mealNames.length - 1; i++) {
            if (this.state.mealName === mealNames[i]) {
                this.setState({mealName: mealNames[i + 1], mealIndex: i + 1});
                break;
            }
        }
    };

    //Changes the meal to which the user is adding their meals to the one before the current one
    previousMeal = (event) => {
        let mealNames = ["breakfast", "morning_snack", "lunch", "afternoon_snack", "dinner", "other"];
        for (let i = 1; i < mealNames.length; i++) {
            if (this.state.mealName === mealNames[i]) {
                this.setState({mealName: mealNames[i - 1], mealIndex: i - 1});
                break;
            }
        }
    };

    //Adds 1 to the step property of state which determines rendering of the html elements, resets some properties of the
    //state and generates the preview html table if it is to be rendered in the following step
    nextStep = (event) => {
        event.preventDefault();
        if (this.state.step < 4 && this.props.searchedFoodCleanUp) {
            this.setState({
                step: this.state.step + 1,
                grams: "",
            });
            if (this.state.step === 3) {
                let entries = Object.entries(this.state.addedFoods);
                this.generateTable(entries);
            }
            this.props.searchedFoodCleanUp();
        }
    };

    //Subtracts 1 from the step property of state which determines rendering of the html elements, resets some properties of the
    //state
    previousStep = (event) => {
        event.preventDefault();
        if (this.state.step > 1 && this.props.searchedFoodCleanUp) {
            this.setState({
                step: this.state.step - 1,
                grams: "",
            });
            this.props.searchedFoodCleanUp();
        }
    };

    //Changes attribute date in state when user selects one of the dates in the html form
    changeDate = (date) => {
        this.setState({date: date, step: 2});
    };

    //Checks whether user put in all necessary data, calls function createDiaryEntry from diaryEntryActionCreator
    handleSubmit = () => {
        //Checks whether user put in some courses into the entry, if not isEmpty is true and vice versa
        let entries = Object.entries(this.state.addedFoods);
        let isEmpty = true;
        entries.forEach(entry => {
            if (entry[1].length > 0) {
                isEmpty = false;
            }
        });

        //Checks whether user selected a date and calls the function createDiaryEntry
        if (this.state.date instanceof Date && !isEmpty) {
            let diaryEntry = {meals: this.state.addedFoods, date: this.state.date, activities: this.state.activities};
            this.props.createDiaryEntry(diaryEntry);
        } else {
            console.log("Musíte zadat datum a alespoň jedno jídlo")
        }
    };

    //Removes food from attribute addedFoods in state at an index given by the foodIndex argument
    removeFood = (foodIndex) => {
        let entries = Object.entries(this.state.addedFoods);
        entries[foodIndex[0]][1].splice(foodIndex[1], 1);
        this.generateTable(entries);
        this.setState({addedFoods: Object.fromEntries(entries)})
    };

    //Cleans the message from state whenever the component dismounts the DOM
    componentWillUnmount() {
        if (this.props.messageCleanUp) {
            this.props.messageCleanUp();
        }
    }

    //Changes attributes kcal and description of state attribute activities to values inside the html form
    // input field named kcal and text area named description respectively
    changeActivity = (event) => {
        if (Number(event.target.value) || event.target.className !== "kcal") {
            this.setState({
                activities: {
                    ...this.state.activities,
                    [event.target.className]: event.target.value
                }
            })
        }
    };

    render() {
        //Changes the render from form to message about the outcome after the user submits data
        let displayDE = "block";
        let displayMess = "none";
        let messageText;
        if (this.props.message) {
            if (this.props.message !== "") {
                messageText = this.props.message;
                displayDE = "none";
                displayMess = "block";
            }
        }

        //Determines whether html elements for adding ingredient will be shown or not and the styling of the message
        //which is shown to the user after he adds an ingredient to the meal
        let renderSearchedFood = "none";
        let renderSearchbar = true;
        if (this.props.searchedFood && this.state.step === 2) {
            renderSearchedFood = "block";
        } else if (this.state.step === 2) {
            renderSearchbar = false;
        }

        //Changes the mealName property of state to according String which is to be rendered in its stead
        let renderNames = ["Snídaně", "Dopolední svačina", "Oběd", "Odpolední svačina", "Večeře", "Ostatní"];
        let mealRenderName = renderNames[this.state.mealIndex];

        //Defines the style of the html elements which assures rendering only some of them each step as well as styling
        //of the elements which inform the user about what step they're at
        let renderStepOne = "block";
        let renderStepThree = "none";
        let renderStepFour = "none";
        let stepStyle = {top: "21%"};
        let stepButtonStyle = {top: "50%"};

        if (this.state.step === 2) {
            stepStyle = {top: "15%"};
            renderStepOne = "none";
        } else if (this.state.step === 3) {
            stepStyle = {top: "29.5%"};
            renderStepOne = "none";
            renderStepThree = "block";
        } else if (this.state.step === 4) {
            stepStyle = {top: "28%"};
            renderStepOne = "none";
            renderStepFour = "block";
        }

        let renderGrams = "none";
        if (this.props.searchedFood) {
            renderGrams = "block";
        }

        //Determines rendering of the next and previous step buttons
        let singleButtonStyle = {
            ...stepButtonStyle,
        };
        let renderNextStep = {display: "none"};
        let renderPreviousStep = {display: "none"};
        if (this.state.step >= 4 && this.state.step !== 1) {
            if (this.state.step === 4) {
                renderPreviousStep = singleButtonStyle;
            }
            renderNextStep = {display: "none"};
        } else if (this.state.step >= 2) {
            renderNextStep = {...stepButtonStyle, display: "block"};
            renderPreviousStep = {...stepButtonStyle, display: "block"};
        }

        //Determines whether to render FoodDetails or an empty span
        let foodDetails = this.props.searchedFood ? <FoodDetails viewOnly={true}/> :
            <div style={{display: renderSearchedFood}}/>;

        //Changes the text of the label which guides user through the steps of creating a DiaryEntry
        let renderStepLabel = "";
        if(this.state.step===2){
            renderStepLabel = " - " + mealRenderName;
        } else if (this.state.step===3) {
            renderStepLabel = " - Denní aktivita";
        } else if (this.state.step===4){
            renderStepLabel = " - Přehled a potvrzení";
        }

        //Determines rendering of the guide which tells the user how to create a Diary Entry
        let renderGuide = "none";
        if(this.state.step===2 && !renderSearchbar){
            renderGuide = "block";
        }

        let renderNextMeal = "none";
        let renderPreviousMeal = "none";
        if(this.state.step===2) {
            renderNextMeal = "block";
            renderPreviousMeal = "block";
            if (this.state.mealName === "breakfast") {
                renderPreviousMeal = "none";
            } else if (this.state.mealName === "other") {
                renderNextMeal = "none";
            }
        }

        return (
            <div>
                <div className="create-diaryentry-wrapper" style={{display: displayDE}}>
                    <div className="choose-date-label"
                         style={{display: renderStepOne}}>{"Vyberte den, pro který chcete vytvořit zápis"}</div>
                    <div style={{display: renderStepOne}}><Calendar onChange={this.changeDate}/></div>
                    <div>
                        <button className="create-diaryentry-previous-meal" style={{display: renderPreviousMeal}}
                                onClick={this.previousMeal}>{"Předchozí chod"}</button>
                        <button className="create-diaryentry-next-meal" style={{display: renderNextMeal}}
                                onClick={this.nextMeal}>{"Další chod"}</button>
                    </div>
                    <SearchFood addMode={true} disabled={renderSearchbar}/>
                    <div style={{display: renderGuide}} className="meal-adding-explanation">
                        {"Vysvětlivka: Talčítky Předchozí chod a Další chod přepínate mezi chody," +
                        " aktuální chod vídíte u ukazatele kroku. Jídlo k danému chodu přidáte tím, že " +
                        "jej nejprve vyhledáte a pak zadáte, kolik gramů daného jídla chcete k AKTUÁLNÍMU chodu přidat. " +
                        "Není povinné ke každému chodu přidat jídlo."}
                    </div>
                    <button className="create-diaryentry-previous-step" onClick={this.previousStep}
                            style={renderPreviousStep}>{"Předchozí krok"}</button>
                    <button className="create-diaryentry-next-step" onClick={this.nextStep}
                            style={renderNextStep}>{"Další krok"}</button>
                    <span className="create-meal-step" style={stepStyle}>{"Krok " + this.state.step + "/4" + renderStepLabel}</span>
                    <div>
                        <form className="create-diaryentry-form">
                            <div className="create-diaryentry-add-food-wrapper" style={{display: renderSearchedFood}}>
                                {foodDetails}
                                <input onChange={this.changeGrams} disabled={this.props.searchedFood === null}
                                       className="create-diaryentry-grams" placeholder="Zadejte gramy"
                                       style={{display: renderGrams}} value={this.state.grams}/>
                                <button onClick={this.addFood} style={{display: renderGrams}}
                                        className="create-diaryentry-add-food">{"Přidat jídlo"}</button>
                            </div>
                            <div className="create-diaryentry-calories-label voluntary" style={{display: renderStepThree}}>
                                {"Tento krok je nepovinný"}
                            </div>
                            <input placeholder="Zadejte spálené kalorie" value={this.state.activities.kcal}
                                   onChange={this.changeActivity} style={{display: renderStepThree}} className="kcal"/>
                            <textarea placeholder="Popis aktivity"
                                      value={this.state.activities.description} onChange={this.changeActivity}
                                      className="description" style={{display: renderStepThree}}/>
                            <div className="table-preview-wrapper" style={{display: renderStepFour}}>
                                <div className="table-restriction">
                                    {this.state.tableHtml}
                                </div>
                                <button style={{display: renderStepFour}} onClick={this.handleSubmit}
                                        className="create-diaryentry-submit">Potvrdit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <span style={{display: displayMess}}>{messageText}</span>
            </div>
        )
    }

    // Generates an html table the columns and rows of which are set by the number of meals and number of elements inside
    // the arrays of those meals respectively, meals and their arrays are stored in addedFood attribute of state
    generateTable = (entries) => {
        //Determines number of rows table will have
        let longest = -1;
        for (let i = 0; i < entries.length; i++) {
            if (entries[i][1].length > longest) {
                longest = entries[i][1].length
            }
        }

        let cells;
        let rows = [];
        let mealNames = ["Snídaně", "Dopolední svačina", "Oběd", "Odpolední svačina", "Večeře", "Ostatní"];

        //i represents number of columns rows and j number of columns, if the meals arrays are empty it generates a
        //placeholder instead
        for (let i = 0; i <= longest; i++) {
            cells = [];
            for (let j = 0; j < entries.length; j++) {
                if (i === 0) {
                    cells.push(
                        <th className="create-diaryentry-table-header" key={this.getKey()}>
                            <div className="table-cell-restriction">
                                {mealNames[j]}
                            </div>
                        </th>
                    );
                } else {
                    if (entries[j][1].length > i - 1) {
                        let inflection;
                        if (parseInt(entries[j][1][i - 1].grams) === 1) {
                            inflection = "gram";
                        } else if (parseInt(entries[j][1][i - 1].grams) > 1 && parseInt(entries[j][1][i - 1].grams) < 5) {
                            inflection = "gramy"
                        } else {
                            inflection = "gramů"
                        }

                        cells.push(
                            <td className="create-diaryentry-table-cell" key={this.getKey()}>
                                <div className="table-cell-restriction">
                                    {entries[j][1][i - 1].food.name + " " + entries[j][1][i - 1].grams + " " + inflection}
                                    <RemoveFoodButton foodIndex={[j, i - 1]} onClick={this.removeFood}/>
                                </div>
                            </td>
                        )
                    } else if (i === 1) {
                        cells.push(
                            <td className="create-diaryentry-table-cell" key={this.getKey()}>
                                <div className="table-cell-restriction">
                                    {"Přidejte chod"}
                                </div>
                            </td>
                        )
                    } else {
                        cells.push(<td className="create-diaryentry-table-cell" key={this.getKey()} />)
                    }
                }
            }
            rows.push(<tr key={this.getKey()}>{cells}</tr>);

            //if the arrays are empty inserts a placeholder
            if (longest === 0) {
                cells = [];
                for (let j = 0; j < 6; j++) {
                    cells.push(
                        <td className="create-diaryentry-table-cell" key={this.getKey()}>
                            <div className="table-cell-restriction">
                                {"Přidejte chod"}
                            </div>
                        </td>
                    )
                }
                rows.push(<tr key={this.getKey()}>{cells}</tr>);
            }
        }

        let table = <table className="create-diaryentry-preview-table">
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
            <i onClick={this.handleClick} className="far fa-trash-alt delete-button"/>
        )
    }
}

//Ensures reception of the functions from actionCreators in props
const mapDispatchToProps = (dispatch) => ({
    createDiaryEntry: (diaryEntry) => {
        dispatch(createDiaryEntry(diaryEntry));
    },
    messageCleanUp: () => {
        dispatch(messageCleanUp());
    },
    searchedFoodCleanUp: () => {
        dispatch(searchedFoodCleanUp());
    }
});

//Ensures reception of the properties from React-Redux Store in props
const mapStateToProps = state => ({
    searchedFood: state.foodReducer.searchedFood,
    message: state.diaryEntryReducer.createMessage,
});

//Connects the component to React-Redux Store
export default connect(mapStateToProps, mapDispatchToProps)(CreateDiaryEntry);