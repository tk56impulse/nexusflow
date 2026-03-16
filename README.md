# NexusFlow 
3/13 ①
## プロジェクト概要

NexusFlow は、既存の **PropFlow**（進捗管理システム）と **LogicDeck**（意思決定支援ツール）を統合し、単一のリポジトリへ移行するプロジェクトです。
「実行（PropFlow）」と「判断（LogicDeck）」のプロセスを融合させることで、タスクの進捗管理だけでなく、その価値や優先度を動的に評価する包括的なワークフロー管理を実現します。

## ディレクトリ構成

統合に伴い、コアロジックと型定義を中心に以下のような構成で整理を進めています。

- **`src/lib/types.ts`**
  - プロジェクト全体の共通型定義。
  - `PropFlowTask` と `LogicDeckTask` を統合した `Task` 型（Discriminated Union）を定義し、`source` プロパティによる型安全な分岐を実現しています。

- **`src/lib/logic/`**
  - ビジネスロジックの格納場所。
  - `scoreCalculator.ts`: 旧 LogicDeck のアルゴリズムを移植し、統合 `Task` 型に対応させたスコア計算ロジック。

## 主要技術

- **Framework**: Next.js
- **Language**: TypeScript
- **Architecture**:
  - **Discriminated Union型による統合モデル**: 異なる特性を持つタスクデータを、判別可能なユニオン型としてモデル化し、堅牢な型安全性を確保。
  - **Type Guard Pattern**: ランタイムでのデータ検証とコンパイル時の型チェックを両立させる実装パターンを採用。

## 今後の展望

1. **PropFlowロジックの完全移行**: 未実装の PropFlow 固有ロジック（承認フロー等）を `src/lib/logic` 配下へ移植。
2. **統合ダッシュボード**: 両方のタスクを横断的に可視化・操作できる Next.js ベースの UI コンポーネント開発。
3. **API統合**: バックエンドAPIを統合し、単一のエンドポイントで多様なタスク操作を可能にする。

## 作業ログ（3/16）
- **プロジェクト基盤の最適化**: 
  - Next.js プロジェクトのディレクトリ構成を App Router に準拠した `src/` 配下へ統合。
  - Turbopack 環境におけるビルドキャッシュおよび TypeScript 設定（`tsconfig.json`）を最適化し、開発体験を改善。
  - `.gitignore` および VS Code の除外設定（`files.exclude`）を整備し、キャッシュフォルダのクリーンな管理を確立。

- **コアロジックの統合と機能実装**:
  - `src/lib/logic/score.ts` へ並び替えロジック（`sortTasks`）を追加し、スコア計算との依存関係を集約。
  - 統合ダッシュボード (`src/app/page.tsx`) における、`PropFlow` および `LogicDeck` データの横断的なスコア計算・ソート表示を実装。
  - プロトタイプ画面による、タスク優先度の動的評価ロジックの動作確認が完了。