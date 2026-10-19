# Flt10_Tab_CeoReport

- 종류: 화면
- 메뉴: 준법감시 > 11. 임직원매매(준감인) > 책임자보고 (#1464)
- 파일: `client/vi/flt/Flt10_Tab_CeoReport.java`
- 함께 쓰는 클래스 3개:
  - `Flt10_TabPage_TrList` `client/vi/flt/Flt10_TabPage_TrList.java`
  - `Flt10_TabPage_ReportPerson` `client/vi/flt/Flt10_TabPage_ReportPerson.java`
  - `Flt03_TabPage_Account` `client/vi/flt/Flt03_TabPage_Account.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr01_Lookup_ApprLink`](../../apr/components/Apr01_Lookup_ApprLink.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Flt10_Tab_CeoReport:217 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `apr.Apr01_Appr.selectByLinkCode` | Flt10_Tab_CeoReport:195, Flt10_Tab_CeoReport:303 | [`Apr01_Appr.java:77`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectByLinkCode`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Flt10_Tab_CeoReport:371 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `flt.Flt03_Account.selectByStdDate` | Flt03_TabPage_Account:60 | [`Flt03_Account.java:55`](../../flt/services/Flt03_Account.md) | [`flt03_account.selectByStdDate`](../../flt/sql/flt03_account.md) |
| `flt.Flt10_Tr.selectByStdDate` | Flt10_TabPage_ReportPerson:55 | [`Flt10_Tr.java:188`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.selectByStdDate`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.selectByStdDate2` | Flt10_TabPage_TrList:83 | [`Flt10_Tr.java:199`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.selectByStdDate2`](../../flt/sql/flt10_tr.md) |
| `sys.Sys10_File.getServerPath` | Flt10_Tab_CeoReport:442 | [`Sys10_File.java:231`](../../sys/services/Sys10_File.md) | [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `sys.Sys99_Print.insertRdCeoReport` | Flt10_Tab_CeoReport:429, Flt10_Tab_CeoReport:530 | [`Sys99_Print.java:4551`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`flt03_account.selectByStdDate`](../../flt/sql/flt03_account.md), [`flt10_tr.selectByStdDate`](../../flt/sql/flt10_tr.md), [`flt10_tr.selectByStdDate2`](../../flt/sql/flt10_tr.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`flt01_company_std`](../../../db/tables/flt.md), [`flt02_emp`](../../../db/tables/flt.md), [`flt03_account`](../../../db/tables/flt.md), [`flt04_oath`](../../../db/tables/flt.md), [`flt05_item_type`](../../../db/tables/flt.md), [`flt07_family_consent`](../../../db/tables/flt.md), [`flt10_tr`](../../../db/tables/flt.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_get_dcr_no`, `f_get_emptrans`, `f_get_floortrcheck`, `f_get_quarter_date`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `getperson`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Flt10_Tab_CeoReport (`client/vi/flt/Flt10_Tab_CeoReport.java`, 632줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준년월: {yyyyText} {monthComboBox} 재직구분: {transName} {retrieveButton} 상신상태: {apprStepName} {apprButton} {apprViewButton} {downloadButton} {rdFileCreateForm} {rdFileDownloadForm}
- 입력·하위 화면: `apprStepCode` TextField, `apprStepName` TextField, `yyyyText` TextField, `monthComboBox` ComboBoxField("MonthsCode"), `transName` StringComboBox, `lookup` Apr01_Lookup_ApprLink, `editor` Apr01_Edit_ApprDoc, `tabPage01` Flt03_TabPage_Account, `tabPage02` Flt10_TabPage_ReportPerson, `tabPage03` Flt10_TabPage_TrList, `apprDoc` Apr01_Edit_ApprDoc

#### 이벤트
[E0] 화면 열림 (생성자 L89-124) → settings(), retrieve()
[E1] yyyyText.KeyPress [Enter] (L136) → retrieve()
[E2] monthComboBox[MonthsCode].Collapse (L149) → retrieve()
[E3] transName[재직].Collapse (L163) → retrieve()
[E4] retrieveButton[조회].Select (L170) → retrieve()
[E5] apprButton[결재요청].Select (L177) → dcrChk()
[E6] downloadButton[엑셀다운로드].Select (L185) → createRdExcel()
[E7] apprViewButton[문서보기].Select (L192) → getStdDate(), apprChk()
[E8] rdFileCreateForm.SubmitComplete (L245) → insertLinkApproval()
[E9] tabPanel.Selection [arg0 != null] (L264) → retrieve()
[E10] messageBox.DialogHide [YES] (L486) → insertLinkApproval()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L275-299 | 생성자,E1,E2,E3,E4,E9 | 상태 처리 | 업무 |
| private apprChk() | L301-368 | E7,retrieve,insertLinkApproval | 서비스 apr.Apr01_Appr.selectByLinkCode | 업무 |
| private dcrChk() | L370-394 | E5 | 조회창 Dcr01_Lookup_Class 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode(companyId, linkCode) | 업무 |
| private insertLinkApproval() | L396-412 | E8,E10,createRd | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private createRd() | L414-514 | dcrChk | 확인창 표시, 서비스 sys.Sys99_Print.insertRdCeoReport, sys.Sys10_File.getServerPath(companyId, personId, stdDate, startDate, transCode, noAccountSkipYnCheck, windowClassName, companyId) | 업무 |
| private createRdExcel() | L516-584 | E6 | 서비스 sys.Sys99_Print.insertRdCeoReport(companyId, personId, stdDate, startDate, transCode, noAccountSkipYnCheck, windowClassName) | 업무 |
| private getStdDate() | L586-600 | E7,retrieve,apprChk,insertLinkApproval,createRd,createRdExcel | 서비스 yyyy.MM.dd | 업무 |
| private getStdDateEnd() | L602-618 | settings,retrieve,createRd,createRdExcel | 서비스 yyyy.MM.dd | 업무 |
| private getDateStr() | L620-624 | createRd,createRdExcel | 상태 처리 | 업무 |
| private settings() | L126-273 | 생성자 | 조회창 Apr01_Lookup_ApprLink 열기, 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectByLinkCode, apr.Apr01_Appr.selectById, 이벤트 연결, 초기값: yyyyText=year, monthComboBox=Integer.valueOf(month("MonthsCode") | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L626-628 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L629-631 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={dcrChk}>결재요청</Button>
3. <Button type="search" onClick={() => /* getStdDate(), apprChk() */}>문서보기</Button>
4. <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>

### Flt10_TabPage_TrList (`client/vi/flt/Flt10_TabPage_TrList.java`, 98줄)

- 레이아웃: center=grid
- 그리드 `grid` (buildGrid01()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - personName 80 "이름" TextFrozen 편집:"center"
  - orgName 150 "소속" TextFrozen 편집:"left"
  - checkCycleName 80 "보고주기" TextFrozen 편집:"center"
  - trYn 100 "매매여부" TextCenter 편집:"C13322"
  - depositAmt 130 "당해연도<br>순입금액" Long 편집:"C13322"
  - totalInvestAmt 130 "총 누적<br>투자금액" Long 편집:"C13322"
  - corpName 180 "증권사" Text
  - accountNo 200 "계좌번호" Text
  - accountName 100 "계좌명" Text
  - trItemName 180 "매매종목" Text
  - trTypeName 80 "거래구분" TextCenter
  - regDate 100 "사전신고일" Date
  - expectTrQty 100 "신고수량" Double
  - trDate 100 "매매일자" Date
  - trQty 100 "매매수량" Double
  - unitPrice 120 "단가" Double
  - trAmt 150 "매매금액" Long

#### 이벤트
[E0] 화면 열림 (생성자 L28-32) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildGrid01() | L34-65 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L67-92 | 공개 메서드 | 서비스 flt.Flt10_Tr.selectByStdDate2(companyId, stdDate, noAccountSkipYnCheck, startDate, transCode), 건수 표시 | 업무 |
| private setHtmlGridStyle() | L95-97 | buildGrid01 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid01 = () => [
  // ⚠DB없음 L37 newHeaderGroupMap05newHeaderGroupConfigsetHtmlGridStyle13 100 "점검사항" (flt01_new_header_group_map05new_header_group_configset_html_grid_style13 컬럼 없음)
  // ⚠DB없음 L38 newHeaderGroupMap08newHeaderGroupConfig111 100 "매매내역" (flt01_new_header_group_map08new_header_group_config111 컬럼 없음)
  // ⚠ 대응 없음 (GridBuilder L41) addTextFrozen
  // ⚠ 대응 없음 (GridBuilder L42) addTextFrozen
  // ⚠ 대응 없음 (GridBuilder L43) addTextFrozen
  gb.textCenter('trYn', 100, '매매여부'),  // L49
  gb.long('depositAmt', 130, '당해연도<br>순입금액'),  // L50
  gb.long('totalInvestAmt', 130, '총 누적<br>투자금액'),  // L51
  gb.text('corpNm', 180, '증권사'),  // L52
  gb.text('accountNo', 200, '계좌번호'),  // L53
  gb.text('accountNm', 100, '계좌명'),  // L54
  gb.text('trItemNm', 180, '매매종목'),  // L55
  gb.textCenter('trTypeNm', 80, '거래구분'),  // L56
  gb.date('regDate', 100, '사전신고일'),  // L57
  gb.double('expectTrQty', 100, '신고수량'),  // L58
  gb.date('trDate', 100, '매매일자'),  // L59
  gb.double('trQty', 100, '매매수량'),  // L60
  gb.double('unitPrice', 120, '단가'),  // L61
  gb.long('trAmt', 150, '매매금액'),  // L62
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Flt10_TabPage_ReportPerson (`client/vi/flt/Flt10_TabPage_ReportPerson.java`, 65줄)

- 레이아웃: center=grid
- 그리드 `grid` (buildGrid01(), 체크박스(다중)):
  - personName 80 "이름" TextCenter
  - orgName 150 "소속" Text
  - apprEffectDate 100 "신고일자" Date

#### 이벤트
[E0] 화면 열림 (생성자 L24-28) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildGrid01() | L30-38 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L40-64 | 공개 메서드 | 서비스 flt.Flt10_Tr.selectByStdDate(companyId, stdDate, startDate, transCode) | 업무 |

#### Grid Spec
```javascript
const buildGrid01 = () => [
  gb.textCenter('personNm', 80, '이름'),  // L33
  gb.text('orgNm', 150, '소속'),  // L34
  gb.date('apprEffectDate', 100, '신고일자'),  // L35
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Flt03_TabPage_Account (`client/vi/flt/Flt03_TabPage_Account.java`, 70줄)

- 레이아웃: center=grid
- 그리드 `grid` (buildGrid01(), 체크박스(다중)):
  - apprEffectDate 100 "신고일자" Date
  - checkCycleName 80 "보고주기" TextCenter
  - personName 80 "이름" TextCenter
  - orgName 150 "소속" Text
  - corpName 180 "증권사" Text
  - accountNoDec 200 "계좌번호" Text
  - accountName 100 "계좌명" TextCenter
  - familyRelateName 80 "관계" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L24-28) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildGrid01() | L30-43 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L45-69 | 공개 메서드 | 서비스 flt.Flt03_Account.selectByStdDate(companyId, stdDate, startDate, transCode), 건수 표시 | 업무 |

#### Grid Spec
```javascript
const buildGrid01 = () => [
  gb.date('apprEffectDate', 100, '신고일자'),  // L33
  gb.textCenter('checkCycleNm', 80, '보고주기'),  // L34
  gb.textCenter('personNm', 80, '이름'),  // L35
  gb.text('orgNm', 150, '소속'),  // L36
  gb.text('corpNm', 180, '증권사'),  // L37
  gb.text('accountNoDec', 200, '계좌번호'),  // L38
  gb.textCenter('accountNm', 100, '계좌명'),  // L39
  gb.textCenter('familyRelateNm', 80, '관계'),  // L40
];
```

#### 사용된 버튼들
버튼 사용하지 않음

