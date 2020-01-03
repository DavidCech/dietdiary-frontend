export const getFoods = (name, page) => dispatch => {
    fetch("http://localhost:6767/foods/?name=" + name + "&skipNumber=" + page * 10)
        .then(res => res.json())
        .then(cargo => {
            console.log(cargo);
            dispatch({
                type: 'GET_FOODS',
                payload: cargo,
            })
        }).catch(e =>
        console.log(e)
    )
};

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

export const searchedFoodToState = (food) => dispatch => {
    dispatch({
        type: 'SEARCHED_FOOD_TO_STATE',
        payload: food,
    })
};