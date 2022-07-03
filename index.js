const {Client} = require('pg');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const client = new Client({
    host : "localhost", 
    port : 5432, 
    user : "postgres", 
    password : "kpu@0914",
    database: "abc_mart"
})
client.connect((err)=>{
  if(err) throw err;
  console.log('PostGreSQL Connected...');
});

//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));

//route for homepage
app.get('/',(req, res) => {
  let sql = "SELECT * FROM product order by product_id";
  let query = client.query(sql, (err, results) => {
    if(err) throw err;
    res.render('product_view',{
      results: results.rows
     });
  });
});

//route for insert data
app.post('/save',(req, res) => {
  
  let product_name = req.body.product_name;
  let product_qty = req.body.product_qty;
  let product_price = req.body.product_price;
  let famous = req.body.famous;
 
  let query = client.query('insert into product (product_name, product_qty, product_price, famous)values($1,$2,$3,$4)', [product_name, product_qty, product_price, famous],(err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});
//route for update data
app.post('/update',(req, res) => {
  let sql = "UPDATE product SET product_name='"+req.body.product_name+"',product_qty='"+req.body.product_qty+"', famous='"+req.body.famous+"',product_price='"+req.body.product_price+"' WHERE product_id="+req.body.id;
  let query = client.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});

//route for delete data
app.post('/delete',(req, res) => {
  let sql = "DELETE FROM product WHERE product_id="+req.body.product_id+"";
  let query = client.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/');
  });
});

//server listening
app.listen(3000, () => {
  console.log('Server is running at port 3000');
});
