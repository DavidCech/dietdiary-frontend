import React, {Component} from 'react';
import {Provider} from "react-redux";
import {store} from "./store";
import {BrowserRouter} from 'react-router-dom';
import DietDiaryRouter from "./components/DietDiaryRouter";
import './styles/global.css'

//Puts together all the components and classes
class App extends Component {
    render() {
        return (
            <Provider store={store}>

                <BrowserRouter>

                    <div className="App">
                        <DietDiaryRouter/>
                    </div>

                </BrowserRouter>

            </Provider>
        )
    }
}


export default App;