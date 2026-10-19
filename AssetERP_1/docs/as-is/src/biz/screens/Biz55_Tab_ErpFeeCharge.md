# Biz55_Tab_ErpFeeCharge

- 종류: 화면
- 메뉴: KFS > 11. ERP 계약사관리 > AssetERP 사용료청구 (#1403)
- 파일: `client/vi/biz/Biz55_Tab_ErpFeeCharge.java`
- 함께 쓰는 클래스 2개:
  - `Biz55_Lookup_ErpFeeCharge` `client/vi/biz/Biz55_Lookup_ErpFeeCharge.java`
  - `Biz55_Lookup_ErpCompany` `client/vi/biz/Biz55_Lookup_ErpCompany.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Dcr10_Lookup_MailSender`](../../dcr/components/Dcr10_Lookup_MailSender.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Biz55_Tab_ErpFeeCharge:213, Biz55_Tab_ErpFeeCharge:275 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `biz.Biz50_ErpSetup.selectMailForm` | Biz55_Tab_ErpFeeCharge:598, Biz55_Tab_ErpFeeCharge:696 | [`Biz50_ErpSetup.java:51`](../../biz/services/Biz50_ErpSetup.md) | [`biz50_erp_setup.selectMailForm`](../../biz/sql/biz50_erp_setup.md) |
| `biz.Biz51_ErpContCorp.selectErpCompany` | Biz55_Lookup_ErpCompany:148 | [`Biz51_ErpContCorp.java:33`](../../biz/services/Biz51_ErpContCorp.md) | [`biz51_erp_cont_corp.selectErpCompany`](../../biz/sql/biz51_erp_cont_corp.md) |
| `biz.Biz52_ErpFee.selectDefaultData` | Biz55_Lookup_ErpFeeCharge:406 | [`Biz52_ErpFee.java:42`](../../biz/services/Biz52_ErpFee.md) | [`biz52_erp_fee.selectDefaultData`](../../biz/sql/biz52_erp_fee.md) |
| `biz.Biz55_ErpFeeCharge.confirmUpdate` | Biz55_Tab_ErpFeeCharge:525 | [`Biz55_ErpFeeCharge.java:49`](../../biz/services/Biz55_ErpFeeCharge.md) | [`biz55_erp_fee_charge.confirmUpdate`](../../biz/sql/biz55_erp_fee_charge.md) |
| `biz.Biz55_ErpFeeCharge.delete` | Biz55_Tab_ErpFeeCharge:369 | [`Biz55_ErpFeeCharge.java:279`](../../biz/services/Biz55_ErpFeeCharge.md) | `UpdateDataModel(biz55_erp_fee_charge)` 동적 DELETE |
| `biz.Biz55_ErpFeeCharge.insertUpdate` | Biz55_Lookup_ErpFeeCharge:390 | [`Biz55_ErpFeeCharge.java:260`](../../biz/services/Biz55_ErpFeeCharge.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz55_erp_fee_charge)` 동적 INSERT/UPDATE → [`biz55_erp_fee_charge.selectById`](../../biz/sql/biz55_erp_fee_charge.md) |
| `biz.Biz55_ErpFeeCharge.selectByStdDate` | Biz55_Tab_ErpFeeCharge:347 | [`Biz55_ErpFeeCharge.java:40`](../../biz/services/Biz55_ErpFeeCharge.md) | [`biz55_erp_fee_charge.selectByStdDate`](../../biz/sql/biz55_erp_fee_charge.md) |
| `biz.Biz55_ErpFeeCharge.updateApprId` | Biz55_Tab_ErpFeeCharge:465 | [`Biz55_ErpFeeCharge.java:244`](../../biz/services/Biz55_ErpFeeCharge.md) | [`biz55_erp_fee_charge.updateApprId`](../../biz/sql/biz55_erp_fee_charge.md) |
| `biz.Biz55_ErpFeeCharge.updateErpCompany` | Biz55_Tab_ErpFeeCharge:387 | [`Biz55_ErpFeeCharge.java:64`](../../biz/services/Biz55_ErpFeeCharge.md) | [`biz52_erp_fee.selectByDate`](../../biz/sql/biz52_erp_fee.md), [`biz55_erp_fee_charge.insertErpFeeCharge`](../../biz/sql/biz55_erp_fee_charge.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp01_person.getPersonCount`](../../emp/sql/emp01_person.md), [`sms02_history.selectByCompanyId`](../../sms/sql/sms02_history.md), [`sys10_file.selectByCompanyId`](../../sys/sql/sys10_file.md) |
| `dcr.Dcr10_MailHistory.insertMailHistory` | Biz55_Tab_ErpFeeCharge:789 | [`Dcr10_MailHistory.java:94`](../../dcr/services/Dcr10_MailHistory.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr10_mail_history.insertMailHistory`](../../dcr/sql/dcr10_mail_history.md), [`dcr11_mail_file_history.insertMailFileHistory`](../../dcr/sql/dcr11_mail_file_history.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Biz55_Tab_ErpFeeCharge:410 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `sys.Sys10_File.selectApprRelateDoc` | Biz55_Tab_ErpFeeCharge:732 | [`Sys10_File.java:155`](../../sys/services/Sys10_File.md) | [`sys10_file.selectApprRelateDoc`](../../sys/sql/sys10_file.md) |
| `utils.mail.SendMailSMTP.sendMailSessionTest` | Biz55_Tab_ErpFeeCharge:752 | [`SendMailSMTP.java:101`](../../utils/services/mail.SendMailSMTP.md) | [`cmp10_mail_book.selectByEmailAddress`](../../cmp/sql/cmp10_mail_book.md), [`emp00_trans_info.getPersonInfo`](../../emp/sql/emp00_trans_info.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.selectByPersonId`](../../sys/sql/sys01_company.md), [`sys10_file.selectByFileId`](../../sys/sql/sys10_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr05_relate_doc`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`biz50_erp_setup`](../../../db/tables/biz.md), [`biz51_erp_cont_corp`](../../../db/tables/biz.md), [`biz52_erp_fee`](../../../db/tables/biz.md), [`biz55_erp_fee_charge`](../../../db/tables/biz.md), [`cmp10_mail_book`](../../../db/tables/cmp.md), [`cmp11_mail_role`](../../../db/tables/cmp.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr10_mail_history`](../../../db/tables/dcr.md), [`dcr11_mail_file_history`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sms02_history`](../../../db/tables/sms.md), [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Biz55_Tab_ErpFeeCharge (`client/vi/biz/Biz55_Tab_ErpFeeCharge.java`, 902줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 청구년월: {dataYMText} 검색: {searchText} {retrieveButton} {createButton} {deleteButton} {confirmButton} {cancleButton} {multiSendButton}
- 입력·하위 화면: `dataYMText` TextField 빈칸="YYYY.MM", `searchText` TextField 빈칸="계약사", `lookupErpFeeCharge` Biz55_Lookup_ErpFeeCharge, `editor` Apr01_Edit_ApprDoc, `lookupErpCompany` Biz55_Lookup_ErpCompany, `popup` Dcr01_Lookup_Class, `apprDoc` Apr01_Edit_ApprDoc, `mailSender` Dcr10_Lookup_MailSender
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - actionCell 50 "수정" Cell 편집:editCell
  - fixYn 80 "확정여부" BooleanYn2
  - erpProductCode 60 "상품코드" TextCenter
  - corpName 170 "계약사명" Text
  - chargeDate 90 "청구일" Date
  - startDate 90 "사용시작일" Date
  - closeDate 90 "사용종료일" Date
  - erpFee 100 "시스템사용료" Long
  - dataFee 100 "DATA사용료" Long
  - smsCount 80 "사용량(건)" Long
  - addSmsFee 100 "추가요금" Long
  - serverUsage 80 "사용량(GB)" Long
  - addServerFee 100 "추가요금" Long
  - userCount 80 "사용인원(명)" Long
  - addUserFee 100 "추가요금" Long
  - chargeAmt 100 "청구금액" Long
  - actionCell 70 "결재요청" Cell 편집:actionCell01
  - apprStatusName 90 "결재상태" TextCenter
  - actionCell 70 "문서보기" Cell 편집:viewCell
  - actionCell 80 "메일보내기" Cell 편집:actionCell02
  - mailYn 70 "송신여부" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L90-120) → settings(), retrieve()
[E1] dataYMText.KeyPress [Enter] (L131) → retrieve()
[E2] searchText.KeyPress [Enter] (L142) → retrieve()
[E3] createButton[생성].Select (L151) → create()
[E4] retrieveButton[조회].Select (L157) → retrieve()
[E5] deleteButton[삭제].Select (L163) → deleteRow()
       └ [E10] messageBox.DialogHide [YES] (L363) → 서비스 biz.Biz55_ErpFeeCharge.delete
[E6] confirmButton[확정].Select (L169) → confirmUpdate()
       └ [E11] msgBox.DialogHide [YES] (L531) → retrieve()
       └ [E12] msgBox.DialogHide [YES] (L561) → retrieve()
[E7] cancleButton[확정취소].Select (L175) → confirmUpdate()
[E8] multiSendButton[일괄메일발송].Select (L181) → multiSendMailReady()
[E9] msgBox.DialogHide [YES] (L237) → searchDcr()
[E13] button01[닫기].Select (L643) → 인라인 L643-648 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L341-353 | 생성자,E1,E2,E4,E11,E12,create,updateApprId | 서비스 biz.Biz55_ErpFeeCharge.selectByStdDate(stdDate, searchText) | 업무 |
| private deleteRow() | L355-374 | E5 | ConfirmBox → E10 | 업무 |
| private create() | L376-407 | E3 | 조회창 Biz55_Lookup_ErpCompany 열기, 서비스 biz.Biz55_ErpFeeCharge.updateErpCompany(dataYMText, startDate, closeDate, beforeStartDate, beforeCloseDate) | 업무 |
| private searchDcr() | L409-439 | E9,buildGrid | 조회창 Dcr01_Lookup_Class 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertLinkApproval() | L441-461 | searchDcr | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L464-476 | insertLinkApproval | 서비스 biz.Biz55_ErpFeeCharge.updateApprId(apprId) | 업무 |
| private confirmUpdate() | L478-589 | E6,E7 | 미선택 시 alert "선택된 계약사가 없습니다" → 확인창 E11 | 업무 |
| private sendMail() | L591-620 | buildGrid | 조회창 Dcr10_Lookup_MailSender 열기, 서비스 biz.Biz50_ErpSetup.selectMailForm(noteYn) | 업무 |
| private multiSendMailReady() | L622-655 | E8 | 확인창 표시 | 업무 |
| private processSendMail() | L657-686 | multiSendMailReady | 확인창 표시 | 업무 |
| private multiSetMailCheck() | L688-728 | processSendMail | 확인창 표시, 서비스 biz.Biz50_ErpSetup.selectMailForm(noteYn) | 업무 |
| private fileRetrieve() | L730-749 | multiSetMailCheck | 서비스 sys.Sys10_File.selectApprRelateDoc(apprId) | 업무 |
| private multiSendMail() | L751-778 | fileRetrieve | 상태 처리 | 업무 |
| private addLog() | L780-809 | multiSendMail | 서비스 dcr.Dcr10_MailHistory.insertMailHistory(fileList) | 업무 |
| private getDate() | L811-814 | create | 서비스 yyyy.MM.dd | 업무 |
| private getStartDate() | L816-820 | retrieve,create | 서비스 yyyy.MM.dd | 업무 |
| private getBeforeStartDate() | L822-827 | create | 서비스 yyyy.MM.dd | 업무 |
| private getCloseDate() | L829-835 | create | 서비스 yyyy.MM.dd | 업무 |
| private getBeforeCloseDate() | L837-843 | create | 서비스 yyyy.MM.dd | 업무 |
| public createMapping() | L846-854 | sendMail,multiSetMailCheck | 상태 처리 | 업무 |
| private checkStringNull() | L856-864 | createMapping | 상태 처리 | 업무 |
| private checkDateNull() | L866-876 | createMapping | 상태 처리 | 업무 |
| private checkLongNull() | L878-888 | createMapping | 상태 처리 | 업무 |
| public settings() | L122-188 | 생성자 | 이벤트 연결, 초기값: dataYMText=DateTimeFormat.getFormat("yyyy.MM" | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L190-339 | 필드 초기화 | 조회창 Biz55_Lookup_ErpFeeCharge 열기 → 콜백: unmask, 팝업 Apr01_Edit_ApprDoc 열기, 확인창 표시, 서비스 apr.Apr01_Appr.selectById, apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L890-892 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlContentStyle() | L894-896 | multiSendMailReady,processSendMail,multiSetMailCheck | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L898-900 | multiSendMailReady | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L311 newHeaderGroupMap011newHeaderGroupConfig12 100 "문자 추가" (biz55_new_header_group_map011new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L312 newHeaderGroupMap013newHeaderGroupConfig12 100 "서버 추가" (biz55_new_header_group_map013new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L313 newHeaderGroupMap015newHeaderGroupConfig12 100 "사용자 추가" (biz55_new_header_group_map015new_header_group_config12 컬럼 없음)
  // ⚠ 대응 없음 (GridBuilder L316) addCell
  gb.booleanYn2('fixYn', 80, '확정여부'),  // L317
  gb.textCenter('erpProductCd', 60, '상품코드'),  // L318 SQL 계산 컬럼(selectByStdDate: sys01_erp_product_cd)
  gb.text('corpNm', 170, '계약사명'),  // L319 SQL 계산 컬럼(selectByStdDate: sys15_corp_nm)
  gb.date('chargeDate', 90, '청구일'),  // L320
  gb.date('startDate', 90, '사용시작일'),  // L321
  gb.date('closeDate', 90, '사용종료일'),  // L322
  gb.long('erpFee', 100, '시스템사용료'),  // L323
  gb.long('dataFee', 100, 'DATA사용료'),  // L324
  gb.long('smsCount', 80, '사용량(건)'),  // L325
  gb.long('addSmsFee', 100, '추가요금'),  // L326
  gb.long('serverUsage', 80, '사용량(GB)'),  // L327
  gb.long('addServerFee', 100, '추가요금'),  // L328
  gb.long('userCount', 80, '사용인원(명)'),  // L329
  gb.long('addUserFee', 100, '추가요금'),  // L330
  gb.long('chargeAmt', 100, '청구금액'),  // L331
  // ⚠ 대응 없음 (GridBuilder L332) addCell
  gb.textCenter('apprStatusNm', 90, '결재상태'),  // L333 SQL 계산 컬럼(selectByStdDate: f_cdnm('AprStatusCode', apr01_status_cd…)
  // ⚠ 대응 없음 (GridBuilder L334) addCell
  // ⚠ 대응 없음 (GridBuilder L335) addCell
  gb.textCenter('mailYn', 70, '송신여부'),  // L336 SQL 계산 컬럼(selectByStdDate: CASE WHEN ( SELECT COUNT(*) FROM dcr10_…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="generate" onClick={create}>생성</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="save" onClick={confirmUpdate}>확정</Button>
5. <Button type="cancel" onClick={confirmUpdate}>확정취소</Button>
6. <Button type="unknown" onClick={multiSendMailReady}>일괄메일발송</Button>
7. <Button type="unknown" onClick={() => /* 인라인 L643-648 (new SelectHandler() { @Override publi…) */}>닫기</Button>

### Biz55_Lookup_ErpFeeCharge (`client/vi/biz/Biz55_Lookup_ErpFeeCharge.java`, 545줄)

- 입력·하위 화면: `erpContCorpId` LongField, `corpName` LookupTriggerField, `chargeDate` MyDateField, `startDate` MyDateField, `closeDate` MyDateField, `erpFee` LongField, `dataFee` LongField, `smsCount` LongField, `addSmsFee` LongField, `serverUsage` LongField, `addServerFee` LongField, `userCount` LongField, `addUserFee` LongField, `totalAmt` LongField, `chargeAmt` LongField, `totalVat` LongField, `etcAmt` LongField, `etcDesc` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L98-100) → 초기화
[E1] corpName[계약사].TriggerClick (L156) → 인라인 L156-161 (new TriggerClickHandler(){ @Override …)
[E2] startDate[사용시작일].ValueChange (L162) → defaultSetup()
[E3] closeDate[사용종료일].ValueChange (L168) → defaultSetup()
[E4] updateButton[저장].Select (L174) → update()
[E5] closeButton[닫기].Select (L180) → hide()
[E6] erpFee[시스템 사용료].KeyUp (L187) → calculation()
[E7] dataFee[DATA 사용료].KeyUp (L199) → calculation()
[E8] smsCount.KeyUp (L211) → calculation()
[E9] addSmsFee[문자 추가요금].KeyUp (L217) → calculation()
[E10] serverUsage.KeyUp (L229) → calculation()
[E11] addServerFee[서버 추가요금].KeyUp (L235) → calculation()
[E12] userCount[사용 인원].KeyUp (L247) → calculation()
[E13] addUserFee[사용자 추가요금].KeyUp (L253) → calculation()
[E14] etcAmt[기타금액].KeyUp (L265) → calculation()
[E15] totalAmt[사용료 합계].KeyUp (L271) → calculation()
[E16] totalVat[부가세].KeyUp (L277) → calculation()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L102-131 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L133-283 | edit | 상태 처리 | 업무 |
| private getEditor() | L285-377 | edit | LabelHtml 래퍼 | 업무 |
| private update() | L379-403 | E4 | 서비스 biz.Biz55_ErpFeeCharge.insertUpdate | 업무 |
| private defaultSetup() | L405-453 | E2,E3,edit | 서비스 biz.Biz52_ErpFee.selectDefaultData(erpContCorpId, companyId, startDate, closeDate), LabelHtml 래퍼 | 업무 |
| private createLabelHtml() | L455-461 | getEditor,defaultSetup | 상태 처리 | 업무 |
| private calculation() | L463-524 | E6,E7,E8,E9,E10,E11,E12,E13,E14,E15,E16,defaultSetup | 상태 처리 | 업무 |
| private numberFormat() | L526-535 | createLabelHtml | 상태 처리 | 업무 |
| private setHtmlStyle() | L537-539 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L541-543 | edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Biz55_Lookup_ErpCompany (`client/vi/biz/Biz55_Lookup_ErpCompany.java`, 169줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="계약사명"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - corpName 200 "계약사명" Text
  - contEndDate 100 "계약종료일" Date
  - erpEndDate 120 "시스템 사용종료일" Date
  - serviceTypeName 100 "서비스종류" TextCenter

#### 이벤트
[E1] searchText.KeyPress [Enter] (L87) → retrieve()
[E2] grid.RowDoubleClick (L96) → create()
[E3] retrieveButton[조회].Select (L103) → retrieve()
[E4] createButton[생성].Select (L110) → create()
[E5] cancelButton[닫기].Select (L116) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L50-82 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L84-122 | open | 상태 처리 | 업무 |
| private retrieve() | L137-149 | E1,E3,open | 서비스 biz.Biz51_ErpContCorp.selectErpCompany(searchText, stdDate) | 업무 |
| private create() | L151-160 | E2,E4 | 상태 처리 | 업무 |
| private buildGrid() | L124-135 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L162-164 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L166-168 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('corpNm', 200, '계약사명'),  // L129
  gb.date('contEndDate', 100, '계약종료일'),  // L130
  gb.date('erpEndDate', 120, '시스템 사용종료일'),  // L131
  gb.textCenter('serviceTypeNm', 100, '서비스종류'),  // L132
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="generate" onClick={create}>생성</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

