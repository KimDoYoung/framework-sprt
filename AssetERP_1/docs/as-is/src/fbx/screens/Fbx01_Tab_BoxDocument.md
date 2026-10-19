# Fbx01_Tab_BoxDocument

- 종류: 화면
- 메뉴: 문서작성 > 03. 파일 및 양식관리 > 파일보관함 (#1008, 미사용)
- 파일: `client/vi/fbx/Fbx01_Tab_BoxDocument.java`
- 함께 쓰는 클래스 1개:
  - `Fbx02_Popup_History` `client/vi/fbx/Fbx02_Popup_History.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Dcr01_Lookup_DcrClass`](../../dcr/components/Dcr01_Lookup_DcrClass.md), [`Sys10_BoxDocList`](../../sys/components/Sys10_BoxDocList.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr01_ClassTree.selectByDcrTreeId` | Fbx01_Tab_BoxDocument:298 | [`Dcr01_ClassTree.java:261`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByDcrDown1Bang`](../../dcr/sql/dcr01_class_tree.md) |
| `fbx.Fbx01_Box.delete` | Fbx01_Tab_BoxDocument:403 | [`Fbx01_Box.java:64`](../../fbx/services/Fbx01_Box.md) | `UpdateDataModel(fbx01_box)` 동적 DELETE |
| `fbx.Fbx01_Box.selectByDcrClassId` | Fbx01_Tab_BoxDocument:356 | [`Fbx01_Box.java:41`](../../fbx/services/Fbx01_Box.md) | [`fbx01_box.selectByDcrClassId`](../../fbx/sql/fbx01_box.md) |
| `fbx.Fbx01_Box.update` | Fbx01_Tab_BoxDocument:369 | [`Fbx01_Box.java:59`](../../fbx/services/Fbx01_Box.md) | `UpdateDataModel(fbx01_box)` 동적 INSERT/UPDATE → [`fbx01_box.selectById`](../../fbx/sql/fbx01_box.md) |
| `fbx.Fbx02_History.selectByBoxId` | Fbx02_Popup_History:63 | [`Fbx02_History.java:28`](../../fbx/services/Fbx02_History.md) | [`fbx02_history.selectByBoxId`](../../fbx/sql/fbx02_history.md) |

## 테이블

[`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`fbx01_box`](../../../db/tables/fbx.md), [`fbx02_history`](../../../db/tables/fbx.md), [`fbx03_file`](../../../db/tables/fbx.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate`, `f_to_number`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fbx01_Tab_BoxDocument (`client/vi/fbx/Fbx01_Tab_BoxDocument.java`, 421줄)

- 레이아웃: north=vlc, center=hlc
- 툴바 `buttonBar`: 업무: {dcrClassName} 제목: {searchText} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `searchText` TextField 빈칸="", `dcrClassId` LongField, `dcrClassName` LookupTriggerField, `statusComboBox` ComboBoxField("FbxBoxStatus"), `popup` Fbx02_Popup_History, `searchPopup` Dcr01_Lookup_DcrClass
- 그리드 `grid` (buildGrid(), 체크박스):
  - dcrClassName 300 "업무" Text
  - crtDate 100 "생성일" Date 편집:MyDateField
  - title 800 "제목" Text 편집:TextField
  - fileCount 80 "파일갯수" Long
  - statusName 80 "상태" Text 편집:statusComboBox
  - actionCell 80 "기록" Cell 편집:HistoryCell

#### 이벤트
[E0] 화면 열림 (생성자 L86-89) → retrieve(), init()
[E1] dcrClassName.TriggerClick (L94) → openLookupDcr()
[E2] searchText.KeyPress [Enter] (L101) → retrieve()
[E3] retrieveButton[조회].Select (L110) → retrieve()
[E4] insertButton[등록].Select (L116) → insertRow()
[E5] updateButton[저장].Select (L122) → update()
[E6] deleteButton[삭제].Select (L128) → deleteRow()
       └ [E10] msgBox.DialogHide [YES] (L398) → 서비스 fbx.Fbx01_Box.delete
[E7] grid.SelectionChanged [선택>0] (L151) → retrieveDocTree()
[E8] tree.Selection (L160) → retrieveDocList()
[E9] statusComboBox[FbxBoxStatus].Collapse (L205) → 인라인 L205-211 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L91-197 | 생성자 | 상태 처리 | 업무 |
| package getMenuTree() | L237-273 | 필드 초기화 | 상태 처리 | 업무 |
| private addChild() | L275-284 | getServiceResult | 상태 처리 | 업무 |
| private retrieveDocList() | L286-293 | E8 | 상태 처리 | 업무 |
| public retrieveDocTree() | L295-310 | E7 | 서비스 dcr.Dcr01_ClassTree.selectByDcrTreeId | 업무 |
| public getServiceResult() | L313-326 | 공개 메서드 | 상태 처리 | 업무 |
| private openLookupDcr() | L330-348 | E1 | 조회창 Dcr01_Lookup_DcrClass 열기 | 업무 |
| public retrieve() | L350-365 | 생성자,E2,E3 | 서비스 fbx.Fbx01_Box.selectByDcrClassId(companyId, orgCodeId, dcrClassId, searchText) | 업무 |
| public update() | L367-370 | E5 | 서비스 fbx.Fbx01_Box.update | 업무 |
| public insertRow() | L372-389 | E4 | 상태 처리 | 업무 |
| public deleteRow() | L391-416 | E6 | ConfirmBox → E10 | 업무 |
| public buildGrid() | L199-235 | 필드 초기화 | 팝업 Fbx02_Popup_History 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L418-420 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('dcrClassNm', 300, '업무'),  // L226
  gb.date('crtDate', 100, '생성일', { editor: 'date' }),  // L227
  gb.text('title', 800, '제목', { editor: 'text' }),  // L228
  gb.long('fileCount', 80, '파일갯수'),  // L229
  gb.text('statusNm', 80, '상태', { editor: 'select' }),  // L230
  // ⚠ 대응 없음 (GridBuilder L232) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Fbx02_Popup_History (`client/vi/fbx/Fbx02_Popup_History.java`, 80줄)

- 그리드 `grid` (buildGrid(), 체크박스):
  - actDate 150 "일자" DateTime
  - actName 80 "동작" TextCenter
  - actContent 320 "내용" Text
  - actEmpName 100 "생성자" Text
  - actOrgName 100 "부서" Text

#### 이벤트
[E0] 화면 열림 (생성자 L27-44) → show()
[E1] closeButton[닫기].Select (L34) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L59-69 | open | 서비스 fbx.Fbx02_History.selectByBoxId(companyId, boxId) | 업무 |
| public open() | L71-75 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L46-57 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L77-79 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.dateTime('actDate', 150, '일자'),  // L50
  gb.textCenter('actNm', 80, '동작'),  // L51 SQL 계산 컬럼(selectByBoxId: f_cdnm('FbxHistoryAct', b.fbx02_act_cd,…)
  gb.text('actContent', 320, '내용'),  // L52
  gb.text('actEmpNm', 100, '생성자'),  // L53 SQL 계산 컬럼(selectByBoxId: f_emp_kor_nm(b.fbx02_act_emp_id))
  gb.text('actOrgNm', 100, '부서'),  // L54 SQL 계산 컬럼(selectByBoxId: f_org_nm(b.fbx02_act_org_code_id, b.fbx…)
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

