# Opr01_Tab_Create

- 종류: 화면
- 파일: `client/vi/opr/Opr01_Tab_Create.java`
- 함께 쓰는 클래스 2개:
  - `Opr03_Tabpage_Reg` `client/vi/opr/Opr03_Tabpage_Reg.java`
  - `Opr02_Tabpage_Fund` `client/vi/opr/Opr02_Tabpage_Fund.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `opr.Opr01_Create.delete` | Opr01_Tab_Create:227 | [`Opr01_Create.java:259`](../../opr/services/Opr01_Create.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr03_relate_fund.deleteByApprId`](../../apr/sql/apr03_relate_fund.md), [`apr04_appr_step.deleteByApprId`](../../apr/sql/apr04_appr_step.md), [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), `UpdateDataModel(opr01_create)` 동적 DELETE |
| `opr.Opr01_Create.selectByTitle1` | Opr01_Tab_Create:143 | [`Opr01_Create.java:69`](../../opr/services/Opr01_Create.md) | [`opr01_create.selectByTitle1`](../../opr/sql/opr01_create.md) |
| `opr.Opr01_Create.update` | Opr01_Tab_Create:163 | [`Opr01_Create.java:254`](../../opr/services/Opr01_Create.md) | `UpdateDataModel(opr01_create)` 동적 INSERT/UPDATE → [`opr01_create.selectById`](../../opr/sql/opr01_create.md) |
| `opr.Opr02_Fund.selectByCreateId` | Opr02_Tabpage_Fund:62 | [`Opr02_Fund.java:25`](../../opr/services/Opr02_Fund.md) | [`opr02_fund.selectByCreateId`](../../opr/sql/opr02_fund.md) |
| `opr.Opr03_Reg.delete` | Opr03_Tabpage_Reg:328 | [`Opr03_Reg.java:95`](../../opr/services/Opr03_Reg.md) | `UpdateDataModel(opr03_reg)` 동적 DELETE |
| `opr.Opr03_Reg.selectByCreateId` | Opr03_Tabpage_Reg:264 | [`Opr03_Reg.java:23`](../../opr/services/Opr03_Reg.md) | [`opr03_reg.selectByCreateId`](../../opr/sql/opr03_reg.md) |
| `opr.Opr03_Reg.selectOnePreCancelCheck` | Opr03_Tabpage_Reg:198 | [`Opr03_Reg.java:69`](../../opr/services/Opr03_Reg.md) | [`opr03_reg.selectOnePreCancelCheck`](../../opr/sql/opr03_reg.md) |
| `opr.Opr03_Reg.update` | Opr03_Tabpage_Reg:280 | [`Opr03_Reg.java:90`](../../opr/services/Opr03_Reg.md) | `UpdateDataModel(opr03_reg)` 동적 INSERT/UPDATE → [`opr03_reg.selectById`](../../opr/sql/opr03_reg.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`emp00_trans_info`](../../../db/views.md), [`fnd00_fund`](../../../db/views.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`opr01_create`](../../../db/tables/opr.md), [`opr02_fund`](../../../db/tables/opr.md), [`opr03_reg`](../../../db/tables/opr.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_max_workdate`, `f_org_nm`, `f_sysdate`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Opr01_Tab_Create (`client/vi/opr/Opr01_Tab_Create.java`, 248줄)

- 레이아웃: north=vlc, west=fundGrid, center=regGrid
- 입력·하위 화면: `searchYear` TextField, `searchTitle` TextField, `termCdComboBox` ComboBoxField("TermCodeOpr", "%", "전체"), `progressCheckBox` CheckBox, `closeCheckBox` CheckBox
- 그리드 `grid` (buildGrid(), 체크박스):
  - title 200 "제목" Text
  - year 50 "년도" Text
  - termNm 100 "기간구분" Text
  - startDate 100 "시작일" Date
  - dueDate 100 "완료예정일" Date
  - korName 100 "담당자" Text
  - orgName 100 "부서" Text
  - closeDate 100 "등록완료일" Date
  - note 300 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L51-53) → open()
[E1] searchYear[년도].EnterKey [Enter] (L62) → retrieve()
[E2] searchTitle[제목].EnterKey [Enter] (L65) → retrieve()
[E3] searchBarBuilder[조회].Retrieve (L75) → retrieve()
[E4] grid.RowClick (L81) → retrievePage()
[E5] msgBox.DialogHide [YES] (L220) → 서비스 opr.Opr01_Create.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L55-109 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L132-153 | E1,E2,E3,open | 서비스 opr.Opr01_Create.selectByTitle1(companyId, empId, year, termCd, title, progressYn, closeYn) | 업무 |
| public update() | L156-164 | 공개 메서드 | 서비스 opr.Opr01_Create.update | 업무 |
| private chkPreUpdate() | L166-195 | update | 상태 처리 | 업무 |
| public insertRow() | L198-213 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L216-237 | 공개 메서드 | 확인창 표시, GridDeleteData opr.Opr01_Create.delete(체크된 행 목록) | 업무 |
| protected retrievePage() | L239-246 | E4,retrieve | 상태 처리 | 업무 |
| private buildGrid() | L111-129 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('title', 200, '제목'),  // L117
  gb.text('year', 50, '년도'),  // L118
  gb.text('termNm', 100, '기간구분'),  // L119 SQL 계산 컬럼(selectByTitle1: f_cdnm('TermCodeOpr', a.opr01_term_cd, …)
  gb.date('startDate', 100, '시작일'),  // L120
  gb.date('dueDate', 100, '완료예정일'),  // L121
  gb.text('korNm', 100, '담당자'),  // L122
  // ⚠DB없음 L124 orgName 100 "부서" (opr01_org_name 컬럼 없음)
  gb.date('closeDate', 100, '등록완료일'),  // L125
  gb.text('note', 300, '비고'),  // L126
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Opr03_Tabpage_Reg (`client/vi/opr/Opr03_Tabpage_Reg.java`, 347줄)

- 그리드 `grid` (buildGrid(), 체크박스):
  - seq 50 "순서" Text
  - korName 100 "담당자" Text
  - posName 50 "직위" Text
  - orgName 150 "부서" Text
  - docNm 250 "운용보고서 첨부파일" Text
  - actionCellUp 80 "파일등록" Cell 편집:fileUpButton
  - actionCellDown 80 "파일받기" Cell 편집:fileDownButton
  - regDate 100 "등록일" Date 편집:MyDateField
  - closeYnNm 80 "완료여부" Text
  - note 300 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L58-87) → setGrid()
[E1] searchBarBuilder[저장].Update (L65) → update()
[E2] okeyButton[작성완료 확정].Select (L67) → okey()
[E3] cancelButton[작성완료 취소].Select (L76) → cancel()
[E4] fileUpdownForm.Change (L97) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setGrid() | L89-120 | 생성자 | 상태 처리 | 업무 |
| private okey() | L154-178 | E2 | 상태 처리 | 업무 |
| private cancel() | L180-207 | E3 | 서비스 opr.Opr03_Reg.selectOnePreCancelCheck | 업무 |
| private upLoad() | L209-236 | buildGrid | 미선택 시 alert "전 작성자 작성완료 후 보고서 업로드가 가능합니다" | 업무 |
| private downLoad() | L238-254 | buildGrid | 미선택 시 alert "작성완료된 보고서만 확인 가능합니다" | 업무 |
| public retrieve() | L256-265 | 공개 메서드 | 서비스 opr.Opr03_Reg.selectByCreateId(companyId, createId, empId) | 업무 |
| public retrieve() | L268-270 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L273-282 | E1,E4,okey,getServiceResult | 서비스 opr.Opr03_Reg.update | 업무 |
| private chkPreUpdate() | L284-305 | update | 상태 처리 | 업무 |
| public insertRow() | L308-320 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L323-329 | 공개 메서드 | GridDeleteData opr.Opr03_Reg.delete(체크된 행 목록) | 업무 |
| public getServiceResult() | L332-341 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid() | L122-152 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L343-345 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('seq', 50, '순서'),  // L140
  gb.text('korNm', 100, '담당자'),  // L141
  gb.text('posNm', 50, '직위'),  // L142
  // ⚠DB없음 L143 orgName 150 "부서" (sys10_org_name 컬럼 없음)
  gb.text('docNm', 250, '운용보고서 첨부파일'),  // L144
  // ⚠ 대응 없음 (GridBuilder L145) addCell
  // ⚠ 대응 없음 (GridBuilder L146) addCell
  gb.date('regDate', 100, '등록일', { editor: 'date' }),  // L147
  // ⚠DB없음 L148 closeYnNm 80 "완료여부" (sys10_close_yn_nm 컬럼 없음)
  gb.text('note', 300, '비고', { editor: 'text' }),  // L149
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={okey}>작성완료 확정</Button>
2. <Button type="unknown" onClick={cancel}>작성완료 취소</Button>
3. <Button type="save" onClick={update}>저장</Button>

### Opr02_Tabpage_Fund (`client/vi/opr/Opr02_Tabpage_Fund.java`, 88줄)

- 그리드 `grid` (buildGrid(), 체크박스):
  - fundCode 80 "펀드코드" Text
  - fundName 250 "펀드명" Text
  - fundTypeName 80 "펀드유형" Text
  - empName1 100 "운용역" Text
  - startDate 100 "설정일" Date
  - publicName 80 "공모/사모" Text
  - orgCodeName 200 "운용부서" Text

#### 이벤트
[E0] 화면 열림 (생성자 L25-34) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L54-63 | 공개 메서드 | 서비스 opr.Opr02_Fund.selectByCreateId(companyId, orgId, createId) | 업무 |
| public retrieve() | L66-68 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L71-73 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L76-78 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L81-83 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid() | L36-52 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L84-86 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fundCd', 80, '펀드코드'),  // L42
  gb.text('fundNm', 250, '펀드명'),  // L43
  gb.text('fundTypeNm', 80, '펀드유형'),  // L44
  gb.text('emp1Nm', 100, '운용역'),  // L45
  gb.date('startDate', 100, '설정일'),  // L46
  gb.text('publicNm', 80, '공모/사모'),  // L47
  gb.text('orgCodeNm', 200, '운용부서'),  // L48
];
```

#### 사용된 버튼들
버튼 사용하지 않음

