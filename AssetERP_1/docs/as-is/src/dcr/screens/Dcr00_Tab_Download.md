# Dcr00_Tab_Download

- 종류: 화면
- 파일: `client/vi/dcr/Dcr00_Tab_Download.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Org00_Lookup_SelectSingle`](../../org/components/Org00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr00_DocList.selectSearchDoc` | Dcr00_Tab_Download:337 | [`Dcr00_DocList.java:21`](../../dcr/services/Dcr00_DocList.md) | [`dcr00_doc_list.selectSearchDoc`](../../dcr/sql/dcr00_doc_list.md) |
| `dcr.Dcr00_DocList.selectSearchDocId` | Dcr00_Tab_Download:339 | [`Dcr00_DocList.java:74`](../../dcr/services/Dcr00_DocList.md) | [`dcr00_doc_list.selectSearchDocId`](../../dcr/sql/dcr00_doc_list.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr13_person_auth`](../../../db/tables/apr.md), [`apr14_relate_ast`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`emp00_trans_info`](../../../db/views.md), [`fnd00_fund`](../../../db/views.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_emp_kor_nm`, `f_max_workdate`, `f_sysdate`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr00_Tab_Download (`client/vi/dcr/Dcr00_Tab_Download.java`, 459줄)

- 레이아웃: center=getCenter()
- 툴바 `buttonBar`: 등록기간: {regDate} ~: {endRegDate} 신탁구분: {sintakComboBox} 공모구분: {publicSubscribeComboBox} 등록담당: {empName} 설정기간: {fundStartDate} ~: {fundEndDate} 유형구분: {fundTypeComboBox} 해지구분: {fundCloseComboBox} 등록부서: {orgCodeName} 문서구분: {classTreeName} 펀드검색: {fundName} 상신제목: {aprTitle} &nbsp;&nbsp;&nbsp;&nbsp;: {resetButton} {retrieveButton} {fileDownload}
- 입력·하위 화면: `regDate` MyDateField, `endRegDate` MyDateField, `sintakComboBox` ComboBoxField("SintakCode", "Y", "전체"), `publicSubscribeComboBox` StringComboBox, `empName` TextField, `fundStartDate` MyDateField, `fundEndDate` MyDateField, `fundTypeComboBox` ComboBoxField("FundTypeCode", "Y", "전체"), `fundCloseComboBox` StringComboBox, `classTreeName` TextField, `fundName` TextField, `aprTitle` TextField, `orgCodeId` LongField, `orgCodeName` LookupTriggerField 빈칸="전체", `editor` Apr01_Edit_ApprDoc, `searchPopup` Org00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스):
  - parentTreeName 120 "문서분류" Text
  - classTreeName 160 "문서구분" Text
  - fundCode 60 "펀드코드" Text
  - fundName 360 "펀드명" Text
  - aprTitle 200 "상신명" Text
  - actionCell 80 "상세보기" Cell 편집:editDocCell
  - fileName 260 "파일명" Text
  - regDate 100 "등록일" Date
  - effectDate 100 "시행일" Date
  - empName 80 "등록자" Text

#### 이벤트
[E0] 화면 열림 (생성자 L91-93) → init()
[E1] empName.KeyPress [Enter] (L140) → retrieve()
[E2] orgCodeName.TriggerClick (L178) → openLookupOrg()
[E3] orgCodeName.Change (L184) → 인라인 L184-191 (new ChangeHandler() { @Override publi…)
[E4] classTreeName.KeyPress [Enter] (L216) → retrieve()
[E5] fundName.KeyPress [Enter] (L224) → retrieve()
[E6] aprTitle.KeyPress [Enter] (L232) → retrieve()
[E7] resetButton[초기화].Select (L249) → 인라인 L249-266 (new SelectHandler(){ @Override public…)
[E8] retrieveButton[검색].Select (L267) → retrieve()
[E9] fileDownload[다운로드].Select (L273) → fileDownload()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L95-106 | 생성자 | 상태 처리 | 업무 |
| private getCenter() | L108-125 | init | 상태 처리 | 업무 |
| private getButtonBar1() | L127-166 | getCenter | 상태 처리 | 업무 |
| private getButtonBar2() | L168-213 | getCenter | 상태 처리 | 업무 |
| private getButtonBar3() | L215-295 | getCenter | 상태 처리 | 업무 |
| public retrieve() | L328-348 | E1,E4,E5,E6,E8,buildGrid | 서비스 dcr.Dcr00_DocList.selectSearchDoc, dcr.Dcr00_DocList.selectSearchDocId | 업무 |
| private setRetrieveParam() | L350-394 | retrieve | 상태 처리 | 업무 |
| public getServiceResult() | L397-398 | 공개 메서드 | 상태 처리 | 업무 |
| private openLookupOrg() | L400-410 | E2 | 조회창 Org00_Lookup_SelectSingle 열기 | 업무 |
| private fileDownload() | L412-449 | E9 | 상태 처리 | 업무 |
| public buildGrid() | L297-326 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L451-453 | getButtonBar1,getButtonBar2,getButtonBar3 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L455-457 | getButtonBar3 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('parentNm', 120, '문서분류'),  // L314
  gb.text('classTreeNm', 160, '문서구분'),  // L315
  gb.text('fundCd', 60, '펀드코드'),  // L316
  gb.text('fundNm', 360, '펀드명'),  // L317
  gb.text('title', 200, '상신명'),  // L318
  // ⚠ 대응 없음 (GridBuilder L319) addCell
  gb.text('fileNm', 260, '파일명'),  // L320
  gb.date('regDate', 100, '등록일'),  // L321
  gb.date('effectDate', 100, '시행일'),  // L322
  gb.text('korNm', 80, '등록자'),  // L323
];
```

#### 사용된 버튼들
1. <Button type="reset" onClick={() => /* 인라인 L249-266 (new SelectHandler(){ @Override public…) */}>초기화</Button>
2. <Button type="search" onClick={retrieve}>검색</Button>
3. <Button type="download" onClick={fileDownload}>다운로드</Button>

