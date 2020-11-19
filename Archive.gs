/*
var checklistSS = SpreadsheetApp.openById("1rcrRJCYrLCmKV0nm9G8SeHOdAKVi2DzzzzFz_sUaoEE").getSheetByName("Checklist");
var logSS = SpreadsheetApp.openById("1rcrRJCYrLCmKV0nm9G8SeHOdAKVi2DzzzzFz_sUaoEE").getSheetByName("Log");
var homescreenSS = SpreadsheetApp.openById("1rcrRJCYrLCmKV0nm9G8SeHOdAKVi2DzzzzFz_sUaoEE").getSheetByName("Homescreen");
*/
//copy of script, script is located on fermentation trackers since archive requests are an user inputted action

var checklistTable1 = SpreadsheetApp.openById("1aZbl7QGLPxSt9vawn5YUwV78A6lCqQbsnCaLzDDT9_0").getSheetByName("Checklist_Table");
var checklistTable2 = SpreadsheetApp.openById("1aZbl7QGLPxSt9vawn5YUwV78A6lCqQbsnCaLzDDT9_0").getSheetByName("Checklist_Table_Run2");
var checklistTable3 = SpreadsheetApp.openById("1aZbl7QGLPxSt9vawn5YUwV78A6lCqQbsnCaLzDDT9_0").getSheetByName("Checklist_Table_Run3");

var trackerLocation = 800;
function packagedButton() {
  var s = SpreadsheetApp.getActiveSheet();
  var statusCell = s.getActiveCell();
  if (s.getName() == 'Main') {
    //Logger.log("Main was entered");
    var editRange = {
      row1 : 10,
      row2 : 18,
      row3 : 26,
      left : 2,
      right : 9
    };
    
    // Exit if out of range
    var thisRow = statusCell.getRow();
    if (thisRow != editRange.row1 && thisRow != editRange.row2 && thisRow != editRange.row3) return;   
    var thisCol = statusCell.getColumn();
    if (thisCol < editRange.left || thisCol > editRange.right) return;
    var FV = s.getRange(thisRow - 1, thisCol).getValue();
    var ui = SpreadsheetApp.getUi();
    var response = ui.alert('Do you want to set ' + FV + ' to PACKAGED and archive the sheet? This will delete all data in the tracker.', 
                            ui.ButtonSet.YES_NO);

    // Process the user's response.
    if (response == ui.Button.YES) {
      
      var cell = statusCell.getA1Notation();
      var FVIDcheck = 800 + '-' + FV;
      var date = new Date();
      
      var data = [date, FVIDcheck, trackerLocation, cell];
      var archiveSS = SpreadsheetApp.openById('1E6-q_VZbYU_5Z6kgfpObP9nwdrdwmRutqwO51c4J094').getSheetByName('Processing')
      archiveSS.appendRow(data);
      statusCell.setValue("Processing");
      statusCell.setBackgroundRGB(183, 183, 183);
      ui.alert('Beer is awaiting processing at 1 AM. Thank you.');
      }
  } 
}
      
//processes archive requests from Archive Request > Processing
function archive() {
  var appSS = SpreadsheetApp.openById('1E6-q_VZbYU_5Z6kgfpObP9nwdrdwmRutqwO51c4J094').getSheetByName('Processing');
  appSS.sort(1);
  var appData = appSS.getRange(1, 1, appSS.getLastRow(), appSS.getLastColumn()).getValues();
  
  //data for all archive information
  var archiveFVID = getAppData(appData, "FV_ID");
  var mainCell = getAppData(appData, "Cell Range");
  var location = getAppData(appData, "Location");
    
  for (var i = 1; i < archiveFVID.length; i++) {
    clearTracker(archiveFVID[i], location[i], mainCell[i]);
  }
  appSS.getRange(2, 1, appSS.getLastRow(), appSS.getLastColumn()).clearContent();
}

function clearChecklist(FVIDcheck, beerName, trackerSS) {
//deletes Packaging Data > 'Checklist' (Step 2)

  var appSS = checklistSS;
  var headers = checklistSS.getRange('1:1').getValues();
  var columnPosition = headers[0].indexOf('FV_ID');
  checklistSS.sort(columnPosition + 1);
  var appData = checklistSS.getRange(1, 1, appSS.getLastRow(), appSS.getLastColumn()).getValues();
  
  var FVID = getAppData(appData, 'FV_ID');
  var positionArray = [];
  for (var i = 1; i < FVID.length; i++) {
    if (FVID[i] == FVIDcheck) {
      positionArray.push(i + 1);
    }
  }
  
  var min = Math.min.apply(null, positionArray);
  var max = Math.max.apply(null, positionArray);
  if ((max - min + 1) == positionArray.length) {
    appSS.getRange(min, 1, positionArray.length, headers[0].length + 1).clear();
    appSS.sort(columnPosition + 1);
    clearPackagingLog(FVIDcheck, beerName, trackerSS);
  } else if (positionArray.length == 0) {
    clearPackagingLog(FVIDcheck, beerName, trackerSS);
  } else {
    var reportString = FVIDcheck + ' (' + beerName + ') failed to be archived (Step 2: Checklists)';
    reportLog(reportString, 6);
  }
}

function clearPackagingLog(FVIDcheck, beerName, trackerSS) {
//deletes Packaging Data > 'Log' (Step 3)

  var appSS = logSS;
  var headers = appSS.getRange('1:1').getValues();
  var columnPosition = headers[0].indexOf('Log_ID');
  appSS.sort(columnPosition + 1);
  var appData = appSS.getRange(1, 1, appSS.getLastRow(), appSS.getLastColumn()).getValues();
  
  var FVID = getAppData(appData, 'Log_ID');
  var positionArray = [];
  for (var i = 1; i < FVID.length; i++) {
    if (FVID[i] == FVIDcheck) {
      positionArray.push(i + 1);
    }
  }
  
  var min = Math.min.apply(null, positionArray);
  var max = Math.max.apply(null, positionArray);
  if ((max - min + 1) == positionArray.length) {
    appSS.getRange(min, 1, positionArray.length, headers[0].length + 1).clear();
    appSS.sort(columnPosition + 1);
    clearChecklistNames(FVIDcheck, beerName, checklistTable1);
    clearChecklistNames(FVIDcheck, beerName, checklistTable2);
    clearChecklistNames(FVIDcheck, beerName, checklistTable3);
    clearHomescreen(FVIDcheck, beerName, trackerSS);
  } else if (positionArray.length == 0) {
    clearHomescreen(FVIDcheck, beerName, trackerSS);
  } else {
    var reportString = FVIDcheck + ' (' + beerName + ') failed to be archived (Step 3: Log)';
    reportLog(reportString, 6);
  }
}

function clearHomescreen(FVIDcheck, beerName, trackerSS) {
//deletes entry in Packaging Data > 'Homescreen' (Step 4)

  var appSS = homescreenSS;
  var headers = appSS.getRange('1:1').getValues();
  var columnPosition = headers[0].indexOf('FV_ID');
  appSS.sort(columnPosition + 1);
  var appData = appSS.getRange(1, 1, appSS.getLastRow(), appSS.getLastColumn()).getValues();
  
  var FVID = getAppData(appData, 'FV_ID');
  var FVIDrow = FVID.indexOf(FVIDcheck) + 1;
  
  if (FVIDrow > 1) {
    appSS.getRange(FVIDrow, 1, 1, headers[0].length + 1).clear();
    appSS.sort(columnPosition + 1);
    var reportString = FVIDcheck + ' (' + beerName + ') was archived';
    reportLog(reportString, 6);
  } else {
    var reportString = FVIDcheck + ' (' + beerName + ') failed to be archived (Step 4: Homescreen)';
    reportLog(reportString, 6);
  }
}

function clearTracker(FVIDcheck, location, mainCell) {
//deletes fermentation tracker data in 800, 1406, or 5010
 
  var trackerSS = findSheet(FVIDcheck);
  var batchNum = trackerSS.getRange(4, 3).getValue();
  var beerName = trackerSS.getRange(3, 3).getValue();
  var comments = trackerSS.getRange('K9:K29').getValues();
  var crashed;
  for (var i = 0; i < comments.length; i++) {
    var comment = comments[i][0].toLowerCase();
    if (comment.indexOf("crashed") > -1) {
      i = comments.length;
      crashed = 'TRUE';
    }
  }
  
  if (crashed && beerName != '') {
    
    //Opens monthly Archive sheet and copies the entire sheet (found by fvID) as a new sheet.
    var app = SpreadsheetApp.openById("13lDyLO5MgKLWhpgnRcIj4-ZPgnIBZKN9ZJkIzBMUadM");
    var archivedSheet = trackerSS.copyTo(app);
    
    //renames the newly made sheet
    archivedSheet.setName(batchNum + " " + beerName + ", " + FVIDcheck);
    
    //checks if the copy was successful
    SpreadsheetApp.openById("13lDyLO5MgKLWhpgnRcIj4-ZPgnIBZKN9ZJkIzBMUadM").getSheetByName(batchNum + " " + beerName + ", " + FVIDcheck).setTabColor("e69138"); 
    var clearList = trackerSS.getRangeList
    (['C2:C6', 'F2:F6', 'C9:K29', 'J33:K37',
      'K39:K47', 'K31', 'N8:N12', 'N15',
      'N17:N45', 'N48:N69', 'N72:N86',
      'P3:P6', 'P10:U29', 'P33:AB66']);
    clearList.clearContent();
    trackerSS.getRange('P33:P66').clearNote();
    clearChecklist(FVIDcheck, beerName, trackerSS);
    
    var mainSSname = location + "-Main"
    var mainSS = findSheet(location + "-Main")
    var statusCell = mainSS.getRange(mainCell);
    statusCell.setValue("Packaged");
    statusCell.setBackgroundRGB(183, 183, 183);
    trackerSS.setTabColor('#B7B7B7');
    
  } else {
    var reportString = FVIDcheck + ' (' + beerName + ') failed to be archived (Step 1: Tracker.) Check crashed status, or beer name is not blank.';
    reportLog(reportString, 6);
  }
}

function clearChecklistNames(FVIDcheck, beerName, checklistTable) {
//deletes Packaging Data > 'Checklist' (Step 2)

  var appSS = checklistTable;
  var headers = appSS.getRange('1:1').getValues();
  var nameColumnPosition = headers[0].indexOf('Name') + 1;
  var dateColumnPosition = headers[0].indexOf('Date') + 1;
  var appData = appSS.getRange(1, 1, appSS.getLastRow(), appSS.getLastColumn()).getValues();
  
  var FVID = getAppData(appData, 'FV_ID');
  var positionArray = [];
  for (var i = 1; i < FVID.length; i++) {
    if (FVID[i] == FVIDcheck) {
      positionArray.push(i + 1);
    }
  }
  
  var min = Math.min.apply(null, positionArray);
  var max = Math.max.apply(null, positionArray);
  if ((max - min + 1) == positionArray.length) {
    appSS.getRange(min, nameColumnPosition, positionArray.length, 1).clear();
    appSS.getRange(min, dateColumnPosition, positionArray.length, 1).clear();
  } else {
    var reportString = FVIDcheck + ' (' + beerName + ') reference tables failed to be cleared';
    reportLog(reportString, 6);
  }
}
