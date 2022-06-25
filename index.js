require("dotenv").config()
const express = require("express");
const app = express();
const mongoose = require("mongoose")
const cors = require("cors")

const UserModel = require("./models/Users")
app.use(express.json())
app.use(cors())

const dbConnection = () => {
    mongoose.connect("mongodb+srv://root:root@cluster1.w15nq.mongodb.net/project1?retryWrites=true&w=majority",
    // {useNewUrlParser: true}
    (err)=>{
      if (!err) {
        console.log("mongoDb connected");
      } else {
        console.error("error while connecting to mongoDb");
        console.error(err)
      }
    }
     )
      
};

dbConnection();



app.post("/createUser", async (req, res) => {
    const user = req.body;
    const newUser = new UserModel(user);
    await newUser.save()

    res.json(user)
})

app.get("/getUsers", (request, response) => {
    UserModel.find({}, (err, result) => {
        if (!err) {
            response.json(result)
        } else {
            response.json(err)
        }
    })
})

app.put("/updateUser", (req, res) => {

    const {fullName,email,age,id} = req.body

    try {
        UserModel.findById(id, (err, user) => {
            console.log(user)
            user.name = fullName
            user.email = email
            user.age = age
            user.save()
            res.send("User has been successfully updated in DB")
        })
    }
    catch (err) {
        res.send("Getting error from server")
    }
})

app.delete("/deleteUser/:id", async (req, res) => {
    const id = req.params.id

    await UserModel.findByIdAndRemove(id).exec()
    res.send("User has been successfully deleted from DB")
})


const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server is running perfectly on port ${PORT}`)
})