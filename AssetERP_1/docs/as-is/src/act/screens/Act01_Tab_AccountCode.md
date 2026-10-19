# Act01_Tab_AccountCode

- 종류: 화면
- 메뉴: 관리회계 > 21. 회계장부 > 계정과목 관리 (#1250)
- 메뉴: 기초자료 > 40. 관리회계 > 계정코드 관리 (#1114)
- 파일: `client/vi/act/Act01_Tab_AccountCode.java`
- 함께 쓰는 클래스 4개:
  - `Act01_Lookup_PrintYn` `client/vi/act/Act01_Lookup_PrintYn.java`
  - `Act01_Lookup_CopyAdmin` `client/vi/act/Act01_Lookup_CopyAdmin.java`
  - `Act01_Edit_AccountCode` `client/vi/act/Act01_Edit_AccountCode.java`
  - `Act01_Lookup_Parent` `client/vi/act/Act01_Lookup_Parent.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys01_Lookup_Company`](../../sys/components/Sys01_Lookup_Company.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act01_AccountCode.delete` | Act01_Tab_AccountCode:293 | [`Act01_AccountCode.java:135`](../../act/services/Act01_AccountCode.md) | `UpdateDataModel(act01_account_code)` 동적 DELETE |
| `act.Act01_AccountCode.insertAdminCopy` | Act01_Lookup_CopyAdmin:283 | [`Act01_AccountCode.java:53`](../../act/services/Act01_AccountCode.md) | [`act01_account_code.insertAdminAccountCode`](../../act/sql/act01_account_code.md), [`act01_account_code.selectByAccountCode`](../../act/sql/act01_account_code.md), [`act01_account_code.selectTreeByAccountCode`](../../act/sql/act01_account_code.md), [`act01_account_code.updateAdminAccountCode`](../../act/sql/act01_account_code.md), [`act14_link.insertUpdate`](../../act/sql/act14_link.md), [`act14_link.selectByAccountCode`](../../act/sql/act14_link.md) |
| `act.Act01_AccountCode.modelUpdate` | Act01_Edit_AccountCode:332 | [`Act01_AccountCode.java:117`](../../act/services/Act01_AccountCode.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(act01_account_code)` 동적 INSERT/UPDATE → [`act01_account_code.selectById`](../../act/sql/act01_account_code.md) |
| `act.Act01_AccountCode.selectByCompanyId` | Act01_Lookup_Parent:183, Act01_Lookup_PrintYn:186, Act01_Tab_AccountCode:251 | [`Act01_AccountCode.java:29`](../../act/services/Act01_AccountCode.md) | [`act01_account_code.selectByCompanyId`](../../act/sql/act01_account_code.md) |
| `act.Act01_AccountCode.selectTreeByCompanyId` | Act01_Lookup_CopyAdmin:218 | [`Act01_AccountCode.java:46`](../../act/services/Act01_AccountCode.md) | [`act01_account_code.selectTreeByCompanyId`](../../act/sql/act01_account_code.md) |
| `act.Act01_AccountCode.update` | Act01_Lookup_PrintYn:199 | [`Act01_AccountCode.java:130`](../../act/services/Act01_AccountCode.md) | `UpdateDataModel(act01_account_code)` 동적 INSERT/UPDATE → [`act01_account_code.selectById`](../../act/sql/act01_account_code.md) |
| `act.Act14_Link.delete` | Act01_Edit_AccountCode:467 | [`Act14_Link.java:66`](../../act/services/Act14_Link.md) | `UpdateDataModel(act14_link)` 동적 DELETE |
| `act.Act14_Link.insert` | Act01_Edit_AccountCode:440 | [`Act14_Link.java:36`](../../act/services/Act14_Link.md) | [`act14_link.insert`](../../act/sql/act14_link.md) |
| `act.Act14_Link.selectByAccountCode` | Act01_Edit_AccountCode:420 | [`Act14_Link.java:24`](../../act/services/Act14_Link.md) | [`act14_link.selectByAccountCode`](../../act/sql/act14_link.md) |
| `act.Act14_Link.updateList` | Act01_Edit_AccountCode:404 | [`Act14_Link.java:54`](../../act/services/Act14_Link.md) | `UpdateDataModel(act14_link)` 동적 INSERT/UPDATE → [`act14_link.selectById`](../../act/sql/act14_link.md) |
| `sys.Sys01_Company.selectByUseYn` | Act01_Lookup_CopyAdmin:260 | [`Sys01_Company.java:103`](../../sys/services/Sys01_Company.md) | [`sys01_company.selectByUseYn`](../../sys/sql/sys01_company.md) |
| `sys.Sys09_Code.selectByKindCode` | Act01_Edit_AccountCode:101 | [`Sys09_Code.java:128`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByKindCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys99_Print.insertRdAccountCode` | Act01_Tab_AccountCode:341 | [`Sys99_Print.java:3566`](../../sys/services/Sys99_Print.md) | [`act01_account_code.selectByCompanyId`](../../act/sql/act01_account_code.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`act14_link`](../../../db/tables/act.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act01_Tab_AccountCode (`client/vi/act/Act01_Tab_AccountCode.java`, 411줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar`: 계정코드/명: {searchText} 계정속성: {attributeComboBox} 사용여부: {useYnName} {retrieveButton} {insertButton} {deleteButton} {rdButton} {rdFileDownloadForm} {copyAdminButton} {printSetButton}
- 입력·하위 화면: `searchText` TextField 빈칸="계정코드/계정과목/계정영문명", `attributeComboBox` ComboBoxField("AccountAttributeCode", "%", "전체"), `useYnName` StringComboBox, `popup` Act01_Edit_AccountCode, `lookupAdmin` Act01_Lookup_CopyAdmin, `lookupPrintSet` Act01_Lookup_PrintYn
- 그리드 `grid` (buildGrid(), 체크박스):
  - accountCode 100 "계정코드" TextCenter
  - accountName 300 "계정과목" TextArea
  - parentName 300 "상위계정과목" TextArea
  - attributeName 60 "속성" TextCenter
  - drcrName 60 "차대" TextCenter
  - slipYn 50 "전표" Boolean
  - printYn 50 "출력" Boolean
  - useYn 50 "사용" Boolean
  - fssYn 50 "금감원" Boolean
  - fssSlipYn 55 "전표(금)" Boolean
  - actionCell 50 "수정" Cell 편집:editCell
  - printSeq 100 "정렬코드" TextCenter
  - accountName2 350 "계정과목(보고서용)" TextArea
  - fssAccountName 350 "계정과목(금감원용)" TextArea
  - accountEName 350 "계정영문명" TextArea
  - content 350 "내용" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L71-111) → settings()
[E1] searchText.KeyPress [Enter] (L116) → retrieve()
[E2] retrieveButton[조회].Select (L138) → retrieve()
[E3] insertButton[생성].Select (L144) → insertRow()
[E4] deleteButton[삭제].Select (L150) → deleteRow()
       └ [E8] msgBox.DialogHide [YES] (L286) → 서비스 act.Act01_AccountCode.delete
[E5] copyAdminButton[계정과목복사].Select (L156) → adminLookup()
[E6] rdButton[엑셀다운로드].Select (L162) → createRdExcel()
[E7] printSetButton[출력정보 및 사용여부 설정].Select (L168) → lookupPrintSet()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L215-260 | E1,E2,buildGrid,insertRow | 서비스 act.Act01_AccountCode.selectByCompanyId(companyId, searchText, useYn, attributeCode), 건수 표시 | 업무 |
| public update() | L263-265 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L268-276 | E3 | 팝업 Act01_Edit_AccountCode 열기 | 업무 |
| public deleteRow() | L279-304 | E4 | 미선택 시 alert "계정코드를 선택해주세요" → 확인창 E8 | 업무 |
| private adminLookup() | L306-309 | E5 | 조회창 Act01_Lookup_CopyAdmin 열기 | 업무 |
| private createRdExcel() | L311-391 | E6 | 서비스 sys.Sys99_Print.insertRdAccountCode(companyId, personId, windowClassName, searchText, useYn, attributeCode) | 업무 |
| private lookupPrintSet() | L393-406 | E7 | 조회창 Act01_Lookup_PrintYn 열기 | 업무 |
| private settings() | L113-174 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L176-212 | 필드 초기화 | 팝업 Act01_Edit_AccountCode 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L408-410 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('accountCd', 100, '계정코드'),  // L194
  gb.textArea('accountNm', 300, '계정과목'),  // L195
  gb.textArea('parentNm', 300, '상위계정과목'),  // L196 SQL 계산 컬럼(selectByCompanyId: (SELECT act01_account_cd || ' ' ||CASE …)
  gb.textCenter('attributeNm', 60, '속성'),  // L197 SQL 계산 컬럼(selectByCompanyId: f_cdnm('AccountAttributeCode', a.act01_…)
  gb.textCenter('drcrNm', 60, '차대'),  // L198 SQL 계산 컬럼(selectByCompanyId: f_cdnm('DrcrType', a.act01_drcr_type, a…)
  gb.boolean('slipYn', 50, '전표'),  // L199
  gb.boolean('printYn', 50, '출력'),  // L200
  gb.boolean('useYn', 50, '사용'),  // L201
  gb.boolean('fssYn', 50, '금감원'),  // L202
  gb.boolean('fssSlipYn', 55, '전표(금)'),  // L203
  // ⚠ 대응 없음 (GridBuilder L204) addCell
  gb.textCenter('printSeq', 100, '정렬코드'),  // L205
  gb.textArea('accountNm2', 350, '계정과목(보고서용)'),  // L206
  gb.textArea('fssAccountNm', 350, '계정과목(금감원용)'),  // L207
  gb.textArea('accountEnm', 350, '계정영문명'),  // L208
  gb.textArea('content', 350, '내용'),  // L209
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="generate" onClick={insertRow}>생성</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>
5. <Button type="change" onClick={adminLookup}>계정과목복사</Button>
6. <Button type="save" onClick={lookupPrintSet}>출력정보 및 사용여부 설정</Button>

### Act01_Lookup_PrintYn (`client/vi/act/Act01_Lookup_PrintYn.java`, 241줄)

- 툴바 `buttonBar`: 계정코드/명: {searchText} 계정속성: {attributeComboBox} 사용여부: {useYnName} {retrieveButton} {updateButton} {initButton}
- 입력·하위 화면: `searchText` TextField 빈칸="계정코드/계정과목", `useYnName` StringComboBox, `attributeComboBox` ComboBoxField("AccountAttributeCode", "%", "전체")
- 그리드 `grid` (buildGrid()):
  - attributeName 70 "속성" TextCenter
  - accountCode 100 "계정코드" TextCenter
  - accountName2 480 "계정과목(보고서용)" TextArea 편집:"456EA6"
  - printYn 80 "출력여부" Boolean 편집:"456EA6"
  - useYn 80 "사용여부" Boolean 편집:"456EA6"

#### 이벤트
[E0] 화면 열림 (생성자 L56-62) → 초기화
[E1] searchText.KeyPress [Enter] (L87) → retrieve()
[E2] retrieveButton[조회].Select (L96) → retrieve()
[E3] updateButton[저장].Select (L102) → update()
[E4] initButton[조건 초기화].Select (L108) → init()
[E5] cancleButton[닫기].Select (L114) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L64-84 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L167-195 | E1,E2,setParam | 서비스 act.Act01_AccountCode.selectByCompanyId(companyId, searchText, useYn, attributeCode), 건수 표시 | 업무 |
| private update() | L197-211 | E3 | 서비스 act.Act01_AccountCode.update | 업무 |
| private init() | L213-217 | E4 | 상태 처리 | 업무 |
| private setParam() | L219-232 | settings | 상태 처리 | 업무 |
| private settings() | L86-152 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L154-165 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L234-236 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L238-240 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('attributeNm', 70, '속성'),  // L158 SQL 계산 컬럼(selectByCompanyId: f_cdnm('AccountAttributeCode', a.act01_…)
  gb.textCenter('accountCd', 100, '계정코드'),  // L159
  gb.textArea('accountNm2', 480, '계정과목(보고서용)', { editor: 'text' }),  // L160
  gb.boolean('printYn', 80, '출력여부'),  // L161
  gb.boolean('useYn', 80, '사용여부'),  // L162
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="reset" onClick={init}>조건 초기화</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Act01_Lookup_CopyAdmin (`client/vi/act/Act01_Lookup_CopyAdmin.java`, 348줄)

- 레이아웃: west=vlcL, center=vlcR
- 툴바 `buttonBarL`: 기준고객사: {stdCompanyField} {retrieveButton} 계정과목: {searchText} {searchButton}
- 툴바 `buttonBarR`: {updateButton}
- 입력·하위 화면: `searchText` TextField, `stdCompanyField` LookupTriggerField, `lookupCompany` Sys01_Lookup_Company
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - companyName 200 "고객사" Text
  - locationName 100 " " Text
- 그리드 `treeGrid` (buildTreeGrid(), 트리):
  - accountCode 100 "계정코드" TextCenter
  - accountName2 500 "계정과목" Text
  - slipYn 80 "전표생성" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L67-73) → 초기화
[E1] stdCompanyField.TriggerClick [result == null] (L135) → 인라인 L135-153 (new TriggerClickHandler() { @Override…)
[E2] searchText.KeyPress [Enter] (L156) → search()
[E3] searchButton[찾기].Select (L165) → search()
[E4] retrieveButton[조회].Select (L171) → retrieve()
[E5] updateButton[계정과목복사].Select (L177) → update()
[E6] closeButton[닫기].Select (L183) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L75-124 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L126-189 | open | 조회창 Sys01_Lookup_Company 열기 | 업무 |
| package buildTreeGrid() | L200-208 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L210-246 | E4,open | 서비스 act.Act01_AccountCode.selectTreeByCompanyId(companyId) | 업무 |
| private addChild() | L248-256 | retrieve | 상태 처리 | 업무 |
| private retrieveCompany() | L258-261 | open | 서비스 sys.Sys01_Company.selectByUseYn | 업무 |
| private update() | L263-300 | E5 | 미선택 시 alert "계정과목을 선택해주세요", 서비스 act.Act01_AccountCode.insertAdminCopy(stdCompanyId, accountCode) | 업무 |
| private search() | L302-338 | E2,E3 | 상태 처리 | 업무 |
| private buildGrid() | L191-198 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L340-342 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L344-346 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 200, '고객사'),  // L195
  gb.text('locNm', 100, ' '),  // L196
];

const buildTreeGrid = () => [
  gb.textCenter('accountCd', 100, '계정코드'),  // L203
  gb.text('accountNm2', 500, '계정과목'),  // L204
  gb.boolean('slipYn', 80, '전표생성'),  // L205
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>
2. <Button type="search" onClick={retrieve}>조회</Button>
3. <Button type="search" onClick={search}>찾기</Button>
4. <Button type="change" onClick={update}>계정과목복사</Button>

### Act01_Edit_AccountCode (`client/vi/act/Act01_Edit_AccountCode.java`, 492줄)

- 입력·하위 화면: `accountCode` TextField, `accountName` TextField, `accountName2` TextField, `accountEName` TextField, `attributeCode` TextField, `drcrType` TextField, `printSeq` TextField, `content` MyTextArea, `useYn` CheckBox, `slipYn` CheckBox, `printYn` CheckBox, `fssYn` CheckBox, `fssAccountName` TextField, `fssSlipYn` CheckBox, `attributeName` ComboBoxField("AccountAttributeCode") 빈칸="선택", `drcrName` ComboBoxField("DrcrType") 빈칸="선택", `parentName` LookupTriggerField, `parentCode` TextField, `providePurName` ComboBoxField("ProvidePurCode") 빈칸="목적", `provideContentName` CommonComboBoxField("sys.Sys09_Code.selectByKindCode") 빈칸="내용", `popup` Act01_Lookup_Parent
- 그리드 `linkGrid` (buildGrid(), 체크박스(다중)):
  - provideName 405 "이익제공(수령) 목적-내용" Text
  - actionCell 30 "" CellNotSort 편집:upButton
  - actionCell 30 "" CellNotSort 편집:downButton

#### 이벤트
[E0] 화면 열림 (생성자 L134-160) → setting(), show()
[E1] updateButton[저장].Select (L143) → update()
[E2] closeButton[닫기].Select (L149) → hide()
[E3] attributeName[계정속성].Collapse (L164) → 인라인 L164-169 (new CollapseHandler() { @Override pub…)
[E4] drcrName[차대구분].Collapse (L171) → 인라인 L171-176 (new CollapseHandler() { @Override pub…)
[E5] parentName[상위계정].TriggerClick (L178) → 인라인 L178-191 (new TriggerClickHandler(){ @Override …)
[E6] providePurName[ProvidePurCode].ValueChange (L195) → refreshCode()
[E7] provideInsertButton[선택].Select (L206) → insertRow()
[E8] provideDeleteButton[삭제].Select (L212) → deleteRow()
       └ [E9] msgBox.DialogHide [YES] (L460) → 서비스 act.Act14_Link.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L113-122 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L124-132 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L162-221 | 생성자 | 조회창 Act01_Lookup_Parent 열기 | 업무 |
| private refreshCode() | L223-230 | E6 | 서비스 sys.Sys09_Code.selectByKindCode | 업무 |
| private getEditor() | L232-310 | insert,edit | 상태 처리 | 업무 |
| public update() | L312-342 | E1 | 서비스 act.Act01_AccountCode.modelUpdate | 업무 |
| public changeRow() | L366-385 | buildGrid | 상태 처리 | 업무 |
| public getSeq() | L387-414 | changeRow | 서비스 act.Act14_Link.updateList(updateList) | 업무 |
| private retrieveLink() | L416-421 | edit,insertRow | 서비스 act.Act14_Link.selectByAccountCode(companyId, accountCode), 건수 표시 | 업무 |
| private insertRow() | L423-450 | E7 | 서비스 act.Act14_Link.insert | 업무 |
| private deleteRow() | L452-478 | E8 | ConfirmBox → E9 | 업무 |
| private buildGrid() | L344-364 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlStyle() | L480-482 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L484-486 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L488-490 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('provideNm', 405, '이익제공(수령) 목적-내용'),  // L360 SQL 계산 컬럼(selectByAccountCode: f_cdnm('ProvidePurCode' , SUBSTR(act14_…)
  // ⚠ 대응 없음 (GridBuilder L361) addCellNotSort
  // ⚠ 대응 없음 (GridBuilder L362) addCellNotSort
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="select" onClick={insertRow}>선택</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Act01_Lookup_Parent (`client/vi/act/Act01_Lookup_Parent.java`, 220줄)

- 툴바 `buttonBar`: 계정코드/명: {searchText} 계정속성: {attributeComboBox} 사용여부: {useYnName} {retrieveButton}
- 입력·하위 화면: `searchText` TextField, `attributeComboBox` ComboBoxField("AccountAttributeCode", "%", "전체") 빈칸="전체", `useYnName` StringComboBox
- 그리드 `grid` (buildGrid(), 체크박스):
  - accountCode 100 "계정코드" TextCenter
  - accountName 310 "계정과목" TextArea
  - accountName2 310 "계정과목(보고서용)" TextArea

#### 이벤트
[E1] grid.CellDoubleClick (L84) → confirm()
[E2] searchText.KeyPress [Enter] (L107) → retrieve()
[E3] retrieveButton[조회].Select (L116) → retrieve()
[E4] oKButton[확인].Select (L123) → confirm()
[E5] cancelButton[취소].Select (L129) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-92 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L149-189 | E2,E3,open | 서비스 act.Act01_AccountCode.selectByCompanyId(companyId, searchText, useYn, attributeCode), 건수 표시 | 업무 |
| public confirm() | L191-199 | E1,E4 | 상태 처리 | 업무 |
| public getServiceResult() | L202-210 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L94-135 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L137-147 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L212-214 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L216-218 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('accountCd', 100, '계정코드'),  // L142
  gb.textArea('accountNm', 310, '계정과목'),  // L143
  gb.textArea('accountNm2', 310, '계정과목(보고서용)'),  // L144
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

