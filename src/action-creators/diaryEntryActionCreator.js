//Receives diaryEntry object and submits it with authentication header to create function in backend which in turn creates
//according item in the database
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
            dispatch({
                type: 'CREATE_DIARYENTRY_TO_STATE',
                payload: {
                    response: response.status,
                    message: "Záznam v deníčku úspěšně vytvořen"
                },
            });
        } else {
            dispatch({
                type: 'CREATE_DIARYENTRY_TO_STATE',
                payload: {
                    response: response.status,
                    message: "Bohužel došlo k chybě"
                },
            });
        }
    }).catch(e =>
        console.log(e)
    )
};

//Fetches diaryEntries from database for all the dates it receives as an argument (it can be either array
//or a singular date), the fetch also requires authentication header which is supplied from local storage
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

//Receives Diary Entry which is to be removed from component and submits it to the delete Diary Entry function in
//backend from which it in turn receives a status code which determines what message will the user receive
export const deleteDiaryEntry = (diaryEntry) => dispatch => {
    fetch("http://localhost:6767/diaryEntries/delete", {
        method: "delete",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authHeader')
        },
        body: JSON.stringify(diaryEntry)
    }).then(response => {
        if (response.status === 200) {
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
        type: 'SEARCHED_DIARYENTRY_CLEANUP',
    })

};

//Sets the createMessage property of diaryEntryReducer in Store to its initial value
export const messageCleanUp = () => dispatch => {
    dispatch({
        type: 'MESSAGE_CLEANUP',
    })

};
