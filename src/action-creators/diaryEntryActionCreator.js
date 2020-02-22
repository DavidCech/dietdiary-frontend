//
export const createDiaryEntry = (diaryEntry) => dispatch => {
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

//
export const getDiaryEntries = date => dispatch => {
    fetch("http://localhost:6767/diaryEntries/get/?date=" + date + "", {
        method: "get",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authHeader')
        },
    }).then(response => {
            if (response.status === 200) {
                return response.json()
            } else {
                dispatch({
                    type: 'SEARCHED_DIARYENTRY_TO_STATE',
                    payload: null,
                });
                throw new Error("Chyba " + response.status);
            }
    }).then(response => {
        dispatch({
            type: 'SEARCHED_DIARYENTRY_TO_STATE',
            payload: response,
        })
    }).catch(e =>
        console.log(e)
    )
};

export const deleteDiaryEntry = (diaryEntry) => dispatch => {
    fetch("http://localhost:6767/diaryEntries/delete", {
        method: "delete",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authHeader')
        },
        body: JSON.stringify(diaryEntry)
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

//Sets all properties of diaryEntryReducer in Store to their initial values
export const diaryEntryCleanUp = () => dispatch => {
    dispatch({
        type: 'SEACHED_DIARYENTRY_CLEANUP',
    })

};