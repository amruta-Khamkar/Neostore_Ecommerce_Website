const express=require('express');
const port=8899;
const app=express();
const cors=require('cors')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}));
const postRoutes=require('./routes/postRoutes');
app.use(express.static('./'));

app.use('/api/users',postRoutes);


app.listen(port,(err)=>{
    if (err) throw err;
    console.log(`working on ${port}`)
})
