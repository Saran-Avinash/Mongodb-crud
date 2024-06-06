const { error } = require("console");
const exp = require("constants");
const express = require("express");
const mongoose = require("mongoose");
const {Schema} = mongoose;
const path = require("path");
const { stringify } = require("querystring");
const app = express();



// middlewar

app.use(express.json());


//connection to db

mongoose.connect("mongodb://localhost:27017/UserGroup").then(() => {
    console.log("Successfully connected to database");
}).catch((error) => {
    console.log("Something went wrong");
})

const userSchema = new Schema({
    name : String,
    email : String,
    phoneNumber : Number
})

const User = mongoose.model('User', userSchema);



//receiving add request

app.post('/insert', async (request, response) => {
    const user = new User(request.body);
    await user.save();
    console.log("User saved: ", user);

    response.sendStatus(200);
})


app.get('/retrieve', async (request, response) => {
    const data = await User.find().then((data) => {
        response.setHeader('Content-Type', 'application/json');
        response.send(data);
    }).catch((error)=> {
        response.sendStatus(404);
    }) 
})


app.delete('/delete/:name', async (request, response) => {
   
    try{
            const recordToDelete = await User.findOneAndDelete({name : request.params.name});
            response.sendStatus(200);
    }
    catch(error) {
        // response.sendStatus(404);
    }
})

 
app.put('/put/:name', async (request, response) => {

    try{
        console.log(request.params.name);
        console.log(request.body);
     await User.findOneAndUpdate({name : request.params.name}, request.body);
     response.sendStatus(200);
    }
    catch(error){
        response.sendStatus(404);
    }

})









const frontend = path.join(__dirname, "../frontend");
app.use(express.static(frontend));


app.get("/",(request, response) => {
    response.redirect("/home");

})


app.get("/home", (request, response)=> {
    response.sendFile(path.join(frontend, 'index.html'));
})

 

app.listen(8080, ()=> {
    console.log(`Server is listening on port 8080`);
})