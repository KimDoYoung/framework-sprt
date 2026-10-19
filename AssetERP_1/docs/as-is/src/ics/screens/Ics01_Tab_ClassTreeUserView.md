# Ics01_Tab_ClassTreeUserView

- 종류: 화면
- 메뉴: 준법감시 > 00. 법규정보 > 법규조회 (#1336)
- 파일: `client/vi/ics/Ics01_Tab_ClassTreeUserView.java`
- 함께 쓰는 클래스 5개:
  - `Ics20_Lookup_RevisionHistory` `client/vi/ics/Ics20_Lookup_RevisionHistory.java`
  - `Ics20_Lookup_File` `client/vi/ics/Ics20_Lookup_File.java`
  - `Ics20_Lookup_Content` `client/vi/ics/Ics20_Lookup_Content.java`
  - `Ics01_Lookup_IcsFile` `client/vi/ics/Ics01_Lookup_IcsFile.java`
  - `Ics01_Lookup_IcsFileAdmin` `client/vi/ics/Ics01_Lookup_IcsFileAdmin.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ics01_Lookup_Content`](../../ics/components/Ics01_Lookup_Content.md), [`Ics01_Lookup_SelectParent`](../../ics/components/Ics01_Lookup_SelectParent.md), [`Sch03_Lookup_IcsUser`](../../sch/components/Sch03_Lookup_IcsUser.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics01_ClassTree.selectByTypeCodePaging` | Ics01_Tab_ClassTreeUserView:79 | [`Ics01_ClassTree.java:96`](../../ics/services/Ics01_ClassTree.md) | [`ics01_class_tree.selectByTypeCodePaging`](../../ics/sql/ics01_class_tree.md), [`ics01_class_tree.selectByTypeCodePagingTotal`](../../ics/sql/ics01_class_tree.md) |
| `ics.Ics20_RevisionHistory.selectByClassTreeId` | Ics20_Lookup_RevisionHistory:137 | [`Ics20_RevisionHistory.java:48`](../../ics/services/Ics20_RevisionHistory.md) | [`ics20_revision_history.selectByClassTreeId`](../../ics/sql/ics20_revision_history.md) |
| `ics.Ics20_RevisionHistory.updateContent` | Ics20_Lookup_Content:85 | [`Ics20_RevisionHistory.java:60`](../../ics/services/Ics20_RevisionHistory.md) | [`ics20_revision_history.updateContent`](../../ics/sql/ics20_revision_history.md) |
| `sys.Sys10_File.getIcsFile` | Ics01_Lookup_IcsFileAdmin:157 | [`Sys10_File.java:81`](../../sys/services/Sys10_File.md) | [`sys10_file.getIcsFile`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.selectByParentId` | Ics20_Lookup_File:105 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.delete` | Ics01_Lookup_IcsFile:179 | [`Sys11_RelateFile.java:199`](../../sys/services/Sys11_RelateFile.md) | `UpdateDataModel(sys11_relate_file)` 동적 DELETE |
| `sys.Sys11_RelateFile.insert` | Ics01_Lookup_IcsFile:213 | [`Sys11_RelateFile.java:143`](../../sys/services/Sys11_RelateFile.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys11_relate_file.insert`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.insertCheck`](../../sys/sql/sys11_relate_file.md) |
| `sys.Sys11_RelateFile.selectByParentId` | Ics01_Lookup_IcsFile:197 | [`Sys11_RelateFile.java:33`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.selectByParentId`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`ics01_class_tree`](../../../db/tables/ics.md), [`ics02_manager`](../../../db/tables/ics.md), [`ics03_company_info`](../../../db/tables/ics.md), [`ics05_relate_manager`](../../../db/tables/ics.md), [`ics19_revision_relate_ics`](../../../db/tables/ics.md), [`ics20_revision_history`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`tdm45_manl_relate_ics`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_get_ics_nm`, `f_ics_class_tree_nm_allpath`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics01_Tab_ClassTreeUserView (`client/vi/ics/Ics01_Tab_ClassTreeUserView.java`, 272줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 분류: {classTreeName} 법규검색: {lawSearch} 조문검색: {statuteSearch} {retrieveButton} {detailSearchCheckBox} {advisCheckBox} {retrieveButton}
- 입력·하위 화면: `classTreeName` LookupTriggerField 빈칸="전체", `classTreeId` LongField, `detailSearchCheckBox` CheckBox, `advisCheckBox` CheckBox, `lawSearch` TextField 빈칸="법규코드/법규명", `statuteSearch` TextField 빈칸="관련조문", `lookup` Ics01_Lookup_Content, `lookupDeadline` Sch03_Lookup_IcsUser, `lookupRevisionHistory` Ics20_Lookup_RevisionHistory, `lookupFile` Ics01_Lookup_IcsFile
- 그리드 `grid` (buildGrid(), 체크박스):
  - classTreeCode 70 "법규코드" TextCenter
  - classTreeName 220 "법규명" TextArea
  - content 380 "상세내용" TextLimitArea
  - actionCell 30 " " Cell 편집:actionCell
  - submitTo 150 "제출처" TextArea
  - relatedLaw 200 "관련조문" TextArea
  - revisionCount 80 "개정이력" TextCenter
  - actionCell 30 " " Cell 편집:revisionCell
  - cycleName 100 "주기" Text
  - actionCell 30 " " Cell 편집:deadlineCell
  - fileCount 60 "서식파일" TextCenter
  - actionCell 30 " " Cell 편집:fileAddCell
  - parentTreeFullName 200 "분류" TextArea
  - advisYn 60 "일임<br>(자문)" BooleanYn2

#### 이벤트
[E0] 화면 열림 (생성자 L55-95) → settings(), retrieve()
[E1] classTreeName.TriggerClick [result == null] (L103) → 인라인 L103-121 (new TriggerClickHandler(){ @Override …)
[E2] lawSearch.KeyPress [Enter] (L124) → retrieve()
[E3] statuteSearch.KeyPress [Enter] (L134) → retrieve()
[E4] retrieveButton[조회].Select (L148) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L210-234 | 생성자,E2,E3,E4 | 상태 처리 | 업무 |
| private contentView() | L236-244 | buildGrid | 조회창 Ics01_Lookup_Content 열기 | 업무 |
| private deadlineList() | L246-249 | buildGrid | 조회창 Sch03_Lookup_IcsUser 열기 | 업무 |
| private revisionList() | L251-254 | buildGrid | 조회창 Ics20_Lookup_RevisionHistory 열기 | 업무 |
| private fileAddList() | L256-263 | buildGrid | 조회창 Ics01_Lookup_IcsFile 열기 | 업무 |
| private settings() | L97-154 | 생성자 | 조회창 Ics01_Lookup_SelectParent 열기, 이벤트 연결, 초기값: classTreeId=null, classTreeId=null, classTreeId=resultModel.getClassTreeId(, detailSearchCheckBox=false("상세내용 포함"), advisCheckBox=false | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L156-208 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L265-267 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L269-271 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('classTreeCd', 70, '법규코드'),  // L192
  gb.textArea('classTreeNm', 220, '법규명'),  // L193
  // ⚠ 대응 없음 (GridBuilder L194) addTextLimitArea
  // ⚠ 대응 없음 (GridBuilder L195) addCell
  gb.textArea('submitTo', 150, '제출처'),  // L196
  gb.textArea('relatedLaw', 200, '관련조문'),  // L197
  gb.textCenter('revisionCount', 80, '개정이력'),  // L198
  // ⚠ 대응 없음 (GridBuilder L199) addCell
  gb.text('cycleNm', 100, '주기'),  // L200
  // ⚠ 대응 없음 (GridBuilder L201) addCell
  gb.textCenter('fileCount', 60, '서식파일'),  // L202
  // ⚠ 대응 없음 (GridBuilder L203) addCell
  gb.textArea('parentTreeFullNm', 200, '분류'),  // L204
  gb.booleanYn2('advisYn', 60, '일임<br>(자문)'),  // L205
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Ics20_Lookup_RevisionHistory (`client/vi/ics/Ics20_Lookup_RevisionHistory.java`, 148줄)

- 툴바 `iconBar`: {anchor}
- 입력·하위 화면: `lookupContent` Ics20_Lookup_Content, `lookupFile` Ics20_Lookup_File
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 90 "등록일" Date
  - submissionDate 90 "의견제출일" Date
  - effectDate 90 "시행일" Date
  - title 450 "법규명" Text
  - actionCell 60 "상세내용" Cell 편집:ContentCell
  - financeAgencyName 100 "소관부처" Text
  - reflectionDate 90 "법규반영일" Date
  - fileCount 60 "첨부파일" LongCenter
  - actionCell 30 " " Cell 편집:fileListCell

#### 이벤트
[E0] 화면 열림 (생성자 L40-42) → 초기화
[E1] anchor.MouseDown (L59) → retrieve()
[E2] closeButton[닫기].Select (L66) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L44-48 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L134-138 | E1,open | 서비스 ics.Ics20_RevisionHistory.selectByClassTreeId(classTreeId) | 업무 |
| private fileList() | L140-143 | buildGrid | 조회창 Ics20_Lookup_File 열기 | 업무 |
| private makeLayout() | L50-87 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| package buildGrid() | L90-132 | 필드 초기화 | 조회창 Ics20_Lookup_Content 열기, 미선택 시 alert "첨부파일이 없습니다.", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L145-147 | makeLayout | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 90, '등록일'),  // L121
  gb.date('submissionDate', 90, '의견제출일'),  // L122
  gb.date('effectDate', 90, '시행일'),  // L123
  gb.text('title', 450, '법규명'),  // L124
  // ⚠ 대응 없음 (GridBuilder L125) addCell
  gb.text('financeAgencyNm', 100, '소관부처'),  // L126
  gb.date('reflectionDate', 90, '법규반영일'),  // L127
  gb.longCenter('fileCount', 60, '첨부파일'),  // L128
  // ⚠ 대응 없음 (GridBuilder L129) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics20_Lookup_File (`client/vi/ics/Ics20_Lookup_File.java`, 117줄)

- 입력·하위 화면: `viewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - fileName 440 "첨부파일명" Text
  - actionCell 80 "다운로드" Cell 편집:downloadCell
  - actionCell 80 "미리보기" Cell 편집:viewCell

#### 이벤트
[E1] closeButton[닫기].Select (L46) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L38-65 | 공개 메서드 | 상태 처리 | 업무 |
| private buildApprFileGrid() | L67-97 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기 | 업무 |
| private retrieve() | L99-111 | open | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private setHtmlHeaderStyle() | L113-115 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('fileNm', 440, '첨부파일명'),  // L92
  // ⚠ 대응 없음 (GridBuilder L93) addCell
  // ⚠ 대응 없음 (GridBuilder L94) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics20_Lookup_Content (`client/vi/ics/Ics20_Lookup_Content.java`, 102줄)

- 입력·하위 화면: `note` MyTextArea

#### 이벤트
[E1] updateButton[저장].Select (L60) → update()
[E2] closeButton[닫기].Select (L66) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L39-80 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L82-96 | E1 | 서비스 ics.Ics20_RevisionHistory.updateContent | 업무 |
| private setHtmlHeaderStyle() | L98-100 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

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

