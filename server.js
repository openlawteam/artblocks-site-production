const path = require('path');
const express = require("express");
const app = express();
const fs = require('fs');

function isNumber(value) {
    return isNaN(value) === false;
}

const pathToIndex = path.join(__dirname, 'build/index.html');
app.get('/token/:tokenId', (req, res) => {
    const raw = fs.readFileSync(pathToIndex, "utf8");
    const token = req.params.tokenId;

    if (isNumber(token) === false) {
        res.redirect("/token/0");
    } else {
        const updated1 = raw.replace('https://api.artblocks.io/image/248', (
            `https://api.artblocks.io/image/${token}`));
        const updated2 = updated1.replace('https://api.artblocks.io/image/248', (
            `https://api.artblocks.io/image/${token}`));
        const updated3 = updated2.replace('https://api.artblocks.io/image/248', (
            `https://api.artblocks.io/image/${token}`));
        const updated4 = updated3.replace('https://api.artblocks.io/image/248', (
            `https://api.artblocks.io/image/${token}`));

        res.send(updated4);
    }
})

app.get('/project/:projectId', (req, res) => {
    const raw = fs.readFileSync(pathToIndex, "utf8");
    const project = req.params.projectId;

    if (isNumber(project) === false) {
        res.redirect("/project/0");
    } else {
        const updated1 = raw.replace('https://api.artblocks.io/image/248', (
            `https://api.artblocks.io/image/${project * 1000000}`));
        const updated2 = updated1.replace('https://api.artblocks.io/image/248', (
            `https://api.artblocks.io/image/${project * 1000000}`));
        const updated3 = updated2.replace('https://api.artblocks.io/image/248', (
            `https://api.artblocks.io/image/${project * 1000000}`));
        const updated4 = updated3.replace('https://api.artblocks.io/image/248', (
            `https://api.artblocks.io/image/${project * 1000000}`));

        res.send(updated4);
    }
})

app.get('/sustainability', (req, res) => {
    const raw = fs.readFileSync(pathToIndex, "utf8");
    //const project = req.params.projectId;

    /*if (isNumber(project) === false) {
        res.redirect("/project/0");
    } else {*/
        const updated1 = raw.replace('https://api.artblocks.io/image/248', (
            `https://lh3.googleusercontent.com/Pb95y9FbyRaibJ2qvm3AhiQ83xTDr98EGsJ6kGNZrSdLQ0EXZFRYS_5lwRhrL6_2q9D-Wo9WNE641LlUUHMlgld4loz5PQmrVfo2=s0`));
        const updated2 = updated1.replace('https://api.artblocks.io/image/248', (
            `https://lh3.googleusercontent.com/Pb95y9FbyRaibJ2qvm3AhiQ83xTDr98EGsJ6kGNZrSdLQ0EXZFRYS_5lwRhrL6_2q9D-Wo9WNE641LlUUHMlgld4loz5PQmrVfo2=s0`));
        const updated3 = updated2.replace('https://api.artblocks.io/image/248', (
            `https://lh3.googleusercontent.com/Pb95y9FbyRaibJ2qvm3AhiQ83xTDr98EGsJ6kGNZrSdLQ0EXZFRYS_5lwRhrL6_2q9D-Wo9WNE641LlUUHMlgld4loz5PQmrVfo2=s0`));
        const updated4 = updated3.replace('https://api.artblocks.io/image/248', (
            `https://lh3.googleusercontent.com/Pb95y9FbyRaibJ2qvm3AhiQ83xTDr98EGsJ6kGNZrSdLQ0EXZFRYS_5lwRhrL6_2q9D-Wo9WNE641LlUUHMlgld4loz5PQmrVfo2=s0`));

        res.send(updated4);
    //}
})

app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "build/index.html"))
);
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})
