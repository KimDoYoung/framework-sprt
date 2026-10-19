# Apr06_Tab_ApprStepRule

- 종류: 화면
- 파일: `client/vi/apr/Apr06_Tab_ApprStepRule.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr06_ApprStepRule.delete` | Apr06_Tab_ApprStepRule:152 | **(없음)** | - |
| `apr.Apr06_ApprStepRule.selectByCompanyId` | Apr06_Tab_ApprStepRule:121 | [`Apr06_ApprStepRule.java:36`](../../apr/services/Apr06_ApprStepRule.md) | [`apr06_appr_step_rule.selectByCompanyId`](../../apr/sql/apr06_appr_step_rule.md) |
| `apr.Apr06_ApprStepRule.update` | Apr06_Tab_ApprStepRule:146 | **(없음)** | - |

## 테이블

[`apr06_appr_step_rule`](../../../db/tables/apr.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr06_Tab_ApprStepRule (`client/vi/apr/Apr06_Tab_ApprStepRule.java`, 164줄)

- 레이아웃: north=buttonBar01, center=getCenterLayout()
- 툴바 `buttonBar01`: {label01} {deleteButton} {insertRowButton} {saveButton}
- 그리드 `grid` (buildGrid(), 체크박스):
  - apprStepRuleCode 80 "상신단계코드" Text 편집:TextField
  - apprStepRuleName 250 "상신단계명" Text 편집:TextField
  - apprLine01 100 "상신내용1" Text 편집:TextField
  - apprLine02 100 "상신내용2" Text 편집:TextField
  - apprLine03 100 "상신내용3" Text 편집:TextField
  - apprLine04 100 "상신내용4" Text 편집:TextField
  - apprLine05 100 "상신내용5" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L46-49) → makeLayout(), setInitData()
[E1] deleteButton[삭제].Select (L53) → delete()
[E2] insertRowButton[등록].Select (L59) → insertRow()
[E3] saveButton[저장].Select (L65) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getCenterLayout() | L103-116 | makeLayout | 상태 처리 | 업무 |
| private setInitData() | L118-122 | 생성자 | 서비스 apr.Apr06_ApprStepRule.selectByCompanyId(companyId) | 업무 |
| private insertRow() | L124-132 | E2 | 상태 처리 | 업무 |
| private update() | L134-147 | E3 | 서비스 apr.Apr06_ApprStepRule.update | 업무 |
| private delete() | L149-153 | E1 | GridDeleteData apr.Apr06_ApprStepRule.delete(체크된 행 목록) | 업무 |
| public getServiceResult() | L156-159 | 공개 메서드 | 상태 처리 | 업무 |
| private makeLayout() | L51-84 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L86-101 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L161-163 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('apprStepRuleCd', 80, '상신단계코드', { editor: 'text' }),  // L92
  gb.text('apprStepRuleNm', 250, '상신단계명', { editor: 'text' }),  // L93
  gb.text('apprLine01', 100, '상신내용1', { editor: 'text' }),  // L94
  gb.text('apprLine02', 100, '상신내용2', { editor: 'text' }),  // L95
  gb.text('apprLine03', 100, '상신내용3', { editor: 'text' }),  // L96
  gb.text('apprLine04', 100, '상신내용4', { editor: 'text' }),  // L97
  gb.text('apprLine05', 100, '상신내용5', { editor: 'text' }),  // L98
];
```

#### 사용된 버튼들
1. <Button type="delete" onClick={delete}>삭제</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>

