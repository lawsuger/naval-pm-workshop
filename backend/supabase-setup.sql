-- ============================================================
-- 納瓦爾讀書會 · 個人商品化工作簿 —— Supabase 後台建表腳本
-- ------------------------------------------------------------
-- 安裝步驟：
-- 1. 到 supabase.com 建一個免費專案
-- 2. 左側 SQL Editor > New query，把本檔貼上，按 Run
-- 3. 左側 Project Settings > API：
--      - 複製「Project URL」  -> 填到 index.html 的 CONFIG.supabase.url
--      - 複製「anon / publishable」key -> 填到 CONFIG.supabase.anonKey
-- 4. anon key 是公開可用的（搭配下方 RLS insert policy 只能新增、不能讀取，安全）
-- 5. 看資料：到 Table Editor > submissions，或用 service_role key 在後端讀取／匯出
-- ============================================================

create table if not exists public.submissions (
  id            bigint generated always as identity primary key,
  submission_id text,
  submitted_at  timestamptz,
  name          text,
  unit          text,
  age_band      text,
  app_version   text,
  payload       jsonb,                       -- 完整填寫內容（所有模組欄位）
  created_at    timestamptz not null default now()
);

-- 開啟 Row Level Security（一定要開）
alter table public.submissions enable row level security;

-- 只允許「新增」(insert)，不允許匿名讀取/修改/刪除 —— 學員只能投稿，看不到別人資料
drop policy if exists "anon can insert submissions" on public.submissions;
create policy "anon can insert submissions"
  on public.submissions
  for insert
  to anon, authenticated
  with check (true);

-- （刻意不建立 select policy → 匿名無法讀取，保護學員隱私）
-- 你要分析資料時，用 Supabase 後台 Table Editor，或 service_role key。

-- 方便分析的檢視表（把常用欄位從 payload 拉平；用 service_role 或後台查詢）
create or replace view public.submissions_flat as
select
  id, submission_id, submitted_at, name, unit, age_band,
  payload->>'years'             as years,
  (payload->>'m1_play')::int    as play_gauge,
  payload->>'m1_dimmest'        as dimmest_light,
  payload->>'m2_intersection'   as specific_knowledge,
  payload->>'m3_ev_persona'     as persona,
  payload->>'m4_leverage_focus' as leverage_focus,
  payload->>'m4_mvp_action'     as mvp_action,
  payload->>'m5_recruit_target' as recruit_target,
  (payload->>'m6_enough_number')::numeric as enough_number,
  payload->>'m6_stage'          as freedom_stage,
  payload->>'m6_sleep_test'     as sleep_test,
  payload->>'final_one_liner'   as commitment,
  created_at
from public.submissions;
