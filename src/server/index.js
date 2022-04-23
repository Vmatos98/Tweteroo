import express from 'express';
import cors from 'cors';
import * as fs from 'fs';
import chalk from 'chalk';


const app = express().use(express.json()).use(cors());
const dataUsers = "./src/DB/accounts.json";
const dataContent = "src/DB/content.json";


app.post("/sign-up", (req, res) => {
    const {username} = req.body;
    const data = JSON.parse(fs.readFileSync(dataUsers));
    if (data.find((user) => user.username === username) ) {
        res.status(200).send("OK");
        console.log(chalk.bold.yellow(`The user: "${username}" already exists!`));
        return;
    }
    data.push(req.body);

    fs.writeFile(dataUsers, JSON.stringify(data, null, 2), (err) => {
        if (err) throw err;
        console.log(chalk.bold.green(`The user: "${username}" was created!`));
    });
    res.status(201).send("OK");
});


// app.get("/tweets", (req, res) => {
    
// });
app.listen(5000);