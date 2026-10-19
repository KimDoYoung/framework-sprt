# Dcr00_Tab_FileList

- 종류: 화면
- 메뉴: 문서작성 > 02. 문서검색 > 문서별 첨부파일 검색 (#1224)
- 파일: `client/vi/dcr/Dcr00_Tab_FileList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_DcrClass`](../../dcr/components/Dcr01_Lookup_DcrClass.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr00_DocList.getFile` | Dcr00_Tab_FileList:214 | [`Dcr00_DocList.java:197`](../../dcr/services/Dcr00_DocList.md) | [`dcr00_doc_list.getFile`](../../dcr/sql/dcr00_doc_list.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr13_person_auth`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_sysdate`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr00_Tab_FileList (`client/vi/dcr/Dcr00_Tab_FileList.java`, 278줄)

- 레이아웃: center=getCenter()
- 툴바 `buttonBar`: 등록기간: {regDate} ~: {endRegDate} 문서분류: {classTreeName} 검색: {searchText} {retrieveButton} {fileDownload}
- 입력·하위 화면: `regDate` MyDateField, `endRegDate` MyDateField, `searchText` TextField 빈칸="상신제목/파일명/비고/등록자", `classTreeName` LookupTriggerField 빈칸="전체", `searchPopup` Dcr01_Lookup_DcrClass, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - actionCell 40 "" Cell 편집:actionCell
  - classTreeName 350 "문서분류" Text
  - regDate 100 "등록일" Date
  - inoutName 70 "문서구분" TextCenter
  - aprTitle 450 "상신제목" Text
  - fileName 450 "파일명" Text
  - note 150 "비고" Text
  - empName 100 "등록자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L72-74) → init()
[E1] classTreeName.TriggerClick [result == null] (L113) → 인라인 L113-132 (new TriggerClickHandler() { @Override…)
[E2] searchText.KeyPress [Enter] (L133) → retrieve()
[E3] retrieveButton[조회].Select (L141) → retrieve()
[E4] fileDownload[다운로드].Select (L147) → downloadChk()
       └ [E5] msgBox.DialogHide [YES] (L229) → fileDownload()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L76-87 | 생성자 | 상태 처리 | 업무 |
| private getCenter() | L89-102 | init | 상태 처리 | 업무 |
| private getButtonBar() | L104-171 | getCenter | 조회창 Dcr01_Lookup_DcrClass 열기 | 업무 |
| public retrieve() | L202-220 | E2,E3 | 서비스 dcr.Dcr00_DocList.getFile(companyId, orgId, empId, classTreeId, regDate, endRegDate, searchText, admin) | 업무 |
| private downloadChk() | L222-244 | E4 | ConfirmBox → E5 | 업무 |
| private fileDownload() | L246-269 | E5 | 상태 처리 | 업무 |
| public getServiceResult() | L272-273 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L173-200 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L275-277 | getButtonBar | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L190) addCell
  gb.text('classTreeNm', 350, '문서분류'),  // L191
  gb.date('regDate', 100, '등록일'),  // L192
  gb.textCenter('inoutNm', 70, '문서구분'),  // L193
  gb.text('title', 450, '상신제목'),  // L194
  gb.text('fileNm', 450, '파일명'),  // L195
  gb.text('note', 150, '비고'),  // L196
  gb.textCenter('korNm', 100, '등록자'),  // L197
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={downloadChk}>다운로드</Button>

