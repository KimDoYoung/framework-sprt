# Apr90_Tab_DisposalListAdmin

- 종류: 화면
- 메뉴: 관리자 > 03. 문서관리 > 폐기문서 승인(관리자) (#1253)
- 파일: `client/vi/apr/Apr90_Tab_DisposalListAdmin.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Apr90_Tab_DisposalListAdmin:127 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `apr.Apr90_DisposalList.selectByCompanyId` | Apr90_Tab_DisposalListAdmin:249 | [`Apr90_DisposalList.java:38`](../../apr/services/Apr90_DisposalList.md) | [`apr90_disposal_list.selectByCompanyId`](../../apr/sql/apr90_disposal_list.md) |
| `apr.Apr90_DisposalList.updateAppr` | Apr90_Tab_DisposalListAdmin:205 | [`Apr90_DisposalList.java:81`](../../apr/services/Apr90_DisposalList.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md), [`apr11_advert_book.deleteByApprId`](../../apr/sql/apr11_advert_book.md), [`apr90_disposal_list.updateDisposalCode`](../../apr/sql/apr90_disposal_list.md), [`apr91_disposal_history.insert`](../../apr/sql/apr91_disposal_history.md), [`opr01_create.updateApprIdByApprId`](../../opr/sql/opr01_create.md), [`pln02_plan.updateApprIdByApprId`](../../pln/sql/pln02_plan.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr11_advert_book`](../../../db/tables/apr.md), [`apr90_disposal_list`](../../../db/tables/apr.md), [`apr91_disposal_history`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`opr01_create`](../../../db/tables/opr.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`pln02_plan`](../../../db/tables/pln.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr90_Tab_DisposalListAdmin (`client/vi/apr/Apr90_Tab_DisposalListAdmin.java`, 260줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 처리상태: {disposalComboBox} {retrieveButton} {disposalButton} {returnButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `disposalComboBox` ComboBoxField("DisposalCode", "%", "전체"), `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - disposalName 100 "처리상태" TextCenter
  - regDate 100 "신청일" Date
  - regEmpName 100 "신청자" TextCenter
  - title 350 "문서명" Text
  - actionCell 45 " " CellFix 편집:actionCell
  - statusName 100 "문서상태" TextCenter
  - reason 400 "사유" TextArea
  - confirmYn 100 "승인여부" BooleanYn
  - confirmEmpName 100 "승인(반려)자" TextCenter
  - confirmDate 100 "승인(반려)일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L59-86) → settings()
[E1] retrieveButton[조회].Select (L98) → retrieve()
[E2] disposalButton[승인].Select (L104) → update()
       └ [E4] msgBox.DialogHide [YES] (L195) → retrieve()
[E3] returnButton[반려].Select (L110) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private update() | L170-229 | E2,E3 | 미선택 시 alert "선택된 문서가 존재하지 않습니다" → 확인창 E4 | 업무 |
| private retrieve() | L231-255 | E1,E4 | 서비스 apr.Apr90_DisposalList.selectByCompanyId(companyId, startDate, closeDate, disposalCode) | 업무 |
| private settings() | L88-116 | 생성자 | 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L118-168 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L257-259 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('disposalNm', 100, '처리상태'),  // L156 SQL 계산 컬럼(selectById: f_cdnm('DisposalCode', apr90_disposal_c…)
  gb.date('regDate', 100, '신청일'),  // L157
  gb.textCenter('regEmpNm', 100, '신청자'),  // L158 SQL 계산 컬럼(selectById: f_emp_kor_nm(apr90_reg_emp_id))
  gb.text('title', 350, '문서명'),  // L159 SQL 계산 컬럼(selectById: appr.title)
  // ⚠ 대응 없음 (GridBuilder L160) addCellFix
  gb.textCenter('statusNm', 100, '문서상태'),  // L161 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', appr.status_cd,…)
  gb.textArea('reason', 400, '사유'),  // L162
  gb.booleanYn('confirmYn', 100, '승인여부'),  // L163
  gb.textCenter('confirmEmpNm', 100, '승인(반려)자'),  // L164 SQL 계산 컬럼(selectById: f_emp_kor_nm(apr90_confirm_emp_id))
  gb.date('confirmDate', 100, '승인(반려)일'),  // L165
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>승인</Button>
3. <Button type="cancel" onClick={update}>반려</Button>

