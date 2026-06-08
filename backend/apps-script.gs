/**
 * 納瓦爾讀書會 · 個人商品化工作簿 —— Google 試算表後台
 * ------------------------------------------------------------------
 * 用途：接收網頁送出的填寫資料，逐筆寫進你的 Google Sheet（一列一人）。
 *
 * 安裝步驟（5 分鐘）：
 * 1. 開一個新的 Google 試算表 → 上方選單 擴充功能 > Apps Script
 * 2. 把本檔全部貼進去，存檔
 * 3. 右上「部署」>「新增部署作業」> 類型選「網頁應用程式」
 *    - 執行身分：我
 *    - 具有存取權的使用者：「任何人」(Anyone)
 * 4. 複製產生的「網頁應用程式」網址（.../exec 結尾）
 * 5. 貼到 webapp/index.html 最上方 CONFIG.appsScriptUrl
 * 之後每位學員按「送出」，就會多一列。第一列自動是欄位標題，方便你做樞紐分析。
 * ------------------------------------------------------------------
 */

// 欄位順序（= 試算表欄位標題，固定不變，方便你長期統計）
var HEADERS = [
  "submission_id","submitted_at","app_version","part",
  "name","unit","years","age_band",
  "m1_health","m1_work","m1_play","m1_love","m1_dimmest","m1_status_game","m1_wealth_game",
  "m2_flow_1","m2_flow_2","m2_flow_3","m2_drain","m2_circle_a","m2_circle_b","m2_circle_c","m2_intersection",
  "m3_odyssey_a","m3_odyssey_b","m3_odyssey_c","m3_ev_audience","m3_ev_obstacle","m3_ev_persona","m3_ev_channel","m3_ev_complex","m3_ev_simple",
  "m4_funnel_front","m4_funnel_mid","m4_funnel_back","m4_leverage_focus","m4_mvp_action","m4_mvp_loss","m4_mvp_gain",
  "m5_recruit_target","m5_icebreak_q","m5_luck_motion","m5_luck_awareness","m5_luck_unique","m5_star_ip",
  "m6_annual_expense","m6_enough_number","m6_stage","m6_sleep_test","m6_desire_contract","m6_oath_agree",
  "final_one_liner","notes"
];

var SHEET_NAME = "submissions";

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter && e.parameter.data) {
      data = JSON.parse(e.parameter.data);
    }
    var sheet = getSheet_();
    ensureHeader_(sheet);
    var row = HEADERS.map(function (k) {
      var v = data[k];
      if (v === undefined || v === null) return "";
      if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
      return v;
    });
    sheet.appendRow(row);
    return json_({ ok: true, id: data.submission_id || "" });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

// 測試用：瀏覽器打開 /exec 會看到 OK
function doGet() {
  return json_({ ok: true, msg: "Naval workshop backend is alive." });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  return sheet;
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
