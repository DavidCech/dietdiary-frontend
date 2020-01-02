export const createDiaryEntry = (diaryEntry) => {
    fetch("http://localhost:6767/diaryEntries/create", {
        method: "post",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authHeader')
        },
        body: JSON.stringify(diaryEntry),
    }).then(response => {
        if (response.status === 200) {
            return response.json()
        } else {
            throw new Error("Chyba " + response.status);
        }
    }).then(cargo => {
        console.log(cargo);
    }).catch(e =>
        console.log(e)
    )
};

export const getDiaryEntries = date => dispatch => {
    fetch("http://localhost:6767/diaryEntries/get/?date=" + date + "", {
        method: "get",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authHeader')
        },
    }).then(response => {
        return response.json();
    }).then(cargo => {
        console.log(cargo);
        dispatch({
            type: 'SEARCHED_DIARYENTRY_TO_STATE',
            payload: cargo,
        })
    }).catch(e =>
        console.log(e)
    )
};