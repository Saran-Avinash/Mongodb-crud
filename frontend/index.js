
document.addEventListener('DOMContentLoaded', ()=> {


let add = document.getElementById("add");
let addAction = document.getElementsByClassName("add")[0];
let updateAction = document.getElementsByClassName("add")[1];
let alert = document.getElementById("alert");
let refresh = document.getElementById("refresh");
let updateName = document.getElementById("updateName");
let updateEmail = document.getElementById("updateEmail");
let updateNumber = document.getElementById("updateNumber");

let nameInput = document.getElementById("name");
let emailInput = document.getElementById("email");
let phoneNumberInput = document.getElementById("number");
let addSubmit = document.getElementById("addSubmit");
let updateSubmit = document.getElementById("updateSubmit");
let ptable = document.getElementById("table");
let table = document.querySelector('tbody');

add.addEventListener("click", ()=> {
    addAction.style.display = "flex";
    ptable.style.display = "none";
    alert.style.display = "none";
})

// add event listener
addSubmit.addEventListener("click", ()=> {
    alert.style.display = "none";
    const userData = {
        name : nameInput.value,
        email : emailInput.value,
        phoneNumber : phoneNumberInput.value
    }
    console.log(userData);

    fetch('/insert', {
        method : 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(userData)
    }).then(response =>{
        if(response.ok){
            alert.textContent = "Successfully added to data base!";
            alert.style.color = "green";
        }
        else{
            alert.textContent = "Something went wrong!";
            alert.style.color = "red";
        }
    })
})



refresh.addEventListener("click", ()=> {
    addAction.style.display = "none";
    updateAction.style.display = "none";
    fetch('/retrieve',
    ).then(response => {
        if(!response.ok){
            alert.textContent = "Error fetching data from a database!";
            alert.style.color = "red";
        }
        table.innerHTML = '';
        alert.textContent = "Data Successfully fetched from database!";
        alert.style.color = "green";
        console.log(response.body);
        return response.json();
    }).then((data)=>{
        ptable.style.display = "block";
        data.forEach(item => {
            let tr = document.createElement("tr");
            table.appendChild(tr);

            let td = document.createElement("td");
            tr.appendChild(td);
            td.innerHTML = item.name;

            td = document.createElement("td");
            tr.appendChild(td);
            td.innerHTML = item.email;

            td = document.createElement("td");
            tr.appendChild(td);
            td.innerHTML = item.phoneNumber;

            td = document.createElement("td");
            tr.appendChild(td);
            //delete button
            let deleteButton = document.createElement("button");
            deleteButton.addEventListener("click", ()=> {
                deleteRecord(tr);
            });
            deleteButton.innerHTML = "Delete";
            td.appendChild(deleteButton);

            //update button
            let updateButton = document.createElement("button");
            updateButton.addEventListener("click", ()=>{
                updateAction.style.display = "flex";
                ptable.style.display = "none";
                updateRecord(tr);
            });
            updateButton.innerHTML = "Update";
            td.appendChild(updateButton);
    
        });
    })
    
}, false);


// delete records in db and here
function deleteRecord(row){
    alert.style.display = "none";

     const to_delete = row.cells[0].childNodes[0].data;

     fetch(`/delete/${to_delete}`, {
            method: 'DELETE',
     }
    )
    row.remove();
}
function updateRecord(row){

    updateName.setAttribute("value", row.cells[0].childNodes[0].data);
    updateName.setAttribute("readonly", 'true');
    const name = row.cells[0].childNodes[0].data;
    updateSubmit.addEventListener("click", ()=> {

        let newEmail = updateEmail.value;
        let newNumber = updateNumber.value;

        const payLoad = {
            email : newEmail,
            number : newNumber
        }
         fetch(`/put/${name}`,{
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(payLoad)
         }).then(response => {
            if(!response.ok){
                alert.innerHTML = 'No record found to update';
            }
            else{
                alert.innerHTML = 'Successfully updated';
            }
         })
    }, false);
    
};

});


// update api

 