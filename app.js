const express = require('express');
const app = express();
const path = require("path");
app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.render("index");
});


app.get("/collisionTest.js",(req,res)=>{
    res.sendFile(path.join(__dirname,"collisionTest.js"));
});


app.get("/shipTest.js",(req,res)=>{
    res.sendFile(path.join(__dirname,"shipTest.js"));
});



app.get("/main.css",(req,res)=>{
    res.sendFile(path.join(__dirname,"main.css"));
});

app.get("/block",(req,res)=>{
    res.sendFile(path.join(__dirname,"block.js"));
});

app.get("/rayVsRect",(req,res)=>{
    res.sendFile(path.join(__dirname,"rayVsRect.js"));
});

app.get("/2Dvector",(req,res)=>{
    res.sendFile(path.join(__dirname,"2Dvector.js"));
});

app.get("/polygon",(req,res)=>{
    res.sendFile(path.join(__dirname,"polygon.js"));
});

app.get("/blockCollision",(req,res)=>{
    res.sendFile(path.join(__dirname,"blockCollision.js"));
});


app.get("/pirateShip",(req,res)=>{
    res.sendFile(path.join(__dirname,"pirateShip.js"));
});

app.get("/playerObject",(req,res)=>{
    res.sendFile(path.join(__dirname,"playerObject.js"));
});

app.get("/blockBlockCollision",(req,res)=>{
    res.sendFile(path.join(__dirname,"blockBlockCollision.js"));
});

app.get("/cannon",(req,res)=>{
    res.sendFile(path.join(__dirname,"cannon.js"));
});

app.get("/cannonBall",(req,res)=>{
    res.sendFile(path.join(__dirname,"cannonBall.js"));
});

app.get("/grapple",(req,res)=>{
    res.sendFile(path.join(__dirname,"grapple.js"));
});

app.get("/planet",(req,res)=>{
    res.sendFile(path.join(__dirname,"planet.js"));
});

app.get("/constants",(req,res)=>{
    res.sendFile(path.join(__dirname,"constants.js"));
});

app.get("/blockShipCollision",(req,res)=>{
    res.sendFile(path.join(__dirname,"blockShipCollision.js"));
});

app.get("/trapDoor",(req,res)=>{
    res.sendFile(path.join(__dirname,"trapDoor.js"));
});

app.get("/trapDoorCollision",(req,res)=>{
    res.sendFile(path.join(__dirname,"trapDoorCollision.js"));
});

app.get("/ladder",(req,res)=>{
    res.sendFile(path.join(__dirname,"ladder.js"));
});

app.get("/playerLadderCollision",(req,res)=>{
    res.sendFile(path.join(__dirname,"playerLadderCollision.js"));
});

app.get("/telescope",(req,res)=>{
    res.sendFile(path.join(__dirname,"telescope.js"));
});

app.get("/platform",(req,res)=>{
    res.sendFile(path.join(__dirname,"platform.js"));
});

app.get("/shipPlanetCollision",(req,res)=>{
    res.sendFile(path.join(__dirname,"shipPlanetCollision.js"));
});

app.get("/pointPolyCollision",(req,res)=>{
    res.sendFile(path.join(__dirname,"pointPolyCollision.js"));
});

app.get("/cannonBallShipCollision",(req,res)=>{
    res.sendFile(path.join(__dirname,"cannonBallShipCollision.js"));
});

app.get("/cannonBallTrapDoorCollision",(req,res)=>{
    res.sendFile(path.join(__dirname,"cannonBallTrapDoorCollision.js"));
});

app.get("/cannonBallPlanetCollision",(req,res)=>{
    res.sendFile(path.join(__dirname,"cannonBallPlanetCollision.js"));
});

app.get("/shipShipCollision",(req,res)=>{
    res.sendFile(path.join(__dirname,"shipShipCollision.js"));
});

app.get("/explosion",(req,res)=>{
    res.sendFile(path.join(__dirname,"explosion.js"));
});

app.get("/flag",(req,res)=>{
    res.sendFile(path.join(__dirname,"flag.js"));
});

app.get("/asteroid",(req,res)=>{
    res.sendFile(path.join(__dirname,"asteroid.js"));
});
app.get("/playerRopeCollision",(req,res)=>{
    res.sendFile(path.join(__dirname,"playerRopeCollision.js"));
});
app.get("/speedBoost.svg",(req,res)=>{
    res.sendFile(path.join(__dirname,"speedBoost.svg"));
});
app.get("/grapple.svg",(req,res)=>{
    res.sendFile(path.join(__dirname,"grapple.svg"));
});
app.get("/cannonBall.svg",(req,res)=>{
    res.sendFile(path.join(__dirname,"cannonBall.svg"));
});
app.listen(3000, ()=>console.log("listening on port 3000"));