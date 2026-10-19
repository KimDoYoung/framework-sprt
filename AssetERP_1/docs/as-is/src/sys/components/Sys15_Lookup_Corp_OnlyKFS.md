# Sys15_Lookup_Corp_OnlyKFS

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `biz`
- 파일: `client/vi/sys/Sys15_Lookup_Corp_OnlyKFS.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys00_Common.selectByKindGroupCode` | Sys15_Lookup_Corp_OnlyKFS:106 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys15_Corp.delete` | Sys15_Lookup_Corp_OnlyKFS:252 | [`Sys15_Corp.java:128`](../../sys/services/Sys15_Corp.md) | [`sys15_corp.checkUseCorpId`](../../sys/sql/sys15_corp.md), `UpdateDataModel(sys15_corp)` 동적 DELETE |
| `sys.Sys15_Corp.selectByKFS` | Sys15_Lookup_Corp_OnlyKFS:203 | [`Sys15_Corp.java:35`](../../sys/services/Sys15_Corp.md) | [`sys15_corp.selectByKFS`](../../sys/sql/sys15_corp.md) |
| `sys.Sys15_Corp.update` | Sys15_Lookup_Corp_OnlyKFS:223 | [`Sys15_Corp.java:45`](../../sys/services/Sys15_Corp.md) | [`sys15_corp.insert`](../../sys/sql/sys15_corp.md), [`sys15_corp.selectById`](../../sys/sql/sys15_corp.md), [`sys15_corp.selectCorpCodeCheck`](../../sys/sql/sys15_corp.md), [`sys15_corp.selectNewCorpCodeByBizNo`](../../sys/sql/sys15_corp.md), [`sys15_corp.update`](../../sys/sql/sys15_corp.md) |

## 테이블

[`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys17_corp_account`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_check_use_corp_id`, `f_sysdate`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys15_Lookup_Corp_OnlyKFS (`client/vi/sys/Sys15_Lookup_Corp_OnlyKFS.java`, 287줄)

- 툴바 `buttonBar`: 구분: {corpTypeComboBox} 검색: {searchText} {useCheckBox} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `searchText` TextField 빈칸="운용사명/코드/비고", `useCheckBox` CheckBox, `corpTypeComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체", "전체")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - corpTypeName 120 "구분" TextCenter 편집:corpTypeComboBox
  - corpName 200 "운용사명" Text 편집:TextField
  - corpCode 80 "코드" TextCenter 편집:TextField
  - note 350 "비고" Text 편집:TextField
  - useYn 70 "사용" Boolean

#### 이벤트
[E1] corpTypeComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L113) → retrieve()
[E2] searchText.KeyPress [Enter] (L124) → retrieve()
[E3] retrieveButton[조회].Select (L135) → retrieve()
[E4] insertButton[등록].Select (L141) → insertRow()
[E5] updateButton[저장].Select (L147) → update()
[E6] deleteButton[삭제].Select (L153) → deleteRow()
       └ [E9] msgBox.DialogHide [YES] (L245) → 서비스 sys.Sys15_Corp.delete, 메시지 "삭제가 완료되었습니다"
[E7] closeButton[닫기].Select (L159) → hide()
[E8] corpTypeComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L177) → 인라인 L177-183 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L64-98 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L100-165 | open | 서비스 sys.Sys00_Common.selectByKindGroupCode | 업무 |
| private retrieve() | L195-209 | E1,E2,E3,setting | 서비스 sys.Sys15_Corp.selectByKFS(companyId, corpType, useYn, searchText) | 업무 |
| private insertRow() | L211-219 | E4 | 상태 처리 | 업무 |
| private update() | L221-235 | E5 | 서비스 sys.Sys15_Corp.update | 업무 |
| private deleteRow() | L237-275 | E6 | ConfirmBox → E9 | 업무 |
| private buildGrid() | L167-193 | 필드 초기화 | 서비스 sys.Sys00_Common.selectByKindGroupCode, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L277-279 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L280-282 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L283-285 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('corpTypeNm', 120, '구분', { editor: 'select' }),  // L186
  gb.text('corpNm', 200, '운용사명', { editor: 'text' }),  // L187
  gb.textCenter('corpCd', 80, '코드', { editor: 'text' }),  // L188
  gb.text('note', 350, '비고', { editor: 'text' }),  // L189
  gb.boolean('useYn', 70, '사용'),  // L190
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

