require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const client = require('@mailchimp/mailchimp_marketing');

const app = express();

app.use(express.static(__dirname + '/ContactFrom'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/ContactFrom/index.html')
})

app.post("/", (req, res) => {
    const FirstName = req.body.Fname;
    const LastName = req.body.Lname;
    const Email = req.body.email;


    client.setConfig({
        apiKey: process.env.API_KEY,
        server: "us7",
    });

    const run = async () => {
        const response = await client.lists.batchListMembers(process.env.LIST_ID, {
            members: [{
                email_address: Email,
                status: "subscribed",
                merge_fields: {
                    FNAME: FirstName,
                    LNAME: LastName
                }
            }],
        });
        console.log(response);
        if (response.new_members.length > 0) {
            res.sendFile(__dirname + '/ContactFrom/success.html')
        }
        else {
            res.sendFile(__dirname + '/ContactFrom/failure.html')
        }
    };

    run();


    // async function run() {
    //     const response = await client.ping.get();
    //     console.log(response);
    // }

    // run();

})

app.post("/error", (req, res) => {
    res.sendFile(__dirname + '/ContactFrom/index.html');
})

app.listen(process.env.PORT || 3000, () => {
    console.log("server is up and running on port 3000");
})

