// TODO: fix problem that checkbox can be ticked, but the corresponding field is empty




/*
HIDING AND SHOWING CONTENT
*/

$(document).ready(function() {
    $(".postJobSubmitForm").hide();
    $(".updateJobSubmitForm").hide();
    $(".deleteJobSubmitForm").hide();
});

function show_submit_form(){
    $(".postJobSubmitForm").show();
}

function hide_submit_form(){
    $(".postJobSubmitForm").hide();
}

function show_update_form(){
    $(".updateJobSubmitForm").show();
}

function hide_update_form(){
    $(".updateJobSubmitForm").hide();
}

function show_delete_form(){
    $(".deleteJobSubmitForm").show();
}

function hide_delete_form(){
    $(".deleteJobSubmitForm").hide();
}


/*
Checking the input fields and checkboxes
*/
var categorie, salary, contact, contactType;

function checkJobCategorieBoxes(type_of_action){
    var construction, business, teacher;
    if(type_of_action == "post"){
        construction = document.getElementById("contruction");
        business = document.getElementById("business");
        teacher = document.getElementById("teacher");
    }else{
        construction = document.getElementById("contructionUpdate");
        business = document.getElementById("businessUpdate");
        teacher = document.getElementById("teacherUpdate");
    }
    if(construction.checked){
        categorie = "Construction";
        return 1;
    }else if(business.checked){
        categorie = "Business";
        return 1;
    }else if(teacher.checked){
        categorie = "Teacher";
        return 1;
    }else {
        console.log("categorie not filled out");
        return 0;   //0 == not filled out
    }
}

function checkSalaryBoxes(type_of_action){
    var unsalaried, withSalary;
    if(type_of_action == "post"){
        unsalaried = document.getElementById("unsalaried");
        withSalary = document.getElementById("withSalary");
    }else{
        unsalaried = document.getElementById("unsalariedUpdate");
        withSalary = document.getElementById("withSalaryUpdate");
    }
    if(unsalaried.checked){
        salary = "unsalaried";
        return 1;
    }else if(withSalary.checked){
        salary = document.getElementById("amountUpdate").value;
        return 1;
    }else{
        console.log("salary not filled out");
        return 0;
    }
}

function checkContactBoxes(type_of_action){
    var eMail, Phone;
    if(type_of_action == "post"){
        eMail = document.getElementById("eMail");
        Phone = document.getElementById("Phone");
    }else{
        eMail = document.getElementById("eMailUpdate");
        Phone = document.getElementById("PhoneUpdate");
    }
    if(eMail.checked){
        contact = document.getElementById("emailUpdated").value;
        contactType = "E-Mail";
        return 1;
    }else if(Phone.checked){
        contact = document.getElementById("numberUpdated").value;
        contactType = "Phone";
        return 1;
    }else{
        console.log("contact not filled out");
        return 0;
    }
}

function checkAllCheckBoxes(type_of_action){
    if(checkJobCategorieBoxes(type_of_action) == 0 || checkSalaryBoxes(type_of_action) == 0 ||checkContactBoxes(type_of_action) == 0){
        return 0;
    }else{
        return 1;
    }
}

function getInputFieldValues(type_of_action, id_if_update){
    let firstName, lastName, location, jobTitle;
    if(type_of_action == "post"){
        firstName = document.getElementById("firstName").value;
        lastName = document.getElementById("lastName").value;
        location = document.getElementById("location").value;
        jobTitle = document.getElementById("jobTitle").value;
    }else{
        firstName = document.getElementById("firstNameUpdate").value;
        lastName = document.getElementById("lastNameUpdate").value;
        location = document.getElementById("locationUpdate").value;
        jobTitle = document.getElementById("jobTitleUpdate").value;
    }
    if(firstName == "" ||lastName == "" || location == "" || jobTitle == ""){
        alert(`Please fill out the whole form to ${type_of_action} a job.`);
    }else{
        let data = {};
        if(type_of_action == "update"){
            // const id_string = `ObjectId(${id_if_update})`;
            data = {
                _id: id_if_update,      //adding the id to update
                _firstName: firstName,
                _lastName: lastName,
                _location: location,
                _contactType: contactType,
                _contactInfo: contact,
                _jobTitle: jobTitle,
                _categorie: categorie,
                _salary: salary
            }
        }else{
            data = {
                _firstName: firstName,
                _lastName: lastName,
                _location: location,
                _contactType: contactType,
                _contactInfo: contact,
                _jobTitle: jobTitle,
                _categorie: categorie,
                _salary: salary
            }
        }
        let jsonData = "\n" + JSON.stringify(data, "\t", 2);
        document.forms[0].reset();
        return JSON.parse(jsonData);
    }
}

/*
Post job data to the database
*/
function postData(){
    if(checkAllCheckBoxes("post") == 0){
        alert("Please fill out the whole form to post a job.");
    }else{
        let jsonData = getInputFieldValues("post", 0);
        $.ajax({
          type: 'POST',
          url: "/postJobData",
          data: jsonData,
          dataType: "json"
        });
    }
}

/*
<--- INFO ABOUT UPDATING AND DELETING FUNCTION (PROBABLY SECURITY RELEVANT!!!) --->

Check if given ID exists on server -> if so, update/delete, if not: alert
Problem:
    With this function there will be a security issue (You could just brute force all IDs and delete/manipulate all existing jobs)
Solution:
    Authentification-System for user (e.g. OAuth2) -> test if ID corresponds to user (if not, forbid the upadate/delete request), however I will not do so (focus is not on security in this project), so be aware of the security situation described above (besides that, there probably are way worse security issues in this project, I am not aware of xD)
*/


/*
Update data on the database
*/
function checkIdBox(type_of_action){
    if(document.getElementById(`${type_of_action}_id_field`).value == ""){
        return 0;
    }else{
        return 1;
    }
}

function updateData(){
    if(checkAllCheckBoxes("update") == 0 || checkIdBox("update") == 0){
        alert("Please fill out the whole form to update a job.");
    }else{
        let id_value = document.getElementById("update_id_field").value;
        var regExForIdCheck = new RegExp("^[0-9a-fA-F]{24}$");  //id specification for mongo db ids
        if(regExForIdCheck.test(id_value)==false){
            alert("The id has to be 24 characters long (valid characters: 1-9 and a-f).\nPlease enter a valid id.");
        }else{
            let jsonData = getInputFieldValues("update", id_value);
            if(jsonData!=null){
                $.ajax({
                    type: 'PUT',
                    url: "/updateJobData",
                    dataType: "json",
                    data: jsonData,
                    success: function(response){
                        if(response == true){
                            alert(`The job with the id "${id_value}" was updated.`);
                        }else{
                            alert(`The job with the id "${id_value}" does not exist.`);
                        }
                    }
                });
            }
        }
    }
}

/*
Delete data on the database
*/

function deleteData(){
    if(checkIdBox("delete") == 0){
        alert("Please fill out the whole form to delete a job.")
    }else{
        const id_value = document.getElementById("delete_id_field").value;
        var regExForIdCheck = new RegExp("^[0-9a-fA-F]{24}$");  //id specification for mongo db ids
        if(regExForIdCheck.test(id_value)==false){
            alert("The id has to be 24 characters long (valid characters: 1-9 and a-f).\nPlease enter a valid id.");
        }else{
            let id = {
                _id: id_value
            }
            let jsonDataStringified = "\n" + JSON.stringify(id, "\t", 2);
            let jsonData = JSON.parse(jsonDataStringified);
            $.ajax({
                url: "/deleteJobData",
                type: "DELETE",
                dataType: "json",
                data: jsonData,
                success: function(response){
                    if(response == true){
                        alert(`The job with the id "${id_value}" was deleted.`);
                    }else{
                        alert(`The job with the id "${id_value}" does not exist.`);
                    }
                }
            });
        }
    }
}
