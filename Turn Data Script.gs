// NEW TURN CODE

function turn() {

  var appSS = SpreadsheetApp.openById("1Wmft3g-rsG7x99s50wEP-avO8Z92JLEdpoMXCWuH8PA").getSheetByName("Turn");
  appSS.sort(1);
  var appData = appSS.getRange(1, 1, appSS.getLastRow(), appSS.getLastColumn()).getValues();
  
  // Grab all the data from appData in which the key matches the header. Returns the header as well.
  var timestamp = getAppData(appData, "Timestamp");
  var name = getAppData(appData, "Name");
  var location = getAppData(appData, "Location");
  var fv = getAppData(appData, "FV");
  var action = getAppData(appData, "Action?");
  
  var turn1 = getAppData(appData, "30 min. caustic CIP cycle through spray ball");
  var turn2 = getAppData(appData, "5 min. cycle through each port and the blowoff arm");
  var turn3 = getAppData(appData, "Soak manway gasket, zwickle, and carbstone in 2% caustic solution");
  var turn4 = getAppData(appData, "Scrub fermenter feet/bracing with a dilute caustic solution and floor brush");
  var turn5 = getAppData(appData, "Clean fermenter ext. manway to cone with non-abrasive sponge and caustic");
  var turn6 = getAppData(appData, "Remove dry hop port and gasket, clean as necessary");
  var turn7 = getAppData(appData, "Remove PVR(s) and clean as necessary");
  var turn8 = getAppData(appData, "Replace all valves, arms, sample cocks, and stone using iodine scrub and isopropyl spray");
  var turn9 = getAppData(appData, "Remove sprayball and clean as necessary (if not top-spraying)");
  var turn10 = getAppData(appData, "Give final visual inspection of tank with flashlight");
  var turn11 = getAppData(appData, "RLU value recorded under manway");
  
  var bsr1 = getAppData(appData, "Completed 'Turned' tasks");
  var bsr2 = getAppData(appData, "30 min. hot BSR CIP cycle through spray ball");
  var bsr3 = getAppData(appData, "5 min. cycle through each port and the blowoff arm (Hot BSR). Soak carbstone.");
  var bsr4 = getAppData(appData, "Calibrate PRV to blow at 15 psi");
  var bsr5 = getAppData(appData, "Remove spray ball and clean as neccessary");
  var bsr6 = getAppData(appData, "Examine all valve seats and gaskets for damage, replace if necessary");
  var bsr7 = getAppData(appData, "Clean tank exterior top to bottom using a 5% solution of foaming acid");
  
  // I need the date
  var date = ['Date'];
  timestamp.forEach((element, i) => {
    if (i === 0) return;
    date.push(new Date(element.setHours(0, 0, 0, 0)));
  });
  
  var turnArray = [];
  var bsrArray = [];
  var sanitizedArray = [];
  
  action.forEach((element, i) => { 
    if (i === 0) return;
    if (element === "Sanitized") {
      
      sanitizedArray.push([date[i], name[i]]);
      
    } else if (element === "Turned") {
      
      turnArray.push([date[i], name[i], turn1[i], turn2[i], turn3[i], turn4[i], turn5[i], turn6[i], turn7[i], turn8[i], turn9[i], turn10[i], turn11[i]]);
      
    } else if (element === "Hot BSR") {
      
      bsrArray.push([date[i], name[i], bsr1[i], bsr2[i], bsr3[i], bsr4[i], bsr5[i], bsr6[i], bsr7[i]]);
      
    }
  });
  console.log(turnArray);
  // Status update for main pages and report logs
        
    
  // Sanitized function
    
    
  // Turn function
    
    
  // Hot BSR function (updates FV viewer and last hot bsr list)
    
  
  
};