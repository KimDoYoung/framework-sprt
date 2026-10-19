# Est02_Tab_PfResultReport

- 종류: 화면
- 메뉴: 펀드관리 > 05. 부동산PF 용역수행 > 용역결과보고서 (#1378)
- 파일: `client/vi/est/Est02_Tab_PfResultReport.java`
- 함께 쓰는 클래스 2개:
  - `Est03_TabPage_PfHistoryList` `client/vi/est/Est03_TabPage_PfHistoryList.java`
  - `Est04_Lookup_PfFile` `client/vi/est/Est04_Lookup_PfFile.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Est02_Tab_PfResultReport:162 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Est02_Tab_PfResultReport:224 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `est.Est02_PfContract.selectByText` | Est02_Tab_PfResultReport:210 | [`Est02_PfContract.java:27`](../../est/services/Est02_PfContract.md) | [`est02_pf_contract.selectByText`](../../est/sql/est02_pf_contract.md) |
| `est.Est02_PfContract.updateResultApprId` | Est02_Tab_PfResultReport:265 | [`Est02_PfContract.java:59`](../../est/services/Est02_PfContract.md) | [`est02_pf_contract.updateResultApprId`](../../est/sql/est02_pf_contract.md) |
| `est.Est03_PfHistory.selectByPfContractId` | Est03_TabPage_PfHistoryList:83 | [`Est03_PfHistory.java:27`](../../est/services/Est03_PfHistory.md) | [`est03_pf_history.selectByPfContractId`](../../est/sql/est03_pf_history.md) |
| `est.Est04_PfFile.selectByPfHistoryId` | Est04_Lookup_PfFile:127 | [`Est04_PfFile.java:22`](../../est/services/Est04_PfFile.md) | [`est04_pf_file.selectByPfHistoryId`](../../est/sql/est04_pf_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`est01_pf_fee_type`](../../../db/tables/est.md), [`est02_pf_contract`](../../../db/tables/est.md), [`est03_pf_history`](../../../db/tables/est.md), [`est04_pf_file`](../../../db/tables/est.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Est02_Tab_PfResultReport (`client/vi/est/Est02_Tab_PfResultReport.java`, 317줄)

- 레이아웃: center=vlc, south=tabPage
- 툴바 `buttonBar`: 조회기준일: {startDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `searchText` TextField 빈칸="차주명/사업자명/수수료명", `tabPage` Est03_TabPage_PfHistoryList, `editor` Apr01_Edit_ApprDoc, `popup` Dcr01_Lookup_Class, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid()):
  - borrower 250 "차주명" Text
  - projectSiteName 300 "사업자명" Text
  - projectSiteAddr 300 "사업장 주소지" Text
  - feeName 250 "용역(수수료)명" Text
  - startDate 100 "수행시작일" Date
  - closeDate 100 "수행종료일" Date
  - actionCell 50 "결재" Cell 편집:actionCell01
  - resultApprStatusName 100 "결재상태" TextCenter
  - actionCell 100 "문서보기" Cell 편집:actionCell02

#### 이벤트
[E0] 화면 열림 (생성자 L61-89) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L96) → retrieve()
[E2] retrieveButton[조회].Select (L104) → retrieve()
[E3] grid.RowClick (L110) → retrieveTabpage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveTabpage() | L118-126 | E3 | 상태 처리 | 업무 |
| public retrieve() | L203-221 | 생성자,E1,E2,updateResultApprId | 서비스 est.Est02_PfContract.selectByText(companyId, startDate, searchText) | 업무 |
| private getClassTreeModel() | L223-247 | buildGrid | 조회창 Dcr01_Lookup_Class 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertLinkApproval() | L249-262 | getClassTreeModel | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateResultApprId() | L264-276 | insertLinkApproval | 서비스 est.Est02_PfContract.updateResultApprId(pfContractId, apprId) | 업무 |
| public createMapping() | L278-290 | insertLinkApproval | 상태 처리 | 업무 |
| private checkStringNull() | L292-300 | createMapping | 상태 처리 | 업무 |
| private checkDateNull() | L302-312 | createMapping | 상태 처리 | 업무 |
| private settings() | L91-116 | 생성자 | 이벤트 연결, 초기값: startDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L128-201 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById(apprId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L314-316 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('borrower', 250, '차주명'),  // L190
  gb.text('projectSiteNm', 300, '사업자명'),  // L191
  gb.text('projectSiteAddr', 300, '사업장 주소지'),  // L192
  gb.text('feeNm', 250, '용역(수수료)명'),  // L193
  gb.date('startDate', 100, '수행시작일'),  // L194
  gb.date('closeDate', 100, '수행종료일'),  // L195
  // ⚠ 대응 없음 (GridBuilder L196) addCell
  gb.textCenter('resultApprStatusNm', 100, '결재상태'),  // L197
  // ⚠ 대응 없음 (GridBuilder L198) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Est03_TabPage_PfHistoryList (`client/vi/est/Est03_TabPage_PfHistoryList.java`, 142줄)

- 툴바 `buttonBar`: <font style='font-size:14px;'><b>▶ 일정별 용역 수행내역</b></font>:
- 입력·하위 화면: `lookup` Est04_Lookup_PfFile
- 그리드 `grid` (buildGrid()):
  - no 50 "연번" LongCenter
  - startDate 100 "수행시작일" Date
  - closeDate 100 "수행종료일" Date
  - content 350 "용역수행내역" Text
  - detail 450 "용역수행내역상세" Text
  - orgName 150 "담당부서" Text
  - fileCountStr 100 "증빙자료" Text
  - actionCell 50 " " Cell 편집:actionCell
  - statusName 100 "승인상태" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L35-49) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L75-89 | 공개 메서드 | 서비스 est.Est03_PfHistory.selectByPfContractId(companyId, pfContractId) | 업무 |
| public getListHtml() | L92-124 | 공개 메서드 | 상태 처리 | 업무 |
| public statusCheck() | L126-137 | 공개 메서드 | 상태 처리 | 업무 |
| public init() | L139-141 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L51-73 | 필드 초기화 | 조회창 Est04_Lookup_PfFile 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.longCenter('no', 50, '연번'),  // L62
  gb.date('startDate', 100, '수행시작일'),  // L63
  gb.date('closeDate', 100, '수행종료일'),  // L64
  gb.text('content', 350, '용역수행내역'),  // L65
  gb.text('detail', 450, '용역수행내역상세'),  // L66
  gb.text('orgNm', 150, '담당부서'),  // L67
  gb.text('fileCountStr', 100, '증빙자료'),  // L68
  // ⚠ 대응 없음 (GridBuilder L69) addCell
  gb.textCenter('statusNm', 100, '승인상태'),  // L70
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Est04_Lookup_PfFile (`client/vi/est/Est04_Lookup_PfFile.java`, 138줄)

- 툴바 `buttonBar`: {retrieveButton} {fileDownloadForm}
- 입력·하위 화면: `viewer` Sys10_Lookup_FileViewer
- 그리드 `grid` (buildGrid()):
  - fileDesc 150 "증빙파일형식" Text
  - fileName 350 "파일명" Text
  - actionCell 50 "받기" Cell 편집:downloadCell
  - checkRoute 250 "증빙 확인 경로<br>(증빙첨부 불가시)" Text

#### 이벤트
[E0] 화면 열림 (생성자 L51-99) → show()
[E1] retrieveButton[새로고침].Select (L66) → retrieve()
[E2] closeButton[닫기].Select (L72) → hide()
[E3] grid.CellClick [event.getCellIndex() == 2] (L78) → 인라인 L78-89 (new CellClickHandler() { @Override pu…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L46-49 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L121-133 | E1,open | 서비스 est.Est04_PfFile.selectByPfHistoryId(pfHistoryId) | 업무 |
| public buildGrid() | L101-119 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L135-137 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fileDesc', 150, '증빙파일형식'),  // L113
  gb.text('fileNm', 350, '파일명'),  // L114 SQL 계산 컬럼(selectByPfHistoryId: sys10_file_nm)
  // ⚠ 대응 없음 (GridBuilder L115) addCell
  gb.text('checkRoute', 250, '증빙 확인 경로<br>(증빙첨부 불가시)'),  // L116
];
```

#### 사용된 버튼들
1. <Button type="reset" onClick={retrieve}>새로고침</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

