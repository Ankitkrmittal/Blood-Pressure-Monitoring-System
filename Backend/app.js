import 'dotenv/config'
import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";
import cors from 'cors';
const PORT = 4444;
const app =express();

import authRoutes from './http/routes/auth.routes.js'
import requireAuth from './http/middlewares/requireAuth.js';
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/auth',authRoutes);

//app.use('/api/user',requireAuth,);

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`);
})
