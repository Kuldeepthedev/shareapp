const express = require('express')
const app = express()
app.use(express.json())
const userRoute = require('./Routes/userRoute')
const dbconnect = require('./database/dbconnect')
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '150mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '150mb' }));
require('dotenv').config()
const cors = require('cors')
const postRoute = require('./Routes/postRoute')
const showpostRoute = require('./Routes/showpostRoute')
const showmypostRoute = require('./Routes/showmypostRoute')
const showsavepostRoute = require('./Routes/showsavepost')

const corsOptions = {
    origin: 'http://https://communicateus.netlify.app/',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use('/uploads', express.static('uploads'));



app.use('/user', userRoute)
app.use('/post', postRoute)
app.use('/showpost', showpostRoute)
app.use('/showmypost', showmypostRoute)
app.use('/showsavepost', showsavepostRoute)

const PORT = process.env.PORT
dbconnect().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server Started at ${PORT}`)
    })
})
.catch((error)=>{
    console.log("eroor while connecting to databse")
})