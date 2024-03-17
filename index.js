require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dns = require('dns')

// Basic Configuration
const port = process.env.PORT || 3000;
let id = 0;
let array = [];

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {


    const urlObj = new URL(req.body.url)

    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      res.send({ error: 'invalid url' })
    }
    else {
      dns.lookup( urlObj.hostname, (err)=>{
        if ( err ) {
          res.send({ error: 'invalid url' })
        }
        else {
          id++;
          array.push({ original_url : req.body.url, short_url : id})

          res.json({
            original_url : req.body.url,
            short_url : id
          })
        }
      })
    }


    

})

app.get('/api/shorturl/:id', function(req, res) {

  console.log('array',array)

  const foundObject = array.find( el => el.short_url == req.params.id )

  console.log('foundObject',foundObject)

  if ( array.includes(foundObject) ) {
    res.redirect(foundObject.original_url)
  }
  else {
    res.send({ error: "ID not found" })
  }

})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
