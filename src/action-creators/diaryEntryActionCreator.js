export const createDiaryEntry = (diaryEntry) => {
    fetch("http://localhost:6767/diaryEntries/create", {
        method: "post",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('authHeader')
        },
        body: JSON.stringify(diaryEntry),
    }).then(response => response.json())
        .then(cargo =>
            console.log(cargo)
        ).catch(e =>
        console.log(e)
    )
};