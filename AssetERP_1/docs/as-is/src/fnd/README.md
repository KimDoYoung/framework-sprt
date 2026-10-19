# 도메인: fnd

화면 25개, 컴포넌트 7개, 서버 클래스 17개, 매퍼 18개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Fnd01_Tab_FundCode`](screens/Fnd01_Tab_FundCode.md) | 펀드관리 > 02. 펀드관리 > 펀드 등록 및 변경 | 5 | 7 |
| [`Fnd01_Tab_FundIcamHistory`](screens/Fnd01_Tab_FundIcamHistory.md) | 펀드관리 > 02. 펀드관리 > 펀드 조회(변경이력) | 2 | 2 |
| [`Fnd01_Tab_FundInfoLoad`](screens/Fnd01_Tab_FundInfoLoad.md) | - | 5 | 8 |
| [`Fnd01_Tab_FundPlan`](screens/Fnd01_Tab_FundPlan.md) | 펀드관리 > 01. 상품기획 > 신규기획펀드 등록 | 3 | 5 |
| [`Fnd01_Tab_FundSearch`](screens/Fnd01_Tab_FundSearch.md) | 펀드관리 > 02. 펀드관리 > 펀드 조회 | 2 | 2 |
| [`Fnd01_Tab_FundSearchIcam`](screens/Fnd01_Tab_FundSearchIcam.md) | 펀드관리 > 02. 펀드관리 > 펀드 조회 (ICAM) | 2 | 1 |
| [`Fnd03_Tab_Consignment`](screens/Fnd03_Tab_Consignment.md) | 펀드관리 > 90. 기관정보관리 > 수탁사정보 관리 | 1 | 5 |
| [`Fnd03_Tab_ConsignmentManager`](screens/Fnd03_Tab_ConsignmentManager.md) | I/F > 91. 기관정보관리(관리자) > 수탁사정보 관리(관리자) | 1 | 3 |
| [`Fnd06_Tab_OfficeWork`](screens/Fnd06_Tab_OfficeWork.md) | 펀드관리 > 90. 기관정보관리 > 사무수탁사정보 관리 | 1 | 5 |
| [`Fnd06_Tab_OfficeWorkManager`](screens/Fnd06_Tab_OfficeWorkManager.md) | I/F > 91. 기관정보관리(관리자) > 사무수탁사정보 관리(관리자) | 1 | 3 |
| [`Fnd07_Tab_IssuingEntity`](screens/Fnd07_Tab_IssuingEntity.md) | 펀드관리 > 90. 기관정보관리 > 발행기관정보 관리 | 1 | 3 |
| [`Fnd08_Tab_OrgAuth`](screens/Fnd08_Tab_OrgAuth.md) | 펀드관리 > 02. 펀드관리 > 펀드 권한설정 | 5 | 8 |
| [`Fnd08_Tab_OrgAuthTempFund`](screens/Fnd08_Tab_OrgAuthTempFund.md) | 펀드관리 > 01. 상품기획 > 신규기획펀드 권한설정 | 3 | 6 |
| [`Fnd09_Tab_TrustBank`](screens/Fnd09_Tab_TrustBank.md) | 펀드관리 > 90. 기관정보관리 > 수탁은행정보 관리 | 1 | 5 |
| [`Fnd09_Tab_TrustBankManager`](screens/Fnd09_Tab_TrustBankManager.md) | I/F > 91. 기관정보관리(관리자) > 수탁은행정보 관리(관리자) | 1 | 3 |
| [`Fnd10_Tab_RelateAst`](screens/Fnd10_Tab_RelateAst.md) | 펀드관리 > 02. 펀드관리 > 펀드별 자산 조회(ICAM) | 1 | 3 |
| [`Fnd10_Tab_RelateFnd`](screens/Fnd10_Tab_RelateFnd.md) | 펀드관리 > 02. 펀드관리 > 자산별 펀드 조회(ICAM) | 1 | 3 |
| [`Fnd11_Tab_BookExtr`](screens/Fnd11_Tab_BookExtr.md) | 펀드관리 > 02. 펀드관리 > 펀드보유주식등록(타사무) | 1 | 4 |
| [`Fnd20_Tab_Plan`](screens/Fnd20_Tab_Plan.md) | 펀드관리 > 01. 상품기획 > 상품기획일정 등록 | 2 | 4 |
| [`Fnd20_Tab_PlanEmp`](screens/Fnd20_Tab_PlanEmp.md) | 펀드관리 > 01. 상품기획 > 상품기획문서 등록 | 2 | 5 |
| [`Fnd25_Tab_FundTerms`](screens/Fnd25_Tab_FundTerms.md) | 펀드관리 > 02. 펀드관리 > 펀드규약 | 2 | 2 |
| [`Fnd25_Tab_FundTermsManager`](screens/Fnd25_Tab_FundTermsManager.md) | 펀드관리 > 02. 펀드관리 > 펀드규약 등록 | 4 | 7 |
| [`Fnd30_Tab_DemandOpr`](screens/Fnd30_Tab_DemandOpr.md) | 펀드관리 > 04. 공모주청약 > 공모주 수요예측 | 3 | 12 |
| [`Fnd30_Tab_Opr`](screens/Fnd30_Tab_Opr.md) | 펀드관리 > 04. 공모주청약 > 공모주청약 운용지시 | 4 | 14 |
| [`Fnd32_Tab_Account`](screens/Fnd32_Tab_Account.md) | 펀드관리 > 04. 공모주청약 > 공모주 참여계좌 관리 | 1 | 4 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Fnd01_Lookup_SelectMulti`](components/Fnd01_Lookup_SelectMulti.md) | apr, crm, mkt, opr | 1 | 1 |
| [`Fnd01_Lookup_SelectSingle`](components/Fnd01_Lookup_SelectSingle.md) | dcr | 1 | 1 |
| [`Fnd07_Lookup_IssuingEntity`](components/Fnd07_Lookup_IssuingEntity.md) | pln | 1 | 1 |
| [`Fnd10_Lookup_RelateFund`](components/Fnd10_Lookup_RelateFund.md) | flt | 1 | 3 |
| [`Fnd20_Lookup_ToDoList`](components/Fnd20_Lookup_ToDoList.md) | frm | 1 | 4 |
| [`Fnd30_Edit_DemandOpr`](components/Fnd30_Edit_DemandOpr.md) | sch | 1 | 2 |
| [`Fnd30_Edit_Opr`](components/Fnd30_Edit_Opr.md) | sch | 1 | 2 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`fnd.Fnd00_Fund`](../fnd/services/Fnd00_Fund.md) | 7 |
| [`fnd.Fnd01_FundCode`](../fnd/services/Fnd01_FundCode.md) | 16 |
| [`fnd.Fnd02_FundInfo`](../fnd/services/Fnd02_FundInfo.md) | 5 |
| [`fnd.Fnd03_Consignment`](../fnd/services/Fnd03_Consignment.md) | 9 |
| [`fnd.Fnd05_Memeco`](../fnd/services/Fnd05_Memeco.md) | 1 |
| [`fnd.Fnd06_OfficeWork`](../fnd/services/Fnd06_OfficeWork.md) | 8 |
| [`fnd.Fnd07_IssuingEntity`](../fnd/services/Fnd07_IssuingEntity.md) | 3 |
| [`fnd.Fnd08_OrgAuth`](../fnd/services/Fnd08_OrgAuth.md) | 3 |
| [`fnd.Fnd09_TrustBank`](../fnd/services/Fnd09_TrustBank.md) | 8 |
| [`fnd.Fnd10_Book`](../fnd/services/Fnd10_Book.md) | 7 |
| [`fnd.Fnd11_BookExtr`](../fnd/services/Fnd11_BookExtr.md) | 5 |
| [`fnd.Fnd20_Plan`](../fnd/services/Fnd20_Plan.md) | 12 |
| [`fnd.Fnd25_Terms`](../fnd/services/Fnd25_Terms.md) | 4 |
| [`fnd.Fnd26_TermsDetail`](../fnd/services/Fnd26_TermsDetail.md) | 6 |
| [`fnd.Fnd30_Opr`](../fnd/services/Fnd30_Opr.md) | 11 |
| [`fnd.Fnd31_OprFund`](../fnd/services/Fnd31_OprFund.md) | 7 |
| [`fnd.Fnd32_Account`](../fnd/services/Fnd32_Account.md) | 6 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`fnd00_fund`](sql/fnd00_fund.md) | 11 |
| [`fnd01_fund_code`](sql/fnd01_fund_code.md) | 22 |
| [`fnd02_fund_info`](sql/fnd02_fund_info.md) | 12 |
| [`fnd03_consignment`](sql/fnd03_consignment.md) | 13 |
| [`fnd04_sales`](sql/fnd04_sales.md) | 2 |
| [`fnd05_memeco`](sql/fnd05_memeco.md) | 1 |
| [`fnd06_office_work`](sql/fnd06_office_work.md) | 16 |
| [`fnd07_issuing_entity`](sql/fnd07_issuing_entity.md) | 4 |
| [`fnd08_org_auth`](sql/fnd08_org_auth.md) | 3 |
| [`fnd09_trust_bank`](sql/fnd09_trust_bank.md) | 13 |
| [`fnd10_book`](sql/fnd10_book.md) | 8 |
| [`fnd11_book_extr`](sql/fnd11_book_extr.md) | 4 |
| [`fnd20_plan`](sql/fnd20_plan.md) | 6 |
| [`fnd25_terms`](sql/fnd25_terms.md) | 3 |
| [`fnd26_terms_detail`](sql/fnd26_terms_detail.md) | 5 |
| [`fnd30_opr`](sql/fnd30_opr.md) | 5 |
| [`fnd31_opr_fund`](sql/fnd31_opr_fund.md) | 9 |
| [`fnd32_account`](sql/fnd32_account.md) | 4 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `Fnd00_Lookup_PlanFund` | `client/vi/fnd/Fnd00_Lookup_PlanFund.java` | `fnd.Fnd00_Fund.selectByLookupFundPlan` |
| `Fnd01_TabPage_FundCode` | `client/vi/fnd/Fnd01_TabPage_FundCode.java` | `pln.Fnd01_FundPlan.selectByPlanFundId` |
| `Fnd01_Tab_FundSearch_20240730` | `client/vi/fnd/Fnd01_Tab_FundSearch_20240730.java` | `fnd.Fnd01_FundCode.selectByFundName` |
| `Fnd01_Tab_MultiFund` | `client/vi/fnd/Fnd01_Tab_MultiFund.java` | `fnd.Fnd00_Fund.selectByDocIdText` |
| `Fnd05_Tab_Memeco` | `client/vi/fnd/Fnd05_Tab_Memeco.java` | `fnd.Fnd05_Memeco.delete`, `fnd.Fnd05_Memeco.selectByCodeName`, `fnd.Fnd05_Memeco.update` |
