import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';


import announce from './routes/api/announce.js';
import users from './routes/api/user.js';
import auth from './routes/api/auth.js';
import profile from './routes/api/profile.js';
import department from './routes/api/department.js';
import services from './routes/api/services.js';
import events from './routes/api/events.js';
import form from './routes/api/form.js';
import documents from './routes/api/documents.js';
import comment from './routes/api/comment.js';
import gallary from './routes/api/gallary.js';

import connectDB from './config/db.js';

const app= express();



app.use(express.json({ extended : true}));
app.use(bodyParser.urlencoded({limit : "1000mb", extended : true}));
app.use(cors());

//connect Database
connectDB();

app.use('/users', users); 
app.use('/auth', auth); 
app.use('/profile', profile);
app.use('/announce', announce); 
app.use('/department', department); 
app.use('/services', services); 
app.use('/event', events);
app.use('/form', form);
app.use('/documents', documents);
app.use('/comment', comment);
app.use('/gallary', gallary);

const PORT = process.env.PORT || 4000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

