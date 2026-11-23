# TypingApp

公開版: https://nakm2021.github.io/TypingApp/

毎回異なる自然な日本語をローマ字で入力する、オフライン対応のタイピング練習アプリです。ダーク基調のゲームUI、3種類のゲームモード、3段階の難易度、成績履歴、設定を備えています。

## 使用技術・動作環境

- Angular 22 / Standalone Components / Signals / Router
- TypeScript 6 / HTML / SCSS
- IndexedDB（成績・出題履歴・自己ベスト）、localStorage（設定）
- Node.js 26 LTS、npm 11
- Chromium / Firefox / Safari の現行版

Node.jsはシステムへインストールせず `.tools/node` に同梱しています。別途Node.js 26以上がある環境では通常の `npm` も使えます。

## インストール・起動

最も簡単な起動方法（システムへのNode.js/npmインストール不要）：

```bash
./start.sh
```

通常のnpmコマンドを使う場合：

```bash
export PATH="$PWD/.tools/node/bin:$PATH"
npm install
npm start
```

ブラウザで `http://localhost:4200` を開きます。

```bash
./test.sh                    # テスト
./build.sh                   # 本番ビルド（dist/typing-app）
```

## ディレクトリ構成

```text
src/app/
├── core/engines/       # ローマ字候補生成・判定
├── core/services/      # 問題生成、ゲーム進行、保存、設定
├── core/utils/         # スコア計算
├── features/           # home / typing / result / history / settings
└── models/             # 共通の厳格な型
public/assets/questions # 辞書・テンプレートの仕様資料
```

## 問題生成

`QuestionGeneratorService` は人物・場所・動作・時間・形容詞など8ロール、102語の読み付き辞書と340種類の文法テンプレートから、表示文とかなを同時に構築します。初級専用の短文、長音、半角英数字・記号、会話、情景描写、現代語、古風な語り、文学的表現を難易度別に出題します。漢字から読みを推測しません。正規化した本文を重複キーにし、同一セッションとIndexedDB内の直近300問を避けます。同じ構造の連続を抑え、最大40回の再抽選後は固定プールへ安全にフォールバックします。

単語を追加するには `src/app/core/services/question-generator.service.ts` の対応ロール配列に `w('表示','かな','難易度','カテゴリ')` を追加します。文法上交換可能なロールにだけ追加してください。テンプレートは同ファイルの `TEMPLATES` に表示とかなを一緒に連結する関数として追加します。将来のOllama等は `QuestionSource` の `ai` を実装する生成プロバイダーとして差し替え可能です。

## ローマ字判定

`RomajiMatcher` はかな列を許容ローマ字列へ展開し、入力の各時点で有効な候補を絞ります。`shi/si`、`chi/ti`、`tsu/tu`、`fu/hu`、拗音、促音、撥音、母音前の `n'/nn`、小書き文字、長音、句読点に対応します。誤入力は候補状態を進めません。

## 保存と拡張

保存失敗はゲームを停止させません。結果と問題履歴は設定画面から削除できます。誤入力時の警告音はON/OFFと5種類の音色を選択でき、Web Audio APIで端末内生成するため音声ファイルや通信は不要です。問題辞書の外部JSON完全移行、ローカルAI生成器、より詳細な統計は既存サービス境界を保ったまま追加できます。
