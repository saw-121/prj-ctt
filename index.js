const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/user");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const methodOverride = require("method-override");

//routes import
const loginRoutes = require("./routes/login/login");
const adminRoutes = require("./routes/admin/admin_route");
const userRoutes = require("./routes/users/user_route");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(cookieParser());
app.use(methodOverride("_method"));

app.use(
  require("express-session")({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

//db connection config
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongodb connected successfully");
  })
  .catch((error) => {
    console.log("Connection Error");
    console.error(error);
  });

app.use("/", loginRoutes);
app.use("/admin", adminRoutes);
app.use("/users", userRoutes);

app.listen(process.env.PORT, function () {
  console.log(`Server is runing on port ${process.env.PORT}`);
});
