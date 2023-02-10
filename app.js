const bodyParser= require('body-parser');
const express= require('express');
const path = require('path');

const app= express();
app.set('view engine', 'pug');
app.set('views' ,'views')
const adminRoutes= require('./routes/admin');
const shopRoutes= require('./routes/shop');
const rootDir= require('./util/path')

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname,'public')));

app.use(shopRoutes);

app.use("/admin" ,adminRoutes.routes);

app.use((req,res, next)=>{
    res.status(404).sendFile(path.join(rootDir, 'views', '404.html'))
})



app.listen(3000);
