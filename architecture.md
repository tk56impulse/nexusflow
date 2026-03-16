```mermaid
graph TD
    User[ユーザー] -->|操作| UI[PropFlow: page.tsx]
    UI -->|データ入力| Logic[LogicDeck: calculation.ts]
    Logic -->|計算ロジック| Calc((算出エンジン))
    Calc -->|結果返却| UI
    UI -->|永続化| DB[(Firebase)]
    
%% 背景色(fill)と文字色(color)を指定
    style User fill:#e0e0e0,stroke:#333,color:#000
    style UI fill:#add8e6,stroke:#333,color:#000
    style Logic fill:#ffb6c1,stroke:#333,color:#000
    style Calc fill:#ffb6c1,stroke:#333,color:#000
    style DB fill:#90ee90,stroke:#333,color:#000