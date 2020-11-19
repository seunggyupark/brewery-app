var sheet800 = SpreadsheetApp.openById("1QxTsqa_y4OO8zYhlTygvycjiJzNbCJMk_Zjy3S7xrwY"); //800 FV tracker global variable
var sheet5010 = SpreadsheetApp.openById("1Sd5KQ3Ul0qM_FdIHVcIqA12qqhqEanUiVO6f238QV6Y"); //5010 FV tracker global variable
var sheet1406 = SpreadsheetApp.openById("1JVasZkIGOurJ1_dj9VjKYeXVA-Ogfoo9efqtbFNuDuo"); //1406 FV tracker global variable
var masterTask = SpreadsheetApp.openById("1NMl2IOhB8Y5UN3x-oXkL9Epuv9Njw1btPdnX5QsN5sc").getSheetByName('Master Task Sheet'); //master task manager global variable
var dailyTask = SpreadsheetApp.openById('1-CKJ5242GC8as-0aSRNBYiGv6dzBO1QIn_nR53FyA-c').getSheetByName('Tasks'); //daily taskmanager global variable
var homescreenSS = SpreadsheetApp.openById("1rcrRJCYrLCmKV0nm9G8SeHOdAKVi2DzzzzFz_sUaoEE").getSheetByName("Homescreen"); //packaging homescreen global variable
var checklistSS = SpreadsheetApp.openById("1rcrRJCYrLCmKV0nm9G8SeHOdAKVi2DzzzzFz_sUaoEE").getSheetByName("Checklist");
var logSS = SpreadsheetApp.openById("1rcrRJCYrLCmKV0nm9G8SeHOdAKVi2DzzzzFz_sUaoEE").getSheetByName("Log");

function getAppData(array, header) {
  //Returns relevant column data by comparing header values. Purpose is to obtain all data
  //in a batch operation to speed up processing. Assumes headers are in array[0].
  
  var columnPosition = array[0].indexOf(header);
  var column = array.map(function(r){ return r[columnPosition]; });
  return column;
}

//accepts format LOCATION-FV, example 800-FV13
//['800', 'FV13']
function findSheet(FVID) {
  var FVIDarray = FVID.split("-");
  var location = FVIDarray[0];
  var FV = FVIDarray[1];
  if (location == 800) { 
    return (sheet800.getSheetByName(FV));
  } else if (location == 5010) {
    return (sheet5010.getSheetByName(FV));  
  } else if (location == 1406) {
    return (sheet1406.getSheetByName(FV));  
  }
}


function getArraySubsection(array, startingRow, endingRow, startingColumn, endingColumn) {
  var section = array.slice(startingRow, endingRow + 1).map(i => i.slice(startingColumn, endingColumn + 1));
  return section;
}

function firstEmptyRow(rangeValues) {
  var ct = 0;
  while (rangeValues[ct][0] != "" ) {
    ct++;
  }
  return (ct);
}

//transposes a row into a 2D column
function row2col(row) {
  return row[0].map(function(elem) {return [elem];});
}

function mainFVposition(FVID) {
  var FVIDarray = FVID.split("-");
  var location = FVIDarray[0];
  var FV = FVIDarray[1];
  if (location == 800) { 
    var ss = sheet800.getSheetByName("Main");
  } else if (location == 5010) {
    var ss = sheet5010.getSheetByName("Main");  
  } else {
    var ss = sheet1406.getSheetByName("Main");  
  }
  
  FV = FV.substring(2);
  FV = FV - 0;
  if (FV < 9) {
    var targetCell = ss.getRange(10, 1 + FV);
  } else if (FV < 17) {
    var targetCell = ss.getRange(18, FV - 7);
  } else if (FV < 25) {
    var targetCell = ss.getRange(26, FV - 15);
  }
  return targetCell;
}

function reportLog(string, row) {
  var ss = SpreadsheetApp.openById('1RP5YQ9LMI09-M236kfDT1as2cOFxO7DLBQu3gUqk7Ds').getSheetByName('Report Log');
  var range = ss.getRange(row, 2);
  var action = range.getValue();
  if (action == '') {
    action = string;
  } else {
    action = action + '<br/>' + string;
  }
  range.setValue(action);
}

function returnTargetRow(values, value) {
  var ct = 0;
  while (values[ct][0] != value) {
    ct++;
  }
  return (ct);
}

var taskAdder = (function() {
  var masterTaskSS = SpreadsheetApp.openById("1NMl2IOhB8Y5UN3x-oXkL9Epuv9Njw1btPdnX5QsN5sc").getSheetByName("Master Task Sheet");
  
  return {
  //      taskAdder.addTask('Micro Sample, ' + batchNum + ' Post transfer', toLocation, toFV, today, 'Lab', 'Lab');
    addTask: function(action, toLocation, toFV, date, assigned, tag) {
      var randomNumber = Math.floor(Math.random() * 100000);
      var data = [[randomNumber + "-" + assigned + "-" + action, toLocation, toFV, date, action, assigned, "FALSE", "", tag]];
      var lastRow = masterTaskSS.getLastRow();
      masterTaskSS.getRange(lastRow + 1, 1, 1, 9).setValues(data);
    }
  }
})();
