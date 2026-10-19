# Ics31_Tab_ComplianceConfirm

- 종류: 화면
- 메뉴: 준법감시 > 20. 임직원 내부통제 준수 > 내부통제 준수점검(준감인) (#1311)
- 파일: `client/vi/ics/Ics31_Tab_ComplianceConfirm.java`
- 함께 쓰는 클래스 1개:
  - `Ics32_Lookup_RelateAppr` `client/vi/ics/Ics32_Lookup_RelateAppr.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Ics32_Lookup_RelateAppr:162 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Ics32_Lookup_RelateAppr:273 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `ics.Ics30_Compliance.selectByPaging` | Ics31_Tab_ComplianceConfirm:96 | [`Ics30_Compliance.java:54`](../../ics/services/Ics30_Compliance.md) | [`ics30_compliance.selectByCompanyIdPaging`](../../ics/sql/ics30_compliance.md), [`ics30_compliance.selectByCompanyIdTotal`](../../ics/sql/ics30_compliance.md) |
| `ics.Ics31_ComplianceWrite.updateConfirmYn` | Ics31_Tab_ComplianceConfirm:326 | [`Ics31_ComplianceWrite.java:112`](../../ics/services/Ics31_ComplianceWrite.md) | [`ics31_compliance_write.updateConfirmYn`](../../ics/sql/ics31_compliance_write.md) |
| `ics.Ics32_RelateAppr.insert` | Ics32_Lookup_RelateAppr:306 | [`Ics32_RelateAppr.java:48`](../../ics/services/Ics32_RelateAppr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics32_relate_appr.insert`](../../ics/sql/ics32_relate_appr.md), [`ics32_relate_appr.selectByCompanyId`](../../ics/sql/ics32_relate_appr.md) |
| `ics.Ics32_RelateAppr.selectByCount` | Ics32_Lookup_RelateAppr:205 | [`Ics32_RelateAppr.java:37`](../../ics/services/Ics32_RelateAppr.md) | [`ics32_relate_appr.selectByCount`](../../ics/sql/ics32_relate_appr.md) |
| `ics.Ics32_RelateAppr.updateApprId` | Ics32_Lookup_RelateAppr:374 | [`Ics32_RelateAppr.java:77`](../../ics/services/Ics32_RelateAppr.md) | [`ics32_relate_appr.updateApprId`](../../ics/sql/ics32_relate_appr.md) |
| `sys.Sys01_Company.selectById` | Ics31_Tab_ComplianceConfirm:115 | [`Sys01_Company.java:20`](../../sys/services/Sys01_Company.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.updateMainImageId`](../../sys/sql/sys01_company.md) |
| `sys.Sys99_Print.insertComplianceState` | Ics32_Lookup_RelateAppr:323 | [`Sys99_Print.java:324`](../../sys/services/Sys99_Print.md) | [`dbConfig.getBatchSeq`](../../utils/sql/dbConfig.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp03_trans.getRetireDate`](../../emp/sql/emp03_trans.md), [`emp03_trans.selectInOffice`](../../emp/sql/emp03_trans.md), [`ics30_compliance.selectComplianceResultByPersonId`](../../ics/sql/ics30_compliance.md), [`ics31_compliance_write.checkWriteByPersonId`](../../ics/sql/ics31_compliance_write.md), [`ics31_compliance_write.selectNonComplianceReason`](../../ics/sql/ics31_compliance_write.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |
| `utils.pdf.PDFCreate.createIcs31` | Ics32_Lookup_RelateAppr:335 | [`PDFCreate.java:74`](../../utils/services/pdf.PDFCreate.md) | - |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp33_except_biz`](../../../db/tables/emp.md), [`ics30_compliance`](../../../db/tables/ics.md), [`ics31_compliance_write`](../../../db/tables/ics.md), [`ics32_relate_appr`](../../../db/tables/ics.md), [`org00_org_info`](../../../db/views.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_code_seq`, `f_get_compliance_result`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics31_Tab_ComplianceConfirm (`client/vi/ics/Ics31_Tab_ComplianceConfirm.java`, 411줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준 분기(월): {yyyyText} {periodComboBox} 검색: {searchText} {checkBox} {retrieveButton} {confirmButton} {cancleButton}
- 입력·하위 화면: `periodComboBox` ComboBoxField("MonthsCode"), `checkBox` CheckBox, `yyyyText` TextField, `searchText` TextField 빈칸="내용/부서명/사원명", `lookup` Ics32_Lookup_RelateAppr
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - complianceTypeName 200 "준수항목" Text
  - subNum 80 "번호" TextCenter
  - content 450 "내용" TextArea
  - reason 300 "답변" TextArea
  - orgName 250 "부서명" Text
  - personName 100 "사원명" Text
  - confirmYn 80 "확인여부" BooleanYn

#### 이벤트
[E0] 화면 열림 (생성자 L70-112) → settings()
[E1] yyyyText.ValueChange (L139) → 인라인 L139-145 (new ValueChangeHandler<String>() { @O…)
[E2] searchText.KeyPress [Enter] (L148) → retrieve()
[E3] periodComboBox[MonthsCode].ValueChange (L159) → 인라인 L159-165 (new ValueChangeHandler<String>() { @O…)
[E4] retrieveButton[조회].Select (L170) → retrieve()
[E5] confirmButton[확인].Select (L176) → confirmChk()
[E6] cancleButton[확인취소].Select (L182) → confirmChk()
[E7] apprButton[상신].Select (L188) → listPopup()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| protected enable() | L196-244 | settings | 상태 처리 | 업무 |
| public retrieve() | L271-312 | E2,E4,confirmChk | 상태 처리 | 업무 |
| private confirmChk() | L314-364 | E5,E6 | 서비스 ics.Ics31_ComplianceWrite.updateConfirmYn(confirmerId, confirmYn, yyyymm) | 업무 |
| private listPopup() | L366-374 | E7 | 조회창 Ics32_Lookup_RelateAppr 열기 | 업무 |
| private getDate() | L376-397 | retrieve,confirmChk | 상태 처리 | 업무 |
| private settings() | L114-194 | 생성자 | 서비스 sys.Sys01_Company.selectById(companyId), 이벤트 연결, 초기값: yyyyText=startYear, checkBox=false("미확인건만 조회") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L246-269 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L399-402 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L404-406 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L408-410 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('complianceTypeNm', 200, '준수항목'),  // L249 SQL 계산 컬럼(selectByCompanyIdPaging: f_cdnm('IcsComplianceType', ics30_compl…)
  gb.textCenter('subNum', 80, '번호'),  // L250
  gb.textArea('content', 450, '내용'),  // L251
  gb.textArea('reason', 300, '답변'),  // L252
  gb.text('orgNm', 250, '부서명'),  // L253 SQL 계산 컬럼(selectByCompanyIdPaging: org02_kor_nm)
  gb.text('personNm', 100, '사원명'),  // L254 SQL 계산 컬럼(selectByCompanyIdPaging: emp01_kor_nm)
  gb.booleanYn('confirmYn', 80, '확인여부'),  // L255 SQL 계산 컬럼(selectByCompanyIdPaging: COALESCE(ics31_confirm_yn, 'false'))
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirmChk}>확인</Button>
3. <Button type="cancel" onClick={confirmChk}>확인취소</Button>
4. <Button type="register" onClick={listPopup}>상신</Button>

### Ics32_Lookup_RelateAppr (`client/vi/ics/Ics32_Lookup_RelateAppr.java`, 397줄)

- 툴바 `buttonBar`: 분기(월): {yyyyText} {periodComboBox} {retrieveButton}
- 입력·하위 화면: `yyyyText` TextField, `periodComboBox` ComboBoxField("MonthsCode"), `editor` Apr01_Edit_ApprDoc, `popup` Dcr01_Lookup_Class, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid()):
  - totalCount 100 "전체건수" LongCenter
  - confirmCount 100 "확인건수" LongCenter
  - statusName 150 "결재상태" TextCenter
  - actionCell 60 "결재요청" Cell 편집:actionCell
  - actionCell 60 "상세보기" Cell 편집:viewCell

#### 이벤트
[E0] 화면 열림 (생성자 L95-121) → settings(), show()
[E1] retrieveButton[조회].Select (L127) → retrieve()
[E2] cancleButton[닫기].Select (L133) → hide()
[E3] msgBox.DialogHide [YES] (L252) → linkCheck()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L68-93 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L196-211 | E1,open,updateApprId | 서비스 ics.Ics32_RelateAppr.selectByCount(companyId, stdDate) | 업무 |
| private getDate() | L213-234 | retrieve,insertRelateApprId,insertComplianceState | 상태 처리 | 업무 |
| private apprCheck() | L236-270 | buildGrid | 확인창 표시 | 업무 |
| private linkCheck() | L272-302 | E3,apprCheck | 조회창 Dcr01_Lookup_Class 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertRelateApprId() | L305-319 | linkCheck | 서비스 ics.Ics32_RelateAppr.insert(companyId, yyyymm, cycleType) | 업무 |
| private insertComplianceState() | L322-352 | insertRelateApprId | 서비스 sys.Sys99_Print.insertComplianceState(companyId, personId, stdDate, windowClassName, companyId, stdDate, relateApprId, groupId, cycleName, cycleType) | 업무 |
| private insertLinkApproval() | L354-371 | insertComplianceState | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L373-388 | insertLinkApproval | 서비스 ics.Ics32_RelateAppr.updateApprId | 업무 |
| private settings() | L123-139 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L141-194 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "상신문서가 존재하지않습니다", 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L390-392 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L394-396 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.longCenter('totalCount', 100, '전체건수'),  // L187 SQL 계산 컬럼(selectByCount: ( ( SELECT COUNT(emp03_trans_id) FROM e…)
  gb.longCenter('confirmCount', 100, '확인건수'),  // L188 SQL 계산 컬럼(selectByCount: ( SELECT COUNT(ics31_compliance_write_i…)
  gb.textCenter('statusNm', 150, '결재상태'),  // L189 SQL 계산 컬럼(selectByCompanyId: f_cdnm('AprStatusCode', b.apr01_status_…)
  // ⚠ 대응 없음 (GridBuilder L190) addCell
  // ⚠ 대응 없음 (GridBuilder L191) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

