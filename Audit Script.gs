function audit() {
  var appSS = SpreadsheetApp.openById("1NMl2IOhB8Y5UN3x-oXkL9Epuv9Njw1btPdnX5QsN5sc").getSheetByName("Completed Task Log");
  var appData = appSS.getRange(1, 1, appSS.getLastRow(), appSS.getLastColumn()).getValues();
  
  var trackingID = getAppData(appData, "Tracking ID");
  var location = getAppData(appData, "Location");
  var FV = getAppData(appData, "FV");
  var action = getAppData(appData, "Action");
  var assigned = getAppData(appData, "Assigned");
  var date = getAppData(appData, "Date");
  
  var homescreenData = homescreenSS.getRange(1, 1, homescreenSS.getLastRow(), homescreenSS.getLastColumn()).getValues();
  var homescreenID = getAppData(homescreenData, "FV_ID");
  var CO2 = getAppData(homescreenData, "CO2/PSI");
  var confCO2 = getAppData(homescreenData, "Conf. CO2/PSI");
  
  var report = '';
  for (var i = 101; i < trackingID.length; i++) {
    trackingID[i] = trackingID[i] + '';
    if (trackingID[i].indexOf('AUDIT') > -1) {
      var FVID = location[i] + '-' + FV[i];
      var formattedDate = Utilities.formatDate(date[i], "GMT-7", "M/dd");
      
      if (action[i] == 'Dump, Biofine, & Carb') {
        var position = homescreenID.indexOf(FVID);
        if (CO2[position] == '') {
          var string = assigned[i] + ' ' + formattedDate + ': ' + FVID + ' is missing CO2 data<br/>';
          report = report + string;
          
        }
      } else if (action[i] == 'Confirmation Carb') {
        var position = homescreenID.indexOf(FVID);
        if (confCO2[position] == '') {
          var string = assigned[i] + ' ' + formattedDate + ': ' + FVID + ' is missing confirmation CO2 data<br/>';
          report = report + string;
        }
      } else if (action[i].toLowerCase().indexOf('dryhop') > -1) {
        var trackerSS = findSheet(FVID);
        if (trackerSS.getRange('J33').getValue() == '') {
          var string = assigned[i] + ' ' + formattedDate + ': ' + FVID + ' is missing dryhop data<br/>';
          report = report + string;
        }
      }
    }
  }
  reportLog(report, 9);
}


function moveCompleteTasks() {
  var completedLog = SpreadsheetApp.openById("1NMl2IOhB8Y5UN3x-oXkL9Epuv9Njw1btPdnX5QsN5sc").getSheetByName("Completed Task Log");
  dailyTask.sort(7, false);
  var headers = dailyTask.getRange('1:1').getValues();
  var completedCol = headers[0].indexOf('Completed?') + 1;
  
  var trueCheck = dailyTask.getRange(2, completedCol).getValue();
  if (!trueCheck) return;
  
  var values = dailyTask.getRange(1, completedCol, dailyTask.getLastRow(), 1).getValues();
  var trueRow = returnTargetRow(values, '');
  var lastCol = dailyTask.getLastCol();
  var data = dailyTask.getRange(2, 1, trueRow - 1, lastCol); 
  
  completedLog.sort(4, false);
  completedLog.getRange(102, 1, completedLog.getLastRow(), completedLog.getLastCol()).clearContent();
  completedLog.getRange(102, 1, trueRow, lastCol).setValues(data.getValues());
  data.clearContent();
  dailyTask.sort(7, false);
}

function transferTasks() {
  var msIn24h = 86400000;

  dailyTask.sort(4, true);
  masterTask.sort(4, true);
  
  var appendedRow = returnTargetRow(s, 'D2:D150', '') + 2;
    
  // finds value of dates and compares them assuming script runs at 2-3 AM to find current date tasks. Assumes tasks are all set at 12AM.
  var amountOfRows = dateCompare(taskList, 'D2:D150', 0.5);
  
  var data = taskList.getRange(2, 1, amountOfRows, 10);
  s.getRange(appendedRow, 1, amountOfRows, 10).setValues(data.getValues());
  
  data.clearContent();
  sort(taskList, 4, true);
}