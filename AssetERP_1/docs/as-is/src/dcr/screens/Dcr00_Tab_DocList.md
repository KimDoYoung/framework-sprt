# Dcr00_Tab_DocList

- 종류: 화면
- 메뉴: 문서작성 > 02. 문서검색 > 통합 문서검색 (#1006)
- 파일: `client/vi/dcr/Dcr00_Tab_DocList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr03_TabPage_Relate`](../../apr/components/Apr03_TabPage_Relate.md), [`Apr42_Lookup_CommentView`](../../apr/components/Apr42_Lookup_CommentView.md), [`Apr50_Lookup_ApprList`](../../apr/components/Apr50_Lookup_ApprList.md), [`Dcr01_Lookup_DcrClass`](../../dcr/components/Dcr01_Lookup_DcrClass.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectByText2` | Dcr00_Tab_DocList:304 | [`Apr01_Appr.java:142`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectByText2`](../../apr/sql/apr01_appr.md) |
| `sys.Sys99_Print.insertRdDocList` | Dcr00_Tab_DocList:315 | [`Sys99_Print.java:3741`](../../sys/services/Sys99_Print.md) | [`apr01_appr.selectByText2ExcelDownload`](../../apr/sql/apr01_appr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`adv02_account`](../../../db/tables/adv.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr12_relate_adv`](../../../db/tables/apr.md), [`apr13_person_auth`](../../../db/tables/apr.md), [`apr50_bookmark`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`sys50_specific_menu`](../../../db/tables/sys.md), [`sys51_specific_menu_person`](../../../db/tables/sys.md), [`sys52_specific_menu_link`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_get_fund_nm2`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr00_Tab_DocList (`client/vi/dcr/Dcr00_Tab_DocList.java`, 386줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar01`: 조회기간: {regDate} ~: {endRegDate} 문서분류: {classTreeName}
- 툴바 `buttonBar02`: 결재상태: {statusCode} 문서구분: {inoutCode} 검색: {searchText} 수신처: {receiveName} {retrieveButton} {downloadButton} {rdFileDownloadForm} {hlc}
- 입력·하위 화면: `statusCode` ComboBoxField("AprStatusCode", "%", "전체"), `inoutCode` ComboBoxField("AprInOutTypeCode", "%", "전체"), `regDate` MyDateField, `endRegDate` MyDateField, `searchText` TextField 빈칸="상신제목/내용/등록자/연관펀드/연관일임/비고/대외문서번호", `receiveName` TextField 빈칸="미입력", `classTreeName` LookupTriggerField 빈칸="전체", `tabPage` Apr03_TabPage_Relate, `lookup` Apr50_Lookup_ApprList, `searchPopup` Dcr01_Lookup_DcrClass, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스):
  - actionCell 40 "" Cell 편집:actionCell01
  - bookmarkYn 30 "" BookMarkYn
  - regDate 90 "등록일" Date
  - regEmpName 80 "등록자" TextCenter
  - statusName 80 "결재상태" ApprStep
  - title 300 "상신제목" Text
  - inOutTypeName 70 "문서구분" TextCenter
  - classTreeName 350 "문서분류" Text
  - receiveName 150 "수신처" Text
  - stampSeq 100 "대외문서번호" TextCenter
  - relateDisplayName 80 "펀드/일임" TextCenter
  - actionCell 50 "댓글" Cell 편집:actionCell02
  - note 300 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L92-157) → settings()
[E1] bookmarkAnchor.MouseDown (L117) → 인라인 L117-123 (new MouseDownHandler() { @Override pu…)
[E2] searchText.KeyPress [Enter] (L183) → retrieve()
[E3] receiveName.KeyPress [Enter] (L194) → retrieve()
[E4] classTreeName.TriggerClick [result == null] (L203) → 인라인 L203-222 (new TriggerClickHandler() { @Override…)
[E5] retrieveButton[조회].Select (L223) → retrieve()
[E6] downloadButton[엑셀다운로드].Select (L229) → createRdExcel()
[E7] grid.RowClick (L235) → 인라인 L235-240 (new RowClickHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L289-310 | E2,E3,E5 | 서비스 apr.Apr01_Appr.selectByText2(classTreeId, startDate, endDate, searchText, orgId, empId, companyId, admin, receiveName, aprStatusCode, aprInoutCode) | 업무 |
| private createRdExcel() | L312-373 | E6 | 서비스 sys.Sys99_Print.insertRdDocList(classTreeId, startDate, endDate, searchText, orgId, empId, admin, receiveName, aprStatusCode, aprInoutCode, personId, companyId, windowClassName) | 업무 |
| private getRegDate() | L375-377 | createRdExcel | 상태 처리 | 업무 |
| private getEndRegDate() | L379-381 | createRdExcel | 상태 처리 | 업무 |
| private settings() | L159-244 | 생성자 | 조회창 Dcr01_Lookup_DcrClass 열기, 이벤트 연결, 초기값: endRegDate=toDay, regDate=endDate, classTreeName="전체", classTreeName=classTreeModel.getClassTreeFullName( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L246-287 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 조회창 Apr42_Lookup_CommentView 열기 → 콜백: unmask, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L383-385 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L271) addCell
  // ⚠ 대응 없음 (GridBuilder L272) addBookMarkYn
  gb.date('regDate', 90, '등록일'),  // L273
  gb.textCenter('regEmpNm', 80, '등록자'),  // L274
  // ⚠ 대응 없음 (GridBuilder L275) addApprStep
  gb.text('title', 300, '상신제목'),  // L276
  gb.textCenter('inOutTypeName', 70, '문서구분'),  // L277
  gb.text('classTreeNm', 350, '문서분류'),  // L278
  gb.text('receiveNm', 150, '수신처'),  // L279
  gb.textCenter('stampSeq', 100, '대외문서번호'),  // L280
  gb.textCenter('relateDisplayName', 80, '펀드/일임'),  // L281
  // ⚠ 대응 없음 (GridBuilder L282) addCell
  gb.text('note', 300, '비고'),  // L284
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>

