const express = require("express");
const {Server} = require("socket.io");
const http = require("http");
require("dotenv").config();


const app = express();

const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

io.on("connection", (socket) => {
    console.log("React frontend Connected to Socket.Io Successfully");
    socket.on("disconnect", () => {
        console.log("React Frontend Disconnect from socket.Io");
    })
});


app.use(express.json());
const leads = [];


// ********************************************get(/)**************************************************
app.get('/', (req, res) => {
    res.send("LeadBridge is running");
});
// ********************************************Funct =>getLeadDetails***********************************

async function getLeadDetails(leadgen_id) {

    const page_access_token = process.env.PAGE_ACCESS_TOKEN;
    const query = new URLSearchParams({
        fields :"field_data",
        access_token : page_access_token
    });
    try {
        const response = await fetch("https://graph.facebook.com/" + encodeURIComponent(leadgen_id) + "?" + query.toString());
        if (!response.ok) {
            console.error("Meta Graph API request failed.");
            return;
        }
        const lead = await response.json();
        console.dir(lead, {depth:null});
        const leadDetails = {
            leadgen_id: leadgen_id,
            full_name: "",
            email: "",
            phone_number: "",
        }
        if(!lead.field_data) return;
        lead.field_data.forEach((field) => {
            if (field.name === "full_name" || field.name ==="name") {
                leadDetails.full_name = field.values[0] || "";
            }
            if (field.name === "email") {
                leadDetails.email = field.values[0] || "";
            }
            if (field.name === "phone_number") {
                leadDetails.phone_number = field.values[0] || "";
            }
        });

        console.log("final LeadDetails: ==============>", leadDetails);
        leads.push(leadDetails);
        io.emit("new_lead", leadDetails);
        return leadDetails;
    }
    catch (error) {
        console.log("Could not fetch lead Details from Meta Graph API");
    }

}

// *************************************get(/webhook)*************************************************
app.get('/webhook', (req, res) => {

    console.log("Query", req.query);
    console.log("URL", req.url);

    const mode = req.query["hub.mode"];
    const challenge = req.query["hub.challenge"];
    const token = req.query["hub.verify_token"];

    if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
        return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
});

// *************************************post(/webhook)*************************************************
app.post("/webhook", (req, res) => {

    console.log("LeadGenId Extracted from", req.body);
    console.dir(req.body, {depth:null});

    if (
    !req.body ||
    !Array.isArray(req.body.entry) ||
    !req.body.entry[0] ||
    !Array.isArray(req.body.entry[0].changes) ||
    !req.body.entry[0].changes[0] ||
    !req.body.entry[0].changes[0].value ||
    !req.body.entry[0].changes[0].value.leadgen_id
) {
    return res.status(400).json({
        message: "leadgen_id not found"
    });
}
    const leadgen_id = req.body.entry[0].changes[0].value.leadgen_id;

    getLeadDetails(leadgen_id);

    res.status(200).json({
        message: "LeadDetails Recieved Successfully"
    });

});

// app.post('/webhook', (req, res) => {

//     const leadgen_ids = [];
//     if (req.body && Array.isArray(req.body.entry)) {
//         req.body.entry.forEach((entry) => {
//             if (!Array.isArray(entry.changes)) return;

//             entry.changes.forEach((change) => {
//                 if (change.field === 'leadgen' && change.value && change.value.leadgen_id) {
//                     leadgen_ids.push(change.value.leadgen_id);
//                 }
//             })

//         })
//     }

//     // leadgen_ids.forEach((leadgen_id)=>{
//     //    await getLeadDetails(leadgen_id);  //awaitnot worked properly
//     // });  //for Eacjj finish immidietly   //forEach ko ye pata nahi ki andar wala await kab complete hoga.


//     for(const leadgen_id of leadgen_ids){
//        await getLeadDetails(leadgen_id);
//     }//complete one by one

//     res.status(200).json({
//         message:"webhook Post working successfully"
//     });

// });
// ********************************************get(/leads)**************************************************

app.get("/leads", (req, res) => {

    try {
        return res.status(200).json({
            leads: leads
        })
    }
    catch (err) {
        console.error("Could not return stored leads.");
        return res.status(500).json({
            message: "Could not return stored leads.",
            error: err
        })
    }

});

// ********************************************post(/leads)**************************************************
app.post("/leads", (req, res) => {

    const { leadgen_id, full_name, email, phone_number } = req.body || {};

    if (!leadgen_id || !full_name || !email || !phone_number) {
        return res.status(400).json({
            message: "leadgen_id, full_name, email, phone_number required"
        });
    }
    const newLead = {
        leadgen_id : leadgen_id,
        full_name : full_name,
        email : email,
        phone_number : phone_number
    }

    leads.push(newLead);

    return res.status(201).json({
        lead: newLead
    });

});


server.listen(5000, () => {
    console.log("Server Started Successfully");
});