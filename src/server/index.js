import express from 'express';
import cors from 'cors';
import * as fs from 'fs';
import chalk from 'chalk';


const app = express().use(express.json()).use(cors());
const dataUsers = "./src/DB/accounts.json";
const dataContent = "src/DB/content.json";


app.post("/sign-up", (req, res) => {
    const {username, avatar} = req.body;
    const data = JSON.parse(fs.readFileSync(dataUsers));
    if(!username || !avatar){
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }
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

app.post("/tweets", (req, res) => {
    const {tweet} = req.body;
    const username = req.header("user");
    if (!username || !tweet) {
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }
    const data = JSON.parse(fs.readFileSync(dataContent));
    const users = JSON.parse(fs.readFileSync(dataUsers));
    let avatar='';
    users.find(user => {
        if(user.username === username) avatar = user.avatar; 
    })


    data.unshift({
        username,
        avatar,
        tweet,
    });

    fs.writeFile(dataContent, JSON.stringify(data, null, 2), (err) => {
        if (err) throw err;
        console.log(chalk.bold.yellow(`The tweet of ${username} has been added to DB`));
    });
    res.status(201).send("OK");
});

app.get("/tweets", (req, res) => {
    const page = req.query.page;
    if(isNaN(page) || page<1){
        res.status(400).send("Informe uma página válida!");
        return;
    }
    const tweets = JSON.parse(fs.readFileSync(dataContent, "utf8"));
    const output = [];
    for(let i = page * 10 -10; i< page *10 - 1; i++){
        if(i<= tweets.length) {
            const username = tweets[i].username;
            const tweet = tweets[i].tweet;
            if(!tweets[i].avatar){
                const users = JSON.parse(fs.readFileSync(dataUsers));
                let avatar='';
                users.find(user => {
                    if(user.username === username) avatar = user.avatar; 
                })
                output.push({
                    username,
                    tweet,
                    avatar
                });
                    console.log(output);
            }else{
            output.push(tweets[i]);
            }
        }
    }
    res.send(output);
});

app.get("/tweets/:user", (req, res) => {
    const {user} = req.params;
    const tweets = JSON.parse(fs.readFileSync(dataContent, "utf8"));
    const output = [];
    for(let i of tweets){
        if(i.username === user){
            const tweet = i.tweet;
            if(!i.avatar){
                const users = JSON.parse(fs.readFileSync(dataUsers));
                let avatar='';
                users.find(userData => {
                    if(userData.username === user) avatar = userData.avatar; 
                })
                output.push({
                    user,
                    tweet,
                    avatar
                });
                    console.log(output);
            }else{
                output.push(i);
            }
        }
    }
    res.send(output);
});
app.listen(5000);