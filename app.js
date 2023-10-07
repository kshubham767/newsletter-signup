//jshint esversion: 6

const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
require('dotenv').config();

app = express();

//directory to be loaded statically
app.use(express.static("public"));

app.use(bodyParser.urlencoded({encoding:true}));
app.get("/",function(req,res)
{
    res.sendFile(__dirname+"/signup.html");
});


app.post("/",function(req,res)
{
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const data = {
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const url = "https://us21.api.mailchimp.com/3.0/lists/9ecdcef861";
    const options = {
        method: "POST",
        auth:"kshubham767:"+apiKey
    }


    const request = https.request(url,options,function(response)
    {

        if (response.statusCode === 200) {
            res.sendFile(__dirname+"/success.html");
        }
        else
        {
            res.sendFile(__dirname+"/failure.html");
        }

        let responseData = '';

response.on("data", function(data) {
    responseData += data;
});

response.on("end", function() {
    try {
        const parsedData = JSON.parse(responseData);
        console.log(parsedData);
    } catch (error) {
        console.error("Error parsing JSON:", error);
    }
});

    });

    request.write(jsonData);
    request.end();
});

//for failure case redirect to root
app.post("/failure",function(req,res)
{
    res.redirect("/");
});
const port = process.env.PORT || 3000;
app.listen(port,function()
{
    console.log("Server is running on port "+ port);
});
