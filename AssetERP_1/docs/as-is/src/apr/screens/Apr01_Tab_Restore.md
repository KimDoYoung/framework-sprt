# Apr01_Tab_Restore

- 종류: 화면
- 메뉴: 관리자 > 03. 문서관리 > 폐기문서 복구 (#1098)
- 파일: `client/vi/apr/Apr01_Tab_Restore.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr99_ApprDel.restore` | Apr01_Tab_Restore:269 | [`Apr99_ApprDel.java:43`](../../apr/services/Apr99_ApprDel.md) | [`apr90_disposal_list.deleteByApprId`](../../apr/sql/apr90_disposal_list.md), [`apr91_disposal_history.insert`](../../apr/sql/apr91_disposal_history.md), [`apr99_appr_del.deleteApprId`](../../apr/sql/apr99_appr_del.md), [`apr99_appr_del.restore`](../../apr/sql/apr99_appr_del.md) |
| `apr.Apr99_ApprDel.selectByCompanyId` | Apr01_Tab_Restore:238 | [`Apr99_ApprDel.java:27`](../../apr/services/Apr99_ApprDel.md) | [`apr99_appr_del.selectByCompanyId`](../../apr/sql/apr99_appr_del.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr90_disposal_list`](../../../db/tables/apr.md), [`apr91_disposal_history`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr01_Tab_Restore (`client/vi/apr/Apr01_Tab_Restore.java`, 291줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 담당부서: {orgName} 담당자: {personName} 상신제목: {aprName} {searchButton} {restoreButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `orgName` TextField, `personName` TextField, `aprName` TextField, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 100 "등록일" Date
  - effectDate 100 "시행일" Date
  - classTreeNameAllPath 400 "문서분류" Text
  - title 400 "상신제목" Text
  - actionCell 60 "상세보기" Cell 편집:actionCell
  - aprOrgName 150 "담당부서" Text
  - aprPersonName 100 "담당자" TextCenter
  - delDate 100 "폐기일" Date
  - delEmpName 100 "폐기진행" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L58-93) → buttonSetting(), setInitData(), retrieve()
[E1] searchButton[조회].Select (L102) → retrieve()
[E2] restoreButton[복구].Select (L108) → restoreChk()
       └ [E6] msgBox.DialogHide [YES] (L249) → restore()
[E3] orgName.KeyPress [Enter] (L114) → retrieve()
[E4] personName.KeyPress [Enter] (L122) → retrieve()
[E5] aprName.KeyPress [Enter] (L130) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buttonSetting() | L95-138 | 생성자 | 상태 처리 | 업무 |
| private setInitData() | L194-204 | 생성자 | 상태 처리 | 업무 |
| private retrieve() | L206-244 | 생성자,E1,E3,E4,E5,buildGrid,restore | 서비스 apr.Apr99_ApprDel.selectByCompanyId(companyId, personName, orgName, aprName, startDate, closeDate) | 업무 |
| private restoreChk() | L246-264 | E2 | ConfirmBox → E6 | 업무 |
| private restore() | L266-286 | E6 | 서비스 apr.Apr99_ApprDel.restore | 업무 |
| public buildGrid() | L140-192 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "해당문서의 열람권한이 없습니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L288-290 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '등록일'),  // L180
  gb.date('effectDate', 100, '시행일'),  // L181
  gb.text('treeNmAllpath', 400, '문서분류'),  // L182
  gb.text('title', 400, '상신제목'),  // L183
  // ⚠ 대응 없음 (GridBuilder L184) addCell
  gb.text('aprOrgName', 150, '담당부서'),  // L185
  gb.textCenter('aprPersonName', 100, '담당자'),  // L186
  gb.date('delDate', 100, '폐기일'),  // L187
  gb.textCenter('delEmpName', 100, '폐기진행'),  // L188
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="reset" onClick={restoreChk}>복구</Button>

