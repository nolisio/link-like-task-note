# AGENTS.md

本ファイルは本リポジトリで作業するAIエージェント（Sisyphus等）向けの規律を定める。
`frontend/AGENTS.md` は frontend 配下固有のルールを定義しており、本ファイルはそれを包含するプロジェクト全体のオーケストレーション規律である。

---

## オーケストレーション規律（再発防止ルール）

### 背景
過去セッションで、UI実装・検証・コミットを全てメインエージェントが直接実行し、`visual-engineering` カテゴリや `playwright` / `git-master` スキルへの委譲を怠った。本セクションはその再発防止を目的とする。

---

### Rule 1: 着手前の Verbalize 必須

あらゆるタスクに着手する前に、以下4点を**必ず明示的に宣言**してから動く。省略禁止。

```
[Intent]       : research / implementation / investigation / evaluation / fix / open-ended のいずれか
[Category]     : 選定した task() カテゴリ（例: visual-engineering）
[Skills]       : load_skills に載せる全スキル（空なら空である理由も明記）
[Delegation]   : self-execute / delegate / hybrid のどれか + その理由
```

宣言せずに Edit/Write/Bash を叩いた時点でルール違反とみなす。

---

### Rule 2: Visual Work は例外なく `visual-engineering`

以下のいずれかに該当する作業は、**メインエージェントが直接書かない**。必ず `task(category="visual-engineering", load_skills=["frontend-ui-ux", ...])` に委譲する。

- React/Next.js コンポーネントの新規作成・リファクタ
- CSS / Tailwind / スタイリング変更
- レイアウト・余白・アニメーション・モーダル・トランジション
- UI コンポーネントの抽出・共通化
- `frontend/src/components/**` 配下への追加・編集

**例外**: 1行のtypo修正、import文の並び替えのみ。それ以外は全て委譲。

---

### Rule 3: 検証フェーズの委譲

実ブラウザ検証・E2Eテスト実行・スクリーンショット取得は `playwright` または `dev-browser` スキル付きで委譲する。

```
task(
  load_skills=["playwright"],
  category="unspecified-low",
  prompt="..."
)
```

メインエージェントが `npx playwright` を直接叩くのは、委譲結果の最終サマリを受け取った後の確認目的に限る。

---

### Rule 4: Git 操作の委譲

コミット作成・rebase・squash・履歴調査は `git-master` スキル付きで委譲する。

```
task(
  category="quick",
  load_skills=["git-master"],
  prompt="..."
)
```

`git add` / `git commit` / `git push` をメインエージェントが直接叩いてよいのは、委譲先の指示通りに実行する場合のみ。

---

### Rule 5: 並列 Explore のデフォルト化

2ファイル以上に跨る調査、既存パターンの把握が必要な場合、**着手前に必ず** `explore` を2〜3本 background で並列起動する。

```
task(subagent_type="explore", run_in_background=true, load_skills=[], ...)
task(subagent_type="explore", run_in_background=true, load_skills=[], ...)
```

「自分で grep した方が早い」という判断は禁止（Anti-Duplication Rule準拠）。

---

### Rule 6: レビューの自動化

UI/ロジックの実装が完了したら、コミット前に `/review-work` を発火する。委譲無しで「動いたからOK」と判断しない。

---

### Rule 7: 違反検知チェックリスト

ユーザーから「オーケストレーションを使ったか？」と問われた時、以下を自己診断する：

- [ ] 着手前に Intent/Category/Skills/Delegation を verbalize したか
- [ ] UI 実装を自分で書いていないか
- [ ] 検証を自分で直接実行していないか
- [ ] Git 操作を自分で直接実行していないか
- [ ] Explore を並列で起動したか
- [ ] `/review-work` を通したか

1つでも「いいえ」があれば、**次回以降の類似タスクで改善する旨を明示的に報告**する。

---

### Rule 8: ユーザー指示との優先順位

`AGENTS.md` の既存ルール（「不明点はすぐ聞いて」等）は**対話の質に関する指示**であり、**オーケストレーション規律を免除するものではない**。両立させること。

- 不明点 → ユーザーに質問
- 実装方針確定後 → 適切なカテゴリに委譲

この2つは順序であって、代替ではない。
