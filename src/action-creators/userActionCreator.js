//Fetches username and email of the user who is logged in from the database
export const getAccountInformation = () => dispatch => {
    fetch("http://localhost:6767/users/test", {
        method: "get",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('authHeader')
        },
    }).then(res => {
        if (res.status === 200) {
            return res.json()
        } else {
            throw new Error ("Chyba " + res.status);
        }
    }).then(json => {
        console.log(json);
        dispatch({
            type: 'USER_INFORMATION',
            payload: json
        })
    }).catch(e => console.log(e))
};