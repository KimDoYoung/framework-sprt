# Chk03_Tab_DailyListWrite

- 종류: 화면
- 메뉴: 펀드관리 > 10. 펀드회계 일일점검 > 일일점검내역 작성 (#1241)
- 파일: `client/vi/chk/Chk03_Tab_DailyListWrite.java`
- 함께 쓰는 클래스 5개:
  - `Chk03_Edit_Reason` `client/vi/chk/Chk03_Edit_Reason.java`
  - `Chk03_Edit_Note` `client/vi/chk/Chk03_Edit_Note.java`
  - `Chk02_Edit_DailyList` `client/vi/chk/Chk02_Edit_DailyList.java`
  - `Chk01_Lookup_ClassTree` `client/vi/chk/Chk01_Lookup_ClassTree.java`
  - `Chk01_Edit_ClassTree` `client/vi/chk/Chk01_Edit_ClassTree.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `chk.Chk01_ClassTree.delete` | Chk01_Edit_ClassTree:151 | [`Chk01_ClassTree.java:95`](../../chk/services/Chk01_ClassTree.md) | `UpdateDataModel(chk01_class_tree)` 동적 DELETE |
| `chk.Chk01_ClassTree.selectByCompanyId` | Chk01_Lookup_ClassTree:218 | [`Chk01_ClassTree.java:53`](../../chk/services/Chk01_ClassTree.md) | [`chk01_class_tree.selectByCompanyId`](../../chk/sql/chk01_class_tree.md) |
| `chk.Chk01_ClassTree.selectByLinkCode` | Chk03_Tab_DailyListWrite:101 | [`Chk01_ClassTree.java:25`](../../chk/services/Chk01_ClassTree.md) | [`chk01_class_tree.selectByLinkCode`](../../chk/sql/chk01_class_tree.md) |
| `chk.Chk01_ClassTree.update` | Chk01_Edit_ClassTree:117 | [`Chk01_ClassTree.java:90`](../../chk/services/Chk01_ClassTree.md) | `UpdateDataModel(chk01_class_tree)` 동적 INSERT/UPDATE → [`chk01_class_tree.selectById`](../../chk/sql/chk01_class_tree.md) |
| `chk.Chk02_DailyList.modelUpdate` | Chk02_Edit_DailyList:254 | [`Chk02_DailyList.java:148`](../../chk/services/Chk02_DailyList.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(chk02_daily_list)` 동적 INSERT/UPDATE → [`chk02_daily_list.selectById`](../../chk/sql/chk02_daily_list.md) |
| `chk.Chk02_DailyList.selectByPersonId` | Chk03_Tab_DailyListWrite:399 | [`Chk02_DailyList.java:65`](../../chk/services/Chk02_DailyList.md) | [`chk02_daily_list.selectByPersonId`](../../chk/sql/chk02_daily_list.md) |
| `chk.Chk03_DailyListWrite.modelUpdate` | Chk03_Edit_Note:90, Chk03_Edit_Reason:90, Chk03_Tab_DailyListWrite:318 | [`Chk03_DailyListWrite.java:149`](../../chk/services/Chk03_DailyListWrite.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(chk03_daily_list_write)` 동적 INSERT/UPDATE → [`chk03_daily_list_write.selectById`](../../chk/sql/chk03_daily_list_write.md) |
| `chk.Chk03_DailyListWrite.selectById` | Chk03_Tab_DailyListWrite:284, Chk03_Tab_DailyListWrite:351 | [`Chk03_DailyListWrite.java:21`](../../chk/services/Chk03_DailyListWrite.md) | [`chk03_daily_list_write.selectById`](../../chk/sql/chk03_daily_list_write.md) |
| `chk.Chk03_DailyListWrite.updateAnswerCode` | Chk03_Tab_DailyListWrite:210 | [`Chk03_DailyListWrite.java:45`](../../chk/services/Chk03_DailyListWrite.md) | [`chk03_daily_list_write.selectByPersonId`](../../chk/sql/chk03_daily_list_write.md), [`chk03_daily_list_write.updateAnswerCode`](../../chk/sql/chk03_daily_list_write.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(chk03_daily_list_write)` 동적 INSERT/UPDATE → [`chk03_daily_list_write.selectById`](../../chk/sql/chk03_daily_list_write.md) |

## 테이블

[`chk01_class_tree`](../../../db/tables/chk.md), [`chk02_daily_list`](../../../db/tables/chk.md), [`chk03_daily_list_write`](../../../db/tables/chk.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`sch02_share`](../../../db/tables/sch.md), [`sch22_write_group`](../../../db/tables/sch.md)

## DB 함수

`f_cdnm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Chk03_Tab_DailyListWrite (`client/vi/chk/Chk03_Tab_DailyListWrite.java`, 419줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 점검일자: {startDate} 분류: {classTreeName} 검색: {searchText} {checkBox} {retrieveButton}
- 입력·하위 화면: `classTreeName` LookupTriggerField, `checkBox` CheckBox, `startDate` MyDateField, `searchText` TextField 빈칸="분류/점검내용/설명", `lookup` Chk01_Lookup_ClassTree
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - classTreeName 200 "분류" Text
  - content 500 "점검내용" TextArea
  - cutoff 70 "CutOff" TextCenter
  - windowNo 100 "화면번호" TextCenter
  - actionCell 40 " " Cell 편집:actionCell
  - yes 70 "예" Boolean
  - no 70 "아니오" Boolean
  - not 70 "해당없음" Boolean
  - reason 200 "점검결과" TextArea
  - actionCell 40 " " Cell 편집:editCell01
  - note 200 "비고" TextArea
  - actionCell 40 " " Cell 편집:editCell02
  - confirmYn 80 "확인여부" BooleanYn

#### 이벤트
[E0] 화면 열림 (생성자 L71-98) → settings()
[E1] classTreeName.TriggerClick [result != null] (L127) → 인라인 L127-146 (new TriggerClickHandler() { @Override…)
[E2] searchText.KeyPress [Enter] (L150) → retrieve()
[E3] retrieveButton[조회].Select (L162) → retrieve()
[E4] grid.getStore().StoreRecordChange [chkModel.getConfirmYn()] (L168) → 서비스 chk.Chk03_DailyListWrite.updateAnswerCode(dailyListId, classTreeId, companyId, personId, useYn, answerCode, date), 메시지 "담당자가 확인처리한 일일점검내역으로 수정이 불가능합니다"

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private edit() | L283-306 | buildGrid | 서비스 chk.Chk03_DailyListWrite.selectById | 업무 |
| private updateReasonNote() | L308-384 | edit | 팝업 Chk03_Edit_Reason 열기, 팝업 Chk03_Edit_Note 열기, 서비스 chk.Chk03_DailyListWrite.modelUpdate, chk.Chk03_DailyListWrite.selectById(dailyListWriteId) | 업무 |
| public retrieve() | L386-405 | E2,E3,settings,buildGrid | 서비스 chk.Chk02_DailyList.selectByPersonId(companyId, personId, classTreeId, useYn, searchText, checkBox, date) | 업무 |
| private settings() | L100-235 | 생성자 | 조회창 Chk01_Lookup_ClassTree 열기, 서비스 chk.Chk01_ClassTree.selectByLinkCode, chk.Chk03_DailyListWrite.updateAnswerCode(linkCode, companyId, dailyListId, classTreeId, companyId, personId, useYn, answerCode, date), 이벤트 연결, 초기값: startDate=LoginUser.getToday(, checkBox=false("미점검 내용만 보기") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L237-281 | 필드 초기화 | 팝업 Chk02_Edit_DailyList 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L407-410 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L412-414 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L416-418 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L265 newHeaderGroupMap06newHeaderGroupConfigsetHtmlGridStyle13 100 "체크" (sch22_new_header_group_map06new_header_group_configset_html_grid_style13 컬럼 없음)
  gb.text('classTreeNm', 200, '분류'),  // L266
  gb.textArea('content', 500, '점검내용'),  // L267
  gb.textCenter('cutoff', 70, 'CutOff'),  // L268
  gb.textCenter('windowNo', 100, '화면번호'),  // L269
  // ⚠ 대응 없음 (GridBuilder L270) addCell
  // ⚠DB없음 L271 yes 70 "예" (sch22_yes 컬럼 없음)
  // ⚠DB없음 L272 no 70 "아니오" (sch22_no 컬럼 없음)
  // ⚠DB없음 L273 not 70 "해당없음" (sch22_not 컬럼 없음)
  gb.textArea('reason', 200, '점검결과'),  // L274
  // ⚠ 대응 없음 (GridBuilder L275) addCell
  gb.textArea('note', 200, '비고'),  // L276
  // ⚠ 대응 없음 (GridBuilder L277) addCell
  gb.booleanYn('confirmYn', 80, '확인여부'),  // L278
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Chk03_Edit_Reason (`client/vi/chk/Chk03_Edit_Reason.java`, 106줄)

- 입력·하위 화면: `reason` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L50-70) → settings(), show()
[E1] updateButton[저장].Select (L73) → update()
[E2] closeButton[닫기].Select (L79) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L40-48 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L87-101 | E1 | 서비스 chk.Chk03_DailyListWrite.modelUpdate | 업무 |
| private settings() | L72-85 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L103-105 | edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Chk03_Edit_Note (`client/vi/chk/Chk03_Edit_Note.java`, 106줄)

- 입력·하위 화면: `note` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L50-70) → settings(), show()
[E1] updateButton[저장].Select (L73) → update()
[E2] closeButton[닫기].Select (L79) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L40-48 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L87-101 | E1 | 서비스 chk.Chk03_DailyListWrite.modelUpdate | 업무 |
| private settings() | L72-85 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L103-105 | edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Chk02_Edit_DailyList (`client/vi/chk/Chk02_Edit_DailyList.java`, 283줄)

- 입력·하위 화면: `classTreeName` LookupTriggerField, `cutoff` TextField, `windowNo` TextField, `classTreeId` LongField, `seq` LongField, `content` MyTextArea, `explan` MyTextArea, `useYn` StringComboBox, `lookup` Chk01_Lookup_ClassTree

#### 이벤트
[E0] 화면 열림 (생성자 L126-173) → settings(), show()
[E1] useYn[사용여부].Collapse (L181) → 인라인 L181-190 (new CollapseHandler() { @Override pub…)
[E2] classTreeName[분류].TriggerClick [result != null] (L191) → 인라인 L191-208 (new TriggerClickHandler() { @Override…)
[E3] updateButton[저장].Select (L221) → update()
[E4] closeButton[닫기].Select [callback == null] (L227) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L72-96 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L98-124 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L241-270 | E3 | 서비스 chk.Chk02_DailyList.modelUpdate | 업무 |
| private settings() | L175-239 | 생성자 | 조회창 Chk01_Lookup_ClassTree 열기, 이벤트 연결, 초기값: classTreeId=resultModel.getClassTreeId(, classTreeName=resultModel.getClassTreeName(("분류") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L272-274 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L276-278 | edit,open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L280-282 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Chk01_Lookup_ClassTree (`client/vi/chk/Chk01_Lookup_ClassTree.java`, 269줄)

- 툴바 `buttonBar`: {retrieveButton} {addChildButton}
- 입력·하위 화면: `editClassTree` Chk01_Edit_ClassTree
- 그리드 `treeGrid` (buildTreeGrid(), 트리):
  - classTreeName 450 "분류명" Text
  - seq 40 "순서" LongCenter
  - adminYn 40 "" BooleanIcon
  - actionCell 50 "수정" Cell 편집:editCell

#### 이벤트
[E0] 화면 열림 (생성자 L79-104) → settings(), show()
[E1] treeGrid.RowDoubleClick (L108) → hide()
[E2] retrieveButton[조회].Select (L115) → retrieve()
[E3] addChildButton[등록].Select (L121) → insertClassTree()
[E4] selectButton[확인].Select [선택>0] (L127) → hide()
[E5] allSelectButton[전체].Select (L139) → hide()
[E6] cancleButton[닫기].Select (L147) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L56-66 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L68-77 | 공개 메서드 | 상태 처리 | 업무 |
| public buildTreeGrid() | L156-181 | 필드 초기화 | 상태 처리 | 업무 |
| private editClassTree() | L183-192 | buildTreeGrid | 팝업 Chk01_Edit_ClassTree 열기 | 업무 |
| private insertClassTree() | L194-214 | E3 | 팝업 Chk01_Edit_ClassTree 열기 | 업무 |
| public retrieve() | L216-224 | E2,open,edit,editClassTree,insertClassTree | 서비스 chk.Chk01_ClassTree.selectByCompanyId(companyId, parentTreeId) | 업무 |
| private setChildMenuItem() | L226-236 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L239-264 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L106-154 | 생성자 | 미선택 시 alert "분류를 선택해주세요", 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L266-268 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('classTreeNm', 450, '분류명'),  // L176
  gb.longCenter('seq', 40, '순서'),  // L177
  // ⚠ 대응 없음 (GridBuilder L178) addBooleanIcon
  // ⚠ 대응 없음 (GridBuilder L179) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertClassTree}>등록</Button>
3. <Button type="save" onClick={hide}>확인</Button>
4. <Button type="unknown" onClick={hide}>전체</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Chk01_Edit_ClassTree (`client/vi/chk/Chk01_Edit_ClassTree.java`, 241줄)

- 입력·하위 화면: `classTreeName` TextField, `linkCode` TextField, `seq` LongField, `note` TextArea, `linkName` ComboBoxField("ChkLinkCode", "(선택안함)") 빈칸="선택", `useYn` StringComboBox

#### 이벤트
[E2] linkName[매뉴링크].Collapse (L170) → 인라인 L170-175 (new CollapseHandler() { @Override pub…)
[E3] useYn[사용여부].Collapse (L182) → 인라인 L182-191 (new CollapseHandler() { @Override pub…)
[E4] deleteButton[삭제].Select (L192) → deleteChk()
       └ [E1] msgBox.DialogHide [YES] (L129) → delete()
[E5] updateButton[저장].Select (L198) → update()
[E6] closeButton[닫기].Select (L204) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L66-87 | 공개 메서드 | 상태 처리 | 업무 |
| public insert() | L89-110 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L112-124 | E5 | 서비스 chk.Chk01_ClassTree.update | 업무 |
| private deleteChk() | L126-144 | E4 | ConfirmBox → E1 | 업무 |
| private delete() | L146-158 | E1 | 서비스 chk.Chk01_ClassTree.delete | 업무 |
| public setForm() | L160-232 | edit,insert | 상태 처리 | 업무 |
| private setHtmlStyle() | L234-236 | setForm | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L238-240 | edit,insert | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="delete" onClick={deleteChk}>삭제</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

