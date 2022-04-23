import express from 'express';

const app = express();

app.post("/sign-up", (req, res) => {
    res.send('Hello World');
});

app.get("/", (req, res) => {
    res.send('Hello World');
});

app.listen(5000);