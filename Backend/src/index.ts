// import express from "express";
// import cors from 'cors';
// import { json } from 'express';
// import routes from "./routes/index";

// const app = express();
// app.use(cors());
// app.use(json());

// require('./config/db')
// const port = process.env.PORT || 8080
// app.listen(port, () => {
//     console.log("server is listening on port " + port);
// })

// app.use('/api', routes)
// app.get('/api', (req, res) => {
//     res.send('Hello World!')
// })
// app.js (or index.js)

import { join } from 'path';
import express from 'express';
import cors from 'cors';
import routes from './routes/index';
import bodyParser from 'body-parser';
import pushNotifications from './services/notification';
// import { deleteOldFiles } from './services/uploadFiles';
// import cron = require('node-cron');

const app = express();

app.use(cors({origin:true}));
app.use(express.static('default'));
app.use(cors());

app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(bodyParser.json())

app.use('/', express.static(join(__dirname, '..', 'public/uploads')));

require('./config/db');
// cron.schedule('0 0 * * *', async () => {
//     await deleteOldFiles();

// });
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

app.use('/api', routes);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
