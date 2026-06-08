# 個人商品化互動工作簿（網頁版）

> 納瓦爾讀書會 · 將個人商品化 · 做自己生命的設計師 —— 保險經紀處經理專屬
> Dark Gold 互動工作簿：TA 邊看公式／解釋／出處邊填，自動存檔，產出「我的個人使用說明書」，資料送你後台統計。

---

## 這包有什麼

```
webapp/
├─ index.html              ← 主程式（單檔，含全部畫面與邏輯，零安裝零相依）
├─ README.md               ← 本說明
└─ backend/
   ├─ apps-script.gs        ← Google 試算表後台（推薦先用這個）
   └─ supabase-setup.sql    ← Supabase 雲端資料庫後台（長期用）
```

設計原則：**單檔、純前端、無 npm 相依**——好部署、可離線開、不會因套件改版而壞（符合修哥版本紀律）。

---

## 三步上線

### 步驟 1：設定後台（兩個都可填，會同時送）

打開 `index.html`，最上方 `<script>` 內有一段 `CONFIG`：

```js
const CONFIG = {
  appsScriptUrl: "",          // ← 貼 Google Apps Script 網址
  supabase: { url:"", anonKey:"", table:"submissions" },  // ← 貼 Supabase 設定
  appVersion: "web-1.0"
};
```

- **A. Google 試算表（推薦先用）**：照 `backend/apps-script.gs` 開頭 5 步驟做完，把 `.../exec` 網址貼進 `appsScriptUrl`。資料會一列一人進你的 Sheet，直接做樞紐分析。
- **B. Supabase（長期／專業）**：照 `backend/supabase-setup.sql` 開頭做完，把 Project URL 與 anon key 貼進 `supabase`。資料進資料庫，可用 `submissions_flat` 檢視表分析。
- 兩個都填 = 雙寫（Sheet 看得快、DB 留得久）；都不填 = 純前端，學員用「下載我的使用說明書」帶走。

### 步驟 2：部署網頁（給 TA 一個網址＋QR）

單檔靜態網站，任選其一：

- **Zeabur**（你有現成 skill）：把 `webapp/` 當靜態站部署，得到固定網址。
- **Netlify Drop**：把 `webapp` 資料夾拖到 https://app.netlify.com/drop ，30 秒得到網址。
- **GitHub Pages**：推到 public repo（repo 名＝資料夾名）開 Pages。
- **本機測試**：直接用瀏覽器打開 `index.html` 即可（送 Supabase 沒問題；送 Apps Script 也可）。

> 拿到網址後，用任何線上 QR 產生器做成 QR code，工作坊現場投影，TA 手機掃碼即填。

### 步驟 3：現場使用

- **網頁組**：掃 QR → 填寫 → 按「送出給講師統計」。資料自動存在手機（localStorage），第二次上課回來會自動帶出 Part 1 的內容。
- **紙本組**（長輩／小組討論）：用 `../print/` 兩份列印檔，見那邊 README。
- TA 也可按「下載我的使用說明書」存成 PDF 帶走，這就是他的個人成果。

---

## 你（講師）怎麼看資料、做下次設計

- **Google Sheet**：每列一人，欄位固定。建議直接做樞紐：
  - `age_band` × `m4_leverage_focus`：不同年齡層想押哪種槓桿
  - `m6_stage` 分布：全單位的財務自由階段地圖
  - `m1_play` 平均：團隊「遊戲」油表（熱情枯竭預警）
  - `m5_recruit_target` 清單：全單位下週的增員行動總表
- **Supabase**：查 `submissions_flat` 檢視表，或匯出 CSV。
- **回流大腦資料庫**：統計洞察可寫進 `naval-workshops/`，精華再升級回 `wiki/`（需修哥審核閘門）。

---

## 隱私與安全

- 不收身分證／信用卡／密碼；姓名欄可用代號。
- Supabase 只開 `insert` policy（學員彼此看不到資料）。
- anon key 是設計給前端公開用的；真正的讀取權在你手上（後台／service_role）。
- 所有 secrets（若未來接更多服務）一律走環境變數，不寫死。

---

## 欄位字典（送到後台的 key）

| key | 模組 | 意義 |
|---|---|---|
| name, unit, years, age_band | 報到 | 基本資料（統計分群用）|
| m1_health/work/play/love | 1 | 四燈號儀表板 0–100 |
| m1_dimmest / m1_status_game / m1_wealth_game | 1 | 最暗的燈／地位遊戲→貢獻遊戲 |
| m2_flow_1~3 / m2_drain | 2 | 三個心流時刻／最耗能事 |
| m2_circle_a/b/c / m2_intersection | 2 | 三圈交集／一句定位 |
| m3_odyssey_a/b/c | 3 | 奧德賽三計畫 |
| m3_ev_audience/obstacle/persona/channel/complex/simple | 3 | 電梯簡報六空格 |
| m4_funnel_front/mid/back / m4_leverage_focus | 4 | 三層漏斗／要押的槓桿 |
| m4_mvp_action/loss/gain | 4 | 30 天 MVP |
| m5_recruit_target / m5_icebreak_q | 5 | 准增員／破冰問句 |
| m5_luck_motion/awareness/unique / m5_star_ip | 5 | 四種幸運分類／IP 點子 |
| m6_annual_expense / m6_enough_number / m6_stage / m6_sleep_test | 6 | 足夠數字／階段／睡眠測試 |
| m6_desire_contract / m6_oath_agree | 6 | 慾望合約／主權誓言 |
| final_one_liner / notes | 總結 | 30 天承諾／給講師的話 |

---

v1.0 · 2026-06-08 · 底座：納瓦爾 39 條 × 生命設計師 × 斯多葛 × 劉潤/樊登/Housel × 修哥 18 年實務
