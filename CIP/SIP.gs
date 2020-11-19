function turn() {
  var ct = 0;
  var s = SpreadsheetApp.getActive().getSheetByName("Turn");
  s.sort(5, false);
  while (s.getRange(2 + ct, 2).getValue() != "" ) {
    
    var name = s.getRange(ct + 2, 2).getValue();
    var location = s.getRange(ct + 2, 3).getValue();
    var FV = s.getRange(ct + 2, 4).getValue();
    var mainSheet = findSheet(location, "Main");
    var trackerSheet = findSheet(location, FV);
    var targetCell = numberFV(FV, mainSheet);
    var action = s.getRange(ct + 2, 5).getValue();
    
    if (action !== 'Sanitized') {
      targetCell.setValue(action);
      targetCell.setBackgroundRGB(239, 239, 239);
      trackerSheet.setTabColor("efefef")
    }
    
    var string = location + ', ' + FV + ' ' + action.toLowerCase() + ': ' + name;
    reportLog(string, 3);
    
    var CIPLog = findCIP(location, FV);
    
    var today = new Date;
    today.setHours(0, 0, 0, 0);
    var yesterday = new Date(today.setDate(today.getDate() - 1));
    yesterday.setHours(0, 0, 0, 0);
    
    if (action == 'Sanitized') {
      var data = CIPLog.getRange('N4:O36').getValues();
      CIPLog.getRange('N5:O37').setValues(data);
      
      CIPLog.getRange('N4').setValue(yesterday);
      CIPLog.getRange('O4').setValue(name);
    } else if (action == 'Turned') {
      var data = CIPLog.getRange('A2:M36').getValues();
      CIPLog.getRange('A3:M37').setValues(data);
      
      CIPLog.getRange('A2').setValue(yesterday);
      CIPLog.getRange('B2').setValue(name);
      
      data = s.getRange(ct + 2, 6, 1, 11).getValues();
      CIPLog.getRange('C2:M2').setValues(data);
    } else if (action == 'Hot BSR') {
      var data = CIPLog.getRange('P2:X36').getValues();
      CIPLog.getRange('P3:X37').setValues(data);
      
      CIPLog.getRange('P2').setValue(yesterday);
      CIPLog.getRange('Q2').setValue(name);
      
      data = s.getRange(ct + 2, 17, 1, 7).getValues();
      CIPLog.getRange('R2:X2').setValues(data);
      
      var fvViewer = SpreadsheetApp.openById("1-CKJ5242GC8as-0aSRNBYiGv6dzBO1QIn_nR53FyA-c").getSheetByName("Production FV Viewer");
      var keyList = fvViewer.getRange("B2:B100").getValues(); //gets the FV_IDs for the production FV viewer
      var ID = location + "-" + FV;
      var hotBSRrow = returnRowByID(ID, keyList);
      fvViewer.getRange(hotBSRrow, 11).setValue(yesterday);
      
      var masterTask = SpreadsheetApp.openById("1NMl2IOhB8Y5UN3x-oXkL9Epuv9Njw1btPdnX5QsN5sc").getSheetByName("Last Hot BSR");
      var keyList = masterTask.getRange("A2:A100").getValues(); //gets the FV_IDs for the production FV viewer
      var taskHotBSRrow = returnRowByID(ID, keyList);
      masterTask.getRange(taskHotBSRrow, 2).setValue(yesterday);
    }
    
    ct++;
  }
  s.getRange("A2:Z60").clearContent();
}