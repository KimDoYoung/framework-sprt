# Apr01_Grid_DocList

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `dcr`
- 파일: `client/vi/apr/Apr01_Grid_DocList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr03_TabPage_Relate`](../../apr/components/Apr03_TabPage_Relate.md), [`Apr50_Lookup_ApprList`](../../apr/components/Apr50_Lookup_ApprList.md), [`Dcr10_Lookup_MailSender`](../../dcr/components/Dcr10_Lookup_MailSender.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectByClassTreeId2` | Apr01_Grid_DocList:271 | [`Apr01_Appr.java:202`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectByClassTreeId2`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByClassTreeId` | Apr01_Grid_DocList:227 | [`Dcr30_Link.java:67`](../../dcr/services/Dcr30_Link.md) | [`dcr30_link.selectByClassTreeId`](../../dcr/sql/dcr30_link.md) |

## 테이블

[`adv02_account`](../../../db/tables/adv.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr12_relate_adv`](../../../db/tables/apr.md), [`apr13_person_auth`](../../../db/tables/apr.md), [`apr50_bookmark`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`sys50_specific_menu`](../../../db/tables/sys.md), [`sys51_specific_menu_person`](../../../db/tables/sys.md), [`sys52_specific_menu_link`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_emptrans`, `f_get_fund_nm2`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr01_Grid_DocList (`client/vi/apr/Apr01_Grid_DocList.java`, 322줄)

- 입력·하위 화면: `startDate` MyDateField, `endDate` MyDateField, `searchTextField` TextField, `tabPage` Apr03_TabPage_Relate, `lookup` Apr50_Lookup_ApprList, `apprEditor` Apr01_Edit_ApprDoc, `editor` Apr01_Edit_ApprDoc, `mailSender` Dcr10_Lookup_MailSender
- 그리드 `grid` (buildGrid(), 체크박스):
  - bookmarkYn 30 " " BookMarkYn
  - title 290 "상신제목" Text
  - relateDisplayName 80 "펀드/일임" TextCenter
  - statusName 65 "상태" TextHtml
  - actionCell 50 "보기" Cell 편집:detailCell
  - actionCell 50 "메일" Cell 편집:sendMailCell
  - regDate 100 "등록일" Date
  - effectDate 100 "시행일" Date
  - regEmpName 100 "등록자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L69-71) → init()
[E1] helpAnchor.MouseDown (L82) → 메시지 "업데이트 예정 / 해당문서분류의 팁은 추후 업데이…"
[E2] bookmarkAnchor.MouseDown (L96) → 인라인 L96-102 (new MouseDownHandler() { @Override pu…)
[E3] insertButton[신규문서 작성].Select (L120) → insertApproval()
[E4] searchTextField.KeyPress [Enter] (L156) → retrieve()
[E5] retrieveButton[검색].Select (L164) → retrieve()
[E6] grid.RowClick (L170) → 인라인 L170-175 (new RowClickHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L77-139 | 생성자 | 조회창 Apr50_Lookup_ApprList 열기 | 업무 |
| public addInsertButton() | L141-143 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L218-246 | E4,E5,buildGrid,insertApproval | 서비스 dcr.Dcr30_Link.selectByClassTreeId(companyId, classTreeId) | 업무 |
| private retrieve() | L248-277 | E4,E5,buildGrid,insertApproval | 서비스 apr.Apr01_Appr.selectByClassTreeId2(classTreeId, startDate, endDate, searchText, orgId, empId, companyId, admin, admin) | 업무 |
| public insertApproval() | L279-306 | E3 | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private sendMail() | L308-316 | buildGrid | 조회창 Dcr10_Lookup_MailSender 열기 | 업무 |
| private settings() | L145-176 | init | 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(fromDateStr, endDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L178-216 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L318-320 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L205) addBookMarkYn
  gb.text('title', 290, '상신제목'),  // L206
  gb.textCenter('relateDisplayName', 80, '펀드/일임'),  // L207
  // ⚠ 대응 없음 (GridBuilder L208) addTextHtml
  // ⚠ 대응 없음 (GridBuilder L209) addCell
  // ⚠ 대응 없음 (GridBuilder L210) addCell
  gb.date('regDate', 100, '등록일'),  // L211
  gb.date('effectDate', 100, '시행일'),  // L212
  gb.textCenter('regEmpNm', 100, '등록자'),  // L213
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>검색</Button>
2. <Button type="register" onClick={insertApproval}>신규문서 작성</Button>

