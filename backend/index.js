const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Stocks = require('./Models/Stocks');
require('dotenv').config();
const MyStock = mongoose.model('MyStock');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const port = process.env.PORT ||5000;

const database = process.env.MONGOURI;

require('./Models/Stocks');

mongoose.connect(database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('mongoose connected');
}).catch((err) => console.log('no connection'))


// Root Route for testing

app.get('/', async (req, res) => {
    const item = new MyStock({
        otype: "o45",
        bso: [
            {length: "67mm", quantity:50}
        ],
        dso: [
            {length: "97mm", quantity:550}
        ]
    });
    item.save();
    res.send('working');
})


// GET, POST and DELETE items

app.get('/items', async (req, res) => {
    const arr = [];
    const items = await MyStock.find({});
    items.forEach((item) => {
        arr.push(item.otype);
    })
    res.send(arr);
})

app.post('/add-item', (req,res) => {
    const i = req.body.otype;
    console.log(i);
    const item = new MyStock({
        otype: i.item,
        bso: [
            
        ],
        dso: [
            
        ]
    });
    item.save();
})

app.get('/delete-item/:item', async (req, res) =>{
    const item = req.params.item
    await MyStock.deleteOne({
        otype: item
    })
    res.send('delete-item working')
    console.log(item);
})




// GET, POST and DELETE length with quantity

app.get('/lengths/:item/:option', async (req, res) => {
    const arr = []
    const item = req.params.item;
    const option = req.params.option;
    const i = await MyStock.findOne({otype: item});
    i[option].forEach(function(l) {
        arr.push(l);
    });
    res.send(arr);
})

app.post('/add-length', async (req,res) => {
    const item = req.body.otype.item;
    const len = req.body.length.len;
    const quant = req.body.quantity.quant;

    if(req.body.option.option === 'bso'){
        await MyStock.updateOne(
            {otype: item},
            {
                $push: {
                    bso: {
                        length: len,
                        quantity:quant
                    }
                }
            }
        )
    }
    if(req.body.option.option === 'dso'){
        await MyStock.updateOne(
            {otype: item},
            {
                $push: {
                    dso: {
                        length: len,
                        quantity:quant
                    }
                }
            }
        )
    }
})


// GET and POST details

app.post('/add-stock', async (req,res) => {
    const item = req.body.otype.item;
    const len = req.body.length.length;
    const x = req.body.x.x;

    if(req.body.option.option === 'bso'){
        await MyStock.updateOne(
            {otype: item, "bso.length": len},
            {   
                $inc:
                {
                    "bso.$.quantity": x
                }

            }
        )
    }
    if(req.body.option.option === 'dso'){
        await MyStock.updateOne(
            {otype: item, "dso.length": len},
            {   
                $inc:
                {
                    "dso.$.quantity": x
                }

            }
        )
    }
    // console.log(x);
})

app.post('/sub-stock', async (req,res) => {
    const item = req.body.otype.item;
    const len = req.body.length.length;
    const x = req.body.x.x;

    if(req.body.option.option === 'bso'){
        await MyStock.updateOne(
            {otype: item, "bso.length": len},
            {   
                $inc:
                {
                    "bso.$.quantity": -x
                }

            }
        )
    }
    if(req.body.option.option === 'dso'){
        await MyStock.updateOne(
            {otype: item, "dso.length": len},
            {   
                $inc:
                {
                    "dso.$.quantity": -x
                }

            }
        )
    }
    // console.log(-x);
})


// GET quantity
app.get('/quantity/:item/:option/:length', async (req,res) => {
    const arr = [];
    const item = req.params.item;
    const option = req.params.option;
    const length = req.params.length;
    const i = await MyStock.findOne({otype: item});
    i[option].forEach(function(obj){
        if(obj.length === length){
            arr.push(obj.quantity)
        }
    })
    res.send(arr);
})



app.listen(port,()=>{
    console.log(`server is running on the port ${port}`);
});