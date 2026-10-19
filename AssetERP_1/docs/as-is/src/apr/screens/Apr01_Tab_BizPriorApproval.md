# Apr01_Tab_BizPriorApproval

- 종류: 화면
- 메뉴: 준법감시 > 40. 이익제공(수령)현황 > 이익제공 사전승인신청 (#1134)
- 파일: `client/vi/apr/Apr01_Tab_BizPriorApproval.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Lookup_Link`](../../dcr/components/Dcr30_Lookup_Link.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectByText` | Apr01_Tab_BizPriorApproval:289 | [`Apr01_Appr.java:121`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectByText`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Apr01_Tab_BizPriorApproval:341 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr01_Tab_BizPriorApproval (`client/vi/apr/Apr01_Tab_BizPriorApproval.java`, 393줄)

- 레이아웃: north=northVlc, center=centerVlc
- 툴바 `centerBar`: 조회기간: {startDate} ~: {endDate} {retrieveButton}
- 입력·하위 화면: `apprComboBox` ComboBoxField("PreProvideRcvType") 빈칸="(선택하세요)", `classTreeFullName` LookupTriggerField 빈칸="문서분류가 미지정 상태입니다. 관리자에게 문의해주세요", `startDate` MyDateField, `endDate` MyDateField, `lookup` Dcr30_Lookup_Link, `apprEditor` Apr01_Edit_ApprDoc, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 100 "등록일" Date
  - effectDate 100 "시행일" Date
  - classTreeNameAllPath 400 "문서분류" Text
  - title 600 "문서명" Text
  - statusName 100 "결재상태" TextCenter
  - actionCell 70 "상세보기" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L84-106) → setting(), getEditor()
[E1] apprComboBox[신청서 구분].Collapse (L139) → retrieveDoc()
[E2] classTreeFullName[문서분류].TriggerClick (L149) → openLookupDoc()
[E3] dcrLinkButton[문서분류지정].Select (L155) → 인라인 L155-166 (new SelectHandler() { @Override publi…)
[E4] insertButton[승인신청].Select (L168) → insertLinkApproval()
[E5] retrieveButton[조회].Select (L193) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public setting() | L108-199 | 생성자 | 조회창 Dcr30_Lookup_Link 열기 | 업무 |
| private getEditor() | L201-246 | 생성자 | 상태 처리 | 업무 |
| private retrieve() | L277-295 | E5,buildGrid,insertLinkApproval | 서비스 apr.Apr01_Appr.selectByText(preProvideRcvApprYn, startDate, endDate, empId, companyId) | 업무 |
| private openLookupDoc() | L298-307 | E2 | 상태 처리 | 업무 |
| private retrieveDoc() | L338-360 | E1 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertLinkApproval() | L362-382 | E4 | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| public buildGrid() | L248-275 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L384-386 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L389-391 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '등록일'),  // L267
  gb.date('effectDate', 100, '시행일'),  // L268
  gb.text('treeNmAllpath', 400, '문서분류'),  // L269
  gb.text('title', 600, '문서명'),  // L270
  gb.textCenter('statusNm', 100, '결재상태'),  // L271
  // ⚠ 대응 없음 (GridBuilder L272) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertLinkApproval}>승인신청</Button>
3. <Button type="save" onClick={() => /* 인라인 L155-166 (new SelectHandler() { @Override publi…) */}>문서분류지정</Button>

