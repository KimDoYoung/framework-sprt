# Emp17_Tab_BenefitManager

- 종류: 화면
- 메뉴: 자금관리 > 20. 사업비관리 > 복리후생비 관리 (#1222)
- 파일: `client/vi/emp/Emp17_Tab_BenefitManager.java`
- 함께 쓰는 클래스 2개:
  - `Emp55_Lookup_account` `client/vi/emp/Emp55_Lookup_account.java`
  - `Emp17_Edit_Note` `client/vi/emp/Emp17_Edit_Note.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act01_Lookup_AccountCode`](../../act/components/Act01_Lookup_AccountCode.md), [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Lookup_Link`](../../dcr/components/Dcr30_Lookup_Link.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Emp17_Tab_BenefitManager:1002, Emp17_Tab_BenefitManager:371, Emp17_Tab_BenefitManager:404, Emp17_Tab_BenefitManager:507 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Emp17_Tab_BenefitManager:868 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `emp.Emp17_Benefit.deleteApprId` | Emp17_Tab_BenefitManager:442 | [`Emp17_Benefit.java:146`](../../emp/services/Emp17_Benefit.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md), [`emp17_benefit.deleteApprId`](../../emp/sql/emp17_benefit.md) |
| `emp.Emp17_Benefit.modelUpdate` | Emp17_Edit_Note:105 | [`Emp17_Benefit.java:180`](../../emp/services/Emp17_Benefit.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(emp17_benefit)` 동적 INSERT/UPDATE → [`emp17_benefit.selectById`](../../emp/sql/emp17_benefit.md) |
| `emp.Emp17_Benefit.payRequestApprCheck` | Emp17_Tab_BenefitManager:947 | [`Emp17_Benefit.java:112`](../../emp/services/Emp17_Benefit.md) | [`emp17_benefit.selectByYyyymm`](../../emp/sql/emp17_benefit.md) |
| `emp.Emp17_Benefit.selectApprId` | Emp17_Tab_BenefitManager:991 | [`Emp17_Benefit.java:100`](../../emp/services/Emp17_Benefit.md) | [`emp17_benefit.selectByYyyymm`](../../emp/sql/emp17_benefit.md) |
| `emp.Emp17_Benefit.selectByBenefitCode` | Emp17_Tab_BenefitManager:599 | [`Emp17_Benefit.java:56`](../../emp/services/Emp17_Benefit.md) | [`emp17_benefit.selectByBenefitCode`](../../emp/sql/emp17_benefit.md) |
| `emp.Emp17_Benefit.selectByText` | Emp17_Tab_BenefitManager:564 | [`Emp17_Benefit.java:42`](../../emp/services/Emp17_Benefit.md) | [`emp17_benefit.selectByText`](../../emp/sql/emp17_benefit.md) |
| `emp.Emp17_Benefit.selectByYyyymm` | Emp17_Tab_BenefitManager:893 | [`Emp17_Benefit.java:84`](../../emp/services/Emp17_Benefit.md) | [`emp17_benefit.selectByYyyymm`](../../emp/sql/emp17_benefit.md) |
| `emp.Emp17_Benefit.sendMessage` | Emp17_Edit_Note:123 | [`Emp17_Benefit.java:163`](../../emp/services/Emp17_Benefit.md) | [`emp01_person.selectByPersonId`](../../emp/sql/emp01_person.md) |
| `emp.Emp17_Benefit.update` | Emp17_Tab_BenefitManager:641 | [`Emp17_Benefit.java:237`](../../emp/services/Emp17_Benefit.md) | `UpdateDataModel(emp17_benefit)` 동적 INSERT/UPDATE → [`emp17_benefit.selectById`](../../emp/sql/emp17_benefit.md) |
| `emp.Emp17_Benefit.updatePayRequestApprId` | Emp17_Tab_BenefitManager:1051 | [`Emp17_Benefit.java:202`](../../emp/services/Emp17_Benefit.md) | [`emp17_benefit.updateModel`](../../emp/sql/emp17_benefit.md) |
| `emp.Emp17_Benefit.updatePayRequestYm` | Emp17_Tab_BenefitManager:750, Emp17_Tab_BenefitManager:817 | [`Emp17_Benefit.java:215`](../../emp/services/Emp17_Benefit.md) | [`emp17_benefit.updateModel`](../../emp/sql/emp17_benefit.md) |
| `emp.Emp55_BenefitInfo.selectAccountName` | Emp17_Tab_BenefitManager:1082 | [`Emp55_BenefitInfo.java:65`](../../emp/services/Emp55_BenefitInfo.md) | [`emp55_benefit_info.selectAccountName`](../../emp/sql/emp55_benefit_info.md) |
| `emp.Emp55_BenefitInfo.selectByBenefitCode` | Emp17_Tab_BenefitManager:852 | [`Emp55_BenefitInfo.java:39`](../../emp/services/Emp55_BenefitInfo.md) | [`emp55_benefit_info.selectByBenefitCode`](../../emp/sql/emp55_benefit_info.md) |
| `emp.Emp55_BenefitInfo.selectByCompanyId` | Emp55_Lookup_account:122 | [`Emp55_BenefitInfo.java:53`](../../emp/services/Emp55_BenefitInfo.md) | [`emp55_benefit_info.selectByCompanyId`](../../emp/sql/emp55_benefit_info.md) |
| `emp.Emp55_BenefitInfo.update` | Emp55_Lookup_account:132 | [`Emp55_BenefitInfo.java:98`](../../emp/services/Emp55_BenefitInfo.md) | `UpdateDataModel(emp55_benefit_info)` 동적 INSERT/UPDATE → [`emp55_benefit_info.selectById`](../../emp/sql/emp55_benefit_info.md) |
| `sys.Sys00_Common.selectBenefit` | Emp17_Tab_BenefitManager:117 | [`Sys00_Common.java:146`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectBenefit`](../../sys/sql/sys00_common.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp17_benefit`](../../../db/tables/emp.md), [`emp55_benefit_info`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp17_Tab_BenefitManager (`client/vi/emp/Emp17_Tab_BenefitManager.java`, 1104줄)

- 레이아웃: north=vlc01, center=vlc02
- 툴바 `buttonBar01`: {label01} 조회기간: {startDate} ~: {closeDate} 신청구분: {benefitName} 검색: {searchTextField} {retrieveButton} {payRequestInsertButton} {dcrLinkButton} {benefitSetButton}
- 툴바 `buttonBar02`: {label02} 기준년월: {yearField} {monthComboBox} 신청구분: {benefitName2} 지급여부: {benefitYn} 검색: {searchTextField2} {retrieveButton2} {payRequestDeleteButton} {confirmButton} {cancelButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchTextField` TextField 빈칸="신청구분/사원명/문서명", `searchTextField2` TextField 빈칸="신청구분/사원명/문서명", `classTreeFullName` LookupTriggerField 빈칸="문서분류가 미지정 상태입니다. 관리자에게 문의해주세요", `apprStepCode` TextField, `apprStepName` TextField, `yearField` TextField, `monthComboBox` ComboBoxField("MonthsCode", "yyyy", "MM", "월"), `benefitYn` StringComboBox, `benefitName` CommonComboBoxField("sys.Sys00_Common.selectBenefit", "%", "전체"), `benefitName2` CommonComboBoxField("sys.Sys00_Common.selectBenefit") 빈칸="신청구분 선택바랍니다", `lookup` Emp55_Lookup_account, `editor` Apr01_Edit_ApprDoc, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - issueDate 100 "신청일" Date
  - benefitName 100 "신청구분" Text
  - personName 100 "사원명" TextCenter
  - apprTitleName 400 "문서명" Text
  - issueAmt 80 "신청금액" Long
  - occDate 100 "발생일자" Date
  - benefitDetail 200 "내용" Text
  - apprStatusName 100 "결재상태" TextCenter
  - actionCell 80 "신청문서보기" Cell 편집:actionCell
  - actionCell 80 "문서폐기" Cell 편집:deleteCell
  - actionCell 80 "알림" Cell 편집:noticeCell
- 그리드 `payRequestGrid` (payRequestdGrid(), 체크박스(다중)):
  - issueDate 100 "신청일" Date
  - benefitName 100 "신청구분" Text
  - personName 100 "사원명" TextCenter
  - apprTitleName 400 "문서명" Text
  - issueAmt 80 "신청금액" Long
  - occDate 100 "발생일자" Date
  - benefitDetail 200 "내용" Text
  - actionCell 80 "신청문서보기" Cell 편집:actionCell
  - benefitYnStr 80 "지급여부" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L124-216) → settings()
[E1] searchTextField.KeyPress [Enter] (L235) → retrieve()
[E2] searchTextField2.KeyPress [Enter] (L246) → retrieve2()
[E3] yearField.KeyPress [Enter] (L255) → retrieve2()
[E4] retrieveButton[조회].Select (L269) → retrieve()
[E5] retrieveButton2[조회].Select (L275) → retrieve2()
[E6] confirmButton[지급확인].Select (L281) → updateBenefitYn()
       └ [E20] msgBox.DialogHide [YES] (L649) → retrieve2()
       └ [E21] msgBox.DialogHide [YES] (L676) → retrieve2()
[E7] cancelButton[지급취소].Select (L287) → updateBenefitYn()
[E8] payRequestInsertButton[지출결의등록].Select (L293) → apprChk2()
[E9] payRequestDeleteButton[지출결의제거].Select (L299) → payRequestDelete()
[E10] benefitSetButton[복리후생비 설정].Select (L305) → execute(), comboBoxRetrieve()
[E11] dcrLinkButton[문서분류지정].Select (L318) → execute()
[E12] classTreeFullName[문서분류].TriggerClick (L331) → openLookupDoc()
[E13] benefitName[sys.Sys00_Common.selectBenefit].Collapse (L338) → retrieve()
[E14] benefitName2[sys.Sys00_Common.selectBenefit].Collapse (L344) → retrieve2()
[E15] monthComboBox[MonthsCode].Collapse (L350) → retrieve2()
[E16] benefitYn[전체].Collapse (L356) → retrieve2()
[E17] apprButton[상신].Select (L362) → insertLinkApproval()
[E18] apprViewButton[문서보기].Select (L368) → execute(), apprChk()
[E19] msgBox.DialogHide [YES] (L435) → retrieve()
[E22] msgBox.DialogHide [YES] (L744) → retrieve2(), retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L96-101 | E10,E11,E18,buildGrid,payRequestdGrid,retrieve,retrieve2,comboBoxRetrieve,openLookupDoc,insertLinkApproval | 상태 처리 | 업무 |
| public payRequestdGrid() | L499-546 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "상신문서가 존재하지 않습니다", 서비스 apr.Apr01_Appr.selectById | 업무 |
| private retrieve() | L548-570 | E1,E4,E13,E19,E22,comboBoxRetrieve,payRequestDelete | 서비스 emp.Emp17_Benefit.selectByText(companyId, startDate, closeDate, benefitCode, searchText) | 업무 |
| private retrieve2() | L572-608 | E2,E3,E5,E14,E15,E16,E20,E21,E22,comboBoxRetrieve,payRequestDelete,insertLinkApproval,updateApprId | 서비스 emp.Emp17_Benefit.selectByBenefitCode(companyId, yyyymm, benefitCode, benefitYnStr, searchText), 건수 표시 | 업무 |
| private comboBoxRetrieve() | L610-628 | E10,settings | 상태 처리 | 업무 |
| private updateBenefitYn() | L630-701 | E6,E7 | ConfirmBox → E20 | 업무 |
| private payRequestInsert() | L703-782 | apprChk2 | 확인창 표시, 서비스 emp.Emp17_Benefit.updatePayRequestYm(payRequestYyyymm) | 업무 |
| private payRequestDelete() | L784-837 | E9 | 미선택 시 alert "삭제할 내용을 선택해주세요", 서비스 emp.Emp17_Benefit.updatePayRequestYm(payRequestYyyymm) | 업무 |
| private openLookupDoc() | L840-849 | E12 | 상태 처리 | 업무 |
| private defaultName() | L851-889 | retrieve2 | 서비스 emp.Emp55_BenefitInfo.selectByBenefitCode, dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private apprChk() | L891-937 | E18,retrieve2 | 서비스 emp.Emp17_Benefit.selectByYyyymm | 업무 |
| private apprChk2() | L939-966 | E8 | 미선택 시 alert, 서비스 emp.Emp17_Benefit.payRequestApprCheck | 업무 |
| private insertLinkApproval() | L968-1048 | E17 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 emp.Emp17_Benefit.selectApprId, apr.Apr01_Appr.selectById | 업무 |
| private updateApprId() | L1050-1062 | insertLinkApproval | 서비스 emp.Emp17_Benefit.updatePayRequestApprId(apprId) | 업무 |
| private getPayRequestGridList() | L1064-1070 | insertLinkApproval,updateApprId | 상태 처리 | 업무 |
| private getTotalIssueAmt() | L1072-1078 | insertLinkApproval | 상태 처리 | 업무 |
| private getAccountName() | L1080-1094 | retrieve2 | 서비스 emp.Emp55_BenefitInfo.selectAccountName | 업무 |
| public settings() | L218-393 | 생성자 | 조회창 Emp55_Lookup_account 열기, 조회창 Dcr30_Lookup_Link 열기, 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(fromDateStr, closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L395-497 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 팝업 Emp17_Edit_Note 열기, 확인창 표시, 서비스 apr.Apr01_Appr.selectById, emp.Emp17_Benefit.deleteApprId, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L1096-1098 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L1100-1102 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('issueDate', 100, '신청일'),  // L484
  gb.text('benefitNm', 100, '신청구분'),  // L485 SQL 계산 컬럼(selectById: f_cdnm('EmpBenefitType', emp17_benefit_…)
  gb.textCenter('personNm', 100, '사원명'),  // L486 SQL 계산 컬럼(selectById: f_emp_kor_nm(emp17_person_id))
  gb.text('apprTitleNm', 400, '문서명'),  // L487 SQL 계산 컬럼(selectById: apr01_title)
  gb.long('issueAmt', 80, '신청금액'),  // L488
  gb.date('occDate', 100, '발생일자'),  // L489
  gb.text('benefitDetail', 200, '내용'),  // L490
  gb.textCenter('statusNm', 100, '결재상태'),  // L491 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', apr01_status_cd…)
  // ⚠ 대응 없음 (GridBuilder L492) addCell
  // ⚠ 대응 없음 (GridBuilder L493) addCell
  // ⚠ 대응 없음 (GridBuilder L494) addCell
];

const payRequestdGrid = () => [
  gb.date('issueDate', 100, '신청일'),  // L535
  gb.text('benefitNm', 100, '신청구분'),  // L536 SQL 계산 컬럼(selectById: f_cdnm('EmpBenefitType', emp17_benefit_…)
  gb.textCenter('personNm', 100, '사원명'),  // L537 SQL 계산 컬럼(selectById: f_emp_kor_nm(emp17_person_id))
  gb.text('apprTitleNm', 400, '문서명'),  // L538 SQL 계산 컬럼(selectById: apr01_title)
  gb.long('issueAmt', 80, '신청금액'),  // L539
  gb.date('occDate', 100, '발생일자'),  // L540
  gb.text('benefitDetail', 200, '내용'),  // L541
  // ⚠ 대응 없음 (GridBuilder L542) addCell
  // ⚠DB없음 L543 benefitYnStr 80 "지급여부" (emp17_benefit_yn_str 컬럼 없음)
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertLinkApproval}>상신</Button>
2. <Button type="search" onClick={() => /* execute(), apprChk() */}>문서보기</Button>
3. <Button type="search" onClick={retrieve}>조회</Button>
4. <Button type="save" onClick={execute}>문서분류지정</Button>
5. <Button type="register" onClick={apprChk2}>지출결의등록</Button>
6. <Button type="save" onClick={() => /* execute(), comboBoxRetrieve() */}>복리후생비 설정</Button>
7. <Button type="search" onClick={retrieve2}>조회</Button>
8. <Button type="save" onClick={updateBenefitYn}>지급확인</Button>
9. <Button type="cancel" onClick={updateBenefitYn}>지급취소</Button>
10. <Button type="delete" onClick={payRequestDelete}>지출결의제거</Button>

### Emp55_Lookup_account (`client/vi/emp/Emp55_Lookup_account.java`, 145줄)

- 툴바 `buttonBar`: {retrieveButton} {updateButton}
- 입력·하위 화면: `lookupAccount` LookupTriggerField
- 그리드 `grid` (buildGrid()):
  - benefitName 130 "복리후생비명" TextCenter
  - unUseYn 80 "미사용" Boolean
  - accountCode 100 "계정코드" TextCenter 편집:lookupAccount
  - accountName 420 "계정과목" Text

#### 이벤트
[E1] retrieveButton[조회].Select (L66) → retrieve()
[E2] updateButton[저장].Select (L72) → update()
[E3] closeButton[닫기].Select (L78) → hide()
[E4] lookupAccount.TriggerClick (L93) → 인라인 L93-107 (new TriggerClickHandler(){ @Override …)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L41-63 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L117-128 | E1,open,update | 서비스 emp.Emp55_BenefitInfo.selectByCompanyId(companyId) | 업무 |
| public update() | L130-138 | E2 | 서비스 emp.Emp55_BenefitInfo.update | 업무 |
| private settings() | L65-85 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L87-115 | 필드 초기화 | 조회창 Act01_Lookup_AccountCode 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L140-142 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('benefitNm', 130, '복리후생비명'),  // L109 SQL 계산 컬럼(selectByCompanyId: f_cdnm('EmpBenefitType', emp55_benefit_…)
  gb.boolean('unUseYn', 80, '미사용'),  // L110
  gb.textCenter('accountCd', 100, '계정코드'),  // L111
  gb.text('accountNm', 420, '계정과목'),  // L112 SQL 계산 컬럼(selectByCompanyId: f_get_account_nm(emp55_company_id, emp5…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp17_Edit_Note (`client/vi/emp/Emp17_Edit_Note.java`, 139줄)

- 입력·하위 화면: `note` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L46-63) → settings(), getEditor(), show()
[E1] updateButton[저장].Select (L66) → update()
[E2] closeButton[닫기].Select (L72) → hide()
[E3] sendButton[문자발송].Select (L78) → sendMessage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L39-44 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L86-95 | 생성자 | 상태 처리 | 업무 |
| public update() | L97-115 | E1 | 서비스 emp.Emp17_Benefit.modelUpdate | 업무 |
| public sendMessage() | L117-134 | E3 | 서비스 emp.Emp17_Benefit.sendMessage(note, personId) | 업무 |
| private settings() | L65-84 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L136-138 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={sendMessage}>문자발송</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

