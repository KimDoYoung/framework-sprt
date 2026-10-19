# Apr01_Tab_SubList

- 종류: 화면
- 메뉴: 문서작성 > 06. 문서작성현황 > 건별명세 (#1011)
- 파일: `client/vi/apr/Apr01_Tab_SubList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectBySubList` | Apr01_Tab_SubList:248 | [`Apr01_Appr.java:1131`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectBySubList`](../../apr/sql/apr01_appr.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr20_relate_ics`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_emptrans`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr01_Tab_SubList (`client/vi/apr/Apr01_Tab_SubList.java`, 305줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar01`: 조회기간: {startDate} ~: {closeDate} 담당부서: {orgName} 담당자: {personName} 문서종류: {docTypeCombo} 처리여부: {statusCombo} {searchButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `orgName` TextField, `personName` TextField, `docTypeCombo` StringComboBox, `statusCombo` StringComboBox, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid()):
  - effectDate 120 "일자" Date
  - docTypeName 100 "문서종류" Text
  - classTreeNameAllPath 350 "문서분류" Text
  - title 500 "업무명" Text
  - aprOrgName 150 "담당부서" Text
  - aprPersonName 100 "업무담당자" Text
  - statusName 100 "처리현황" Text
  - actionCell 100 "문서조회" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L52-89) → setInitData(), setting(), retrieve()
[E1] orgName.KeyPress [Enter] (L95) → retrieve()
[E2] personName.KeyPress [Enter] (L104) → retrieve()
[E3] docTypeCombo[전체].Collapse (L120) → retrieve()
[E4] statusCombo[전체].Collapse (L134) → retrieve()
[E5] searchButton[조회].Select (L141) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L91-147 | 생성자 | 상태 처리 | 업무 |
| private setInitData() | L180-190 | 생성자 | 상태 처리 | 업무 |
| public retrieveCall() | L192-203 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L205-254 | 생성자,E1,E2,E3,E4,E5,retrieveCall | 서비스 apr.Apr01_Appr.selectBySubList(companyId, personName, orgName, startDate, closeDate, docType, statusCode) | 업무 |
| private lookupAppr() | L256-300 | buildGrid | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| public buildGrid() | L149-178 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L302-304 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('effectDate', 120, '일자'),  // L168
  gb.text('docTypeName', 100, '문서종류'),  // L169
  gb.text('treeNmAllpath', 350, '문서분류'),  // L170
  gb.text('title', 500, '업무명'),  // L171
  gb.text('aprOrgName', 150, '담당부서'),  // L172
  gb.text('aprPersonName', 100, '업무담당자'),  // L173
  gb.text('statusNm', 100, '처리현황'),  // L174
  // ⚠ 대응 없음 (GridBuilder L175) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

