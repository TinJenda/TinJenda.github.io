/*
 CV tag script
 Author by : KPIS
 */
// var api_host = "https://pex-api.mobsmart.net/gateway";
// var urlWebClient = "https://pex.mobsmart.net";
var api_host = "https://pex-api-dev15.mobsmart.net/gateway";
var urlWebClient = "https://pex-dev15.mobsmart.net";
// parse tag info
var tagInfo = document.getElementsByTagName("cv")[0].getAttribute("data");
var tagArray = tagInfo.split("||");
var clientID = tagArray[0];
var campaignID = tagArray[1];
var eventID = tagArray[2];
var isMobile = detectMob();
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var isChromeIPhone = navigator.userAgent.match('CriOS');
var defaultLang = "zh_hans";
var urlReq = api_host + '/rest-api/check-validate-event-wechat/?event_id=' + eventID + '&client_id=' + clientID + '&campaign_id=' + campaignID;
var urlTrackingCvTag = api_host + '/rest-api/tracking-cvtag/';
var messageConfirm = '是否领取积分？'
var isIPad = /Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;
var isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(navigator.userAgent.toLowerCase());

//// dialog iframe css
css = ':root{--header-color:#3379b7;--width-dialog:400px;--max-width-dialog:90%}'
// dialog confirm - css
css += '.dialog-confirm{position:fixed;top:0;right:0;bottom:0;left:0;display:none;width: 100%;height: 100%;}'
css += '.popup{font-size: 14px;margin:auto;position:relative;z-index:1;background:#ffffff;width:var(--width-dialog);max-width:var(--max-width-dialog);text-align:center;border-radius:5px; overflow: hidden;}'
css += '.overlay{position:absolute;width:100%;height:100vh;background-color:rgba(0,0,0,.4)}'
css += '.dialog-btn{font-size: 14px;border:1px solid #d0d0d0;border-radius:5px;min-height:30px;min-width:30%;padding:0 10px}'
css += '.btn-cancel{background-color:#ffffff;cursor:pointer;color:#0990f9; margin-left:15px}'
css += '.btn-cancel:hover{background-color:#fdfdfd;cursor:pointer;color:#0990f9}'
css += '.btn-primary{background-color:#0990f9;cursor:pointer; color:#FFFFFF}'
css += '.btn-primary:hover{background-color:#037bd8;cursor:pointer}'
css += '.btn-group{padding:0 0 15px 0}'
css += '.popup-header{background-color: #0990f9;width:100%;color: white;display:flex;overflow:hidden}'
css += '.popup-header-text{padding: 5px}'

head = document.head || document.getElementsByTagName('head')[0],
  style = document.createElement('style');
head.appendChild(style);
style.type = 'text/css';

if (style.styleSheet) {
  // This is required for IE8 and below.
  style.styleSheet.cssText = css;
} else {
  style.appendChild(document.createTextNode(css));
}

function toggleModalIframe(verifyCode, pointPerEvent, transactionid) {
  if (pointPerEvent != null && verifyCode != null) {
    var iframeHref = urlWebClient + "/wechat/receive-point/pc/" + verifyCode + "/" + campaignID + "/" + eventID + "/" + clientID + "/" + pointPerEvent + "/" + transactionid + "/" + defaultLang;
    var popup_window = popupWindow(iframeHref, 'getpoint', 600, 780);
    try {
      popup_window.focus();
    } catch (e) {
      alert("Pop-up Blocker is enabled!");
    }
  }
}

function popupWindow(url, title, w, h) {
  var y = window.outerHeight / 2 + window.screenY - (h / 2)
  var x = window.outerWidth / 2 + window.screenX - (w / 2)
  return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + y + ', left=' + x);
}

// dom dialog confirm
var dialogConfirm = document.createElement('div');
dialogConfirm.className = "dialog-confirm";
dialogConfirm.id = "dialog-confirm";
dialogConfirm.innerHTML = '<div class="overlay" id="dialog-container"></div> <div class="popup popup-mobile"> <div class="popup-header"><span class="popup-header-text">确认</span></div> <p>' + messageConfirm + '</p><div class="btn-group"> <button class="dialog-btn btn-primary btn-mobile" id="accept-confirm">好</button><button class="dialog-btn btn-cancel btn-mobile" id="cancel-confirm">取消</button></div></.div>';
document.body.appendChild(dialogConfirm);
var idDialogConfirm = document.getElementById("dialog-confirm");
function showDialogConfirm() {
  /* A function to show the dialog window */
  idDialogConfirm.style.display = "flex";
}

function acceptConfirm() {
  getAjax(urlReq, function (dataCheckEvent) {
    var objectDataCheckEvent = JSON.parse(dataCheckEvent);
    if (objectDataCheckEvent.status.toLowerCase() == "true") {
      getAjax(urlTrackingCvTag, function (dataTracking) {
        try {
          var objectDataTracking = JSON.parse(dataTracking);
          if (objectDataTracking.status.toLowerCase() == "true") {
            var codeVerify = objectDataTracking.verifyCode;
            // dialog to confirm receive reward point
            toggleModalIframe(codeVerify, objectDataCheckEvent.pointPerEvent, objectDataCheckEvent.transactionId);
          } else {
            alert(objectDataTracking.message);
          }
        } catch (error) {
          console.log(error)
        }
      })
    }
  });
}

function cancelConfirm() {
  idDialogConfirm.style.display = "none";
}

//when user accept to receive point, the process will be continue
document.getElementById("accept-confirm").onclick = function () {
  idDialogConfirm.style.display = "none";
  setTimeout(() => {
    acceptConfirm();
  }, 500)
};

// If cancel btn is clicked , the function is executed to set display none
document.getElementById("cancel-confirm").onclick = function () {
  cancelConfirm();
};

function detectMob() {
  if (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
  ) {
    return true;
  }
  else {
    return false;
  }
}

function checkEventIsWorking() {
  console.log("check event is working");
  getAjax(urlReq, function (dataCheckEvent) {
    try {
      var objectDataInsert = JSON.parse(dataCheckEvent);
      if (objectDataInsert.status.toLowerCase() == "false") {
        alert(objectDataInsert.message);
      } else if (objectDataInsert.status.toLowerCase() == "true") {
        mainProcession();
      }
    } catch (error) {
      console.log(error)
    }
  });
}

function mainProcession() {
  showDialogConfirm();
}

//function to make ajax call
function getAjax(urlReq, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', urlReq);
  xhr.onreadystatechange = function () {
    if (xhr.readyState > 3 && xhr.status == 200) callback(xhr.responseText);
  };
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send();
  return xhr;
}

document.addEventListener('DOMContentLoaded', function () {
  window.addEventListener('load',
    function () {
      setTimeout(() => {
        checkEventIsWorking();
      }, 1000);
    }, false);
});