# Ics01_Tab_PeriodList

- 종류: 화면
- 메뉴: 준법감시 > 00. 법규정보 > 월별 법규조회 (#1255)
- 파일: `client/vi/ics/Ics01_Tab_PeriodList.java`
- 함께 쓰는 클래스 2개:
  - `Ics01_Lookup_IcsFile` `client/vi/ics/Ics01_Lookup_IcsFile.java`
  - `Ics01_Lookup_IcsFileAdmin` `client/vi/ics/Ics01_Lookup_IcsFileAdmin.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ics01_Lookup_CheckList`](../../ics/components/Ics01_Lookup_CheckList.md), [`Ics01_Lookup_ClassTreeDetail`](../../ics/components/Ics01_Lookup_ClassTreeDetail.md), [`IcsComboBoxField`](../../ics/components/IcsComboBoxField.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics01_ClassTree.selectByPeriod` | Ics01_Tab_PeriodList:308 | [`Ics01_ClassTree.java:216`](../../ics/services/Ics01_ClassTree.md) | [`ics01_class_tree.selectByPeriod`](../../ics/sql/ics01_class_tree.md) |
| `sys.Sys10_File.getIcsFile` | Ics01_Lookup_IcsFileAdmin:157 | [`Sys10_File.java:81`](../../sys/services/Sys10_File.md) | [`sys10_file.getIcsFile`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.delete` | Ics01_Lookup_IcsFile:179 | [`Sys11_RelateFile.java:199`](../../sys/services/Sys11_RelateFile.md) | `UpdateDataModel(sys11_relate_file)` 동적 DELETE |
| `sys.Sys11_RelateFile.insert` | Ics01_Lookup_IcsFile:213 | [`Sys11_RelateFile.java:143`](../../sys/services/Sys11_RelateFile.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys11_relate_file.insert`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.insertCheck`](../../sys/sql/sys11_relate_file.md) |
| `sys.Sys11_RelateFile.selectByParentId` | Ics01_Lookup_IcsFile:197 | [`Sys11_RelateFile.java:33`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.selectByParentId`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`ics03_company_info`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_biz_date`, `f_get_deadline_nm`, `f_get_ics_nm`, `f_get_std_date`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics01_Tab_PeriodList (`client/vi/ics/Ics01_Tab_PeriodList.java`, 349줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar01`: 조회월: {year} {monthComboBox} {startDate} {closeDate} 대분류: {level1Name} 중분류: {level2Name} {advisCheckBox}
- 툴바 `buttonBar02`: 주기구분: {LawPublicComBox} {cycleComboBox} {exceptDailyCheckBox} 검색: {searchText} {searchButton}
- 입력·하위 화면: `cycleComboBox` ComboBoxField("CycleCode", "%", "전체"), `LawPublicComBox` ComboBoxField("LawPublicType", "%", "전체"), `exceptDailyCheckBox` CheckBox, `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="대분류/중분류/업무명/제출처/관련조문", `level1Name` IcsComboBoxField, `level2Name` LookupTriggerField, `advisCheckBox` CheckBox, `year` TextField, `monthComboBox` ComboBoxField("MonthsCode", "yyyy", "MM", "월"), `lookupDetail` Ics01_Lookup_ClassTreeDetail, `lookupCheckList` Ics01_Lookup_CheckList, `lookupFile` Ics01_Lookup_IcsFile
- 그리드 `grid` (buildGrid()):
  - closeDate 120 "처리기한" Date
  - level1Name 150 "대분류" Text
  - level2Name 200 "중분류" Text
  - classTreeNameAddAppr 500 "법규명" TextAreaHtml
  - actionCell 80 "상세보기" Cell 편집:detailCell
  - submitTo 200 "제출처" TextArea
  - cycleName 100 "주기" Text
  - relatedLaw 200 "관련조문" TextArea
  - fileCount 80 "서식파일" TextCenter
  - actionCell 40 "" Cell 편집:actionCell
  - advisYn 60 "일임<br>(자문)" BooleanYn2

#### 이벤트
[E0] 화면 열림 (생성자 L71-119) → settings()
[E1] year.ValueChange (L139) → setDate()
[E2] monthComboBox[MonthsCode].Collapse (L148) → setDate(), retrieve()
[E3] level1Name[전체].ValueChange (L159) → 인라인 L159-165 (new ValueChangeHandler<String>() { @O…)
[E4] level2Name[전체].TriggerClick (L171) → lookupIcsCode()
[E5] searchText.KeyPress [Enter] (L187) → retrieve()
[E6] searchButton[조회].Select (L202) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L61-68 | buildGrid,lookupIcsCode,retrieve,fileAddList | 상태 처리 | 업무 |
| public lookupIcsCode() | L246-261 | E4 | 조회창 Ics01_Lookup_CheckList 열기 | 업무 |
| public retrieve() | L263-314 | E2,E5,E6 | 서비스 ics.Ics01_ClassTree.selectByPeriod(companyId, searchText, orgId, personId, startDate, closeDate, level1Name, level2Name, cycleCode, lawPublicType, exceptDailyYn, advisYn) | 업무 |
| public fileAddList() | L316-323 | buildGrid | 조회창 Ics01_Lookup_IcsFile 열기 | 업무 |
| private setDate() | L325-332 | E1,E2,execute | 상태 처리 | 업무 |
| public retrieveTabPanel() | L342-344 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L121-208 | 생성자 | 이벤트 연결, 초기값: level1Name="%"("전체"), level2Name="%"("전체"), level2Name="%"("전체"), cycleComboBox="전체"("CycleCode"), LawPublicComBox="전체"("LawPublicType"), exceptDailyCheckBox=true("일별제외"), advisCheckBox=false | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L210-244 | 필드 초기화 | 조회창 Ics01_Lookup_ClassTreeDetail 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L334-336 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L338-340 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlSpace() | L346-348 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('closeDate', 120, '처리기한'),  // L231
  gb.text('level1Nm', 150, '대분류'),  // L232
  gb.text('level2Nm', 200, '중분류'),  // L233
  // ⚠ 대응 없음 (GridBuilder L234) addTextAreaHtml
  // ⚠ 대응 없음 (GridBuilder L235) addCell
  gb.textArea('submitTo', 200, '제출처'),  // L236
  gb.text('cycleNm', 100, '주기'),  // L237
  gb.textArea('relatedLaw', 200, '관련조문'),  // L238
  gb.textCenter('fileCount', 80, '서식파일'),  // L239
  // ⚠ 대응 없음 (GridBuilder L240) addCell
  gb.booleanYn2('advisYn', 60, '일임<br>(자문)'),  // L241
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Ics01_Lookup_IcsFile (`client/vi/ics/Ics01_Lookup_IcsFile.java`, 268줄)

- 입력·하위 화면: `listLookup` Ics01_Lookup_IcsFileAdmin
- 그리드 `grid` (buildApprFileGrid(), 체크박스):
  - fileName 580 "서식파일" Text
  - regDate 100 "등록일" Date
  - actionCell 80 "다운로드" Cell 편집:downloadCell
  - actionCell 80 "삭제" Cell 편집:deleteCell

#### 이벤트
[E1] okButton[닫기].Select (L94) → confirm()
[E2] listButton[불러오기].Select (L100) → listLookup()
[E3] fileUpload.Change (L115) → 인라인 L115-122 (new ChangeHandler() { @Override publi…)
[E4] fileUploadForm.SubmitComplete (L125) → resetFileUpload(), retrieve()
[E5] fileDeleteForm.SubmitComplete (L146) → retrieve()
[E6] fileUpload.Change (L243) → 인라인 L243-250 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openUser() | L60-65 | 공개 메서드 | 상태 처리 | 업무 |
| public openPeriod() | L68-78 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L80-86 | openUser | 상태 처리 | 업무 |
| public setting() | L88-158 | openPeriod,open | 상태 처리 | 업무 |
| private buildApprFileGrid() | L160-190 | 필드 초기화 | GridDeleteData sys.Sys11_RelateFile.delete(체크된 행 목록) | 업무 |
| private retrieve() | L192-203 | E4,E5,setting,listLookup | 서비스 sys.Sys11_RelateFile.selectByParentId(parentId) | 업무 |
| private listLookup() | L205-227 | E2 | 조회창 Ics01_Lookup_IcsFileAdmin 열기, 서비스 sys.Sys11_RelateFile.insert(relateId, tableName) | 업무 |
| private confirm() | L229-234 | E1 | 상태 처리 | 업무 |
| private resetFileUpload() | L236-251 | E4 | 상태 처리 | 업무 |
| public getServiceResult() | L254-262 | listLookup | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L264-266 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('fileNm', 580, '서식파일'),  // L184 SQL 계산 컬럼(selectByParentId: sys10_file_nm)
  gb.date('regDate', 100, '등록일'),  // L185 SQL 계산 컬럼(selectByParentId: sys10_reg_date)
  // ⚠ 대응 없음 (GridBuilder L186) addCell
  // ⚠ 대응 없음 (GridBuilder L187) addCell
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={listLookup}>불러오기</Button>
2. <Button type="unknown" onClick={confirm}>닫기</Button>

### Ics01_Lookup_IcsFileAdmin (`client/vi/ics/Ics01_Lookup_IcsFileAdmin.java`, 196줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="법령구분/내용/서식파일"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - regDate 100 "등록일" Date
  - lawName 150 "법령구분" Text
  - note 150 "내용" Text
  - fileName 350 "서식파일" Text
  - actionCell 80 "다운로드" Cell 편집:downloadCell

#### 이벤트
[E0] 화면 열림 (생성자 L58-87) → Settings(), show(), retrieve()
[E1] searchText.KeyPress [Enter] (L93) → retrieve()
[E2] retrieveButton[조회].Select (L103) → retrieve()
[E3] confirmButton[확인].Select (L109) → confirm()
       └ [E5] msgBox.DialogHide [YES] (L170) → hide()
[E4] closeButton[닫기].Select (L115) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L54-56 | 공개 메서드 | 상태 처리 | 업무 |
| public Settings() | L89-121 | 생성자 | 상태 처리 | 업무 |
| private retrieve() | L148-163 | 생성자,E1,E2 | 서비스 sys.Sys10_File.getIcsFile(parentId, lawType, searchText, firstRegDateYn) | 업무 |
| private confirm() | L165-187 | E3 | ConfirmBox → E5 | 업무 |
| private buildGrid() | L123-146 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L189-191 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L193-195 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '등록일'),  // L139
  gb.text('lawNm', 150, '법령구분'),  // L140 SQL 계산 컬럼(getIcsFile: f_cdnm('LawType', sys10_law_type, 0, f_…)
  gb.text('note', 150, '내용'),  // L141
  gb.text('fileNm', 350, '서식파일'),  // L142
  // ⚠ 대응 없음 (GridBuilder L143) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

