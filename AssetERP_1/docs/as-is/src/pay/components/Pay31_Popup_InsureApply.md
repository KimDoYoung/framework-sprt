# Pay31_Popup_InsureApply

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `emp`
- 파일: `client/vi/pay/Pay31_Popup_InsureApply.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `pay.Pay31_InsureApply.delete` | Pay31_Popup_InsureApply:232 | [`Pay31_InsureApply.java:373`](../../pay/services/Pay31_InsureApply.md) | `UpdateDataModel(pay31_insure_apply)` 동적 DELETE |
| `pay.Pay31_InsureApply.selectByPersonId` | Pay31_Popup_InsureApply:173 | [`Pay31_InsureApply.java:35`](../../pay/services/Pay31_InsureApply.md) | [`pay31_insure_apply.selectByPersonId`](../../pay/sql/pay31_insure_apply.md) |
| `pay.Pay31_InsureApply.update` | Pay31_Popup_InsureApply:220 | [`Pay31_InsureApply.java:368`](../../pay/services/Pay31_InsureApply.md) | `UpdateDataModel(pay31_insure_apply)` 동적 INSERT/UPDATE → [`pay31_insure_apply.selectById`](../../pay/sql/pay31_insure_apply.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Pay31_Popup_InsureApply:148 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`pay31_insure_apply`](../../../db/tables/pay.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_sysdate`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay31_Popup_InsureApply (`client/vi/pay/Pay31_Popup_InsureApply.java`, 247줄)

- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `insureCodeComboBox` ComboBoxField("InsureCode"), `insureApplyCodeComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode")
- 그리드 `grid` (buildGrid()):
  - insureName 120 "보험구분" TextCenter 편집:insureCodeComboBox
  - insureApplyName 120 "신고구분" TextCenter 편집:insureApplyCodeComb…
  - applyDate 120 "신고일" Date 편집:MyDateField
  - initDate 120 "취득일" Date 편집:MyDateField
  - applyMonth 120 "변경적용월" TextCenter 편집:TextField
  - applyMonthPay 120 "신고보수월액" Long 편집:LongField
  - note 220 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L71-95) → settings(), show()
[E1] retrieveButton[조회].Select (L98) → retrieve()
[E2] insertButton[등록].Select (L104) → insert()
[E3] updateButton[저장].Select (L110) → update()
[E4] deleteButton[삭제].Select (L116) → delete()
       └ [E8] messageBox.DialogHide [YES] (L226) → 서비스 pay.Pay31_InsureApply.delete
[E5] closeButton[닫기].Select (L122) → hide()
[E6] insureCodeComboBox[InsureCode].Collapse (L135) → 인라인 L135-141 (new CollapseHandler() { @Override pub…)
[E7] insureApplyCodeComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L149) → 인라인 L149-155 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L64-69 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L168-182 | E1,open | 서비스 pay.Pay31_InsureApply.selectByPersonId(companyId, personId) | 업무 |
| public insert() | L184-190 | E2 | 상태 처리 | 업무 |
| public update() | L192-221 | E3 | 서비스 pay.Pay31_InsureApply.update(personId) | 업무 |
| public delete() | L223-242 | E4 | ConfirmBox → E8 | 업무 |
| private settings() | L97-129 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L131-166 | 필드 초기화 | 서비스 sys.Sys00_Common.selectByKindGroupCode, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L244-246 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('insureNm', 120, '보험구분', { editor: 'select' }),  // L157 SQL 계산 컬럼(selectByPersonId: f_cdnm('InsureCode', pay31_insure_cd, p…)
  gb.textCenter('insureApplyNm', 120, '신고구분', { editor: 'select' }),  // L158 SQL 계산 컬럼(selectByPersonId: f_cdnm('InsureApplyCode', pay31_insure_…)
  gb.date('applyDate', 120, '신고일', { editor: 'date' }),  // L159
  gb.date('initDate', 120, '취득일', { editor: 'date' }),  // L160
  gb.textCenter('applyMonth', 120, '변경적용월', { editor: 'text' }),  // L161
  gb.long('applyMonthPay', 120, '신고보수월액', { editor: 'number' }),  // L162
  gb.text('note', 220, '비고', { editor: 'text' }),  // L163
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={delete}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

