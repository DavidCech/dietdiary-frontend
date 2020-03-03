import React, {Component} from 'react';
import Calendar from "react-calendar";
import {connect} from 'react-redux';
import {getDiaryEntries, diaryEntryCleanUp, deleteDiaryEntry} from "../action-creators/diaryEntryActionCreator";
import {BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar} from 'recharts';
import '../styles/viewdiaryentries.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

//This component serves as GUI for viewing diaryEntries
class ViewDiaryEntries extends Component {
    //Initializes functions and variable keyCount in this class
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.keyCount = 0;
        this.getKey = this.getKey.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.generateTable = this.generateTable.bind(this);
        this.deleteDiaryEntry = this.deleteDiaryEntry.bind(this);
        this.diaryEntriesCleanUp = this.diaryEntriesCleanUp.bind(this);
    }

    //Initializes state property of the component
    state = {
        date: null,
        multipleSelection: false,
        show: "nutrition",
        data: [],
        additionalData: null,
        tableHtml: <div/>,
        inputError: "",
    };

    //Deals with the reception of props from backend
    componentDidUpdate(prevProps) {
        //Checks if the component receives new props and if so whether it is an array or a single item
        if (this.props.searchedDiaryEntries !== prevProps.searchedDiaryEntries && this.props.searchedDiaryEntries !== null && Array.isArray(this.props.searchedDiaryEntries)) {
            //If it is an array the function changes state properties accordingly
            this.setState({data: this.props.searchedDiaryEntries, tableHtml: <div/>});
        } else if (this.props.searchedDiaryEntries !== prevProps.searchedDiaryEntries && this.props.searchedDiaryEntries !== null) {
            if (this.props.searchedDiaryEntries.hasOwnProperty('enrichedData')) {
                //If it is a single item the function changes state properties accordingly and generates an html table based on the received data
                this.setState({
                    data: [this.props.searchedDiaryEntries.data],
                    additionalData: this.props.searchedDiaryEntries.enrichedData,
                });
                this.generateTable(this.props.searchedDiaryEntries.enrichedData);
            } else {
                //If it is an empty pattern it shows a message for the user
                this.setState({
                    data: [this.props.searchedDiaryEntries],
                    tableHtml: <div className="view-diaryentries-no-data">Žádná data k zobrazení</div>,
                });
            }
        }
    }

    //Generates unique keys for html elements in order to avoid errors
    getKey = () => {
        return this.keyCount++;
    };

    //Changes the date property of state
    changeDate = (date) => {
        this.setState({date})
    };

    //Switches multipleSelection property of state which determines whether user selects one date or a range of dates
    //in the Calendar, furthermore erases previous date(s)
    handleCheckbox = () => {
        this.setState({
            multipleSelection: !this.state.multipleSelection,
            date: null
        })
    };

    //Checks whether user has selected date and then calls getDiaryEntries function from diaryEntryActionCreator or
    //sends an error to the user
    handleSubmit = () => {
        if (this.state.date !== null) {
            this.props.getDiaryEntries(JSON.stringify(this.state.date));
            this.setState({inputError: ""})
        } else {
            this.setState({inputError: "Nejdříve musíte zvolit datum nebo data v kalendáři"})
        }
    };

    //Changes the show property of state which determines whether the BarChart will show information about calories or
    //nutritional values
    handleSelect = (event) => {
        if (this.state.show === "kcal") {
            this.setState({show: "nutrition"})
        } else {
            this.setState({show: "kcal"})
        }

    };

    //Cleans up searched diaryEntries from the Redux Store
    componentWillUnmount() {
        this.diaryEntriesCleanUp();
    }

    //Deletes the given diaryEntry if it is the author of the diaryEntry who calls this function
    deleteDiaryEntry = () => {
        if (this.props.deleteDiaryEntry) {
            this.props.deleteDiaryEntry(this.props.searchedDiaryEntries);
        }
    };

    //Cleans up searched diaryEntries from the Redux Store, and resets some properties of state to their initial values
    diaryEntriesCleanUp = () => {
        this.setState({
            date: null,
            multipleSelection: false,
            show: "nutrition",
            additionalData: null,
            inputError: ""
        });
        if (this.props.diaryEntryCleanUp) {
            this.props.diaryEntryCleanUp();
        }
    };

    render() {
        //Toggles between showing diaryEntry(/ies) for the selected days after the user submits them and showing the
        //calendar
        let displayChart = 'none';
        let displayCalendar = 'block';
        if (this.state.data.length !== 0 && this.props.searchedDiaryEntries) {
            displayChart = 'block';
            displayCalendar = 'none';
        }

        //If it is the author of the diaryEntry who views it, this code renders a delete button, else if the user chooses
        //to delete the diaryEntry via the aforementioned delete button it shows a message with the outcome of the delete
        let conditionalDelete;
        let deleteMessage;
        let messageStyle = {display: "none"};
        if (!Array.isArray(this.props.searchedDiaryEntries) && this.props.searchedDiaryEntries) {
            let deleteButton = <i onClick={this.deleteDiaryEntry} className="far fa-trash-alt delete-button"/>;
            conditionalDelete = localStorage.getItem('username') === this.props.searchedDiaryEntries.authorUsername ? deleteButton :
                <div/>;
        } else if (this.props.deleteMessage && !this.props.searchedDiaryEntries) {
            messageStyle = {
                display: "block",
                color: "green",
                position: "fixed",
                top: "50%",
                left: "50%",
                msTransform: "translate(-50%, -50%)",
                transform: "translate(-50%, -50%)",
                fontSize: "24px",
            };
            displayChart = 'none';
            displayCalendar = 'none';
            deleteMessage = <span style={messageStyle}>{this.props.deleteMessage}</span>;
        } else if (this.state.inputError !== "") {
            messageStyle = {
                display: "block",
                color: "red",
                position: "fixed",
                top: "86%",
                left: "50%",
                msTransform: "translate(-50%, -50%)",
                transform: "translate(-50%, -50%)",
                fontSize: "16px",
            };
            deleteMessage = <span style={messageStyle}>{this.state.inputError}</span>;
        }

        //Shows either chart for calories or nutritional values which depends on show attribute of state which user changes
        //with html select tag
        let barsHtml = [];
        if (this.state.show === 'kcal') {
            barsHtml.push(<Bar dataKey="kcal" fill="#18139c" stroke="#18139c" stackId="a" key={this.getKey()}
                               isAnimationActive={false} maxBarSize={100}/>);
            barsHtml.push(<Bar dataKey="goalKcal" fill="none" stroke="#18139c" stackId="a" key={this.getKey()}
                               isAnimationActive={false} maxBarSize={100}/>);
        } else {
            barsHtml.push(<Bar dataKey="carbs" stackId="a" fill="#d67e0f" stroke="#d67e0f" key={this.getKey()}
                               isAnimationActive={false} maxBarSize={100}/>);
            barsHtml.push(<Bar dataKey="goalCarbs" stackId="a" fill="none" stroke="#d67e0f" key={this.getKey()}
                               isAnimationActive={false} maxBarSize={100}/>);
            barsHtml.push(<Bar dataKey="protein" stackId="b" fill="#ab1d1d" stroke="#ab1d1d" key={this.getKey()}
                               isAnimationActive={false} maxBarSize={100}/>);
            barsHtml.push(<Bar dataKey="goalProtein" stackId="b" fill="none" stroke="#ab1d1d" key={this.getKey()}
                               isAnimationActive={false} maxBarSize={100}/>);
            barsHtml.push(<Bar dataKey="fibre" stackId="c" fill="#1c7800" stroke="#1c7800" key={this.getKey()}
                               isAnimationActive={false} maxBarSize={100}/>);
            barsHtml.push(<Bar dataKey="goalFibre" stackId="c" fill="none" stroke="#1c7800" key={this.getKey()}
                               isAnimationActive={false} maxBarSize={100}/>);
            barsHtml.push(<Bar dataKey="fat" stackId="d" fill="saddlebrown" stroke="saddlebrown" key={this.getKey()}
                               isAnimationActive={false} maxBarSize={100}/>);
            barsHtml.push(<Bar dataKey="goalFat" stackId="d" fill="none" stroke="saddlebrown" key={this.getKey()}
                               isAnimationActive={false} maxBarSize={100}/>);
        }

        //Generates text of the button which switches between the graph showing kcal and nutritional values
        let buttonText = this.state.show === "kcal" ? "Ukázat nutriční hodnoty" : "Ukázat kilokalorie";

        //Changes the position of the back button depending on whether there's preview to be rendered or not
        let buttonPosition = "90.5%";
        if (this.state.data.length > 1) {
            buttonPosition = "72%";
        } else if (this.state.tableHtml.props) {
            if (this.state.tableHtml.props.children === "Žádná data k zobrazení") {
                buttonPosition = "75%";
                if(this.state.height<=900){
                    buttonPosition = "83%";
                }
            }
        }

        let chartWidth = 900;
        let chartHeight = 350;

        if(this.state.height<=900){
            chartWidth = 900;
            chartHeight = 280;
        }

        return (
            <div className="view-diaryentries-wrapper">
                <div className="calendar-wrapper" style={{display: displayCalendar}}>
                    <div className="range-div">
                        <span className="range-label">{"Vybrat více než jeden den"}</span>
                        <label className="container">
                            <input type="checkbox" onChange={this.handleCheckbox}/>
                            <span className="checkmark"/>
                        </label>
                    </div>
                    <Calendar onChange={this.changeDate} selectRange={this.state.multipleSelection}
                              value={this.state.date} maxDetail="month"/>
                    <button className="view-diaryentries-submit" onClick={this.handleSubmit}>{"Ukázat záznamy"}</button>
                </div>

                <div className="chart-wrapper" style={{display: displayChart}}>
                    <div className="buttons-wrapper">
                        <button className="chart-toggle" onClick={this.handleSelect}>{buttonText}</button>
                        {conditionalDelete}
                    </div>
                    <BarChart width={chartWidth} height={chartHeight} margin={{top: 20, right: 85, bottom: 25, left: 25}}
                              data={this.state.data}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="date" label={{value: 'Data', position: 'insideBottomRight', offset: -5}}/>
                        <YAxis label={{
                            value: this.state.show === "kcal" ? "kcal" : "g",
                            position: 'insideLeft', offset: this.state.show === "kcal" ? -20 : 5
                        }}/>
                        <Tooltip content={<CustomTooltip/>}/>
                        <Legend height={30}/>
                        {barsHtml}
                    </BarChart>
                    {this.state.tableHtml}
                </div>
                <button className="view-diaryentries-back" style={{display: displayChart, top: buttonPosition}}
                        onClick={this.diaryEntriesCleanUp}>{"Zpět"}</button>
                {deleteMessage}
            </div>
        );
    }

    //Generates an html table which displays the number of consumed nutrients and calories for each meal of the day
    //additionally displays what the meals consisted of and activities for the given day
    generateTable = (data) => {
        //The html representing table cells is stored in cells variable and html representing table rows in the rows variable
        let cells;
        let rows = [];
        let mealNames = ["Snídaně", "Dopolední svačina", "Oběd", "Odpolední svačina", "Večeře", "Ostatní"];
        let nuritionNames = ["Chod", "Kilokalorie", "Bílkoviny", "Sacharidy", "Tuky", "Vláknina", "Obsah chodu"];
        let meals = data.meals;
        let activities = data.activities;
        //Generates a row for each meal and one for the headers
        for (let i = 0; i < mealNames.length + 1; i++) {
            let mealEntry;
            let mealContent = "";
            if (i > 0) {
                mealEntry = Object.entries(meals[i - 1]);
            }
            cells = [];
            //Generates a column for nutritional value, a column for the content of the meal and one column for the name of the meal
            for (let j = 0; j < nuritionNames.length; j++) {
                if (i === 0) {
                    cells.push(
                        <th className="view-diaryentries-table-header" key={this.getKey()}>
                            <div className="table-cell-restriction">
                                {nuritionNames[j]}
                            </div>
                        </th>
                    );
                } else if (j === 0) {
                    cells.push(
                        <td className="view-diaryentries-table-cell" key={this.getKey()}>
                            <div className="table-cell-restriction">
                                {mealNames[i - 1]}
                            </div>
                        </td>);
                } else {
                    if (j === 1) {
                        cells.push(
                            <td className="view-diaryentries-table-cell" key={this.getKey()}>
                                <div className="table-cell-restriction">
                                    {Math.round(mealEntry[j - 1][1])}
                                </div>
                            </td>
                        );
                    } else if (j > 1 && j < mealNames.length) {
                        cells.push(
                            <td className="view-diaryentries-table-cell" key={this.getKey()}>
                                <div className="table-cell-restriction">
                                    {Math.round(mealEntry[j - 1][1]) + " g"}
                                </div>
                            </td>
                        );
                    } else {
                        // eslint-disable-next-line
                        mealEntry[j - 1][1].forEach(meal => {
                            mealContent += meal + ", ";
                        });
                        mealContent = mealContent.substring(0, mealContent.length - 2);
                        cells.push(
                            <td className="view-diaryentries-table-cell" key={this.getKey()}>
                                <div className="table-cell-restriction">
                                    {mealContent}
                                </div>
                            </td>);
                    }
                }
            }
            rows.push(<tr key={this.getKey()}>{cells}</tr>);
        }

        //Puts the html tags together
        let table = <div>
            <table className="view-diaryentries-table">
                <tbody>{rows}</tbody>
            </table>
            <div className="burned-calories-wrapper">
                <div className="burned-calories-count">{"Kalorií spáleno aktivitami: " + activities.kcal}</div>
                <div className="burned-calories-description">{"Popis aktivit: " + activities.description}</div>
            </div>
        </div>;

        this.setState({tableHtml: table})
    }
}

//Deals with the inflection of the word grams in Czech language
const handleInflection = (number) => {
    let inflection;
    if (parseInt(number) === 1) {
        inflection = "gram";
    } else if (parseInt(number) > 1 && parseInt(number) < 5) {
        inflection = "gramy"
    } else {
        inflection = "gramů"
    }

    return inflection;
};

//Creates custom html used by the Tooltip in the BarChart
const CustomTooltip = ({active, payload, label}) => {
    if (active && payload.length === 2) {
        //If the data consist of two items it generates tooltip for calories
        let responseString = "";
        //Checks whether the user overflowed their current goal as to not show negative values of consumed calories
        if (payload[1].value < 0) {
            responseString = `Energie: Zkonzumováno ${Math.round(payload[0].value)} kcal, více než cíl o ${-Math.round(payload[1].value)} kcal`;
        } else {
            responseString = `Energie: Zkonzumováno ${Math.round(payload[0].value)} kcal, do cíle zbývá ${Math.round(payload[1].value)} kcal`;
        }

        return (
            <div className="custom-tooltip" style={{backgroundColor: "white"}}>
                <p className="label">{`${label}:`}</p>
                <p>{responseString}</p>
            </div>
        );
    } else if (active && payload.length === 8) {
        //If the data consist of eight items it generates tooltip for nutritional values
        let names = ["Sacharidy", "Bílkoviny", "Vláknina", "Tuky"];
        let html = [];
        for (let i = 0; i < 8; i += 2) {
            //Checks whether the user overflowed their current goal as to not show negative values of consumed grams
            if (payload[i + 1].value < 0) {
                html.push(<p
                    key={i}>{`${names[i / 2]}: Zkonzumováno ${Math.round(payload[i].value)} ${handleInflection(payload[i].value)},
              více než cíl o ${-Math.round(payload[i + 1].value)} ${handleInflection(payload[i + 1].value)}`}</p>);
            } else {
                html.push(<p
                    key={i}>{`${names[i / 2]}: Zkonzumováno ${Math.round(payload[i].value)} ${handleInflection(payload[i].value)},
              do cíle zbývá ${Math.round(payload[i + 1].value)} ${handleInflection(payload[i + 1].value)}`}</p>);
            }
        }

        return (
            <div className="custom-tooltip" style={{backgroundColor: "white"}}>
                <p className="label">{`${label}:`}</p>
                {html}
            </div>
        );
    }

    return null;
};

//Ensures reception of the functions from actionCreators in props
const mapDispatchToProps = dispatch => ({
    getDiaryEntries: (date) => {
        dispatch(getDiaryEntries(date));
    },
    diaryEntryCleanUp: () => {
        dispatch(diaryEntryCleanUp());
    },
    deleteDiaryEntry: (diaryEntry) => {
        dispatch(deleteDiaryEntry(diaryEntry))
    }
});

//Ensures reception of the properties from React-Redux Store in props
const mapStateToProps = state => ({
    searchedDiaryEntries: state.diaryEntryReducer.searchedDiaryEntries,
    deleteMessage: state.diaryEntryReducer.deleteMessage,
});

//Connects the component to React-Redux Store
export default connect(mapStateToProps, mapDispatchToProps)(ViewDiaryEntries);