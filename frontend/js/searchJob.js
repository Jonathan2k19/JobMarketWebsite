$(document).ready(function() {
   $(".hidden_at_first").hide();
});

let dataArray = []; //stores response from database
let btnCounter = 0; //counts nextBtn clicks

function revealJobs(categorie){
    //gathering data depending on categorie
    if(categorie == "constructionJobs"){
        $.ajax({
            type: 'GET',
            url: "/getConstructionJobData",
            dataType: "json",
            success: function(response){
                dataArray = response;
                handleNextJobBtn(response);
            }
        });
    }else if(categorie == "businessJobs"){
        $.ajax({
            type: 'GET',
            url: "/getBusinessJobData",
            dataType: "json",
            success: function(response){
                dataArray = response;
                handleNextJobBtn(response);
            }
        });
    }else if(categorie == "teachingJobs"){
        $.ajax({
            type: 'GET',
            url: "/getTeachingJobData",
            dataType: "json",
            success: function(response){
                dataArray = response;
                handleNextJobBtn(response);
            }
        });
    }
}

function pop_up_show(){
    $(".hidden_at_first").show();
}

function pop_up_hide(){
    $(".hidden_at_first").hide();
}

function handleNextJobBtn(){
    let i = btnCounter;
    let response = dataArray;
    if(dataArray.length == 0){
        alert("Sorry, there are no jobs available in this categorie.");
    }else{
        if(i >= response.length){
            btnCounter = 0;  //after last job slide go to the first one again
            i = 0;
        }
        document.getElementById("jobTitle").innerHTML = `${response[i]._jobTitle}<br>`;
        document.getElementById("jobCategorie").innerHTML = `Categorie: ${response[i]._categorie}<br>`;
        document.getElementById("firstName").innerHTML = `First Name: ${response[i]._firstName}<br>`;
        document.getElementById("lastName").innerHTML = `Last Name: ${response[i]._lastName}<br>`;
        document.getElementById("location").innerHTML = `Location: ${response[i]._location}<br>`;
        document.getElementById("contact").innerHTML = `${response[i]._contactType}: ${response[i]._contactInfo}<br>`;
        document.getElementById("salary").innerHTML = `Salary: ${response[i]._salary}<br>`;
        pop_up_show();
        btnCounter++;
    }
}
