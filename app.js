//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const passport = require("passport");
 
var fs = require('fs');
var path = require('path');
const CsvReadableStream = require('csv-reader');
const multer = require('multer');

const ejsLint = require('ejs-lint');
// const spawn = require("child_process").spawn;
// const pythonProcess = spawn('python',["data.py"]);



//    app.get('/', (req, res) => {

//     const { spawn } = require('child_process');
//     const pyProg = spawn('python', ['analysis.py']);
 
//     pyProg.stdout.on('data', function(data) {

//         console.log(data.toString());
//         res.write(data);
//         res.end('end');
//     });
// });

// pythonProcess.stdout.on('data', (data) => {
//     // Do something with the data returned from python script
//    });

//    var vega = require('vega')
// var fs = require('fs')

// var stackedBarChartSpec = require('./stacked-bar-chart.spec.json');

// // create a new view instance for a given Vega JSON spec
// var view = new vega
//   .View(vega.parse(stackedBarChartSpec))
//   .renderer('none')
//   .initialize();

// // generate static PNG file from chart
// view
//   .toCanvas()
//   .then(function (canvas) {
//     // process node-canvas instance for example, generate a PNG stream to write var
//     // stream = canvas.createPNGStream();
//     console.log('Writing PNG to file...')
//     fs.writeFile('stackedBarChart.png', canvas.toBuffer())
//   })
//   .catch(function (err) {
//     console.log("Error writing PNG to file:")
//     console.error(err)
//   });
// // END vega-demo.js

// // START stacked-bar-chart.spec.json 
// {
//     "$schema"= "https://vega.github.io/schema/vega/v3.0.json",
//     "width"= 500,
//     "height"= 200,
//     "padding"= 5,
  
//     "data"= [
//       {
//         "name": "table",
//         "values": [
//           {"x": 0, "y": 28, "c":0}, {"x": 0, "y": 55, "c":1},
//           {"x": 1, "y": 43, "c":0}, {"x": 1, "y": 91, "c":1},
//           {"x": 2, "y": 81, "c":0}, {"x": 2, "y": 53, "c":1},
//           {"x": 3, "y": 19, "c":0}, {"x": 3, "y": 87, "c":1},
//           {"x": 4, "y": 52, "c":0}, {"x": 4, "y": 48, "c":1},
//           {"x": 5, "y": 24, "c":0}, {"x": 5, "y": 49, "c":1},
//           {"x": 6, "y": 87, "c":0}, {"x": 6, "y": 66, "c":1},
//           {"x": 7, "y": 17, "c":0}, {"x": 7, "y": 27, "c":1},
//           {"x": 8, "y": 68, "c":0}, {"x": 8, "y": 16, "c":1},
//           {"x": 9, "y": 49, "c":0}, {"x": 9, "y": 15, "c":1}
//         ],
//         "transform": [
//           {
//             "type": "stack",
//             "groupby": ["x"],
//             "sort": {"field": "c"},
//             "field": "y"
//         }
//       ]
//     }
//   ],

//   "scales"= [
//     {
//       "name": "x",
//       "type": "band",
//       "range": "width",
//       "domain": {"data": "table", "field": "x"}
//     },
//     {
//       "name": "y",
//       "type": "linear",
//       "range": "height",
//       "nice": true, "zero": true,
//       "domain": {"data": "table", "field": "y1"}
//     },
//     {
//       "name": "color",
//       "type": "ordinal",
//       "range": "category",
//       "domain": {"data": "table", "field": "c"}
//     }
// ],

// "axes"= [
//   {"orient": "bottom", "scale": "x", "zindex": 1},
//   {"orient": "left", "scale": "y", "zindex": 1}
// ],

// "marks"= [
//   {
//     "type": "rect",
//     "from": {"data": "table"},
//     "encode": {
//       "enter": {
//         "x": {"scale": "x", "field": "x"},
//         "width": {"scale": "x", "band": 1, "offset": -1},
//         "y": {"scale": "y", "field": "y0"},
//         "y2": {"scale": "y", "field": "y1"},
//         "fill": {"scale": "color", "field": "c"}
//       },
//       "update": {
//         "fillOpacity": {"value": 1}
//       },
//       "hover": {
//         "fillOpacity": {"value": 0.5}
//       }
//     }
//   }
// ]
// }
// // END stacked-bar-chart.spec.json


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// app.use('/uploads',express.static(__dirname+'/uploads'));

app.get("/", function (req, res) {
    res.render("home");
});
app.get("/home", function (req, res) {
    res.render("home");
});
mongoose.connect("mongodb://localhost:27017/teacherDB", {UseNewUrlParser:true});

const userSchema={
    // name:String,
    email:String,
    password:String
}
const User =mongoose.model("User", userSchema);
const Admin=mongoose.model("Admin", userSchema);
const courseSchema={
    // type:req.body.type,
    name:String,
    duration:Number,
    start_date:String,
    venue:String,
    organized_by:String,
    description:String,
    img:
    {
        data: Buffer,
        contentType: String
    },
}
const Course=mongoose.model("Course",courseSchema)


 var storage = multer.diskStorage({   
    destination: function(req, file, cb) { 
       cb(null, './uploads');    
    }, 
    filename: function (req, file, cb) { 
       cb(null , file.originalname);   
    }
 });

 
var upload = multer({ storage: storage });
app.post("/image", upload.single('image'), (req, res, next) =>  {
    var obj = new Course({
        // type:req.body.type,
        name:req.body.course,
        duration:req.body.number,
        start_date:req.body.date,
        venue:req.body.venue,
        organized_by:req.body.organized,
        description:req.body.description,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    })
   obj.save();
 });



// module.exports = new mongoose.model('Image', imageSchema);
app.get("/login", function(req,res){
    res.render("login");
});
app.get("/curricular", function(req,res){
    res.render("curricular");
})
app.get("/adminlogin",function(req,res){
    res.render("adminlogin");
  });
//   app.get("/performance",function(req,res){
//     res.render("performance");
//   });

app.post("/login", function(req,res){
    const user=new User({
        email:req.body.username,
        password:req.body.password
    });

    user.save();


    res.render("homeafterlogin");
  
});

app.post("/adminlogin", function(req,res){
    const admin=new Admin({
        email:req.body.username,
        password:req.body.password
    });
    admin.save();

    res.render("homeaft");
});




var data=[];
var data1=[];
app.get('/score',function(req,res){
    res.render('score',{data:data});
});
app.get('/performance',(req,res)=>{
    res.render('performance',{data1:data});
});

let inputStream = fs.createReadStream('marks.csv', 'utf8');

inputStream
	.pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
	.on('data', function (row) {
        
	    // console.log('A row arrived: ', row);
       data.push(row);
        // res.send(row);
        // <%= row %>
	})
	.on('end', function () {
	    console.log('No more rows!');
	});


app.listen(3000, function () {
    console.log("server started on port 3000");
});
