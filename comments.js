// Create web server

var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var comments = require('./comments');

var server = http.createServer(function(request, response) {
    if (request.method === 'GET' && request.url === '/comments') {
        comments.getComments(function(err, comments) {
            if (err) {
                response.writeHead(500, {'Content-Type': 'text/plain'});
                response.end(err + '\n');
                return;
            }

            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify(comments));
        });
    } else if (request.method === 'POST' && request.url === '/comments') {
        var body = '';
        request.on('data', function(data) {
            body += data;
        });
        request.on('end', function() {
            comments.addComment(JSON.parse(body), function(err, comment) {
                if (err) {
                    response.writeHead(500, {'Content-Type': 'text/plain'});
                    response.end(err + '\n');
                    return;
                }

                response.writeHead(201, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(comment));
            });
        });
    } else {
        var filePath = './public' + request.url;
        if (filePath === './public/') {
            filePath = './public/index.html';
        }

        fs.exists(filePath, function(exists) {
            if (exists) {
                fs.readFile(filePath, function(err, data) {
                    if (err) {
                        response.writeHead(500, {'Content-Type': 'text/plain'});
                        response.end(err + '\n');
                    } else {
                        response.writeHead(200, {'Content-Type': mime.lookup(filePath)});
                        response.end(data);
                    }
                });
            } else {
                response.writeHead(404, {'Content-Type': 'text/plain'});
                response.end('404 Not Found\n');
            }
        });
    }
});

server.listen(3000, function() {
    console.log('Server is running at http://localhost:3000/');
});