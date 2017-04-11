/**
 * Created by xiaoxiaosu on 17/4/10.
 */


var dongnao = require('./dongnao');
var querystring = require('querystring')

var url = require('url')



var app = new dongnao()
app.use('/cdn',dongnao.static)
app.use('/aaa',function (req,res,next) {
    console.log('req.query',req.query)
    next()
})
app.use(function (req, res,next) {
    console.log('hello all road')
    next()
})
app.get('/aaa',function (req, res) {
    res.send('hello aaa bbb')
})
app.get('/bbb',function (req,res) {
    res.send('hello bbb')
})
app.post('/bbb',function (req, res) {
    console.log(req.body,'22222')
    res.send(JSON.stringify(req.body))
})
app.get('/ccc',function (req,res) {
    res.send('hello ccc')
})

app.listen(8082)