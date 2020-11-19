//Bring daily main update here from each sheet

function statusUpdate() {
  var array800 = getStatus(800);
  var array5010 = getStatus(5010);
  var array1406 = getStatus(1406);
  var statusArray = array800.concat(array5010);
  statusArray = statusArray.concat(array1406);
  
  updateFVview(statusArray);
  updateHomescreen(statusArray);
}

function getStatus(location) {
  if (location == 800) {
    var ss = sheet800.getSheetByName('Main');
    var array1 = ss.getRange('B10:I10').getValues();
    var array2 = ss.getRange('B18:I18').getValues();
    var array3 = ss.getRange('B26:I26').getValues();
    var data = array1[0].concat(array2[0]);
    data = data.concat(array3[0]);
  } else {
    if (location == 5010) {
      var ss = sheet5010.getSheetByName('Main');
    } else if (location == 1406) {
      var ss = sheet1406.getSheetByName('Main');
    }
    var array1 = ss.getRange('B10:G10').getValues();
    var data = array1[0];
  }
  return data;
}

function updateFVview(data) {
  var appSS = SpreadsheetApp.openById('1-CKJ5242GC8as-0aSRNBYiGv6dzBO1QIn_nR53FyA-c').getSheetByName('Production FV Viewer');
  var headers = appSS.getRange('1:1').getValues();
  var keyPosition = headers[0].indexOf('Row Key') + 1;
  appSS.sort(keyPosition);
  var statusPosition = headers[0].indexOf('Status') + 1;
  var length = data.length;
  data = [data];
  appSS.getRange(2, statusPosition, length, 1).setValues(row2col(data));
}

function updateHomescreen(data) {
  var FVIDposition = ['800-FV1', '800-FV2', '800-FV3', '800-FV4', '800-FV5', '800-FV6', '800-FV7', '800-FV8', '800-FV9', '800-FV10',
                      '800-FV11', '800-FV12', '800-FV13', '800-FV14', '800-FV15', '800-FV16', '800-FV17', '800-FV18', '800-FV19', '800-FV20', '800-FV21', '800-FV22',
                      '800-FV23', '800-FV24', '5010-FV1', '5010-FV2', '5010-FV3', '5010-FV4', '5010-FV5', '5010-FV6', '1406-FV1', '1406-FV2', '1406-FV3', '1406-FV4',
                      '1406-FV5', '1406-FV6'];
  
  var appSS = homescreenSS;
  appSS.sort(4);
  var headers = appSS.getRange('1:1').getValues();
  var statusPosition = headers[0].indexOf('Beer Status') + 1;
  var appData = appSS.getRange(1, 1, appSS.getLastRow(), appSS.getLastColumn()).getValues();
  var FVID = getAppData(appData, 'FV_ID');
  
  var beerStatus = [];
  for (var i = 1; i < FVID.length; i++) {
    var position = FVIDposition.indexOf(FVID[i]);
    var statusData = data[position];
    beerStatus.push(statusData);
  }
  var length = beerStatus.length;
  beerStatus = [beerStatus];
  appSS.getRange(2, statusPosition, length, 1).setValues(row2col(beerStatus));

}