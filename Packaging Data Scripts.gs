//MISC CODE WORK
//
//daily task editor for Khris
//Improve CIP code
//Req Actions Code update
//KPI
//Audit
//shortcut and graph change view for Khris
//volume updates


function packagingDataTransfer() {
  packagingLogTransfer();
  DODataTransfer(); //delete this data
  checklistDataTransfer();
  archive();
}


function packagingLogTransfer() {
  //Transfers packaging log data from "Packaging Data (ID: 1rcrRJCYrLCmKV0nm9G8SeHOdAKVi2DzzzzFz_sUaoEE)
  //to the packaging sheet
  
  var appSS = SpreadsheetApp.openById("1rcrRJCYrLCmKV0nm9G8SeHOdAKVi2DzzzzFz_sUaoEE").getSheetByName("Log");
  appSS.sort(3); //sort by FVID
  var appData = appSS.getRange(1, 1, appSS.getLastRow(), appSS.getLastColumn()).getValues();
  
  var date = getAppData(appData, "Date");
  var name = getAppData(appData, "Name");
  var FVID = getAppData(appData, "Log_ID");
  var item = getAppData(appData, "Item");
  var libCheck = getAppData(appData, "Library Check");
  var quantity = getAppData(appData, "Quantity");
  var warehouse = getAppData(appData, "Warehouse");
  
  var dataArray = [];
  for (var i = 1; i < date.length; i++) {
    dataArray.push([FVID[i], date[i], name[i], item[i], quantity[i], warehouse[i]]);
  }
 
  
  //sends the pacakaing info split by entry to the Report Log. Potentially add a check to organize by FVID later. Checks to see if "yes" and then says the library was pulled attached to the person's name. 
  for (var i = 0; i < dataArray.length; i++) {
    //if (dataArray[i][4] == "Yes") {
      //var pkgReport = dataArray[i][0] + " - " + dataArray[i][2] + " packaged " + dataArray[i][5] + " " + dataArray[i][3] + ". And " + dataArray[i][2] + " confirmed that the Lab/Library was pulled.";
    //} else {
      var pkgReport = dataArray[i][0] + " - " + dataArray[i][2] + " packaged " + dataArray[i][4] + " " + dataArray[i][3] + ". ";
    //}
      reportLog(pkgReport, 6);
  }
 
  var currentFVID = dataArray[0][0];
  var startingRow = 0;
  var j = 0; //Ending row
  for (var i = 0; i < dataArray.length; i++) {
    var newFVID = dataArray[i][0];
    j = i;
    if (newFVID != currentFVID || (newFVID == currentFVID && dataArray.length == (i + 1))) {
      if (newFVID != currentFVID) {
        var endingRow = i - 1;
        i--;
      } else {
        var endingRow = i;
      }
      var ss = findSheet(currentFVID);
      var dataToCopy = getArraySubsection(dataArray, startingRow, endingRow, 1, 5);
      ss.getRange("P10:U29").clearContent();
      ss.getRange(10, 16, (endingRow - startingRow + 1), 5).setValues(dataToCopy);
      currentFVID = newFVID;
      startingRow = j;
    }
  }
}

function DODataTransfer() {
  //Transfers DO data from "Packaging Data (ID: 1rcrRJCYrLCmKV0nm9G8SeHOdAKVi2DzzzzFz_sUaoEE)
  //to the packaging sheet
  
  var appSS = SpreadsheetApp.openById("1rcrRJCYrLCmKV0nm9G8SeHOdAKVi2DzzzzFz_sUaoEE").getSheetByName("Data");
  var range = appSS.getRange(1, 1, appSS.getMaxRows(), appSS.getMaxColumns());
  range.offset(1, 0, range.getNumRows() - 1).sort([{column: 3, ascending: true}, {column: 2, ascending: true}]);
  var appData = appSS.getRange(1, 1, appSS.getLastRow(), appSS.getLastColumn()).getValues();
  // Saves the DO data for viewing the next day
  
  var FVID = getAppData(appData, "FV_ID");
  var caseCount = getAppData(appData, "Case Count");
  var run = getAppData(appData, "Run #");
  var packagingType = getAppData(appData, "Packaging Type");
  var time = getAppData(appData, "Time");
  var name = getAppData(appData, "Name");
  var manifoldTemp = getAppData(appData, "Manifold Temp");
  var unshakenFH1 = getAppData(appData, "Unshaken FH1");
  var FH1 = getAppData(appData, "FH1");
  var FH2 = getAppData(appData, "FH2");
  var FH3 = getAppData(appData, "FH3");
  var FH4 = getAppData(appData, "FH4");
  var FH5 = getAppData(appData, "FH5");
  var notes = getAppData(appData, "Notes");
  
  DOCopy(appData);
  
  var dataArray = [];
  for (var i = 1; i < time.length; i++) {
    dataArray.push([FVID[i], notes[i], caseCount[i], run[i], packagingType[i], time[i], name[i], manifoldTemp[i], unshakenFH1[i], FH1[i], FH2[i], FH3[i], FH4[i], FH5[i]]);
  }
  
  //sort via location FV, then look for the last rows with same locationFVs. If detects a new one > send to sheet, start new. Make this a support code
  if (dataArray.length > 0) {
    var currentFVID = dataArray[0][0];
    var startingRow = 0;
    for (var i = 0; i < dataArray.length; i++) {
      var newFVID = dataArray[i][0];
      if (newFVID != currentFVID || (newFVID == currentFVID && dataArray.length == (i + 1))) {
        if (newFVID != currentFVID) {
          var endingRow = i - 1;
        } else {
          var endingRow = i;
        }
        var ss = findSheet(currentFVID);
        var dataToCopy = getArraySubsection(dataArray, startingRow, endingRow, 2, 13);
        var targetRow = firstEmptyRow(ss.getRange("S33:S66").getValues()) + 33;
        ss.getRange(targetRow, 16, (endingRow - startingRow + 1), 12).setValues(dataToCopy);
        var notesToCopy = getArraySubsection(dataArray, startingRow, endingRow, 1, 1);
        ss.getRange(targetRow, 16, (endingRow - startingRow + 1), 1).setNotes(notesToCopy);
        currentFVID = newFVID;
        startingRow = i;
      }
      
    }
    appSS.getRange(2, 1, appSS.getLastRow(), appSS.getLastColumn()).clearContent();
  }
  
}

function checklistDataTransfer() {
  var appSS = SpreadsheetApp.openById("1rcrRJCYrLCmKV0nm9G8SeHOdAKVi2DzzzzFz_sUaoEE").getSheetByName("Checklist");
  appSS.sort(1);
  var appData = appSS.getRange(1, 1, appSS.getLastRow(), appSS.getLastColumn()).getValues();
  
  var FVID = getAppData(appData, "FV_ID");
  var run = getAppData(appData, "Run #");
  var checklist = getAppData(appData, "Checklist");
  var date = getAppData(appData, "Date");
  var name = getAppData(appData, "Name");
  var nameDate = [];
  for (var i = 1; i < date.length; i++) {
    var formattedDate = Utilities.formatDate(date[i], "GMT-7", "M/dd");
    nameDate.push(name[i] + " " + formattedDate);
  }
  
  var start = getAppData(appData, "Start");
  var end = getAppData(appData, "End");
  var packagingType = getAppData(appData, "Package Type?");
  var caseCount = getAppData(appData, "Case Count");
  
  var readyToPackage = getAppData(appData, "Ready to package?");
  var tankTemp = getAppData(appData, "Tank Temperature");
  var tankPressure = getAppData(appData, "Tank Head Pressure");
  var notes = getAppData(appData, "Notes");
  var rackingArmClarity = [];
  for (var i = 0; i < readyToPackage.length; i++) {
    if (readyToPackage[i]) {
      rackingArmClarity.push("Ready");
    } else {
      rackingArmClarity.push("Not Ready");
    }
  }
  
  var SIP = getAppData(appData, "Startup SIP Complete?");
  var CIP = getAppData(appData, "Shutdown CIP Complete?");
  
  var labSample = getAppData(appData, "Lab Sample Pulled?");
  var librarySample = getAppData(appData, "Library Sample Pulled?");
  
  var sensoryPosition = getAppData(appData, "Sensory 1?");
  var visual = getAppData(appData, "Visual");
  var flavor = getAppData(appData, "Flavor");
  var mouthfeel = getAppData(appData, "Mouthfeel");
  var offFlavor = getAppData(appData, "Off-flavour Check");
  
  var kpiArray = [];
  var prepackageArray = [];
  var sipCipArray = [];
  var labLibraryArray = [];
  var sensoryArray = [];
  var sensoryPositionCheckArray = [];
  
  for (var i = 1; i < name.length; i++) {
    if (checklist[i] == "Shutdown") {
      kpiArray.push([FVID[i], run[i], nameDate[i - 1], start[i], end[i], packagingType[i], caseCount[i]]);
    }
    if (checklist[i] == "Pre-package") {
      prepackageArray.push([FVID[i], run[i], nameDate[i - 1], rackingArmClarity[i], tankTemp[i], tankPressure[i]]);
    }
    if (checklist[i] == "SIP/CIP") {
      sipCipArray.push([FVID[i], run[i], nameDate[i - 1], SIP[i], CIP[i]]);
    }
    if (checklist[i] == "Lab/Library") {
      labLibraryArray.push([FVID[i], run[i], labSample[i], librarySample[i]]);
    }
    if (checklist[i] == "Sensory") {
      sensoryArray.push([FVID[i], run[i], nameDate[i - 1], visual[i], flavor[i], mouthfeel[i], offFlavor[i]]);
      sensoryPositionCheckArray.push(sensoryPosition[i]);
    }
  }
  
  //has a boolean check for sensoryArray due to there being two possible locations the data can go to per run, sensory #1 or sensory #2
  splitChecklistDataTransfer(kpiArray, 8, 41, 65, "", []);
  splitChecklistDataTransfer(prepackageArray, 17, 17, 17, "", []);
  splitChecklistDataTransfer(sipCipArray, 21, 48, 72, "", []);
  splitChecklistDataTransfer(labLibraryArray, 24, 51, 75, "", []);
  splitChecklistDataTransfer(sensoryArray, 29, 53, 77, "True", sensoryPositionCheckArray);
}


//support data specifically for packaging data transfer

//transfers data of the organized arrays from checklist app data
function splitChecklistDataTransfer(array, rowPosition1, rowPosition2, rowPosition3, isThisSensory, sensoryCheckArray) {
  for (var i = 0; i < array.length; i++) {
    var ss = findSheet(array[i][0]);
    var dataToCopy = row2col(getArraySubsection(array, i, i, 2, array[i].length - 1));
    
    if (isThisSensory) {
      rowPosition1 = 29;
      rowPosition2 = 53;
      rowPosition3 = 77;
      if (!sensoryCheckArray[i]) {
        rowPosition1 = rowPosition1 + 5;
        rowPosition2 = rowPosition2 + 5;
        rowPosition3 = rowPosition3 + 5;
      }
    }
    
    if (array[i][1] == "Run 1") {
      ss.getRange(rowPosition1, 14, array[i].length - 2, 1).setValues(dataToCopy);
    } else if (array[i][1] == "Run 2") {
      ss.getRange(rowPosition2, 14, array[i].length - 2, 1).setValues(dataToCopy);
    } else {
      ss.getRange(rowPosition3, 14, array[i].length - 2, 1).setValues(dataToCopy);
    }
  }
  
}

var DOCopy = function(data) {
  var copySS, array, count, columns;
  copySS = SpreadsheetApp.openById('1rcrRJCYrLCmKV0nm9G8SeHOdAKVi2DzzzzFz_sUaoEE').getSheetByName('Prev DO Data');
  copySS.getRange(2, 1, 100, 50).clearContent();
  
  array = [];
  count = 0;
  
  if (data.length > 1) {
    data = deleteRow(data, 0);
    copySS.getRange(2, 1, data.length, data[0].length).setValues(data);
  };
};

var deleteRow = function(arr, row) {
  arr.splice(row, 1);
  return arr;
};

