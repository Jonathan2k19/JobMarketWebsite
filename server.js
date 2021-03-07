/*
BACKEND FOR SERVER USING THE EXPRESS FRAMEWORK FOR NODE JS
    -> USE MONGO-DB AS A DATABASE FOR THE JOBS
VERY GOOD DOCUMENTATION:
    https://zellwk.com/blog/crud-express-mongodb/
*/


//importing some required modules
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongo = require("mongodb").MongoClient;
const assert = require("assert");
//TODO: use your own mongo db connection string
const connectionString = "your_connection_string";
var ObjectId = require("mongodb").ObjectID;

//creating an express application
const app = express();

//using embedded js as template engine (to get the db data to html)
app.set("view-engine", "ejs");

//set static folder to frontend folder (just append routes like "/blabla") -> no need to create lots of different routes with "app.get"
app.use(express.static(path.join(__dirname, "frontend")));

//save the form data to a database (JSON)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//handling the database
mongo.connect(connectionString, {useUnifiedTopology: true}, (err, client) => {
    if (err) return console.error(err);
    console.log('Connected to Database');
    const db = client.db("jobMarketForEveryone");
    const jobsCollection = db.collection("available_jobs");
    //POST A JOB
    app.post("/postJobData", (request, response) => {
        saveJob(jobsCollection, request, response);
    })
    //GET A JOB -> sort jobs (by categorie) on server side is probably better than on client side
    app.get("/getConstructionJobData", (req, res) => {
        getConstructionJobs(db, req, res);
    })
    app.get("/getBusinessJobData", (req, res) => {
        getBusinessJobs(db, req, res);
    })
    app.get("/getTeachingJobData", (req, res) => {
        getTeachingJobs(db, req, res);
    })

    //UPDATE A JOB
    app.put("/updateJobData", (req, res) => {
        updateJobData(db, req, res);
    })

    //DELETE A JOB
    app.delete("/deleteJobData", (req, res) => {
        // TODO: send a response if the id is not available in the database
        deleteJobData(db, req, res);
    })
})

function saveJob(jobsCollection, request, response){
    jobsCollection.insertOne(request.body)
    .then(result => {
        response.redirect("/")
    })
    .catch(error => console.error(error))
}

function getConstructionJobs(db, request, response){
    const test = db.collection("available_jobs").find({"_categorie":"Construction"}).toArray()
    .then(results => {
        response.send(results);
    })
    .catch(error => console.error(error))
}

function getBusinessJobs(db, request, response){
    const cursor = db.collection("available_jobs").find({"_categorie":"Business"}).toArray()
    .then(results => {
        response.send(results);
    })
    .catch(error => console.error(error))
}

function getTeachingJobs(db, request, response){
    const cursor = db.collection("available_jobs").find({"_categorie":"Teacher"}).toArray()
    .then(results => {
        response.send(results);
    })
    .catch(error => console.error(error))
}

function updateJobData(db, request, response){
    const cursor = db.collection("available_jobs").find({"_id": ObjectId(`${request.body._id}`)}).toArray()
    .then(results => {
        if(results.length == 0){
            response.send(false);   //job with given id does not exist in database
        }else{
            //updating all the fields
            db.collection("available_jobs").updateOne({"_firstName": `${results[0]._firstName}`},{$set: {"_firstName": `${request.body._firstName}`}});
            db.collection("available_jobs").updateOne({"_lastName": `${results[0]._lastName}`},{$set: {"_lastName": `${request.body._lastName}`}});
            db.collection("available_jobs").updateOne({"_location": `${results[0]._location}`},{$set: {"_location": `${request.body._location}`}});
            db.collection("available_jobs").updateOne({"_contactType": `${results[0]._contactType}`},{$set: {"_contactType": `${request.body._contactType}`}});
            db.collection("available_jobs").updateOne({"_contactInfo": `${results[0]._contactInfo}`},{$set: {"_contactInfo": `${request.body._contactInfo}`}});
            db.collection("available_jobs").updateOne({"_jobTitle": `${results[0]._jobTitle}`},{$set: {"_jobTitle": `${request.body._jobTitle}`}});
            db.collection("available_jobs").updateOne({"_categorie": `${results[0]._categorie}`},{$set: {"_categorie": `${request.body._categorie}`}});
            db.collection("available_jobs").updateOne({"_salary": `${results[0]._salary}`},{$set: {"_salary": `${request.body._salary}`}});
            response.send(true);        //job with given id exists and was updated
        }
    })
    .catch(error => console.error(error))
}

function deleteJobData(db, request, response){
    // check if id exists in the database
    const cursor = db.collection("available_jobs").find({"_id": ObjectId(`${request.body._id}`)}).toArray()
    .then(results => {
        if(results.length == 0){
            response.send(false);
        }else{
            db.collection("available_jobs").deleteOne({"_id": ObjectId(`${request.body._id}`)});
            response.send(true);
        }
    })
    .catch(error => console.error(error))
}

//Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));

