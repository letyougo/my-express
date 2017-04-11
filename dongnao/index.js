/**
 * Created by xiaoxiaosu on 17/4/10.
 */
var http = require('http'),
    url = require('url'),
    querystring = require('querystring')
fs = require('fs');

var static = require('./middleware/static')

function dongnao() {
    this.map = []
}
dongnao.prototype.get = function (url,cb) {
    var obj = {
        method:'GET',
        isMid:false,
        url:url,
        cb:cb
    }
    this.map.push(obj)
}
dongnao.prototype.post = function (url,cb) {
    var obj = {
        method:'POST',
        isMid:false,
        url:url,
        cb:cb
    }
    this.map.push(obj)
}
dongnao.prototype.use = function () {
    var url,cb
    if(arguments.length == 2){
        url = arguments[0]
        cb = arguments[1]
    }else {
        url = '*'
        cb = arguments[0]
    }
    var obj = {
        method:'GET',
        isMid:true,
        url:url,
        cb:cb
    }
    this.map.push(obj)
}
dongnao.prototype.listen = function (port) {
    var that = this
    this.http = http.createServer(function (req, res) {
        var post = ''
        if(req.method == 'GET'){
            that.run(req,res)
        }else {
            req.on('data',function (chunk) {
                post += chunk
            })
            req.on('end',function () {
                req.body = querystring.parse(post)
                that.run(req,res)
            })
        }
    }).listen(port)
}
dongnao.prototype.run = function (req,res) {
    var that = this
    req.query = querystring.parse(url.parse(req.url).query)

    var pathname = url.parse(req.url).pathname;


    res.send = function (content) {
        res.end(content)
    }


    var next_id
    var next = function () {
        if(that.map[next_id].isMid){
            deal_request(next_id+1,that.map.length)
        }
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    var deal_request = function (i) {

        if(i==that.map.length){
            res.send('404 page not found')
            return
        }
        var matchUrl = that.map[i].url == pathname || that.map[i].url == '*' || (that.map[i].isMid && pathname.indexOf(that.map[i].url)==0)
        if(matchUrl && that.map[i].method == req.method){
            next_id = i
            that.map[i].cb(req,res,next)
        }else {
            deal_request(i+1,that.map.length)
        }
    }
    deal_request(0,that.map.length)
}
dongnao.static =static
module.exports = dongnao