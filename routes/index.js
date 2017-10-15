let express = require('express'),
    router = express.Router(),
    yaml = require('yamljs'),
    formidable = require('formidable'),
    fs = require('fs'),
    config = yaml.load('./config.yaml'),
    path = require('path'),
    utils = require('./../utils/response');

const util = require('util');

router.get('/image/:img', (req, res) => {
    path = path.join(process.env.PWD, '/uploads/', req.params.img);
    fs.readFile(path, function(err, data) {
        if (err) {
            res.writeHead(400, {'Content-type':'text/html'})
            console.log(err);
            res.end("No such image");
        } else {
            //specify the content type in the response will be an image
            res.writeHead(200,{'Content-type':'image/jpg'});
            res.end(data);
        }
    })
});

router.post('/uploadImage', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        // `file` is the name of the <input> field of type `file`
        var old_path = files.file.path,
            file_size = files.file.size,
            file_ext = files.file.name.split('.').pop(),
            index = old_path.lastIndexOf('/') + 1,
            new_path = path.join(process.env.PWD, '/uploads/', files.file.name.split('.')[0] + '.' + file_ext);
        fs.readFile(old_path, function(err, data) {
            fs.writeFile(new_path, data, function(err) {
                fs.unlink(old_path, function(err) {
                    if (err) {
                        res.status(500);
                        res.json({'success': false});
                    } else {
                        utils.doResponse(res, 200, {name : files.file.name.split('.')[0]+ '.' + file_ext})
                    }
                });
            });
        });
    });
});

module.exports = router;