/**
 * Created by xiaoxiaosu on 17/4/11.
 */

var mime = {
    ".html" : "text/html",
    ".css"  : "text/css",
    ".js"   : "text/javascript",
    ".json" : "application/json",
    ".ico"  : "image/x-icon",
    ".gif"  : "image/gif",
    ".jpeg" : "image/jpeg",
    ".jpg"  : "image/jpeg",
    ".png"  : "image/png",
    ".pdf"  : "application/pdf",
    ".svg"  : "image/svg+xml",
    ".swf"  : "application/x-shockwave-flash",
    ".tiff" : "image/tiff",
    ".txt"  : "text/plain",
    ".wav"  : "audio/x-wav",
    ".wma"  : "audio/x-ms-wma",
    ".wmv"  : "video/x-ms-wmv",
    ".xml"  : "text/xml"
};
var url = require('url'),
    fs = require('fs'),
    path = require('path')
var static = function (req,res) {
    var pathname = url.parse(req.url).pathname;
    var root=  path.dirname(path.dirname(__dirname))
    pathname = pathname.replace(/\//,'')

    var p = path.join(root,pathname)
    var ext = path.extname(p)
    console.log(ext)

    console.log(fs.existsSync(p))
    if(fs.existsSync(p)){
        if(ext){
            res.writeHead(200, {'Content-Type': mime[ext]});
            res.send(fs.readFileSync(p))
        }else {
            res.writeHead(200, {'Content-Type': mime['.html']});

            if(fs.existsSync(path.join(p,'index.html'))){
                res.send(fs.readFileSync(path.join(p,'index.html')))
            }else {
                var folder = fs.readdirSync(p)
                var html = '<ul>'
                folder =folder.map(function (file) {
                    return '<li><a href='+file+'>'+file+'</a></li>'
                }).join('')
                html = html + folder + '</ul>'
                res.send(html)
            }

        }
    }else {
        res.send('404 not found')
    }


    res.send(ext)
    //
}

module.exports = static