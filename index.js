const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express());


app.get("/", (req, res) => {
    res.send("Brand shop Server is running");
})
app.listen(port, ()=> {
    console.log(`Brand shop server is running on port : ${port}`);
})