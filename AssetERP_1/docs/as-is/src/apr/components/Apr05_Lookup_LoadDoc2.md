# Apr05_Lookup_LoadDoc2

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `com`, `pay`
- 파일: `client/vi/apr/Apr05_Lookup_LoadDoc2.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Dcr01_Lookup_DcrClass`](../../dcr/components/Dcr01_Lookup_DcrClass.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr00_DocList.selectByText` | Apr05_Lookup_LoadDoc2:345 | [`Dcr00_DocList.java:123`](../../dcr/services/Dcr00_DocList.md) | [`dcr00_doc_list.selectByText`](../../dcr/sql/dcr00_doc_list.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr13_person_auth`](../../../db/tables/apr.md), [`apr14_relate_ast`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`com01_relate_appr`](../../../db/tables/com.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`sys50_specific_menu`](../../../db/tables/sys.md), [`sys51_specific_menu_person`](../../../db/tables/sys.md), [`sys52_specific_menu_link`](../../../db/tables/sys.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm47_manl_relate_dcr`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr05_Lookup_LoadDoc2 (`client/vi/apr/Apr05_Lookup_LoadDoc2.java`, 425줄)

- 레이아웃: north=buttonBar, center=grid, east=cp
- 툴바 `buttonBar`: 등록기간: {regDate} ~: {endRegDate} 문서구분: {classTreeName} 검색: {searchText} {retrieveButton} {tdmRelateDcrYn}
- 입력·하위 화면: `regDate` MyDateField, `endRegDate` MyDateField, `searchText` TextField 빈칸="상신제목/내용/펀드코드/펀드명/등록자", `classTreeName` LookupTriggerField 빈칸="전체", `tdmRelateDcrYn` CheckBox, `searchPopup` Dcr01_Lookup_DcrClass
- 그리드 `grid` (buildGrid(), 체크박스(다중), 체크박스):
  - regDate 90 "등록일" Date
  - aprTitle 300 "상신제목" Text
  - receiveName 130 "수신처" Text
  - fundDisplayName 300 "펀드" Text
  - statusName 70 "상태" TextHtml
  - empName 70 "상신자" Text
  - classTreeName 250 "문서구분" Text

#### 이벤트
[E0] 화면 열림 (생성자 L103-108) → init()
[E1] tdmRelateDcrYn[연결된 문서분류만 조회].ValueChange [event.getValue()] (L225) → retrieve()
[E2] classTreeName.TriggerClick [result == null] (L237) → 인라인 L237-256 (new TriggerClickHandler() { @Override…)
[E3] grid.CellClick (L259) → setHtml()
[E4] searchText.KeyPress [Enter] (L269) → retrieve()
[E5] retrieveButton[조회].Select (L277) → retrieve()
[E6] insertButton[확인].Select (L283) → insert()
[E7] nullButton[선택안함].Select [callback != null] (L289) → hide()
[E8] closeButton[닫기].Select (L298) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L133-204 | 생성자 | 상태 처리 | 업무 |
| private retrieve() | L326-351 | E1,E4,E5,init | 서비스 dcr.Dcr00_DocList.selectByText(companyId, orgId, empId, classTreeId, regDate, endRegDate, searchText, statusCheckYn, keyTable, keyTableId, tdmRelateDcrYn) | 업무 |
| private insert() | L366-400 | E6 | 미선택 시 alert "문서를 선택해주세요" | 업무 |
| public getServiceResult() | L403-412 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L206-304 | init | 조회창 Dcr01_Lookup_DcrClass 열기, 이벤트 연결, 초기값: tdmRelateDcrYn=true("연결된 문서분류만 조회"), tdmRelateDcrYn=false("연결된 문서분류만 조회"), classTreeName="전체", classTreeName=classTreeModel.getClassTreeFullName( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L306-324 | settings | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtml() | L353-356 | E3 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L358-360 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L362-364 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L414-416 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| protected setHtmlCheckBoxLabelStyle() | L417-419 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 90, '등록일'),  // L315
  gb.text('title', 300, '상신제목'),  // L316
  gb.text('receiveNm', 130, '수신처'),  // L317
  // ⚠DB없음 L318 fundDisplayName 300 "펀드" (apr01_fund_display_name 컬럼 없음)
  // ⚠ 대응 없음 (GridBuilder L319) addTextHtml
  gb.text('korNm', 70, '상신자'),  // L320
  gb.text('classTreeNm', 250, '문서구분'),  // L321
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={insert}>확인</Button>
3. <Button type="unknown" onClick={hide}>선택안함</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

