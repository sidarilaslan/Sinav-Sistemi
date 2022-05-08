const express = require("express");

const app = express();
app.use("/public", express.static('public'));




require('./routers/index')(app);



app.listen(3000, () => {
    console.log(`Server is running on  http://localhost:3000/ `);

});