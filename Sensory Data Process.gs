function sensoryReport() {
  var appSS = SpreadsheetApp.openById('1g1JNehibwHRhsOB8-vCqVwRQn9_583gdWkaWkvJmbns').getSheetByName('True to Target Test');
  appSS.sort(4);
  var appData = appSS.getRange(1, 1, appSS.getLastRow(), appSS.getLastColumn()).getValues();
  
  var batchNum = getAppData(appData, "Batch #");
  var brand = getAppData(appData, "Brand");
  var result = getAppData(appData, "Result");
  
  var batchArray = [];
  var resultArray = [];
  var brandArray = [];
  
  for (var i = 1; i < batchNum.length; i++) {
    var arrayPosition = batchArray.indexOf(batchNum[i]);
    if (arrayPosition == -1) {
      batchArray.push(batchNum[i]);
      resultArray.push([result[i]]);
      brandArray.push(brand[i]);
    } else {
      resultArray[arrayPosition].push(result[i]);
    }
  }
  
  //Grab result average and grab FVIDs
  
  var resultAverage = [];
  for (var i = 0; i < resultArray.length; i++) {
    var total = 0;
    for (var j = 0; j < resultArray[i].length; j++) {
      total = total + resultArray[i][j];
    }
    resultAverage.push(total / resultArray[i].length);
  }
  
  var homescreenData = homescreenSS.getRange(1, 1, homescreenSS.getLastRow(), homescreenSS.getLastColumn()).getValues();
  
  var homescreenFVID = getAppData(homescreenData, "FV_ID");
  var homescreenBatchNum = getAppData(homescreenData, "Batch #");
  
  var FVID = [];
  
  for (var i = 0; i < batchArray.length; i++) {
    var position = homescreenBatchNum.indexOf(batchArray[i]);
    Logger.log(position)
    FVID.push(homescreenFVID[position]);
  }
  
  var email = '<u>Sensory Report</u><br/>';
  
  if (batchArray.length == 0) {
    email = email + "<br/>No sensory results to report today.";
  }
  
  for (var i = 0; i < batchArray.length; i++) {
    if (resultAverage[i] >= 0.75) {
      var conclusion = 'Pass';
    } else {
      var conclusion = 'Hold until further notice';
    }
    var convertedResultAverage = (resultAverage[i] * 100).toFixed(2) + '%';
    email = email + '<b>' + brandArray[i] + ', ' + FVID[i] + ' (' + batchArray[i] + ')</b>:' + ' ' + convertedResultAverage + ' with ' + resultArray[i].length + ' entries<br/>&nbsp;&nbsp;<i>Result: '
    + conclusion + '</i><br/><br/>';
  }
  
  var today = new Date;
  today.setHours(0, 0, 0, 0);
  today = Utilities.formatDate(today, "GMT-7", "M/dd");
  var msgPlain = email.replace(/\<br\/\>/gi, '\n').replace(/(<([^>]+)>)/ig, ""); // clear html tags and convert br to new lines for plain mail
  MailApp.sendEmail('database@reubensbrews.com, james@reubensbrews.com, khris@reubensbrews.com, kat@reubensbrews.com', today + ' Sensory Report', msgPlain, { htmlBody: email });
  //MailApp.sendEmail('seung@reubensbrews.com', today + ' Sensory Report', msgPlain, { htmlBody: email });
  
  var archiveSS = SpreadsheetApp.openById('1g1JNehibwHRhsOB8-vCqVwRQn9_583gdWkaWkvJmbns').getSheetByName('True to Target Archive');
  var lastRow = archiveSS.getLastRow();
  
  var data = appSS.getRange(2, 1, appSS.getLastRow(), appSS.getLastColumn()).getValues();
  archiveSS.getRange(lastRow + 1, 1, data.length, data[0].length).setValues(data);
  appSS.getRange(2, 1, appSS.getLastRow(), appSS.getLastColumn()).clearContent();
}
