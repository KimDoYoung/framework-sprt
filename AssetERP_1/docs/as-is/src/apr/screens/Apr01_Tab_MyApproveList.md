# Apr01_Tab_MyApproveList

- 종류: 화면
- 메뉴: 문서작성 > 04. 전자결재 > 결재내역 조회 (#1018)
- 파일: `client/vi/apr/Apr01_Tab_MyApproveList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_DcrClass`](../../dcr/components/Dcr01_Lookup_DcrClass.md), [`Dcr10_Lookup_MailSender`](../../dcr/components/Dcr10_Lookup_MailSender.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectApprListByEmpId` | Apr01_Tab_MyApproveList:330 | [`Apr01_Appr.java:163`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectApprListByEmpId`](../../apr/sql/apr01_appr.md) |
| `sys.Sys99_Print.insertRdApproveList` | Apr01_Tab_MyApproveList:193 | [`Sys99_Print.java:2195`](../../sys/services/Sys99_Print.md) | [`apr01_appr.selectApprListByEmpId`](../../apr/sql/apr01_appr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr07_alt_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr10_mail_history`](../../../db/tables/dcr.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr01_Tab_MyApproveList (`client/vi/apr/Apr01_Tab_MyApproveList.java`, 359줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar01`: 조회기간: {radioReg} 상신일: {radioEffect} 시행일: {dateBox} 문서분류: {classTreeName}
- 툴바 `buttonBar02`: 결재상태: {statusCode} {searchText} {aprCheckBox} {searchButton} {downLoadButton}
- 입력·하위 화면: `statusCode` ComboBoxField("AprStatusCode", "%", "전체"), `radioReg` Radio, `radioEffect` Radio, `searchText` TextField 빈칸="문서명/문서분류/비고", `dateType` TextField, `startDate` MyDateField, `closeDate` MyDateField, `classTreeName` LookupTriggerField 빈칸="전체", `aprCheckBox` CheckBox, `searchPopup` Dcr01_Lookup_DcrClass, `editor` Apr01_Edit_ApprDoc, `mailSender` Dcr10_Lookup_MailSender
- 그리드 `grid` (buildGrid(), 체크박스):
  - statusName 80 "결재상태" ApprStep
  - regDate 100 "등록(상신)일" Date
  - inOutTypeName 70 "문서구분" TextCenter
  - title 400 "문서명" TextHtml
  - regEmpName 100 "상신자" Text
  - NextApprName 120 "다음결재자" Text
  - effectDate 100 "시행일" Date
  - classTreeName 170 "문서분류" Text
  - actionCell 80 "상세보기" Cell 편집:actionCell01
  - actionCell 80 "메일보내기" Cell 편집:actionCell02
  - mailYn 70 "송신여부" Text
  - myApprovalDate 100 "나의결재일" Date
  - finalApprovalDate 100 "결재완료일" Date
  - note 200 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L86-133) → settings()
[E1] classTreeName.TriggerClick [result == null] (L152) → execute()
[E2] searchText.KeyPress [Enter] (L173) → retrieve()
[E3] searchButton[검색].Select (L181) → retrieve()
[E4] downLoadButton[출력/다운로드].Select [result.getStatus() == 1] (L187) → 서비스 sys.Sys99_Print.insertRdApproveList(companyId, personId, windowClassName, empId, startDate, closeDate, status, aprYn, dateType, searchText, classTreeId)
[E5] toggleDate.ValueChange [radioReg.getValue()] (L245) → 인라인 L245-254 (new ValueChangeHandler<HasValue<Boole…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L64-66 | E1,buildGrid,retrieve | 상태 처리 | 업무 |
| private retrieve() | L315-336 | E2,E3,execute,buildGrid | 서비스 apr.Apr01_Appr.selectApprListByEmpId(companyId, empId, startDate, closeDate, status, aprYn, dateType, searchText, classTreeId) | 업무 |
| private sendMail() | L338-346 | buildGrid | 조회창 Dcr10_Lookup_MailSender 열기 | 업무 |
| private settings() | L135-257 | 생성자 | 조회창 Dcr01_Lookup_DcrClass 열기 → 콜백: unmask, 서비스 sys.Sys99_Print.insertRdApproveList(companyId, personId, windowClassName, empId, startDate, closeDate, status, aprYn, dateType, searchText, classTreeId), 이벤트 연결, 초기값: closeDate=toDay, startDate=closeDate1, classTreeName="전체", classTreeName=classTreeModel.getClassTreeFullName(, dateType="reg", radioReg=true, radioEffect=false, dateType="reg", dateType="effect", aprCheckBox=true("완료/반려건 포함") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L259-313 | 공개 메서드 | 팝업 Apr01_Edit_ApprDoc 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L348-350 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L352-354 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L356-358 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L297) addApprStep
  gb.date('regDate', 100, '등록(상신)일'),  // L298
  gb.textCenter('inOutTypeName', 70, '문서구분'),  // L299
  // ⚠ 대응 없음 (GridBuilder L300) addTextHtml
  gb.text('regEmpNm', 100, '상신자'),  // L301
  gb.text('apprNm', 120, '다음결재자'),  // L302
  gb.date('effectDate', 100, '시행일'),  // L303
  gb.text('classTreeNm', 170, '문서분류'),  // L304
  // ⚠ 대응 없음 (GridBuilder L305) addCell
  // ⚠ 대응 없음 (GridBuilder L306) addCell
  gb.text('mailYn', 70, '송신여부'),  // L307
  gb.date('approvalDate', 100, '나의결재일'),  // L308
  gb.date('finalApprovalDate', 100, '결재완료일'),  // L309
  gb.text('note', 200, '비고'),  // L310
];
```

#### 사용된 버튼들
1. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdApproveList(companyId, personId, windowClassName, empId, startDate, closeDate, status, aprYn, dateType, searchText, classTreeId) */}>출력/다운로드</Button>
2. <Button type="search" onClick={retrieve}>검색</Button>

