
var fs = require('fs');

function fileExist(error, fileName, exist, doesnot){
  
  function validateStatus(err, stat) {
    if(err == null) exist();     
    else if(err.code == 'ENOENT') doesnot();
    else error(err);
  }
  
  function getFileStatus(err, localPath){
    if (err) error(err);
    else fs.stat(localPath + fileName, validateStatus);
  }
  
  fs.realpath('./', getFileStatus);
};


function getYearData(year, done) {

  var file = '../data/' + year + '.json',
    path = '/data/' + year + '.json',
    fijos = '../data/fijos.json';

  function onExists(){
    var añofl = require(file);
    var fijosfl = require(fijos);
    var holidays = fijosfl.concat(añofl);

    holidays.sort(function(a, b) { 
      var r = parseInt(a.mes) - parseInt(b.mes);
      if (r === 0) {
        r = parseInt(a.dia) - parseInt(b.dia);
      }
      return r;
    });

    done(null, holidays);
  }

  fileExist(done, path, onExists, function(){
    done(new Error('NOTFOUND'));
  });

}

function getNextOne(holidays, done){
  var actual = (new Date()).getFullYear();
      
  var currMonth = (new Date()).getMonth() + 1;
  var currDay = (new Date()).getDate(); 

  var holiday = {};
  for(var i=0; i < holidays.length; i++){
    if (currMonth == holidays[i].mes && holidays[i].dia > currDay
      || holidays[i].mes > currMonth ){

      holiday = holidays[i];
      break;
    }
  }

  done(null, holiday);
}

function filterOptionals(optionals, holidays){
  var newHolidays = [];
  
  if(optionals === 'null'){

    for(var i=0; i< holidays.length; i++){
      if (!holidays[i].opcional)
        newHolidays.push(holidays[i]);
    }
  }

  return newHolidays;
}

module.exports ={
  getYear: getYearData,
  getNext: getNextOne,
  filter: filterOptionals
};

