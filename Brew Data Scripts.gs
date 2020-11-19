//var sheet800 = SpreadsheetApp.openById("1QxTsqa_y4OO8zYhlTygvycjiJzNbCJMk_Zjy3S7xrwY"); //800 FV tracker global variable
//var sheet5010 = SpreadsheetApp.openById("1Sd5KQ3Ul0qM_FdIHVcIqA12qqhqEanUiVO6f238QV6Y"); //5010 FV tracker global variable
//var sheet1406 = SpreadsheetApp.openById("1JVasZkIGOurJ1_dj9VjKYeXVA-Ogfoo9efqtbFNuDuo"); //1406 FV tracker global variable

function brewDataTransfer() {
  
  var msInDay = 3600000 * 24;
  
  // Brewers App Data
  var appSS = SpreadsheetApp.openById("1Tfx_rQKvmpjQveLRLxn3YQ5BlMhMuWQTEwzrHcgRXNA").getSheetByName("Entry Data");
  appSS.sort(1);
  var appData = appSS.getRange(1, 1, appSS.getLastRow(), appSS.getLastColumn()).getValues();
  
  // Convert data from columns into rows
  // getAppData() is located in Support Code and converts columns of an array into rows
  var FVID = getAppData(appData, "FV_ID");
  var FV = getAppData(appData, "FV");
  var beerName = getAppData(appData, "Beer Name");
  var vol = getAppData(appData, "Vol. (BBL)");
  var batchNum = getAppData(appData, "Batch #");
  var brewer = getAppData(appData, "Brewer");

  var yeast = getAppData(appData, "Yeast ID");
  var yeastGeneration = getAppData(appData, "Generation");
  var yeastSource = getAppData(appData, "From Batch #");
  var pitchRate = getAppData(appData, "Pitch Rate");
  var mash1 = getAppData(appData, "Mash Temp 1");
  var mash2 = getAppData(appData, "Mash Temp 2");
  var mash3 = getAppData(appData, "Mash Temp 3");
  var mash4 = getAppData(appData, "Mash Temp 4");
  var mashTemp = [];
  
  for (var i = 0; i < FVID.length; i++) {
    var mashString = mash1[i];
    if (mash2[i] != '') {
      mashString = mashString + ', ' + mash2[i]
    }
    if (mash3[i] != '') {
      mashString = mashString + ', ' + mash3[i]
    }
    if (mash4[i] != '') {
      mashString = mashString + ', ' + mash4[i]
    }
    mashTemp.push(mashString);
  }
  var date = getAppData(appData, "Day 1 Fermentation Date");
  var time = getAppData(appData, "Time");
  var setF = getAppData(appData, "Set °F");
  var actualF = getAppData(appData, "Actual °F");
  var plato = getAppData(appData, "Plato Actual");
  var pH = getAppData(appData, "pH");
  
  var location = getAppData(appData, "Location");
  var profile = getAppData(appData, "Beer Profile");
  
  // Starts at i = 1 because i = 0 is the header
  for (var i = 1; i < FVID.length; i++) {
    // Returns the sheet location of target tracker
    var FVss = findSheet(FVID[i]);
  	
    // Check to see if sheet is empty by looking at Beer Name entry
    if (FVss.getRange('C3').getValue() === '') { 
    
      // Reorganizing data to send to FV
      var fvInfo = [[FV[i], beerName[i], batchNum[i], vol[i], brewer[i]]];
      var yeastInfo = [[yeast[i], yeastGeneration[i], yeastSource[i], pitchRate[i], mashTemp[i]]];
      var day1Info = [[date[i], time[i], setF[i], actualF[i], plato[i], pH[i]]];
      
      // Retrieve beer profile to enter the cellar tasks
      var profileSS = SpreadsheetApp.openById('1Vw1cFwlVrbQu_3709SDHNJHjH6MtcALGKukfTp1dA8A').getSheetByName(profile[i]);
      // Grabs tasks and dates from column A and B
      var tasks = profileSS.getRange('A2:B14').getValues();
      var taskArray = [];
      var assigned = '';
      var tag = 'Cellar';
      
      for (var j = 0; j < tasks.length; j++) {
        if (tasks[j][1] != '') {
          if (tasks[j][0] == 2) {
            assigned = 'Lab';
          }
          var dateTemp = new Date(date[i].getTime() + (tasks[j][0] - 1) * msInDay);
          dateTemp.setHours(0, 0, 0, 0);
          dateTemp = Utilities.formatDate(dateTemp, "GMT-7", "M/dd");
          var taskID = location[i] + '-' + batchNum[i] + '-' + tasks[j][0] + '-signoff';
          if (tasks[j][1].toLowerCase().indexOf('dryhop') > -1) {
            taskID = taskID + '-AUDIT';
          }
          if (tasks[j][1] == 'VDK') {
            assigned = 'Lab';
            tag = 'Lab';
          }
          taskArray.push([taskID, location[i], FV[i], dateTemp, tasks[j][1], assigned, 'false', '', tag]);
          assigned = '';
          tag = 'Cellar';
        }
      }
      
      // Micro & QA data
      if (location[i] == 800) {
        var microID = "MICRO" + location[i] + '-' + batchNum[i] + '-48H';
        var microDate = new Date(date[i].getTime() + (2 * msInDay));
        microDate.setHours(0, 0, 0, 0);
        microDate = Utilities.formatDate(microDate, "GMT-7", "M/dd");
        taskArray.push([microID, location[i], FV[i], microDate, 'Micro Sample, ' + batchNum[i] + ' 48H', 'Lab', 'false', '', 'Lab']);
      }
      
      // Sending data to fermentation tracker
      var reqActions = getArraySubsection(tasks, 0, tasks.length - 1, 1, 1);
      FVss.getRange('C2:C6').setValues(row2col(fvInfo));
      FVss.getRange('F2:F6').setValues(row2col(yeastInfo));
      FVss.getRange('C9:H9').setValues(day1Info);
      FVss.getRange('J9:J21').setValues(reqActions);
      
      // Refreshes packaging formulas
      FVss.getRange('X20').setFormula('=(X10*0.07258) + (X11*0.09677) + (X12*0.06653) + (X13*0.5) + (X14*0.1666) + (X15*0.4258) + (X16*0.2556) +  (X17*0.1704) + (X18*0.348) + (X19*0.174)');
      FVss.getRange('N13').setFormula('=$C$5');
      FVss.getRange('N14').setFormula('=X20/N13');
      FVss.getRange('AB33:AB66').setFormula('=IF(SUM(W33:AA33) = 0, "", SUM(W33:AA33) / COUNT(W33:AA33))');
      FVss.getRange('N16').setFormula('=IFS(N11 = "", "", N11 = "22 oz", (N15 - 9) / 9, N11 = "12 oz", (N15 - 24) / 24, N11 = "16 oz", (N15 - 24) / 24)');
      FVss.getRange('N71').setFormula('=IFS(N68 = "", "", N68 = "22 oz", (N70 - 9) / 9, N68 = "12 oz", (N70 - 24) / 24, N68 = "16 oz", (N70 - 24) / 24)');
      FVss.getRange('N47').setFormula('=IFS(N44 = "", "", N44 = "22 oz", (N46 - 9) / 9, N44 = "12 oz", (N46 - 24) / 24, N44 = "16 oz", (N46 - 24) / 24)');
      FVss.getRange('X10:X19').setFormula('=SUMIF($R$10:$R$29, W10, $S$10:$S$29)');
      
      // Sending data to master task manager
      masterTask.sort(1);
      var rowToAppend = masterTask.getLastRow() + 1;
      masterTask.getRange(rowToAppend, 1, taskArray.length, 9).setValues(taskArray);
      masterTask.sort(4);
      
      // Update the fermentation tracker main page
      var targetCell = mainFVposition(FVID[i]);
      targetCell.setValue("Day 2 " + beerName[i]);
      targetCell.setBackgroundRGB(106,168,79);
      FVss.setTabColor("6aa84f")
      
			// Add data to Lab Micro page
      var microDataSS = SpreadsheetApp.openById('1M3BvzMPv62TjxrGP_tikqWRCfJQYpnqj_dJ3GEDnFMs');
      var microSS3 = microDataSS.getSheetByName('Micro Data, Day 3');
      var microSS5 = microDataSS.getSheetByName('Micro Data, Day 5');
      var microInfo = [beerName[i] + ', ' + FVID[i], batchNum[i]];
      microSS3.appendRow(microInfo);
      microSS5.appendRow(microInfo);
      
      // Update Production FV Viewer
      var productionFVSS = SpreadsheetApp.openById('1-CKJ5242GC8as-0aSRNBYiGv6dzBO1QIn_nR53FyA-c').getSheetByName('Production FV Viewer');
      var productionFVData = productionFVSS.getRange(1, 1, productionFVSS.getLastRow(), productionFVSS.getLastColumn()).getValues();
      var productionFVID = getAppData(productionFVData, "FV_ID");
      var rowPosition = productionFVID.indexOf(FVID[i]) + 1;
      var dataToCopy = [["Day 2 " + beerName[i], batchNum[i], vol[i], yeast[i], yeastGeneration[i], '', '', '']];
      productionFVSS.getRange(rowPosition, 3, 1, 8).setValues(dataToCopy);
      
      // Report to Daily Report that brew has occurred
      var reportDate = date[i];
      reportDate = Utilities.formatDate(reportDate, "GMT-7", "M/dd");

      var string = reportDate + ' ' + beerName[i] + ' into ' + FVID[i] + '<br/>&nbsp;&nbsp;' + 'Brewer: ' + brewer[i] +
        '<br/>&nbsp;&nbsp;' + 'Profile: ' + profile[i] + '<br/>&nbsp;&nbsp;' + 'Batch #: ' + batchNum[i] + '<br/>&nbsp;&nbsp;' + 'Size: ' + vol[i] + ' bbl<br/>&nbsp;&nbsp;' + 'Mash °F: ' + mashTemp[i];
      reportLog(string, 2);
    } else {
      var reportDate = date[i];
      reportDate = Utilities.formatDate(reportDate, "GMT-7", "M/dd");
      var string = reportDate + ' ' + beerName[i] + ' into ' + FVID[i] + ' failed to create a tracker';
      reportLog(string, 2);
      
      // ADD EASIER METHOD TO RECOVER BREWER DATA
      /*{
      	yeastInfo: yeastData,
        brewData: breweData,
        taskData: taskData
      }
      */
    }
  }
  appSS.getRange(2, 1, appSS.getLastRow(), appSS.getLastColumn()).clearContent();
}