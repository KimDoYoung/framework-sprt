# Rpt02_Tab_MonthWrite

- 종류: 화면
- 메뉴: 커뮤니티 > 04. 업무보고 > 월간회의자료 (#1260)
- 파일: `client/vi/rpt/Rpt02_Tab_MonthWrite.java`
- 함께 쓰는 클래스 3개:
  - `Rpt02_Lookup_Rd_Month` `client/vi/rpt/Rpt02_Lookup_Rd_Month.java`
  - `Rpt02_Lookup_FileList` `client/vi/rpt/Rpt02_Lookup_FileList.java`
  - `Rpt02_Edit_MonthWrite` `client/vi/rpt/Rpt02_Edit_MonthWrite.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Org00_Lookup_SelectSingle`](../../org/components/Org00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `rpt.Rpt02_Month.delete` | Rpt02_Tab_MonthWrite:285 | [`Rpt02_Month.java:50`](../../rpt/services/Rpt02_Month.md) | `UpdateDataModel(rpt02_month)` 동적 DELETE |
| `rpt.Rpt02_Month.modelUpdate` | Rpt02_Edit_MonthWrite:184 | [`Rpt02_Month.java:32`](../../rpt/services/Rpt02_Month.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(rpt02_month)` 동적 INSERT/UPDATE → [`rpt02_month.selectById`](../../rpt/sql/rpt02_month.md) |
| `rpt.Rpt02_Month.selectByText` | Rpt02_Tab_MonthWrite:259 | [`Rpt02_Month.java:23`](../../rpt/services/Rpt02_Month.md) | [`rpt02_month.selectByText`](../../rpt/sql/rpt02_month.md) |
| `sys.Sys10_File.selectByFileYn` | Rpt02_Lookup_FileList:168 | [`Sys10_File.java:246`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByFileYn`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Rpt02_Lookup_FileList:188 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |
| `sys.Sys99_Print.insertRdMonth` | Rpt02_Tab_MonthWrite:186 | [`Sys99_Print.java:1315`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`rpt02_month.selectByText`](../../rpt/sql/rpt02_month.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`rpt02_month`](../../../db/tables/rpt.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_emp_kor_nm`, `f_get_emptrans`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Rpt02_Tab_MonthWrite (`client/vi/rpt/Rpt02_Tab_MonthWrite.java`, 315줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준년월: {yyyyText} {monthComboBox} 본부(부서): {orgField} 검색: {searchText} {retrieveButton} {insertButton} {deleteButton} {downLoadButton}
- 입력·하위 화면: `yyyyText` TextField, `monthComboBox` ComboBoxField("MonthsCode", "%", "전체"), `orgField` LookupTriggerField, `searchText` TextField 빈칸="본부(부서)/업무내용/비고", `lookupRdMonth` Rpt02_Lookup_Rd_Month, `lookup` Rpt02_Edit_MonthWrite, `lookupOrg` Org00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - orgName 150 "본부(부서)" TextCenter
  - yyyyMm 100 "기준년월" TextCenter
  - content 650 "업무내용" TextLimitArea
  - note 500 "비고" TextLimitArea
  - actionCell 80 "수정" Cell 편집:editCell
  - fileCount 80 "첨부파일" LongCenter
  - actionCell 30 " " Cell 편집:uploadCell

#### 이벤트
[E0] 화면 열림 (생성자 L76-108) → settings()
[E1] monthComboBox[MonthsCode].Collapse (L119) → retrieve()
[E2] orgField.TriggerClick (L128) → lookupOrg()
[E3] searchText.KeyPress [Enter] (L138) → retrieve()
[E4] retrieveButton[조회].Select (L146) → retrieve()
[E5] insertButton[등록].Select (L152) → insertRow()
[E6] deleteButton[삭제].Select [YES] (L158) → deleteRow()
[E7] msgBox.DialogHide [YES] (L163) → deleteRow()
[E8] downLoadButton[출력/다운로드].Select [result.getStatus() == 1] (L182) → 서비스 sys.Sys99_Print.insertRdMonth(companyId, personId, windowClassName, yyyyMm, orgCodeId, searchText)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L61-63 | buildGrid,retrieve,insertRow,lookupOrg | 상태 처리 | 업무 |
| public retrieve() | L252-265 | E1,E3,E4,execute,buildGrid,insertRow | 서비스 rpt.Rpt02_Month.selectByText(companyId, yyyyMm, orgCodeId, searchText) | 업무 |
| public insertRow() | L267-275 | E5 | 팝업 Rpt02_Edit_MonthWrite 열기 | 업무 |
| public deleteRow() | L277-286 | E6,E7 | GridDeleteData rpt.Rpt02_Month.delete(체크된 행 목록) | 업무 |
| private lookupOrg() | L288-310 | E2 | 조회창 Org00_Lookup_SelectSingle 열기 | 업무 |
| private settings() | L110-208 | 생성자 | 조회창 Rpt02_Lookup_Rd_Month 열기, 확인창 표시, 서비스 sys.Sys99_Print.insertRdMonth(companyId, personId, windowClassName, yyyyMm, orgCodeId, searchText), 이벤트 연결, 초기값: yyyyText=startYear | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L210-250 | 필드 초기화 | 팝업 Rpt02_Edit_MonthWrite 열기, 조회창 Rpt02_Lookup_FileList 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L312-314 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('orgNm', 150, '본부(부서)'),  // L241
  gb.textCenter('yyyymm', 100, '기준년월'),  // L242
  // ⚠ 대응 없음 (GridBuilder L243) addTextLimitArea
  // ⚠ 대응 없음 (GridBuilder L244) addTextLimitArea
  // ⚠ 대응 없음 (GridBuilder L245) addCell
  gb.longCenter('fileCount', 80, '첨부파일'),  // L246
  // ⚠ 대응 없음 (GridBuilder L247) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdMonth(companyId, personId, windowClassName, yyyyMm, orgCodeId, searchText) */}>출력/다운로드</Button>

### Rpt02_Lookup_Rd_Month (`client/vi/rpt/Rpt02_Lookup_Rd_Month.java`, 86줄)


#### 이벤트
[E0] 화면 열림 (생성자 L31-52) → show()
[E1] closeButton[닫기].Select (L41) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L54-80 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L82-84 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Rpt02_Lookup_FileList (`client/vi/rpt/Rpt02_Lookup_FileList.java`, 249줄)

- 툴바 `buttonBar`: {updateButton}
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - fileName 520 "첨부파일" TextNotSort
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:deleteCell

#### 이벤트
[E1] fileUpload.Change (L72) → 인라인 L72-79 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L81) → resetFileUpload(), retrieve()
[E3] fileDeleteForm.SubmitComplete (L93) → retrieve()
[E4] updateButton[파일업로드].Select (L119) → 인라인 L119-124 (new SelectHandler(){ @Override public…)
[E5] okButton[닫기].Select (L125) → confirm()
[E6] fileUpload.Change (L235) → 인라인 L235-242 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L57-116 | 공개 메서드 | 상태 처리 | 업무 |
| private buildApprFileGrid() | L133-163 | 필드 초기화 | 상태 처리 | 업무 |
| private retrieve() | L165-183 | E2,E3,open,checkFileDelete | 서비스 sys.Sys10_File.selectByFileYn(parentId) | 업무 |
| private checkFileDelete() | L185-210 | buildApprFileGrid | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| private confirm() | L212-215 | E5 | 상태 처리 | 업무 |
| public getServiceResult() | L218-226 | checkFileDelete | 상태 처리 | 업무 |
| private resetFileUpload() | L228-243 | E2 | 상태 처리 | 업무 |
| private settings() | L118-131 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L245-247 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L158) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L159) addCell
  // ⚠ 대응 없음 (GridBuilder L160) addCell
];
```

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 인라인 L119-124 (new SelectHandler(){ @Override public…) */}>파일업로드</Button>
2. <Button type="unknown" onClick={confirm}>닫기</Button>

### Rpt02_Edit_MonthWrite (`client/vi/rpt/Rpt02_Edit_MonthWrite.java`, 204줄)

- 입력·하위 화면: `content` MyTextArea, `note` MyTextArea, `yyyyText` TextField, `monthComboBox` ComboBoxField("MonthsCode")

#### 이벤트
[E0] 화면 열림 (생성자 L107-143) → settings(), show()
[E1] updateButton[저장].Select (L146) → update()
[E2] closeButton[닫기].Select (L152) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L53-72 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L74-105 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L161-195 | E1 | 서비스 rpt.Rpt02_Month.modelUpdate | 업무 |
| private settings() | L145-159 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L197-199 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L201-203 | insert,edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

