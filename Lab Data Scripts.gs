/*
var sheet800 = SpreadsheetApp.openById("1QxTsqa_y4OO8zYhlTygvycjiJzNbCJMk_Zjy3S7xrwY"); //800 FV tracker global variable
var sheet5010 = SpreadsheetApp.openById("1Sd5KQ3Ul0qM_FdIHVcIqA12qqhqEanUiVO6f238QV6Y"); //5010 FV tracker global variable
var sheet1406 = SpreadsheetApp.openById("1JVasZkIGOurJ1_dj9VjKYeXVA-Ogfoo9efqtbFNuDuo"); //1406 FV tracker global variable
var masterTask = SpreadsheetApp.openById("1NMl2IOhB8Y5UN3x-oXkL9Epuv9Njw1btPdnX5QsN5sc").getSheetByName('Master Task Sheet'); //master task manager global variable
var dailyTask = SpreadsheetApp.openById('1-CKJ5242GC8as-0aSRNBYiGv6dzBO1QIn_nR53FyA-c').getSheetByName('Tasks'); //daily taskmanager global variable
var homescreenSS = SpreadsheetApp.openById("1rcrRJCYrLCmKV0nm9G8SeHOdAKVi2DzzzzFz_sUaoEE").getSheetByName("Homescreen"); //packaging homescreen global variable
*/

function updateCrashedStatus() {
  //grabs and organizes all the data from the Fermentation Data > "Daily Data"
  var appSS = SpreadsheetApp.openById("1Fhi4aLz_3YB9m-8XLefs36fRBR8o3bjC6BbDIC6o_1E").getSheetByName("Daily Data");
  appSS.sort(1);
  var appData = appSS.getRange(1, 1, appSS.getLastRow(), appSS.getLastColumn()).getValues();
  
  //data for fermentation data
  var FVID = getAppData(appData, "FV_ID");
  var date = getAppData(appData, "Date");
  var time = getAppData(appData, "Time");
  var setF = getAppData(appData, "Set F");
  var actualF = getAppData(appData, "Actual F");
  var plato = getAppData(appData, "Plato");
  var pH = getAppData(appData, "pH");
  var VDK = getAppData(appData, "VDK");
  var status = getAppData(appData, "Crashed?");
  var comment = getAppData(appData, "Comment");
  var fermentationData = [];
  for (var i = 1; i < FVID.length; i++) {
    fermentationData.push([FVID[i], status[i], comment[i], date[i], time[i], setF[i], actualF[i], plato[i], pH[i], VDK[i]]);
  }
  updateTrackers(fermentationData);
  appSS.getRange(2, 1, appSS.getLastRow(), appSS.getLastColumn()).clearContent();
}

//support code for fermentation data

//adds fermentation data to each tracker 
function updateTrackers(array) {
  for (var i = 0; i < array.length; i++) {
    var ss = findSheet(array[i][0]);
    var targetRow = firstEmptyRowSS(ss) + 9;
    var comment = array[i][2];
    var status = array[i][1];
    if (status) {
      var beerName = ss.getRange(3, 3).getValue();
      var targetCell = mainFVposition(array[i][0]);
      if (comment != "") {
        comment = comment + ', ' + 'Crashed';
      } else {
        comment = 'Crashed';
      }
      targetCell.setBackgroundRGB(60,120,216); //sets cell background to blue to indicate crashed status
      targetCell.setValue("Crashed " + beerName);
      ss.setTabColor("3c78d8"); //sets tab color of sheet to blue
      crashedTasks(array[i], ss, beerName);
    }
    var data = getArraySubsection(array, i, i, 3, array[i].length - 1);
    ss.getRange(targetRow, 3, 1, 7).setValues(data);
    ss.getRange(targetRow, 11).setValue(comment);
  }
}

//returns the first empty row within a tracker's fermentation data
function firstEmptyRowSS(targetSheet) {
  var column = targetSheet.getRange('C9:C29');
  var values = column.getValues(); // get all data in one call
  var ct = 0;
  while ( values[ct][0] != "" ) {
    ct++;
  }
  return (ct);
}

function crashedTasks(array, ss, beerName) {
  var date = new Date();
  date.setHours(0, 0, 0, 0);
  var tomorrow = new Date();
  tomorrow.setDate(date.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  var dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(date.getDate() + 2);
  dayAfterTomorrow.setHours(0, 0, 0, 0);
  var dayAfterTomorrowAdd1 = new Date();
  dayAfterTomorrowAdd1.setDate(date.getDate() + 3);
  dayAfterTomorrowAdd1.setHours(0, 0, 0, 0);
  
  var batchNum = ss.getRange(4, 3).getValue();
  var temp = ss.getRange(9, 5).getValue();
  var FVIDarray = array[0].split("-");
  var location = FVIDarray[0];
  var FV = FVIDarray[1];
  var volume = ss.getRange(5, 3).getValue();
  
  var biofineID = location + "-" + batchNum + "-Bio-AUDIT"; // trackingID with -Bio designation for post crash action
  var carbID = location + '-' + batchNum + '-CO2-AUDIT';
  var confCarbID = location + '-' + batchNum + '-confirmationCO2-AUDIT';
  var sensoryID = location + '-' + batchNum + '-SENSORY';
  var microID = location + '-' + batchNum + '-BIO';
  var prePackagingID = location + '-' + batchNum + '-prepackaging';
  var arrayData;
  var qaTiming;
  
  if (temp < 60) {
    var filterID = location + '-' + batchNum + '-filter';
    arrayData = [
      [biofineID, location, FV, tomorrow, 'Dump, Biofine, & Rouse', '', 'false', '', 'Cellar'],
      [filterID, location, FV, 'ASSIGN DATE', 'Filter', '', 'false', '', 'Cellar'],
      [carbID, location, FV, 'ASSIGN DATE', 'Carb (Post Filter)', '', 'false', '', 'Cellar'],
      [confCarbID, location, FV, 'ASSIGN DATE', 'Confirmation Carb', '', 'false', '', 'Cellar'],
      [microID, location, FV, dayAfterTomorrow, 'Micro Sample, ' + batchNum + ' BIO', 'Lab', 'false', '', 'Lab'],
      [sensoryID, location, FV, 'ASSIGN DATE', beerName + ' (' + batchNum + ') Sensory', 'Lab', 'false', '', 'Lab'],
      [prePackagingID, location, FV, 'ASSIGN DATE', 'Prepackaging Check', '', 'false', '', 'Packaging']
    ];
    qaTiming = 'ASSIGN DATE';
  } else {
    arrayData = [
      [biofineID, location, FV, tomorrow, 'Dump, Biofine, & Carb', '', 'false', '', 'Cellar'],
      [confCarbID, location, FV, dayAfterTomorrow, 'Confirmation Carb', '', 'false', '', 'Cellar'],
      [sensoryID, location, FV, dayAfterTomorrow, beerName + ' (' + batchNum + ') Sensory', 'Lab', 'false', '', 'Lab'],
      [microID, location, FV, dayAfterTomorrow, 'Micro Sample, ' + batchNum + ' BIO', 'Lab', 'false', '', 'Lab'],
      [prePackagingID, location, FV, dayAfterTomorrow, 'Prepackaging Check', '', 'false', '', 'Packaging']
    ];
    qaTiming = dayAfterTomorrow;
  }
  
  if (beerName != 'Pilsner' && beerName != 'Crikey' && beerName != 'Summer IPA' && beerName != 'Bits & Bobs' && beerName != 'Porter' 
      && beerName != 'Hazealicious' && beerName != 'Mind the Gap' && beerName != 'Moreish') {
    arrayData.push([location + '-' + batchNum + '-QAsample', location, FV, qaTiming, 'QA Sample Reminder', 'Lab', 'false', '', 'Lab']);
    arrayData.push([location + '-' + batchNum + '-QA', location, FV, qaTiming, 'QA ' + batchNum + ', ' + beerName, 'Lab', 'false', '', 'Lab']);    
  }
  
  masterTask.sort(1);
  var rowToAppend = masterTask.getLastRow() + 1;
  masterTask.getRange(rowToAppend, 1, arrayData.length, 9).setValues(arrayData);
  masterTask.sort(4);
  
  var crashCheckID = location + '-' + batchNum + '-crashCheck';
  var crashCheck = [crashCheckID, location, FV, date, 'Crash', 'Lab', 'false', '', 'Lab'];
  dailyTask.appendRow(crashCheck);
  
  var packagingData = ['', '', 0.78, array[0], batchNum, volume, 'Crashed ' + beerName, '', '', '', '', beerName];
  homescreenSS.appendRow(packagingData);
}