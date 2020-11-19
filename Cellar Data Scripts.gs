/*
var sheet800 = SpreadsheetApp.openById("1QxTsqa_y4OO8zYhlTygvycjiJzNbCJMk_Zjy3S7xrwY"); //800 FV tracker global variable
var sheet5010 = SpreadsheetApp.openById("1Sd5KQ3Ul0qM_FdIHVcIqA12qqhqEanUiVO6f238QV6Y"); //5010 FV tracker global variable
var sheet1406 = SpreadsheetApp.openById("1JVasZkIGOurJ1_dj9VjKYeXVA-Ogfoo9efqtbFNuDuo"); //1406 FV tracker global variable
*/

function cellarDataTransfer() {
  //grabs and organizes all the data from the Cellar Data > "Cellar Data Entry"
  var appSS = SpreadsheetApp.openById("1Wmft3g-rsG7x99s50wEP-avO8Z92JLEdpoMXCWuH8PA").getSheetByName("Cellar Data Entry");
  appSS.sort(1);
  var appData = appSS.getRange(1, 1, appSS.getLastRow(), appSS.getLastColumn()).getValues();
  
  //data for all actions
  var FVID = getAppData(appData, "FV_ID");
  var date = getAppData(appData, "Date");
  var name = getAppData(appData, "Name");
  var action = getAppData(appData, "Action");
  var nameDate = [];
  for (var i = 1; i < date.length; i++) {
    var formattedDate = Utilities.formatDate(date[i], "GMT-7", "M/dd");
    nameDate.push(name[i] + " " + formattedDate);
    date[i] = formattedDate;
  }
  
  //data for transfer
  var toFVID = getAppData(appData, "To FV_ID");
  
  var transferArray = [];
  
  for (var i = 1; i < name.length; i++) {
    if (action[i] == "Transfer") {
      transferArray.push([FVID[i], name[i], date[i], nameDate[i - 1], toFVID[i]]);
    }
  }
  
  tankTransfer(transferArray);
  
  appSS.sort(1);
  appData = appSS.getRange(1, 1, appSS.getLastRow(), appSS.getLastColumn()).getValues();
  
  //data for all actions
  FVID = getAppData(appData, "FV_ID");
  date = getAppData(appData, "Date");
  name = getAppData(appData, "Name");
  action = getAppData(appData, "Action");
  nameDate = [];
  for (var i = 1; i < date.length; i++) {
    var formattedDate = Utilities.formatDate(date[i], "GMT-7", "M/dd");
    nameDate.push(name[i] + " " + formattedDate);
    date[i] = formattedDate;
  }
  
  //data for carbonation or biofine actions
  var biofineAmount = getAppData(appData, "Biofine Added (Liters)");
  var carbStart = getAppData(appData, "Carb Started");
  var carbEnd = getAppData(appData, "Carb Ended");
  var volCO2 = getAppData(appData, "Volumes CO2");
  var tankPSI = getAppData(appData, "Tank PSI");
  var confirmationCO2 = getAppData(appData, "Confirmation CO2");
  var confirmationPSI = getAppData(appData, "Confirmation PSI");
  var complete = getAppData(appData, "Complete");
  var timestamp = getAppData(appData, "Timestamp");
 
  //data for dryhopping
  var hops1 = getAppData(appData, "Hops #1");
  var lot1 = getAppData(appData, "Lot Code #1");
  var pounds1 = getAppData(appData, "Pounds #1");
  var hops2 = getAppData(appData, "Hops #2");
  var lot2 = getAppData(appData, "Lot Code #2");
  var pounds2 = getAppData(appData, "Pounds #2");
  var hops3 = getAppData(appData, "Hops #3");
  var lot3 = getAppData(appData, "Lot Code #3");
  var pounds3 = getAppData(appData, "Pounds #3");
  var hops4 = getAppData(appData, "Hops #4");
  var lot4 = getAppData(appData, "Lot Code #4");
  var pounds4 = getAppData(appData, "Pounds #4");
  var hops5 = getAppData(appData, "Hops #5");
  var lot5 = getAppData(appData, "Lot Code #5");
  var pounds5 = getAppData(appData, "Pounds #5");
  var hopLot1 = [];
  var hopLot2 = [];
  var hopLot3 = [];
  var hopLot4 = [];
  var hopLot5 = [];
  for (var i = 0; i < date.length; i++) {
    if (hops1[i] !== '') {
      hopLot1.push(hops1[i] + ", " + lot1[i]);
    } else {
    hopLot1.push('');
    }
    
    if (hops2[i] !== '') {
      hopLot2.push(hops2[i] + ", " + lot2[i]);
    } else {
    hopLot2.push('');
    }
    
    if (hops3[i] !== '') {
    hopLot3.push(hops3[i] + ", " + lot3[i]);
    } else {
    hopLot3.push('');
    }
    
    if (hops4[i] !== '') {
    hopLot4.push(hops4[i] + ", " + lot4[i]);
    } else {
    hopLot4.push('');
    }
    
    if (hops5[i] !== '') {
    hopLot5.push(hops5[i] + ", " + lot5[i]);
    } else {
    hopLot5.push('');
    }
  }
  
  var biofineArray = [];
  var carbArray = [];
  var confirmationCarbArray = [];
  var dryhopArray = [];
  
  for (var i = 1; i < name.length; i++) {
    if (action[i] == "Biofine") {
      biofineArray.push([FVID[i], name[i], date[i], nameDate[i - 1], biofineAmount[i]]);
    }
    if (action[i] == "Biofine & Carb" || action[i] == "Carb") {
      carbArray.push([FVID[i], name[i], date[i], nameDate[i - 1], biofineAmount[i], carbStart[i], carbEnd[i], volCO2[i], tankPSI[i], timestamp[i], complete[i]]);
    }
    if (action[i] == "Confirmation Carb") {
      confirmationCarbArray.push([FVID[i], name[i], date[i], nameDate[i - 1], confirmationCO2[i], confirmationPSI[i]]);
    }
    if (action[i] == "Dryhop") {
      dryhopArray.push([FVID[i], name[i], date[i], nameDate[i - 1], hopLot1[i], hopLot2[i], hopLot3[i], hopLot4[i], hopLot5[i], pounds1[i], pounds2[i], pounds3[i], pounds4[i], pounds5[i]]);
    }
    if (action[i] == "Transfer") {
      transferArray.push([FVID[i], name[i], date[i], nameDate[i - 1], toFVID[i]]);
    }
    
    Logger.log(biofineArray.length, carbArray.length, confirmationCarbArray.length, dryhopArray.length)
  }
  var saveArray = [];
  
  dryhopDataTransfer(dryhopArray);
  carbChecklistDataTransfer(biofineArray, "Biofine", saveArray);
  carbChecklistDataTransfer(carbArray, "Biofine & Carb", saveArray);
  carbChecklistDataTransfer(confirmationCarbArray, "Confirmation Carb", saveArray);
  
  //homescreen and production viewer data
  var homescreenSS = SpreadsheetApp.openById("1rcrRJCYrLCmKV0nm9G8SeHOdAKVi2DzzzzFz_sUaoEE").getSheetByName("Homescreen");
  homescreenSS.sort(4);
  var homescreenData = homescreenSS.getRange(1, 1, homescreenSS.getLastRow(), homescreenSS.getLastColumn()).getValues();
  
  var FVIDcol = homescreenData[0].indexOf("FV_ID") + 1;
  var beerStatusCol = homescreenData[0].indexOf("Beer Status") + 1;
  var CO2col = homescreenData[0].indexOf("CO2/PSI") + 1;
  var confirmationCO2col = homescreenData[0].indexOf("Conf. CO2/PSI") + 1;
  var homescreenFVID = getAppData(homescreenData, "FV_ID");
  var homescreenCO2 = getAppData(homescreenData, "CO2/PSI");
  var homescreenConfirmationCO2 = getAppData(homescreenData, "Conf. CO2/PSI");
  
  var productionFVSS = SpreadsheetApp.openById('1-CKJ5242GC8as-0aSRNBYiGv6dzBO1QIn_nR53FyA-c').getSheetByName('Production FV Viewer');
  var productionFVData = productionFVSS.getRange(1, 1, productionFVSS.getLastRow(), productionFVSS.getLastColumn()).getValues();
  
  var productionFVIDcol = productionFVData[0].indexOf("FV_ID") + 1;
  var productionFVCO2col = productionFVData[0].indexOf("CO2/PSI") + 1;
  var productionConfirmationCO2col = productionFVData[0].indexOf("Conf. CO2/PSI") + 1;
  var productionFVID = getAppData(productionFVData, "FV_ID");
  var productionCO2 = getAppData(productionFVData, "CO2/PSI");
  var productionConfirmationCO2 = getAppData(productionFVData, "Conf. CO2/PSI");
  
  
  for (var i = 0; i < carbArray.length; i++) {
    var homescreenRowPosition = homescreenFVID.indexOf(carbArray[i][0]);
    var productionRowPosition = productionFVID.indexOf(carbArray[i][0]);
    var data = carbArray[i][7] + "/" + carbArray[i][8];
    if (homescreenRowPosition > -1) {
      homescreenCO2[homescreenRowPosition] = data;
    }
    if (productionRowPosition > -1) {
      productionCO2[productionRowPosition] = data;
    }
  }
  
  homescreenCO2.shift();
  homescreenCO2 = [homescreenCO2];
  var homescreenCO2data = row2col(homescreenCO2);
  homescreenSS.getRange(2, CO2col, homescreenCO2[0].length, 1).setValues(homescreenCO2data);
  
  productionCO2.shift();
  productionCO2 = [productionCO2];
  var productionCO2data = row2col(productionCO2);
  productionFVSS.getRange(2, productionFVCO2col, productionCO2[0].length, 1).setValues(productionCO2data);
  
  for (var i = 0; i < confirmationCarbArray.length; i++) {
    var homescreenRowPosition = homescreenFVID.indexOf(confirmationCarbArray[i][0]);
    var productionRowPosition = productionFVID.indexOf(confirmationCarbArray[i][0]);
    var data = confirmationCarbArray[i][4] + "/" + confirmationCarbArray[i][5];
    if (homescreenRowPosition > -1) {
      homescreenConfirmationCO2[homescreenRowPosition] = data;
    }
    if (productionRowPosition > -1) {
      productionConfirmationCO2[productionRowPosition] = data;
    }
  }
  
  homescreenConfirmationCO2.shift();
  homescreenConfirmationCO2 = [homescreenConfirmationCO2];
  var homescreenConfirmationCO2data = row2col(homescreenConfirmationCO2);
  homescreenSS.getRange(2, confirmationCO2col, homescreenConfirmationCO2[0].length, 1).setValues(homescreenConfirmationCO2data);
  
  productionConfirmationCO2.shift();
  productionConfirmationCO2 = [productionConfirmationCO2];
  var productionConfirmationCO2data = row2col(productionConfirmationCO2);
  productionFVSS.getRange(2, productionConfirmationCO2col, productionConfirmationCO2[0].length, 1).setValues(productionConfirmationCO2data);
  
  appSS.getRange(2, 1, appSS.getLastRow(), appSS.getLastColumn()).clearContent();
  Logger.log('clearedContent')
  for (var m = 0; m < saveArray.length; m++) {
    appSS.getRange(2, 1, saveArray.length, saveArray[m].length).setValues(saveArray);
    Logger.log('saved data')
  }
}


//support code specifically for cellar data

function dryhopDataTransfer(array) {
  for (var i = 0; i < array.length; i++) {
    var ss = findSheet(array[i][0]);
    var beerName = ss.getRange(3, 3).getValue();
    
    var hopLotData = row2col(getArraySubsection(array, i, i, 4, 8));
    var poundData = row2col(getArraySubsection(array, i, i, 9, 13));
    
    Logger.log(hopLotData + "           " + poundData);
    ss.getRange("K31").setValue(array[i][3]);
    ss.getRange("J33:J37").setValues(hopLotData);
    ss.getRange("K33:K37").setValues(poundData);
    
    var reportString = array[i][0] + ' (' + beerName + ') dryhopped: ' + array[i][1];
    reportLog(reportString, 4);
    var inventoryString = array[i][0] + ' (' + beerName + ')';
    var k = 4;
    var l = 9;
    for (var j = 0; j < 5; j++) {
      if (array[i][k] != "") {
        inventoryString = inventoryString + '<br/>&nbsp;&nbsp;' + array[i][k] + ' (' + array[i][l] + ')';
        k++;
        l++;
      }
    }
    reportLog(inventoryString, 7);
  } 
}

function tankTransfer(array) {
  var transferArchive = SpreadsheetApp.openById("1Wmft3g-rsG7x99s50wEP-avO8Z92JLEdpoMXCWuH8PA").getSheetByName("Transfer Archive");
  var homescreenSS = SpreadsheetApp.openById("1rcrRJCYrLCmKV0nm9G8SeHOdAKVi2DzzzzFz_sUaoEE").getSheetByName("Homescreen");
  homescreenSS.sort(4);
  var homescreenData = homescreenSS.getRange(1, 1, homescreenSS.getLastRow(), homescreenSS.getLastColumn()).getValues();
  var FVIDcol = homescreenData[0].indexOf("FV_ID") + 1;
  var homescreenFVID = getAppData(homescreenData, "FV_ID");
  var reportString = '';

  for (var i = 0; i < array.length; i++) {
    var fromSS = findSheet(array[i][0]);
    var toSS = findSheet(array[i][4]);
    var fromCell = mainFVposition(array[i][0]);
    var toCell = mainFVposition(array[i][4]);
    
    var beerName = fromSS.getRange(3, 3).getValue();
    
    if (toSS.getRange(3, 3).getValue() == '') { //test to see if tank to be transferred to is empty
      var beer = beerName + ' (' + array[i][0] + ')';
      fromCell.setValue("Transferred");
      fromCell.setBackgroundRGB(183, 183, 183);
      toCell.setValue(beer);
      toCell.setBackgroundRGB(183, 225, 205);
      fromSS.setTabColor('#B7B7B7');
      toSS.setTabColor('#B7E1CD');
      
      var data = fromSS.getRange('A1:AB88').getValues();
      var transferArchiveRow = transferArchive.getLastRow() + 1;
      transferArchive.getRange(transferArchiveRow, 1, 88, 28).setValues(data);
      toSS.getRange('A1:AB88').setValues(data);
      
      toSS.getRange('X20').setFormula('=(X10*0.07258) + (X11*0.09677) + (X12*0.06653) + (X13*0.5) + (X14*0.1666) + (X15*0.4258) + (X16*0.2556) +  (X17*0.1704) + (X18*0.348) + (X19*0.174)');
      toSS.getRange('N13').setFormula('=$C$5');
      toSS.getRange('N14').setFormula('=X20/N13');
      toSS.getRange('AB33:AB66').setFormula('=IF(SUM(W33:AA33) = 0, "", SUM(W33:AA33) / COUNT(W33:AA33))');
      toSS.getRange('N16').setFormula('=IFS(N11 = "", "", N11 = "22 oz", (N15 - 9) / 9, N11 = "12 oz", (N15 - 24) / 24, N11 = "16 oz", (N15 - 24) / 24)');
      toSS.getRange('N71').setFormula('=IFS(N68 = "", "", N68 = "22 oz", (N70 - 9) / 9, N68 = "12 oz", (N70 - 24) / 24, N68 = "16 oz", (N70 - 24) / 24)');
      toSS.getRange('N47').setFormula('=IFS(N44 = "", "", N44 = "22 oz", (N46 - 9) / 9, N44 = "12 oz", (N46 - 24) / 24, N44 = "16 oz", (N46 - 24) / 24)');
      toSS.getRange('X10:X19').setFormula('=SUMIF($R$10:$R$29, W10, $S$10:$S$29)');
      
      var clearList = fromSS.getRangeList
      (['C2:C6', 'F2:F6', 'C9:K29', 'J33:K37',
        'K39:K47', 'K31', 'N8:N12', 'N15',
        'N17:N45', 'N48:N69', 'N72:N86',
        'P3:P6', 'P10:U29', 'P33:AB66']);
      clearList.clearContent();
      
      var FVIDrow = homescreenFVID.indexOf(array[i][0]) + 1;
      
      if (FVIDrow > 1) {
        homescreenSS.getRange(FVIDrow, FVIDcol).setValue(array[i][4]);
      } else {
        var homescreenString = array[i][0] + ' (' + beerName + ') was not updated to ' + array[i][4] + ' in the Packaging App Homescreen';
        reportLog(homescreenString, 6);
      }
      
      
      masterTask.sort(4);
      var masterTaskData = masterTask.getRange(1, 1, masterTask.getLastRow(), masterTask.getLastColumn()).getValues();
      var masterTaskFVcol = masterTaskData[0].indexOf("FV") + 1;
      var masterTaskLocationCol = masterTaskData[0].indexOf("Location") + 1;
      var masterTaskFV = getAppData(masterTaskData, "FV");
      var masterTaskLocation = getAppData(masterTaskData, "Location");
      
      var fromArray = array[i][0].split("-");
      var fromLocation = fromArray[0];
      var fromFV = fromArray[1];
      
      var toArray = array[i][4].split("-");
      var toLocation = toArray[0];
      var toFV = toArray[1];
      Logger.log(masterTaskLocation.length)
      for (var j = 0; j < masterTaskLocation.length; j++) {
        if (masterTaskFV[j] == fromFV && masterTaskLocation[j] == fromLocation) {
          masterTask.getRange(j + 1, masterTaskFVcol).setValue(toFV);
          masterTask.getRange(j + 1, masterTaskLocationCol).setValue(toLocation);
        }
      }
      var batchNum = toSS.getRange(4, 3).getValue();
      var today = new Date;
      today.setHours(0, 0, 0, 0);
      // add800Task: function(action, date, assigned, tag) {
      taskAdder.addTask('Micro Sample, ' + batchNum + ' Post transfer', toLocation, toFV, today, 'Lab', 'Lab');
      reportString = array[i][0] + ' (' + beerName + ') was transferred to ' + array[i][4];
    } else {
      reportString = array[i][0] + ' (' + beerName + ') failed to be transferred to ' + array[i][4];
    }
    reportLog(reportString, 6);
  }
}

function carbChecklistDataTransfer(array, action, saveArray) {
  for (var i = 0; i < array.length; i++) {
    var ss = findSheet(array[i][0]);
    var beerName = ss.getRange(3, 3).getValue();
    var data = [];
    
    if (action == "Biofine") {
      var dataToCopy = row2col(getArraySubsection(array, i, i, 3, array[i].length - 1));
      ss.getRange(39, 11, array[i].length - 3, 1).setValues(dataToCopy);
      data = [array[i][2] + " biofined, " + beerName, 31, 133, 222, "1F85DE", 
              array[i][0] + " (" + beerName + ') ' + "biofined: " + array[i][1], 
              array[i][0] + " - " + array[i][4] + " L Biofine"];
    } 
    
    else if (action == "Confirmation Carb") {
      var currentNameDate = ss.getRange(45, 11).getValue(); // to check if there is a name associated with biofining
      if (currentNameDate != "") {
        array[i][3] = currentNameDate + ", "+ array[i][3];
      }
      var dataToCopy = row2col(getArraySubsection(array, i, i, 3, array[i].length - 1));
      ss.getRange(45, 11, array[i].length - 3, 1).setValues(dataToCopy);
      
      var volCO2 = ss.getRange('K43').getValue();
      var tankPSI = ss.getRange('K44').getValue();
      data = [array[i][2] + " Conf CO2, " + beerName, 109, 158, 235, "6d9eeb",
              array[i][0] + ' (' + beerName + ') ' + 'confirmation carbed: ' + array[i][1] +
              '<br/>&nbsp;&nbsp;Confirmation CO2: ' + array[i][4] + '<br/>&nbsp;&nbsp;Confirmation PSI: ' + array[i][5] +
              '<br/>&nbsp;&nbsp;Vol CO2: ' + volCO2 + '<br/>&nbsp;&nbsp;Tank PSI: ' + tankPSI,
               ""];
    }
        
    else {
      if (!array[i][10]){
        Logger.log('Entered conditional statement')
        var tempArray = array[i][0].split("-");
        var saveLocation = tempArray[0];
        var saveFV = tempArray[1];
        var saveData = [array[i][9], array[i][0], saveLocation, saveFV, array[i][2], array[i][1], 'Biofine & Carb', '', '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', array[i][4], array[i][5], array[i][6], array[i][7], array[i][8], '', '', '', '', '', array[i][10]];
        saveArray.push(saveData);
      } 
      var currentNameDate = ss.getRange(39, 11).getValue(); // to check if there is a name associated with biofining
      if (currentNameDate != "") {
        array[i][3] = currentNameDate + ", "+ array[i][3];
      }
      var biofineData = ss.getRange(40, 11).getValue();
      if (biofineData != "") {
        array[i][4] = biofineData;
      }
      var dataToCopy = row2col(getArraySubsection(array, i, i, 3, array[i].length - 3));
      ss.getRange(39, 11, array[i].length - 5, 1).setValues(dataToCopy);
      data = [array[i][2] + " CO2, " + beerName, 109, 158, 235, "6d9eeb",
              array[i][0] + ' (' + beerName + ') ' + 'biofined/carbed: ' + array[i][1] +
              '<br/>&nbsp;&nbsp;Vol CO2: ' + array[i][7] + '<br/>&nbsp;&nbsp;Tank PSI: ' + array[i][8],
              array[i][0] + " - " + array[i][4] + " L Biofine"];
    }
    
    var targetCell = mainFVposition(array[i][0]);
    targetCell.setValue(data[0]).setBackgroundRGB(data[1], data[2], data[3]);
    ss.setTabColor(data[4]);
    
    reportLog(data[5], 5);
    if (data[6] != "") {
      reportLog(data[6], 8);
    }
  }
}