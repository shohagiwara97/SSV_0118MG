# Vercelデプロイ手順（SSV 1Day PWA）

- 作成日: 2026-01-11
- 対象: `pwa/`（Next.js App Router, TypeScript, Tailwind）

---

## 1. 事前準備
- Vercelアカウントを用意
- リポジトリをGitで管理しておく
- ローカルのNode.jsは18以上を推奨

---

## 2. Vercel Web UIでデプロイ
1) Vercelにログインして「New Project」を作成  
2) 対象リポジトリを選択  
3) **Root Directory** を `pwa` に設定  
4) **Framework Preset** は Next.js を選択  
5) Build設定を確認  
   - Install Command: `npm install`  
   - Build Command: `npm run build`  
   - Output Directory: `.next`  
6) 「Deploy」を実行  

---

## 3. Vercel CLIでデプロイ（任意）
1) CLIインストール  
   `npm i -g vercel`
2) ログイン  
   `vercel login`
3) プレビュー環境へデプロイ  
   `vercel --cwd pwa`
4) 本番デプロイ  
   `vercel --cwd pwa --prod`

---

## 4. PWA動作確認
- `manifest.webmanifest` が配信されていることを確認  
- Service Worker が登録されることを確認  
  - Chrome DevTools → Application → Service Workers  
- ホーム画面追加（Add to Home Screen）が可能か確認  

---

## 5. よくある調整
- Service Worker更新が反映されない  
  - `pwa/public/sw.js` の `CACHE_NAME` を更新  
  - ブラウザで「サイトデータ削除」  
- Node.jsバージョン差異  
  - Vercel Project Settings → Node.js Version を指定  

