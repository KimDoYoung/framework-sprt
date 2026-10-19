# Dcr00_Tab_ApprList

- 종류: 화면
- 메뉴: 문서작성 > 02. 문서검색 > 문서 다운로드 (#1326)
- 파일: `client/vi/dcr/Dcr00_Tab_ApprList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr40_Lookup_DownloadHistory`](../../apr/components/Apr40_Lookup_DownloadHistory.md), [`Dcr01_Lookup_DcrClass`](../../dcr/components/Dcr01_Lookup_DcrClass.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr40_DownloadHistory.updateList` | Dcr00_Tab_ApprList:322 | [`Apr40_DownloadHistory.java:52`](../../apr/services/Apr40_DownloadHistory.md) | [`apr40_download_history.insert`](../../apr/sql/apr40_download_history.md) |
| `dcr.Dcr00_DocList.getAppr` | Dcr00_Tab_ApprList:230 | [`Dcr00_DocList.java:222`](../../dcr/services/Dcr00_DocList.md) | [`dcr00_doc_list.getAppr`](../../dcr/sql/dcr00_doc_list.md) |
| `utils.pdf.PDFCreate.createInPDF7` | Dcr00_Tab_ApprList:282 | [`PDFCreate.java:43`](../../utils/services/pdf.PDFCreate.md) | - |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr13_person_auth`](../../../db/tables/apr.md), [`apr40_download_history`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr00_Tab_ApprList (`client/vi/dcr/Dcr00_Tab_ApprList.java`, 343줄)

- 레이아웃: center=getCenter()
- 툴바 `buttonBar`: 등록기간: {regDate} ~: {endRegDate} 문서분류: {classTreeName} 검색: {searchText} {retrieveButton} {downloadButton} {historyButton}
- 입력·하위 화면: `regDate` MyDateField, `endRegDate` MyDateField, `searchText` TextField 빈칸="상신제목/등록자/부서명/비고", `classTreeName` LookupTriggerField 빈칸="전체", `searchPopup` Dcr01_Lookup_DcrClass, `lookup` Apr40_Lookup_DownloadHistory, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - actionCell 40 "" Cell 편집:actionCell
  - classTreeName 500 "문서분류" Text
  - regDate 100 "등록일" Date
  - inoutName 70 "문서구분" TextCenter
  - aprTitle 500 "상신제목" Text
  - empName 100 "등록자" TextCenter
  - fileCount 50 "파일갯수" Long

#### 이벤트
[E0] 화면 열림 (생성자 L77-79) → init()
[E1] classTreeName.TriggerClick [result == null] (L118) → 인라인 L118-137 (new TriggerClickHandler() { @Override…)
[E2] searchText.KeyPress [Enter] (L138) → retrieve()
[E3] retrieveButton[조회].Select (L146) → retrieve()
[E4] downloadButton[다운로드].Select (L152) → downloadChk()
       └ [E6] msgBox.DialogHide [YES] (L246) → makePDF()
[E5] historyButton[기록보기].Select (L158) → 인라인 L158-164 (new SelectHandler(){ @Override public…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L81-92 | 생성자 | 상태 처리 | 업무 |
| private getCenter() | L94-107 | init | 상태 처리 | 업무 |
| private getButtonBar() | L109-187 | getCenter | 조회창 Dcr01_Lookup_DcrClass 열기, 조회창 Apr40_Lookup_DownloadHistory 열기 | 업무 |
| public retrieve() | L218-236 | E2,E3 | 서비스 dcr.Dcr00_DocList.getAppr(companyId, orgId, empId, classTreeId, regDate, endRegDate, searchText, admin) | 업무 |
| private downloadChk() | L238-261 | E4 | ConfirmBox → E6 | 업무 |
| private makePDF() | L263-293 | E6 | 상태 처리 | 업무 |
| private fileDownload() | L295-319 | makePDF | 상태 처리 | 업무 |
| private insertHistory() | L321-334 | fileDownload | 서비스 apr.Apr40_DownloadHistory.updateList(companyId, personId, selectList) | 업무 |
| public getServiceResult() | L337-338 | makePDF,insertHistory | 상태 처리 | 업무 |
| public buildGrid() | L189-216 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L340-342 | getButtonBar | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L207) addCell
  gb.text('classTreeNm', 500, '문서분류'),  // L208
  gb.date('regDate', 100, '등록일'),  // L209
  gb.textCenter('inoutNm', 70, '문서구분'),  // L210
  gb.text('title', 500, '상신제목'),  // L211
  gb.textCenter('korNm', 100, '등록자'),  // L212
  gb.long('fileCount', 50, '파일갯수'),  // L213
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={downloadChk}>다운로드</Button>
3. <Button type="view" onClick={() => /* 인라인 L158-164 (new SelectHandler(){ @Override public…) */}>기록보기</Button>

