# Apr01_Tab_MyReferenceList

- 종류: 화면
- 메뉴: 문서작성 > 04. 전자결재 > 참조내역 조회 (#1093)
- 파일: `client/vi/apr/Apr01_Tab_MyReferenceList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_DcrClass`](../../dcr/components/Dcr01_Lookup_DcrClass.md), [`Dcr10_Lookup_MailSender`](../../dcr/components/Dcr10_Lookup_MailSender.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectByApprId2` | Apr01_Tab_MyReferenceList:320 | [`Apr01_Appr.java:53`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectByApprId2`](../../apr/sql/apr01_appr.md) |
| `apr.Apr01_Appr.selectByReferenceEmpId` | Apr01_Tab_MyReferenceList:311 | [`Apr01_Appr.java:284`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectByReferenceEmpId`](../../apr/sql/apr01_appr.md) |
| `sys.Sys99_Print.insertRdReferenceList` | Apr01_Tab_MyReferenceList:181 | [`Sys99_Print.java:2093`](../../sys/services/Sys99_Print.md) | [`apr01_appr.selectByReferenceEmpId`](../../apr/sql/apr01_appr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`adv02_account`](../../../db/tables/adv.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr07_alt_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr12_relate_adv`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr10_mail_history`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp25_mypage_notice`](../../../db/tables/emp.md), [`ics40_dcr_preconfirm`](../../../db/tables/ics.md), [`sys01_company`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_apr_get_title_nm`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_get_fund_nm2`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr01_Tab_MyReferenceList (`client/vi/apr/Apr01_Tab_MyReferenceList.java`, 355줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar01`: 등록기간: {startDate} {closeDate} 문서분류: {classTreeName}
- 툴바 `buttonBar02`: 결재상태: {statusCode} {searchText} {aprCheckBox} {searchButton} {downLoadButton}
- 입력·하위 화면: `statusCode` ComboBoxField("AprStatusCode", "%", "전체"), `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="문서명/문서분류/비고", `classTreeName` LookupTriggerField 빈칸="전체", `aprCheckBox` CheckBox, `searchPopup` Dcr01_Lookup_DcrClass, `editor` Apr01_Edit_ApprDoc, `mailSender` Dcr10_Lookup_MailSender
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 100 "상신일" Date
  - effectDate 100 "시행일" Date
  - statusName 80 "결재상태" Text
  - classTreeName 170 "문서분류" Text
  - inOutTypeName 70 "문서구분" TextCenter
  - title 400 "문서명" TextHtml
  - actionCell 80 "상세보기" Cell 편집:editDocCell
  - actionCell 80 "메일보내기" Cell 편집:sendMailCell
  - mailYn 70 "송신여부" Text
  - regEmpName 100 "상신자" Text
  - recentApprovalName 150 "최근결재자" Text
  - recentApprovalDate 100 "최근결재일" Date
  - note 200 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L79-117) → settings()
[E1] classTreeName.TriggerClick [result == null] (L137) → execute()
[E2] searchText.KeyPress [Enter] (L159) → retrieve()
[E3] searchButton[검색].Select (L167) → retrieve()
[E4] downLoadButton[출력/다운로드].Select [result.getStatus() == 1] (L173) → 서비스 sys.Sys99_Print.insertRdReferenceList(companyId, personId, windowClassName, regEmpId, statusCode, startDate, closeDate, aprYn, searchText, classTreeId)
[E5] grid.SelectionChanged [선택>0] (L222) → 인라인 L222-228 (new SelectionChangedHandler<Apr01_App…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L61-63 | E1,buildGrid,retrieve | 상태 처리 | 업무 |
| private retrieve() | L298-317 | E2,E3,execute | 서비스 apr.Apr01_Appr.selectByReferenceEmpId(companyId, regEmpId, statusCode, startDate, closeDate, aprYn, searchText, classTreeId) | 업무 |
| private retrieveOne() | L319-336 | buildGrid | 서비스 apr.Apr01_Appr.selectByApprId2(personId, apprId) | 업무 |
| private sendMail() | L338-346 | buildGrid | 조회창 Dcr10_Lookup_MailSender 열기 | 업무 |
| private settings() | L119-229 | 생성자 | 조회창 Dcr01_Lookup_DcrClass 열기 → 콜백: unmask, 서비스 sys.Sys99_Print.insertRdReferenceList(companyId, personId, windowClassName, regEmpId, statusCode, startDate, closeDate, aprYn, searchText, classTreeId), 이벤트 연결, 초기값: closeDate=toDay, startDate=closeDate1, aprCheckBox=true("완료/반려건 포함"), classTreeName="전체", classTreeName=classTreeModel.getClassTreeFullName( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L231-296 | 공개 메서드 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "해당문서는 폐기되어 열람이 불가능합니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L348-350 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L352-354 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '상신일'),  // L281
  gb.date('effectDate', 100, '시행일'),  // L282
  gb.text('statusNm', 80, '결재상태'),  // L283
  gb.text('classTreeNm', 170, '문서분류'),  // L284
  gb.textCenter('inOutTypeName', 70, '문서구분'),  // L285
  // ⚠ 대응 없음 (GridBuilder L286) addTextHtml
  // ⚠ 대응 없음 (GridBuilder L287) addCell
  // ⚠ 대응 없음 (GridBuilder L288) addCell
  gb.text('mailYn', 70, '송신여부'),  // L289
  gb.text('regEmpNm', 100, '상신자'),  // L290
  gb.text('approvalName', 150, '최근결재자'),  // L291
  gb.date('approvalDate', 100, '최근결재일'),  // L292
  gb.text('note', 200, '비고'),  // L293
];
```

#### 사용된 버튼들
1. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdReferenceList(companyId, personId, windowClassName, regEmpId, statusCode, startDate, closeDate, aprYn, searchText, classTreeId) */}>출력/다운로드</Button>
2. <Button type="search" onClick={retrieve}>검색</Button>

