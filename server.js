const path = require('path');
const express = require("express");
const app = express();
const fs = require('fs');
//
const pathToIndex = path.join(__dirname, 'build/index.html');
app.get('/token/:tokenId', (req, res) => {
    const raw = fs.readFileSync(pathToIndex, "utf8");
    const token = req.params.tokenId;
    const updated1 = raw.replace('https://api.artblocks.io/image/0', (
        `https://api.artblocks.io/image/${token}`));
    const updated2 = updated1.replace('https://api.artblocks.io/image/0', (
        `https://api.artblocks.io/image/${token}`));
    const updated3 = updated2.replace('https://api.artblocks.io/image/0', (
        `https://api.artblocks.io/image/${token}`));
    const updated4 = updated3.replace('https://api.artblocks.io/image/0', (
        `https://api.artblocks.io/image/${token}`));

    res.send(updated4);
})

app.get('/project/:projectId', (req, res) => {
    const raw = fs.readFileSync(pathToIndex, "utf8");
    const project = req.params.projectId;
    const updated1 = raw.replace('https://api.artblocks.io/image/0', (
        `https://api.artblocks.io/image/${project*1000000}`));
    const updated2 = updated1.replace('https://api.artblocks.io/image/0', (
        `https://api.artblocks.io/image/${project*1000000}`));
    const updated3 = updated2.replace('https://api.artblocks.io/image/0', (
        `https://api.artblocks.io/image/${project*1000000}`));
    const updated4 = updated3.replace('https://api.artblocks.io/image/0', (
        `https://api.artblocks.io/image/${project*1000000}`));

    res.send(updated4);
})
//
app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) =>
	res.sendFile(path.join(__dirname, "build/index.html"))
);
const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
})
