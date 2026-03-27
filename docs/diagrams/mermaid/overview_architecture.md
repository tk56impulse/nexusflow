```mermaid
graph TD
    User[ユーザー] ===>|操作| UI

    subgraph Client [Next.js App: クライアント環境]
        subgraph UI [画面レイヤー]
            direction TB
            AuthUI[ログイン/会員登録]
            SettingUI[評価項目カスタマイズ]
            TaskUI[タスク入力/スコア閲覧]
        end

        subgraph Logic [ロジック]
            direction TB
            AuthLogic[useAuth: 認証状態監視]
            Calc[算出エンジン: ユーザー定義ルール適用]
        end
        
        SettingUI --> Logic
        TaskUI --> Logic
    end

    subgraph Cloud [Firebase: クラウド環境]
        Auth[(Firebase Auth: パスワード/認証基盤)]
        
        subgraph DB [Firestore: データベース]
            Rules[ユーザー独自の評価項目定義]
            Tasks[タスク・実行ログ]
        end
    end

    AuthUI <==>|1. 認証リクエスト| Auth
    Auth -.->|2. uid発行| AuthLogic
    
    Logic ===>|3. 定義ルール取得| Rules
    Logic ===>|4. タスク保存・同期| Tasks
    
    %% --- スタイル定義 ---
    style User fill:#333,stroke:#000,color:#fff,stroke-width:2px
    style AuthUI fill:#0052cc,stroke:#000,color:#fff,stroke-width:2px
    style SettingUI fill:#0052cc,stroke:#000,color:#fff,stroke-width:2px
    style TaskUI fill:#0052cc,stroke:#000,color:#fff,stroke-width:2px
    style Calc fill:#d81b60,stroke:#000,color:#fff,stroke-width:2px
    style AuthLogic fill:#d81b60,stroke:#000,color:#fff,stroke-width:2px
    style Auth fill:#2e7d32,stroke:#000,color:#fff,stroke-width:2px
    style DB fill:#f1f8e9,stroke:#2e7d32,stroke-width:2px
    style Rules fill:#fff,stroke:#2e7d32,color:#2e7d32,stroke-width:2px
    style Tasks fill:#fff,stroke:#2e7d32,color:#2e7d32,stroke-width:2px

    style UI stroke:#0052cc,stroke-width:2px,fill:#f0f7ff
    style Logic stroke:#d81b60,stroke-width:2px,fill:#fff0f5
    style Data stroke:#2e7d32,stroke-width:1px,fill:#fff

    %% リンクスタイルの修正（行末コメントを完全削除）
    linkStyle default stroke:#000,stroke-width:2px
    linkStyle 4 stroke:#ff4500,stroke-width:2px,stroke-dasharray: 5 5
    linkStyle 5 stroke:#0052cc,stroke-width:2px
    linkStyle 6 stroke:#2e7d32,stroke-width:2px