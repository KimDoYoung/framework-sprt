# Chk03_Tab_DailyListStatus

- 종류: 화면
- 메뉴: 펀드관리 > 10. 펀드회계 일일점검 > 일일점검내역 (#1243)
- 파일: `client/vi/chk/Chk03_Tab_DailyListStatus.java`
- 함께 쓰는 클래스 3개:
  - `Chk02_Edit_DailyList` `client/vi/chk/Chk02_Edit_DailyList.java`
  - `Chk01_Lookup_ClassTree` `client/vi/chk/Chk01_Lookup_ClassTree.java`
  - `Chk01_Edit_ClassTree` `client/vi/chk/Chk01_Edit_ClassTree.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `chk.Chk01_ClassTree.delete` | Chk01_Edit_ClassTree:151 | [`Chk01_ClassTree.java:95`](../../chk/services/Chk01_ClassTree.md) | `UpdateDataModel(chk01_class_tree)` 동적 DELETE |
| `chk.Chk01_ClassTree.selectByCompanyId` | Chk01_Lookup_ClassTree:218 | [`Chk01_ClassTree.java:53`](../../chk/services/Chk01_ClassTree.md) | [`chk01_class_tree.selectByCompanyId`](../../chk/sql/chk01_class_tree.md) |
| `chk.Chk01_ClassTree.selectByLinkCode` | Chk03_Tab_DailyListStatus:116 | [`Chk01_ClassTree.java:25`](../../chk/services/Chk01_ClassTree.md) | [`chk01_class_tree.selectByLinkCode`](../../chk/sql/chk01_class_tree.md) |
| `chk.Chk01_ClassTree.update` | Chk01_Edit_ClassTree:117 | [`Chk01_ClassTree.java:90`](../../chk/services/Chk01_ClassTree.md) | `UpdateDataModel(chk01_class_tree)` 동적 INSERT/UPDATE → [`chk01_class_tree.selectById`](../../chk/sql/chk01_class_tree.md) |
| `chk.Chk02_DailyList.modelUpdate` | Chk02_Edit_DailyList:254 | [`Chk02_DailyList.java:148`](../../chk/services/Chk02_DailyList.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(chk02_daily_list)` 동적 INSERT/UPDATE → [`chk02_daily_list.selectById`](../../chk/sql/chk02_daily_list.md) |
| `chk.Chk03_DailyListWrite.selectDailyListStatusPaging` | Chk03_Tab_DailyListStatus:101 | [`Chk03_DailyListWrite.java:27`](../../chk/services/Chk03_DailyListWrite.md) | [`chk03_daily_list_write.selectDailyListStatusPaging`](../../chk/sql/chk03_daily_list_write.md), [`chk03_daily_list_write.selectDailyListStatusPagingTotal`](../../chk/sql/chk03_daily_list_write.md) |

## 테이블

[`chk01_class_tree`](../../../db/tables/chk.md), [`chk02_daily_list`](../../../db/tables/chk.md), [`chk03_daily_list_write`](../../../db/tables/chk.md), [`emp04_add_title`](../../../db/tables/emp.md), [`sch02_share`](../../../db/tables/sch.md), [`sch22_write_group`](../../../db/tables/sch.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_confirmer_limit`, `f_org_nm`, `f_sysdate`, `f_today`, `getperson`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Chk03_Tab_DailyListStatus (`client/vi/chk/Chk03_Tab_DailyListStatus.java`, 257줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar1`: 일자: {startDate} 분류: {classTreeName} {retrieveButton} {downLoadButton}
- 툴바 `buttonBar2`: 검색: {searchText} {unCheckYn} {unConfirmYn}
- 입력·하위 화면: `classTreeName` LookupTriggerField, `startDate` MyDateField, `unCheckYn` CheckBox, `unConfirmYn` CheckBox, `searchText` TextField 빈칸="분류/점검내용/담당부서/담당자", `lookup` Chk01_Lookup_ClassTree
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - classTreeName 250 "분류" Text
  - content 600 "점검내용" TextArea
  - actionCell 40 " " Cell 편집:actionCell
  - reason 300 "점검결과" TextArea
  - orgName 100 "담당부서" Text
  - personName 100 "담당자" Text
  - confirmerName 100 "확인자" Text
  - confirmYn 80 "확인여부" BooleanYn

#### 이벤트
[E0] 화면 열림 (생성자 L70-113) → settings()
[E1] classTreeName.TriggerClick [result != null] (L142) → 인라인 L142-161 (new TriggerClickHandler() { @Override…)
[E2] searchText.KeyPress [Enter] (L165) → retrieve()
[E3] retrieveButton[조회].Select (L179) → retrieve()
[E4] downLoadButton[출력/다운로드].Select (L185) → 인라인 L185-191 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L223-248 | E2,E3,settings | 상태 처리 | 업무 |
| private settings() | L115-192 | 생성자 | 조회창 Chk01_Lookup_ClassTree 열기, 서비스 chk.Chk01_ClassTree.selectByLinkCode(linkCode, companyId), 이벤트 연결, 초기값: startDate=LoginUser.getToday(, unCheckYn=false("미점검 보기"), unConfirmYn=false("미확인 보기") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L194-221 | 필드 초기화 | 팝업 Chk02_Edit_DailyList 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L250-252 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L254-256 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('classTreeNm', 250, '분류'),  // L211
  gb.textArea('content', 600, '점검내용'),  // L212
  // ⚠ 대응 없음 (GridBuilder L213) addCell
  gb.textArea('reason', 300, '점검결과'),  // L214
  // ⚠DB없음 L215 orgName 100 "담당부서" (chk03_org_nm 컬럼 없음)
  // ⚠DB없음 L216 personName 100 "담당자" (chk03_person_nm 컬럼 없음)
  // ⚠DB없음 L217 confirmerName 100 "확인자" (chk03_confirmer_nm 컬럼 없음)
  gb.booleanYn('confirmYn', 80, '확인여부'),  // L218
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={() => /* 인라인 L185-191 (new SelectHandler() { @Override publi…) */}>출력/다운로드</Button>

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

