//Fetches up to 10 Food items from the database with given name; page argument determines whether it is the first 10,
//second 10, third 10 and so on
export const getFoods = (name, page) => dispatch => {
    fetch("http://localhost:6767/foods/?name=" + name + "&skipNumber=" + page * 10)
        .then(res => res.json())
        .then(cargo => {
            dispatch({
                type: 'GET_FOODS',
                payload: cargo,
            })
        }).catch(e =>
        console.log(e)
    )
};

//Sets all properties of foodReducer in Store to their initial values
export const totalCleanUp = () => dispatch => {
    dispatch({
        type: 'SEARCH_CLEANUP'
    })
};

//Sets searchedFood property of foodReducer in Store to null
export const searchedFoodCleanUp = () => dispatch => {
    dispatch({
        type: 'SEARCHED_FOOD_CLEANUP'
    })
};

//Receives Food object and submits it with authentication header to create function in backend which in turn creates
//according item in the database
export const createFood = (food) => dispatch => {
    fetch("http://localhost:6767/foods/create", {
        method: "post",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authHeader')
        },
        body: JSON.stringify(food)
    }).then(res => res.json())
        .then(cargo =>
            console.log(cargo)
        ).catch(e =>
        console.log(e)
    )
};

//Receives food which is to be removed from component and submits it to the delete food function in backend from which
//it in turn receives a status code which determines what message the user will receive
export const deleteFood = (food) => dispatch => {
    fetch("http://localhost:6767/foods/delete", {
        method: "delete",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authHeader')
        },
        body: JSON.stringify(food)
    }).then(response => {
        if(response.status === 200) {
            dispatch({
                type: 'DELETE',
                payload: "Úspěšně smazáno",
            })
        } else {
            dispatch({
                type: 'DELETE',
                payload: "Bohužel došlo k chybě",
            })
        }
    }).catch(e =>
        console.log(e)
    )
};

//Assigns its payload to the foodReducer store property searchedFood
export const searchedFoodToState = (food) => dispatch => {
    dispatch({
        type: 'SEARCHED_FOOD_TO_STATE',
        payload: food,
    })
};