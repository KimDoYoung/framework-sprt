# Tdm43_Tab_ManlItemList

- 종류: 화면
- 메뉴: 책무 > 90. 책무관리현황 > 매뉴얼 규정/양식 연결 (#1468)
- 파일: `client/vi/tdm/Tdm43_Tab_ManlItemList.java`
- 함께 쓰는 클래스 7개:
  - `Tdm45_TabPage_Relate` `client/vi/tdm/Tdm45_TabPage_Relate.java`
  - `Tdm43_Lookup_RefBasis` `client/vi/tdm/Tdm43_Lookup_RefBasis.java`
  - `Tdm43_Lookup_RelateFormFileList` `client/vi/tdm/Tdm43_Lookup_RelateFormFileList.java`
  - `Tdm43_Lookup_EtcModify` `client/vi/tdm/Tdm43_Lookup_EtcModify.java`
  - `Tdm43_Lookup_ExctDuty` `client/vi/tdm/Tdm43_Lookup_ExctDuty.java`
  - `Tdm43_Edit_Manl` `client/vi/tdm/Tdm43_Edit_Manl.java`
  - `Tdm43_Page_Relate` `client/vi/tdm/Tdm43_Page_Relate.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Dcr01_Lookup_SelectMulti`](../../dcr/components/Dcr01_Lookup_SelectMulti.md), [`Icr01_Lookup_ClassTreeDetail`](../../icr/components/Icr01_Lookup_ClassTreeDetail.md), [`Icr01_Lookup_SelectMulti`](../../icr/components/Icr01_Lookup_SelectMulti.md), [`Ics01_Lookup_ClassTreeDetail`](../../ics/components/Ics01_Lookup_ClassTreeDetail.md), [`Ics01_Lookup_SelectMulti`](../../ics/components/Ics01_Lookup_SelectMulti.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys00_Common.selectByKindGroupCode` | Tdm43_Edit_Manl:240 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys10_File.selectUnConnTdmFormFile` | Tdm43_Lookup_RelateFormFileList:174 | [`Sys10_File.java:97`](../../sys/services/Sys10_File.md) | [`sys10_file.selectUnConnTdmFormFile`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.delete` | Tdm43_Page_Relate:458, Tdm45_TabPage_Relate:193 | [`Sys11_RelateFile.java:199`](../../sys/services/Sys11_RelateFile.md) | `UpdateDataModel(sys11_relate_file)` 동적 DELETE |
| `sys.Sys11_RelateFile.insertTdmManlList` | Tdm43_Tab_ManlItemList:299 | [`Sys11_RelateFile.java:168`](../../sys/services/Sys11_RelateFile.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys11_relate_file.insert`](../../sys/sql/sys11_relate_file.md), [`tdm43_manl.selectById`](../../tdm/sql/tdm43_manl.md) |
| `sys.Sys11_RelateFile.selectByParentId` | Tdm43_Page_Relate:295, Tdm45_TabPage_Relate:303 | [`Sys11_RelateFile.java:33`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.selectByParentId`](../../sys/sql/sys11_relate_file.md) |
| `tdm.Tdm43_Manl.modelUpdate` | Tdm43_Edit_Manl:487 | [`Tdm43_Manl.java:230`](../../tdm/services/Tdm43_Manl.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`tdm43_manl.getNewManlCode`](../../tdm/sql/tdm43_manl.md), `UpdateDataModel(tdm45_manl_relate_ics)` 동적 INSERT/UPDATE → [`tdm45_manl_relate_ics.selectById`](../../tdm/sql/tdm45_manl_relate_ics.md), `UpdateDataModel(tdm46_manl_relate_icr)` 동적 INSERT/UPDATE → [`tdm46_manl_relate_icr.selectById`](../../tdm/sql/tdm46_manl_relate_icr.md), `UpdateDataModel(sys11_relate_file)` 동적 INSERT/UPDATE → [`sys11_relate_file.selectById`](../../sys/sql/sys11_relate_file.md), `UpdateDataModel(tdm47_manl_relate_dcr)` 동적 INSERT/UPDATE → [`tdm47_manl_relate_dcr.selectById`](../../tdm/sql/tdm47_manl_relate_dcr.md), `UpdateDataModel(tdm43_manl)` 동적 INSERT/UPDATE → [`tdm43_manl.selectById`](../../tdm/sql/tdm43_manl.md) |
| `tdm.Tdm43_Manl.selectByDate` | Tdm43_Tab_ManlItemList:232 | [`Tdm43_Manl.java:58`](../../tdm/services/Tdm43_Manl.md) | [`tdm43_manl.selectByDate`](../../tdm/sql/tdm43_manl.md) |
| `tdm.Tdm43_Manl.selectById` | Tdm45_TabPage_Relate:325 | [`Tdm43_Manl.java:20`](../../tdm/services/Tdm43_Manl.md) | [`tdm43_manl.selectById`](../../tdm/sql/tdm43_manl.md) |
| `tdm.Tdm43_Manl.updateEtc` | Tdm43_Lookup_EtcModify:167 | [`Tdm43_Manl.java:292`](../../tdm/services/Tdm43_Manl.md) | [`tdm43_manl.selectByDate`](../../tdm/sql/tdm43_manl.md), [`tdm43_manl.updateEtc`](../../tdm/sql/tdm43_manl.md) |
| `tdm.Tdm43_Manl.updateRefBasis` | Tdm43_Lookup_RefBasis:76 | [`Tdm43_Manl.java:287`](../../tdm/services/Tdm43_Manl.md) | [`tdm43_manl.updateRefBasis`](../../tdm/sql/tdm43_manl.md) |
| `tdm.Tdm45_ManlRelateIcs.delete` | Tdm43_Page_Relate:386, Tdm45_TabPage_Relate:111 | [`Tdm45_ManlRelateIcs.java:68`](../../tdm/services/Tdm45_ManlRelateIcs.md) | `UpdateDataModel(tdm45_manl_relate_ics)` 동적 DELETE |
| `tdm.Tdm45_ManlRelateIcs.insertList` | Tdm43_Tab_ManlItemList:251 | [`Tdm45_ManlRelateIcs.java:39`](../../tdm/services/Tdm45_ManlRelateIcs.md) | [`tdm43_manl.selectById`](../../tdm/sql/tdm43_manl.md), [`tdm45_manl_relate_ics.insert`](../../tdm/sql/tdm45_manl_relate_ics.md) |
| `tdm.Tdm45_ManlRelateIcs.selectByManlId` | Tdm43_Page_Relate:271, Tdm45_TabPage_Relate:277 | [`Tdm45_ManlRelateIcs.java:26`](../../tdm/services/Tdm45_ManlRelateIcs.md) | [`tdm45_manl_relate_ics.selectByManlId`](../../tdm/sql/tdm45_manl_relate_ics.md) |
| `tdm.Tdm46_ManlRelateIcr.delete` | Tdm43_Page_Relate:422, Tdm45_TabPage_Relate:152 | [`Tdm46_ManlRelateIcr.java:63`](../../tdm/services/Tdm46_ManlRelateIcr.md) | `UpdateDataModel(tdm46_manl_relate_icr)` 동적 DELETE |
| `tdm.Tdm46_ManlRelateIcr.insertList` | Tdm43_Tab_ManlItemList:275 | [`Tdm46_ManlRelateIcr.java:34`](../../tdm/services/Tdm46_ManlRelateIcr.md) | [`tdm43_manl.selectById`](../../tdm/sql/tdm43_manl.md), [`tdm46_manl_relate_icr.insert`](../../tdm/sql/tdm46_manl_relate_icr.md) |
| `tdm.Tdm46_ManlRelateIcr.selectByManlId` | Tdm43_Page_Relate:283, Tdm45_TabPage_Relate:290 | [`Tdm46_ManlRelateIcr.java:26`](../../tdm/services/Tdm46_ManlRelateIcr.md) | [`tdm46_manl_relate_icr.selectByManlId`](../../tdm/sql/tdm46_manl_relate_icr.md) |
| `tdm.Tdm47_ManlRelateDcr.delete` | Tdm43_Page_Relate:487, Tdm45_TabPage_Relate:227 | [`Tdm47_ManlRelateDcr.java:60`](../../tdm/services/Tdm47_ManlRelateDcr.md) | `UpdateDataModel(tdm47_manl_relate_dcr)` 동적 DELETE |
| `tdm.Tdm47_ManlRelateDcr.insertList` | Tdm43_Tab_ManlItemList:324 | [`Tdm47_ManlRelateDcr.java:31`](../../tdm/services/Tdm47_ManlRelateDcr.md) | [`tdm43_manl.selectById`](../../tdm/sql/tdm43_manl.md), [`tdm47_manl_relate_dcr.insert`](../../tdm/sql/tdm47_manl_relate_dcr.md) |
| `tdm.Tdm47_ManlRelateDcr.selectByManlId` | Tdm43_Page_Relate:307, Tdm45_TabPage_Relate:316 | [`Tdm47_ManlRelateDcr.java:26`](../../tdm/services/Tdm47_ManlRelateDcr.md) | [`tdm47_manl_relate_dcr.selectByManlId`](../../tdm/sql/tdm47_manl_relate_dcr.md) |

## 테이블

[`dcr01_class_tree`](../../../db/tables/dcr.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm13_task_relate_duty`](../../../db/tables/tdm.md), [`tdm42_manl_org`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm45_manl_relate_ics`](../../../db/tables/tdm.md), [`tdm46_manl_relate_icr`](../../../db/tables/tdm.md), [`tdm47_manl_relate_dcr`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_get_exctdutymap_nm`, `f_get_tdmcheckcycle`, `f_org_nm`, `f_sysdate`, `f_today`, `f_trunc`, `getorg`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm43_Tab_ManlItemList (`client/vi/tdm/Tdm43_Tab_ManlItemList.java`, 356줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준일: {stdDate} 검색: {searchText} {retrieveButton} {addIcsButton} {addIcrButton} {addFormButton} {addDcrButton}
- 입력·하위 화면: `stdDate` MyDateField, `searchText` TextField 빈칸="직책/담당부서/관리의무/점검항목코드/점검항목", `tabPage` Tdm45_TabPage_Relate, `lookup` Tdm43_Edit_Manl
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - actionCell 40 "상세" Cell 편집:viewCell
  - roleName 150 "직책" Text
  - orgName 150 "담당부서" Text
  - taskRelateDutyName 300 "관리의무" TextArea
  - checkItemAddCode 350 "점검항목" TextArea
  - icsCntStr 65 "연관법규" TextCenter
  - icrCntStr 65 "연관내규" TextCenter
  - formFileCntStr 65 "연관양식" TextCenter
  - dcrCntStr 65 "연관문서" TextCenter
  - unuseYn 65 "미사용" BooleanYn2
  - actionCell 65 "허용항목<br>수정" Cell 편집:etcEditCell

#### 이벤트
[E0] 화면 열림 (생성자 L67-100) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L108) → retrieve()
[E2] retrieveButton[조회].Select (L117) → retrieve()
[E3] addIcsButton[법규연결].Select [선택>0] (L123) → insertIcsList()
[E4] addIcrButton[내규연결].Select [선택>0] (L134) → insertIcrList()
[E5] addFormButton[양식연결].Select [선택>0] (L145) → insertFormList()
[E6] addDcrButton[문서분류연결].Select [선택>0] (L156) → insertDcrList()
[E7] grid.SelectionChanged (L167) → 인라인 L167-177 (new SelectionChangedHandler<Tdm43_Man…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L224-241 | 생성자,E1,E2 | 서비스 tdm.Tdm43_Manl.selectByDate(companyId, stdDate, searchText) | 업무 |
| private insertIcsList() | L243-265 | E3 | 조회창 Ics01_Lookup_SelectMulti 열기, 서비스 tdm.Tdm45_ManlRelateIcs.insertList(icsList, manlItemList) | 업무 |
| private insertIcrList() | L267-289 | E4 | 조회창 Icr01_Lookup_SelectMulti 열기, 서비스 tdm.Tdm46_ManlRelateIcr.insertList(icrList, manlItemList) | 업무 |
| private insertFormList() | L291-314 | E5 | 조회창 Tdm43_Lookup_RelateFormFileList 열기, 서비스 sys.Sys11_RelateFile.insertTdmManlList(fileList, parentList, tableName) | 업무 |
| private insertDcrList() | L316-338 | E6 | 조회창 Dcr01_Lookup_SelectMulti 열기, 서비스 tdm.Tdm47_ManlRelateDcr.insertList(dcrList, manlItemList) | 업무 |
| private insertEnd() | L340-351 | insertIcsList,insertIcrList,insertFormList,insertDcrList | 상태 처리 | 업무 |
| private settings() | L102-178 | 생성자 | 이벤트 연결, 초기값: stdDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L180-222 | 필드 초기화 | 팝업 Tdm43_Edit_Manl 열기, 조회창 Tdm43_Lookup_EtcModify 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L353-355 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L209) addCell
  gb.text('roleNm', 150, '직책'),  // L210
  gb.text('orgNm', 150, '담당부서'),  // L211
  gb.textArea('taskRelateDutyNm', 300, '관리의무'),  // L212
  // ⚠DB없음 L213 checkItemAddCode 350 "점검항목" (tdm45_check_item_add_code 컬럼 없음)
  gb.textCenter('icsCntStr', 65, '연관법규'),  // L214
  gb.textCenter('icrCntStr', 65, '연관내규'),  // L215
  gb.textCenter('formFileCntStr', 65, '연관양식'),  // L216
  gb.textCenter('dcrCntStr', 65, '연관문서'),  // L217
  gb.booleanYn2('unuseYn', 65, '미사용'),  // L218
  // ⚠ 대응 없음 (GridBuilder L219) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={insertIcsList}>법규연결</Button>
3. <Button type="unknown" onClick={insertIcrList}>내규연결</Button>
4. <Button type="unknown" onClick={insertFormList}>양식연결</Button>
5. <Button type="unknown" onClick={insertDcrList}>문서분류연결</Button>

### Tdm45_TabPage_Relate (`client/vi/tdm/Tdm45_TabPage_Relate.java`, 336줄)

- 입력·하위 화면: `lookupIcs` Ics01_Lookup_ClassTreeDetail, `lookupIcr` Icr01_Lookup_ClassTreeDetail, `lookupForm` Sys10_Lookup_FileViewer
- 그리드 `refBasisGrid` (refBasisBuildGrid(), 행번호숨김):
  - refBasis 290 "" TextLimitArea 편집:"관련조문"
  - actionCell 40 "수정" Cell 편집:modiCell
- 그리드 `icsGrid` (icsBuildGrid(), 행번호숨김):
  - icsClassTreeName 250 "연관법규" Text
  - actionCell 40 "보기" Cell 편집:viewCell
  - actionCell 40 "삭제" Cell 편집:deleteCell
- 그리드 `icrGrid` (icrBuildGrid(), 행번호숨김):
  - icrClassTreeName 250 "연관내규" Text
  - actionCell 40 "보기" Cell 편집:viewCell
  - actionCell 40 "삭제" Cell 편집:deleteCell
- 그리드 `formGrid` (formBuildGrid(), 행번호숨김):
  - fileName 250 "연관양식" Text
  - actionCell 40 "보기" Cell 편집:viewCell
  - actionCell 40 "삭제" Cell 편집:deleteCell
- 그리드 `dcrGrid` (dcrBuildGrid(), 행번호숨김):
  - dcrClassTreeFullName 290 "연관문서분류" TextArea
  - actionCell 40 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L52-65) → 초기화
[E1] messageBox.DialogHide [YES] (L105) → deleteEnd()
[E2] messageBox.DialogHide [YES] (L146) → deleteEnd()
[E3] messageBox.DialogHide [YES] (L187) → deleteEnd()
[E4] messageBox.DialogHide [YES] (L221) → deleteEnd()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public refBasisBuildGrid() | L67-90 | 필드 초기화 | 조회창 Tdm43_Lookup_RefBasis 열기 | 업무 |
| public icsBuildGrid() | L92-131 | 필드 초기화 | 조회창 Ics01_Lookup_ClassTreeDetail 열기, 확인창 표시, GridDeleteData tdm.Tdm45_ManlRelateIcs.delete(체크된 행 목록) | 업무 |
| public icrBuildGrid() | L133-172 | 필드 초기화 | 조회창 Icr01_Lookup_ClassTreeDetail 열기, 확인창 표시, GridDeleteData tdm.Tdm46_ManlRelateIcr.delete(체크된 행 목록) | 업무 |
| public formBuildGrid() | L174-213 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 확인창 표시, GridDeleteData sys.Sys11_RelateFile.delete(체크된 행 목록) | 업무 |
| public dcrBuildGrid() | L215-248 | 필드 초기화 | 확인창 표시, GridDeleteData tdm.Tdm47_ManlRelateDcr.delete(체크된 행 목록) | 업무 |
| public retrieve() | L250-270 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieveIcs() | L272-283 | retrieve | 서비스 tdm.Tdm45_ManlRelateIcs.selectByManlId(manlId) | 업무 |
| private retrieveIcr() | L285-296 | retrieve | 서비스 tdm.Tdm46_ManlRelateIcr.selectByManlId(manlId) | 업무 |
| private retrieveForm() | L298-309 | retrieve | 서비스 sys.Sys11_RelateFile.selectByParentId(parentId) | 업무 |
| private retrieveDcr() | L311-322 | retrieve | 서비스 tdm.Tdm47_ManlRelateDcr.selectByManlId(manlId) | 업무 |
| private deleteEnd() | L324-335 | E1,E2,E3,E4 | 서비스 tdm.Tdm43_Manl.selectById(manlId) | 업무 |

#### Grid Spec
```javascript
const refBasisBuildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L86) addTextLimitArea
  // ⚠ 대응 없음 (GridBuilder L87) addCell
];

const icsBuildGrid = () => [
  gb.text('icsClassTreeNm', 250, '연관법규'),  // L126 SQL 계산 컬럼(selectByManlId: ics01_class_tree_nm)
  // ⚠ 대응 없음 (GridBuilder L127) addCell
  // ⚠ 대응 없음 (GridBuilder L128) addCell
];

const icrBuildGrid = () => [
  gb.text('icrClassTreeNm', 250, '연관내규'),  // L167 SQL 계산 컬럼(selectByManlId: icr01_class_tree_nm)
  // ⚠ 대응 없음 (GridBuilder L168) addCell
  // ⚠ 대응 없음 (GridBuilder L169) addCell
];

const formBuildGrid = () => [
  gb.text('fileNm', 250, '연관양식'),  // L208 SQL 계산 컬럼(selectByParentId: sys10_file_nm)
  // ⚠ 대응 없음 (GridBuilder L209) addCell
  // ⚠ 대응 없음 (GridBuilder L210) addCell
];

const dcrBuildGrid = () => [
  gb.textArea('dcrClassTreeFNm', 290, '연관문서분류'),  // L244 SQL 계산 컬럼(selectByManlId: f_class_tree_nm_allpath(tdm47_dcr_class…)
  // ⚠ 대응 없음 (GridBuilder L245) addCell
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Tdm43_Lookup_RefBasis (`client/vi/tdm/Tdm43_Lookup_RefBasis.java`, 102줄)

- 입력·하위 화면: `refBasis` TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L33-56) → settings(), show()
[E1] updateButton[저장].Select (L61) → update()
[E2] closeButton[닫기].Select (L67) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private update() | L75-97 | E1 | 서비스 tdm.Tdm43_Manl.updateRefBasis(manlId, refBasis) | 업무 |
| private settings() | L58-73 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L99-101 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm43_Lookup_RelateFormFileList (`client/vi/tdm/Tdm43_Lookup_RelateFormFileList.java`, 203줄)

- 툴바 `buttonBar`: 구분: {typeComboBox} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `typeComboBox` ComboBoxField("TdmCheckFormType", "%", "전체", "전체"), `searchText` TextField 빈칸="파일명/비고"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - tdmCheckFormTypeName 200 "구분" Text
  - fileName 500 "파일명" Text
  - note 200 "비고" Text
  - regDate 100 "등록일" Date
  - actionCell 70 "다운로드" Cell 편집:downloadCell

#### 이벤트
[E0] 화면 열림 (생성자 L64-69) → 초기화
[E1] typeComboBox[TdmCheckFormType].Collapse (L101) → retrieve()
[E2] searchText.KeyPress [Enter] (L110) → retrieve()
[E3] retrieveButton[조회].Select (L121) → retrieve()
[E4] confirmButton[확인].Select (L127) → confirm()
[E5] closeButton[닫기].Select (L133) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L47-50 | buildGrid,retrieve | 상태 처리 | 업무 |
| public open() | L71-97 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L99-139 | open | 상태 처리 | 업무 |
| private retrieve() | L166-180 | E1,E2,E3,execute | 서비스 sys.Sys10_File.selectUnConnTdmFormFile(companyId, tdmCheckFormType, searchText, relateId) | 업무 |
| private confirm() | L182-194 | E4 | 미선택 시 alert "선택한 파일이 없습니다" | 업무 |
| private buildGrid() | L141-164 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L196-198 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L199-201 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('tdmCheckFormTypeNm', 200, '구분'),  // L157 SQL 계산 컬럼(selectUnConnTdmFormFile: f_cdnm('TdmCheckFormType', sys10_tdm_ch…)
  gb.text('fileNm', 500, '파일명'),  // L158
  gb.text('note', 200, '비고'),  // L159
  gb.date('regDate', 100, '등록일'),  // L160
  // ⚠ 대응 없음 (GridBuilder L161) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm43_Lookup_EtcModify (`client/vi/tdm/Tdm43_Lookup_EtcModify.java`, 217줄)

- 입력·하위 화면: `checkEvidDocName` TextArea, `startDate` MyDateField, `ceoDutyCode` TextField, `ceoDutyName` ComboBoxField("TdmCeoDutyCode", "(해당없음)") 빈칸="선택하세요", `exctDutyMap` TextField, `exctDutyName` LookupTriggerField 빈칸="선택하세요", `importLevelCode` TextField, `importLevelName` ComboBoxField("TdmImportLevelCode", "(선택안함)") 빈칸="선택하세요", `lookup` Tdm43_Lookup_ExctDuty

#### 이벤트
[E0] 화면 열림 (생성자 L63-77) → getEditor(), settings(), show()
[E1] exctDutyName[임원의무].TriggerClick (L99) → lookupExctDuty()
[E2] unUseButton[미사용].Select (L106) → 서비스 yyyy.MM.dd
[E3] updateButton[저장].Select (L112) → update()
[E4] closeButton[닫기].Select (L118) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L79-92 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L126-158 | 생성자 | 상태 처리 | 업무 |
| private update() | L160-190 | E3 | 서비스 tdm.Tdm43_Manl.updateEtc(companyId, stdDate, searchText, manlModel) | 업무 |
| private lookupExctDuty() | L192-209 | E1 | 조회창 Tdm43_Lookup_ExctDuty 열기 | 업무 |
| private settings() | L94-124 | 생성자 | 서비스 yyyy.MM.dd, 이벤트 연결, 초기값: startDate=DateTimeFormat.getFormat("yyyy.MM.dd"("사용시작일") | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L211-213 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L214-216 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="unknown" onClick={() => /* 서비스 yyyy.MM.dd */}>미사용</Button>

### Tdm43_Lookup_ExctDuty (`client/vi/tdm/Tdm43_Lookup_ExctDuty.java`, 239줄)

- 입력·하위 화면: `checkBox01` CheckBox, `checkBox02` CheckBox, `checkBox03` CheckBox, `checkBox04` CheckBox, `checkBox05` CheckBox, `checkBox06` CheckBox

#### 이벤트
[E0] 화면 열림 (생성자 L83-148) → show()
[E1] selectButton[선택완료].Select (L120) → select()
[E2] closeButton[닫기].Select (L126) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L36-43 | 공개 메서드 | 상태 처리 | 업무 |
| private checkBox() | L45-81 | open | 상태 처리 | 업무 |
| public select() | L150-234 | E1 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L236-238 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={select}>선택완료</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm43_Edit_Manl (`client/vi/tdm/Tdm43_Edit_Manl.java`, 637줄)

- 입력·하위 화면: `roleName` TextField, `taskName` TextField, `taskRelateDetailName` MyTextArea, `taskRelateDutyName` MyTextArea, `checkItem` MyTextArea 빈칸="점검항목명을 입력하세요", `checkCycleCode` TextField, `checkMonth` TextField, `ceoDutyCode` TextField, `ceoDutyName` ComboBoxField("TdmCeoDutyCode", "(해당없음)") 빈칸="선택하세요", `exctDutyMap` TextField, `exctDutyName` LookupTriggerField 빈칸="선택하세요", `importLevelCode` TextField, `importLevelName` ComboBoxField("TdmImportLevelCode", "(선택안함)") 빈칸="선택하세요", `checkMonth01Yn` CheckBox, `checkMonth02Yn` CheckBox, `checkMonth03Yn` CheckBox, `checkMonth04Yn` CheckBox, `checkMonth05Yn` CheckBox, `checkMonth06Yn` CheckBox, `checkMonth07Yn` CheckBox, `checkMonth08Yn` CheckBox, `checkMonth09Yn` CheckBox, `checkMonth10Yn` CheckBox, `checkMonth11Yn` CheckBox, `checkMonth12Yn` CheckBox, `checkEvidDocName` MyTextArea 빈칸="증빙자료명을 입력하세요", `checkHow` MyTextArea 빈칸="점검방법을 입력하세요", `refBasis` MyTextArea, `startDate` MyDateField, `relateList` Tdm43_Page_Relate, `checkCycleName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택하세요"

#### 이벤트
[E0] 화면 열림 (생성자 L184-195) → settings(), show()
[E1] exctDutyName[임원의무].TriggerClick (L211) → lookupExctDuty()
[E2] unUseButton[미사용].Select (L218) → 서비스 yyyy.MM.dd
[E3] updateButton[저장].Select (L224) → update()
[E4] closeButton[닫기].Select (L230) → hide()
[E5] checkCycleName[점검주기].Collapse (L243) → setCheckMonthBox()
[E6] checkMonth01Yn.ValueChange (L250) → getCheckMonth()
[E7] checkMonth02Yn.ValueChange (L256) → getCheckMonth()
[E8] checkMonth03Yn.ValueChange (L262) → getCheckMonth()
[E9] checkMonth04Yn.ValueChange (L268) → getCheckMonth()
[E10] checkMonth05Yn.ValueChange (L274) → getCheckMonth()
[E11] checkMonth06Yn.ValueChange (L280) → getCheckMonth()
[E12] checkMonth07Yn.ValueChange (L286) → getCheckMonth()
[E13] checkMonth08Yn.ValueChange (L292) → getCheckMonth()
[E14] checkMonth09Yn.ValueChange (L298) → getCheckMonth()
[E15] checkMonth10Yn.ValueChange (L304) → getCheckMonth()
[E16] checkMonth11Yn.ValueChange (L310) → getCheckMonth()
[E17] checkMonth12Yn.ValueChange (L316) → getCheckMonth()
[E18] anchor.MouseDown (L328) → 인라인 L328-334 (new MouseDownHandler() { @Override pu…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L114-147 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L149-166 | 공개 메서드 | 상태 처리 | 업무 |
| public view() | L168-182 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L324-426 | insert,edit,view | 상태 처리 | 업무 |
| private getCheckMonthForm() | L428-464 | getEditor | 상태 처리 | 업무 |
| public update() | L466-511 | E3 | 서비스 tdm.Tdm43_Manl.modelUpdate(relateIcsList, relateIcrList, relateFormList, relateDcrList) | 업무 |
| private setCheckMonthBox() | L513-582 | E5 | 상태 처리 | 업무 |
| private getCheckMonth() | L584-601 | E6,E7,E8,E9,E10,E11,E12,E13,E14,E15,E16,E17,setCheckMonthBox | 상태 처리 | 업무 |
| private lookupExctDuty() | L603-620 | E1 | 조회창 Tdm43_Lookup_ExctDuty 열기 | 업무 |
| private settings() | L197-322 | 생성자 | 서비스 yyyy.MM.dd, sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결, 초기값: startDate=DateTimeFormat.getFormat("yyyy.MM.dd"("사용시작일"), checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth(, checkMonth=getCheckMonth( | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L622-624 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L625-627 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L628-630 | getCheckMonthForm | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L631-633 | insert,edit,view | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L634-636 | getCheckMonthForm | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="unknown" onClick={() => /* 서비스 yyyy.MM.dd */}>미사용</Button>

### Tdm43_Page_Relate (`client/vi/tdm/Tdm43_Page_Relate.java`, 774줄)

- 툴바 `buttonBar`: {insertButton}
- 입력·하위 화면: `relateRefBasisArea` TextArea, `lookupIcs` Ics01_Lookup_ClassTreeDetail, `lookupIcr` Icr01_Lookup_ClassTreeDetail, `lookupForm` Sys10_Lookup_FileViewer, `lookup` Ics01_Lookup_SelectMulti
- 그리드 `relateIcsGrid` (buildRelateIcsGrid()):
  - icsClassTreeName 350 "법규명" Text
  - actionCell 35 "보기" Cell 편집:viewCell
  - actionCell 35 "삭제" Cell 편집:deleteCell
- 그리드 `relateIcrGrid` (buildRelateIcrGrid()):
  - icrClassTreeName 350 "내규명" Text
  - actionCell 35 "보기" Cell 편집:viewCell
  - actionCell 35 "삭제" Cell 편집:deleteCell
- 그리드 `relateFormGrid` (buildRelateFormGrid()):
  - fileName 350 "파일명" Text
  - actionCell 35 "보기" Cell 편집:viewCell
  - actionCell 35 "삭제" Cell 편집:deleteCell
- 그리드 `relateDcrGrid` (buildRelateDcrGrid()):
  - dcrClassTreeFullName 450 "문서분류명" TextArea
  - actionCell 35 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L90-121) → settings()
[E1] plainTabPanel.Selection [arg0 != null] (L163) → buttonSettings()
[E2] insertButton[추가].Select (L181) → insert()
[E3] relateIcsGrid.getStore().StoreAdd (L189) → clearPanel()
[E4] relateIcsGrid.getStore().StoreRemove (L195) → clearPanel()
[E5] relateIcrGrid.getStore().StoreAdd (L203) → clearPanel()
[E6] relateIcrGrid.getStore().StoreRemove (L209) → clearPanel()
[E7] relateFormGrid.getStore().StoreAdd (L217) → clearPanel()
[E8] relateFormGrid.getStore().StoreRemove (L223) → clearPanel()
[E9] relateDcrGrid.getStore().StoreAdd (L231) → clearPanel()
[E10] relateDcrGrid.getStore().StoreRemove (L237) → clearPanel()
[E11] messageBox.DialogHide [YES] (L380) → 서비스 tdm.Tdm45_ManlRelateIcs.delete
[E12] messageBox.DialogHide [YES] (L416) → 서비스 tdm.Tdm46_ManlRelateIcr.delete
[E13] messageBox.DialogHide [YES] (L452) → 서비스 sys.Sys11_RelateFile.delete
[E14] messageBox.DialogHide [YES] (L481) → 서비스 tdm.Tdm47_ManlRelateDcr.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public updateYn() | L123-125 | 공개 메서드 | 상태 처리 | 업무 |
| private buttonSettings() | L127-135 | E1,settings | 상태 처리 | 업무 |
| private setGridColumn() | L137-157 | buttonSettings | 상태 처리 | 업무 |
| private insert() | L245-255 | E2 | 상태 처리 | 업무 |
| public retrieve() | L257-265 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieveRelateIcsGrid() | L268-277 | retrieve | 서비스 tdm.Tdm45_ManlRelateIcs.selectByManlId(manlId) | 업무 |
| public retrieveRelateIcrGrid() | L280-289 | retrieve | 서비스 tdm.Tdm46_ManlRelateIcr.selectByManlId(manlId) | 업무 |
| public retrieveRelateFormGrid() | L292-301 | retrieve | 서비스 sys.Sys11_RelateFile.selectByParentId(parentId) | 업무 |
| public retrieveRelateDcrGrid() | L304-313 | retrieve | 서비스 tdm.Tdm47_ManlRelateDcr.selectByManlId(manlId) | 업무 |
| public inputIcsLine() | L315-326 | 공개 메서드 | 상태 처리 | 업무 |
| public inputIcrLine() | L328-339 | 공개 메서드 | 상태 처리 | 업무 |
| public inputFormLine() | L341-352 | 공개 메서드 | 상태 처리 | 업무 |
| public inputDcrLine() | L354-365 | 공개 메서드 | 상태 처리 | 업무 |
| private buildRelateIcsGrid() | L367-401 | 필드 초기화 | 조회창 Ics01_Lookup_ClassTreeDetail 열기, 확인창 표시, GridDeleteData tdm.Tdm45_ManlRelateIcs.delete(체크된 행 목록) | 업무 |
| private buildRelateIcrGrid() | L403-437 | 필드 초기화 | 조회창 Icr01_Lookup_ClassTreeDetail 열기, 확인창 표시, GridDeleteData tdm.Tdm46_ManlRelateIcr.delete(체크된 행 목록) | 업무 |
| private buildRelateFormGrid() | L439-473 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 확인창 표시, GridDeleteData sys.Sys11_RelateFile.delete(체크된 행 목록) | 업무 |
| private buildRelateDcrGrid() | L475-502 | 필드 초기화 | 확인창 표시, GridDeleteData tdm.Tdm47_ManlRelateDcr.delete(체크된 행 목록) | 업무 |
| public getRelateIcsList() | L505-518 | 공개 메서드 | 상태 처리 | 업무 |
| public getRelateIcrList() | L520-533 | 공개 메서드 | 상태 처리 | 업무 |
| public getRelateFormList() | L535-548 | 공개 메서드 | 상태 처리 | 업무 |
| public getRelateDcrList() | L550-563 | 공개 메서드 | 상태 처리 | 업무 |
| public getRefBasis() | L565-567 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRelateIcsList() | L569-602 | insert | 조회창 Ics01_Lookup_SelectMulti 열기 | 업무 |
| public insertRelateIcrList() | L604-637 | insert | 조회창 Icr01_Lookup_SelectMulti 열기 | 업무 |
| public insertRelateFormList() | L639-672 | insert | 조회창 Tdm43_Lookup_RelateFormFileList 열기 | 업무 |
| public insertRelateDcrList() | L674-708 | insert | 조회창 Dcr01_Lookup_SelectMulti 열기 | 업무 |
| public clearPanel() | L709-767 | E3,E4,E5,E6,E7,E8,E9,E10,retrieveRelateIcsGrid,retrieveRelateIcrGrid,retrieveRelateFormGrid,retrieveRelateDcrGrid | 상태 처리 | 업무 |
| private specialCharacters() | L769-773 | clearPanel | 상태 처리 | 업무 |
| private settings() | L159-243 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
```javascript
const buildRelateIcsGrid = () => [
  gb.text('icsClassTreeNm', 350, '법규명'),  // L396 SQL 계산 컬럼(selectByManlId: ics01_class_tree_nm)
  // ⚠ 대응 없음 (GridBuilder L397) addCell
  // ⚠ 대응 없음 (GridBuilder L398) addCell
];

const buildRelateIcrGrid = () => [
  gb.text('icrClassTreeNm', 350, '내규명'),  // L432 SQL 계산 컬럼(selectByManlId: icr01_class_tree_nm)
  // ⚠ 대응 없음 (GridBuilder L433) addCell
  // ⚠ 대응 없음 (GridBuilder L434) addCell
];

const buildRelateFormGrid = () => [
  gb.text('fileNm', 350, '파일명'),  // L468 SQL 계산 컬럼(selectByParentId: sys10_file_nm)
  // ⚠ 대응 없음 (GridBuilder L469) addCell
  // ⚠ 대응 없음 (GridBuilder L470) addCell
];

const buildRelateDcrGrid = () => [
  gb.textArea('dcrClassTreeFNm', 450, '문서분류명'),  // L498 SQL 계산 컬럼(selectByManlId: f_class_tree_nm_allpath(tdm47_dcr_class…)
  // ⚠ 대응 없음 (GridBuilder L499) addCell
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insert}>추가</Button>

