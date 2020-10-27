require("dotenv").config();

const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const multer = require("multer");

// const chatRoutes = require("./routes/chat");
// const roomRoutes = require("./routes/rooms");

const app = express();

// parse req data
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(multer().single());

//cors settings
// const whitelist = [process.env.FRONT_END];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };
// app.use(cors(corsOptions));

//routes
// app.use(chatRoutes);
// app.use(roomRoutes);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT);
const io = require("./socket").init(server);
