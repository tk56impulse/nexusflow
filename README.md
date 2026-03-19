# NexusFlow 
## 作業ログ（3/13）
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

## 🛠 技術設計 (Technical Design)

### タスクデータ構造の統一
本プロジェクトでは、複数のドメイン（不動産・ロジック）でタスクを扱うため、`BaseTask` を基点とした拡張可能な型定義を採用しています。

- **BaseTask**: 全てのアプリで共通のプロパティ（title, category, layer等）
- **Metadata**: 各アプリ固有の拡張データ（priorityScore, siteLocation等）
- **Source**: データ元を判別するリテラル型 ('propflow' | 'logicdeck')

### インポートルール
ディレクトリ階層の深化に伴うパスの複雑化を防ぐため、以下のエイリアスを推奨します。
- `@/lib/types`: 共通の型定義および定数（LAYER_MAP等）
- `@/lib/logic`: 計算アルゴリズム関連

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
  **設計ドキュメントの整備**: [architecture.md](./architecture.md) を作成し、全体構成とデータフロー図を可視化。

## 作業ログ（3/19）
- **コアシステムのアーキテクチャ刷新**
「NexusFlow」としての基盤を強固にするため、データ構造とディレクトリ戦略を大幅にリファクタリング。

- **型定義の統合 (Unified Task System)**
  - `PropFlow` と `LogicDeck` でバラバラだった Task 型を `src/lib/types.ts` に一本化。
  - 共通プロパティ（`category`, `layer`, `intensity`）を `BaseTask` へ抽出し、アプリ固有データは `metadata` へ分離。
  - `createdAt` を `Date` 型から `number` (timestamp) 型へ変更し、シリアライズ性能とソートの正確性を向上。
- **インポートパスの標準化**
  - `tsconfig.json` のパスエイリアス設定に基づき、`@/lib/types` 等の絶対パス参照へ完全移行。
  - 相対パス地獄（`../../`）を解消し、コンポーネント移動に強い構造を実現。
- **UIコンポーネントの汎用化準備**
  - `TaskCard`, `TaskForm` の型エラーを解消し、どのドメインのタスクでも受け入れ可能な状態を整備。
- **ビルド環境の正常化**
  - 全ファイルにおいて TypeScript の型整合性を確認。`npm run build` の正常終了を確認済み。