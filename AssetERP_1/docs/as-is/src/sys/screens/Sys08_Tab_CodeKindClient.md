# Sys08_Tab_CodeKindClient

- 종류: 화면
- 메뉴: 관리자 > 03. 코드관리 > 고객사 공통코드 (#1079)
- 메뉴: 관리자 > 09. 기타 > 공통코드 (#1248)
- 파일: `client/vi/sys/Sys08_Tab_CodeKindClient.java`
- 함께 쓰는 클래스 1개:
  - `Sys09_Grid_Code` `client/vi/sys/Sys09_Grid_Code.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys01_Lookup_SelectMulti`](../../sys/components/Sys01_Lookup_SelectMulti.md), [`Sys01_Lookup_SelectSingle`](../../sys/components/Sys01_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys08_CodeKind.delete` | Sys08_Tab_CodeKindClient:213 | [`Sys08_CodeKind.java:65`](../../sys/services/Sys08_CodeKind.md) | `UpdateDataModel(sys08_code_kind)` 동적 DELETE |
| `sys.Sys08_CodeKind.selectByKindName` | Sys08_Tab_CodeKindClient:183 | [`Sys08_CodeKind.java:22`](../../sys/services/Sys08_CodeKind.md) | [`sys08_code_kind.selectByKindName`](../../sys/sql/sys08_code_kind.md) |
| `sys.Sys08_CodeKind.update` | Sys08_Tab_CodeKindClient:189 | [`Sys08_CodeKind.java:60`](../../sys/services/Sys08_CodeKind.md) | `UpdateDataModel(sys08_code_kind)` 동적 INSERT/UPDATE → [`sys08_code_kind.selectById`](../../sys/sql/sys08_code_kind.md) |
| `sys.Sys09_Code.codeInsert` | Sys08_Tab_CodeKindClient:266 | [`Sys09_Code.java:276`](../../sys/services/Sys09_Code.md) | [`sys09_code.codeInsert`](../../sys/sql/sys09_code.md) |
| `sys.Sys09_Code.delete` | Sys09_Grid_Code:204 | [`Sys09_Code.java:391`](../../sys/services/Sys09_Code.md) | `UpdateDataModel(sys09_code)` 동적 DELETE |
| `sys.Sys09_Code.selectByCodeKindId` | Sys09_Grid_Code:166 | [`Sys09_Code.java:32`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByCodeKindId`](../../sys/sql/sys09_code.md) |
| `sys.Sys09_Code.update` | Sys09_Grid_Code:190 | [`Sys09_Code.java:386`](../../sys/services/Sys09_Code.md) | `UpdateDataModel(sys09_code)` 동적 INSERT/UPDATE → [`sys09_code.selectById`](../../sys/sql/sys09_code.md) |

## 테이블

[`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`tdm11_task_relate_rule`](../../../db/tables/tdm.md)

## DB 함수

`f_create_seq`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys08_Tab_CodeKindClient (`client/vi/sys/Sys08_Tab_CodeKindClient.java`, 285줄)

- 레이아웃: west=cp, center=gridCode
- 툴바 `buttonBar`: 회사명: {companyName} 코드구분명: {codeKindName} {retrieveButton} {codeCopyButton}
- 입력·하위 화면: `codeKindName` TextField, `companyName` LookupTriggerField, `lookup` Sys01_Lookup_SelectSingle
- 그리드 `grid` (buildGrid()):
  - kindCode 150 "구분코드" Text
  - kindName 180 "코드구분" Text
  - sysYnFlag 60 "시스템" Boolean
  - note 300 "상세설명" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L60-164) → retrieve()
[E1] retrieveButton[조회].Select (L67) → retrieve()
[E2] codeCopyButton[코드복사].Select (L73) → copyChk()
       └ [E7] msgBox.DialogHide [YES] (L244) → codeCopy()
[E3] companyName[ADMIN].TriggerClick [result != null] (L83) → 인라인 L83-102 (new TriggerClickHandler(){ @Override …)
[E4] codeKindName.KeyPress [Enter] (L115) → retrieve()
[E5] grid.SelectionChanged (L155) → 인라인 L155-161 (new SelectionChangedHandler<Sys08_Cod…)
[E6] msgBox.DialogHide [YES] (L208) → 서비스 sys.Sys08_CodeKind.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L179-184 | 생성자,E1,E4 | 서비스 sys.Sys08_CodeKind.selectByKindName(kindName, sysYn) | 업무 |
| public update() | L187-190 | 공개 메서드 | 서비스 sys.Sys08_CodeKind.update | 업무 |
| public insertRow() | L193-199 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L202-223 | 공개 메서드 | 확인창 표시, GridDeleteData sys.Sys08_CodeKind.delete(체크된 행 목록) | 업무 |
| private copyChk() | L225-263 | E2 | 조회창 Sys01_Lookup_SelectMulti 열기, ConfirmBox → E7 | 업무 |
| private codeCopy() | L265-280 | E7 | 서비스 sys.Sys09_Code.codeInsert(companyId, companyList, codeKindId) | 업무 |
| private buildGrid() | L166-176 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L282-284 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('kindCd', 150, '구분코드'),  // L171
  gb.text('kindNm', 180, '코드구분'),  // L172
  // ⚠DB없음 L173 sysYnFlag 60 "시스템" (sys08_sys_yn_flag 컬럼 없음)
  gb.textArea('note', 300, '상세설명'),  // L174
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="change" onClick={copyChk}>코드복사</Button>

### Sys09_Grid_Code (`client/vi/sys/Sys09_Grid_Code.java`, 219줄)

- 툴바 `buttonBar`: 상세코드구분명: {detailCodeKindName} {retrieveButton} {updateButton} {insertButton} {deleteButton}
- 입력·하위 화면: `detailCodeKindName` TextField
- 그리드 `grid` (buildGrid()):
  - code 60 "코드" Text 편집:"0069B4"
  - name 150 "코드명" Text 편집:"0069B4"
  - seq 80 "조회순서" Text 편집:"0069B4"
  - closeYn 60 "미사용" Boolean
  - applyDate 100 "시작일자" Date 편집:"0069B4"
  - closeDate 100 "종료일자" Date 편집:MyDateField
  - note 300 "상세설명" TextArea 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L51-99) → 초기화
[E1] detailCodeKindName.KeyPress [Enter] (L55) → retrieve()
[E2] retrieveButton[조회].Select (L63) → retrieve()
[E3] insertButton[등록].Select (L69) → insertRow()
[E4] updateButton[저장].Select (L75) → update()
[E5] deleteButton[삭제].Select (L81) → deleteRow()
       └ [E6] msgBox.DialogHide [YES] (L199) → 서비스 sys.Sys09_Code.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieveCode() | L117-143 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieveCode() | L145-157 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L159-167 | E1,E2,retrieveCode | 서비스 sys.Sys09_Code.selectByCodeKindId(codeKindId, companyId, searchText) | 업무 |
| public insertRow() | L169-186 | E3 | 상태 처리 | 업무 |
| public update() | L188-191 | E4 | 서비스 sys.Sys09_Code.update | 업무 |
| public deleteRow() | L193-214 | E5 | ConfirmBox → E6 | 업무 |
| private buildGrid() | L101-115 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L216-218 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('code', 60, '코드', { editor: 'text' }),  // L105
  gb.text('name', 150, '코드명', { editor: 'text' }),  // L106
  gb.text('seq', 80, '조회순서', { editor: 'text' }),  // L107
  gb.boolean('closeYn', 60, '미사용'),  // L108
  gb.date('applyDate', 100, '시작일자', { editor: 'date' }),  // L109
  gb.date('closeDate', 100, '종료일자', { editor: 'date' }),  // L110
  gb.textArea('note', 300, '상세설명', { editor: 'text' }),  // L111
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

