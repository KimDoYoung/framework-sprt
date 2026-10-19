# 도메인: biz

화면 19개, 컴포넌트 2개, 서버 클래스 24개, 매퍼 24개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Biz01_Tab_Card`](screens/Biz01_Tab_Card.md) | 준법감시 > 40. 이익제공(수령)현황 > 이익제공 입력(법인카드) | 8 | 26 |
| [`Biz01_Tab_CardContents`](screens/Biz01_Tab_CardContents.md) | 준법감시 > 40. 이익제공(수령)현황 > 법인카드 사용내역 조회 | 7 | 25 |
| [`Biz01_Tab_CardContentsSimple`](screens/Biz01_Tab_CardContentsSimple.md) | 준법감시 > 40. 이익제공(수령)현황 > (s)법인카드사용내역 | 5 | 17 |
| [`Biz01_Tab_CardManagement`](screens/Biz01_Tab_CardManagement.md) | 자금관리 > 30. 법인카드관리 > 법인카드 내역관리 | 7 | 28 |
| [`Biz01_Tab_CardReport`](screens/Biz01_Tab_CardReport.md) | 자금관리 > 30. 법인카드관리 > 법인카드 현황 | 3 | 11 |
| [`Biz01_Tab_CardSimple`](screens/Biz01_Tab_CardSimple.md) | 준법감시 > 40. 이익제공(수령)현황 > (s)이익제공입력(카드) | 6 | 18 |
| [`Biz01_Tab_CardUserAllocation`](screens/Biz01_Tab_CardUserAllocation.md) | 자금관리 > 30. 법인카드관리 > 법인카드 실사용자 배분 | 1 | 2 |
| [`Biz01_Tab_EntertmExpenseReport`](screens/Biz01_Tab_EntertmExpenseReport.md) | 자금관리 > 30. 법인카드관리 > 접대비 현황 | 7 | 14 |
| [`Biz01_Tab_LimitCheckList`](screens/Biz01_Tab_LimitCheckList.md) | 준법감시 > 40. 이익제공(수령)현황 > 이익제공 한도초과현황 | 4 | 3 |
| [`Biz01_Tab_Other`](screens/Biz01_Tab_Other.md) | 준법감시 > 40. 이익제공(수령)현황 > 이익제공 입력(현금,물품) | 7 | 19 |
| [`Biz01_Tab_OtherSimple`](screens/Biz01_Tab_OtherSimple.md) | 준법감시 > 40. 이익제공(수령)현황 > (s)이익제공입력(현금,물품) | 5 | 12 |
| [`Biz01_Tab_PriorApproval`](screens/Biz01_Tab_PriorApproval.md) | 준법감시 > 40. 이익제공(수령)현황 > 이익제공 상세현황 | 1 | 2 |
| [`Biz01_Tab_PriorApprovalSimple`](screens/Biz01_Tab_PriorApprovalSimple.md) | 준법감시 > 40. 이익제공(수령)현황 > (s)이익제공 상세현황 | 1 | 2 |
| [`Biz10_Tab_ContCorp`](screens/Biz10_Tab_ContCorp.md) | KFS > 10. ICAM 계약사관리 > ICAM 계약사 관리 | 11 | 36 |
| [`Biz20_Tab_FeeCharge`](screens/Biz20_Tab_FeeCharge.md) | KFS > 10. ICAM 계약사관리 > 최저보수 청구 | 6 | 21 |
| [`Biz51_Tab_ErpContCorp`](screens/Biz51_Tab_ErpContCorp.md) | KFS > 11. ERP 계약사관리 > AssetERP 계약사관리 | 5 | 18 |
| [`Biz55_Tab_ErpFeeCharge`](screens/Biz55_Tab_ErpFeeCharge.md) | KFS > 11. ERP 계약사관리 > AssetERP 사용료청구 | 3 | 14 |
| [`Biz60_Tab_FundPriceModiReport`](screens/Biz60_Tab_FundPriceModiReport.md) | KFS > 20. 기타 > 기준가 정정내역 보고 | 2 | 12 |
| [`Biz90_Tab_Limit`](screens/Biz90_Tab_Limit.md) | 준법감시 > 40. 이익제공(수령)현황 > 이익제공 기준관리(준감인) | 2 | 6 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Biz01_TabPage_List`](components/Biz01_TabPage_List.md) | bmt | 1 | 4 |
| [`Biz13_Lookup_WithCorp`](components/Biz13_Lookup_WithCorp.md) | scm | 1 | 1 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`biz.Biz01_Promo`](../biz/services/Biz01_Promo.md) | 38 |
| [`biz.Biz02_Person`](../biz/services/Biz02_Person.md) | 9 |
| [`biz.Biz03_AccountMap`](../biz/services/Biz03_AccountMap.md) | 4 |
| [`biz.Biz04_ProvideSetup`](../biz/services/Biz04_ProvideSetup.md) | 4 |
| [`biz.Biz05_RelateAppr`](../biz/services/Biz05_RelateAppr.md) | 13 |
| [`biz.Biz10_ContCorp`](../biz/services/Biz10_ContCorp.md) | 6 |
| [`biz.Biz11_ContHistory`](../biz/services/Biz11_ContHistory.md) | 7 |
| [`biz.Biz12_FeeInfo`](../biz/services/Biz12_FeeInfo.md) | 4 |
| [`biz.Biz13_WithCorp`](../biz/services/Biz13_WithCorp.md) | 9 |
| [`biz.Biz14_RelateAppr`](../biz/services/Biz14_RelateAppr.md) | 5 |
| [`biz.Biz15_Share`](../biz/services/Biz15_Share.md) | 5 |
| [`biz.Biz16_EachCont`](../biz/services/Biz16_EachCont.md) | 7 |
| [`biz.Biz17_DualManageFund`](../biz/services/Biz17_DualManageFund.md) | 4 |
| [`biz.Biz20_FeeCharge`](../biz/services/Biz20_FeeCharge.md) | 12 |
| [`biz.Biz21_FeeChargeDtl`](../biz/services/Biz21_FeeChargeDtl.md) | 3 |
| [`biz.Biz22_FeeChargeCalc`](../biz/services/Biz22_FeeChargeCalc.md) | 4 |
| [`biz.Biz29_Account`](../biz/services/Biz29_Account.md) | 5 |
| [`biz.Biz50_ErpSetup`](../biz/services/Biz50_ErpSetup.md) | 10 |
| [`biz.Biz51_ErpContCorp`](../biz/services/Biz51_ErpContCorp.md) | 7 |
| [`biz.Biz52_ErpFee`](../biz/services/Biz52_ErpFee.md) | 6 |
| [`biz.Biz55_ErpFeeCharge`](../biz/services/Biz55_ErpFeeCharge.md) | 9 |
| [`biz.Biz60_FundPriceModi`](../biz/services/Biz60_FundPriceModi.md) | 5 |
| [`biz.Biz61_ModiRptRelateAppr`](../biz/services/Biz61_ModiRptRelateAppr.md) | 5 |
| [`biz.Biz90_Limit`](../biz/services/Biz90_Limit.md) | 4 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`biz01_promo`](sql/biz01_promo.md) | 51 |
| [`biz02_person`](sql/biz02_person.md) | 9 |
| [`biz03_account_map`](sql/biz03_account_map.md) | 4 |
| [`biz04_provide_setup`](sql/biz04_provide_setup.md) | 4 |
| [`biz05_relate_appr`](sql/biz05_relate_appr.md) | 10 |
| [`biz10_cont_corp`](sql/biz10_cont_corp.md) | 2 |
| [`biz11_cont_history`](sql/biz11_cont_history.md) | 9 |
| [`biz12_fee_info`](sql/biz12_fee_info.md) | 2 |
| [`biz13_with_corp`](sql/biz13_with_corp.md) | 9 |
| [`biz14_relate_appr`](sql/biz14_relate_appr.md) | 3 |
| [`biz15_share`](sql/biz15_share.md) | 5 |
| [`biz16_each_contract`](sql/biz16_each_contract.md) | 6 |
| [`biz17_dual_manage_fund`](sql/biz17_dual_manage_fund.md) | 3 |
| [`biz20_fee_charge`](sql/biz20_fee_charge.md) | 17 |
| [`biz21_fee_charge_dtl`](sql/biz21_fee_charge_dtl.md) | 9 |
| [`biz22_fee_charge_calc`](sql/biz22_fee_charge_calc.md) | 9 |
| [`biz29_account`](sql/biz29_account.md) | 4 |
| [`biz50_erp_setup`](sql/biz50_erp_setup.md) | 7 |
| [`biz51_erp_cont_corp`](sql/biz51_erp_cont_corp.md) | 4 |
| [`biz52_erp_fee`](sql/biz52_erp_fee.md) | 6 |
| [`biz55_erp_fee_charge`](sql/biz55_erp_fee_charge.md) | 8 |
| [`biz60_fund_price_modi`](sql/biz60_fund_price_modi.md) | 2 |
| [`biz61_modi_rpt_relate_appr`](sql/biz61_modi_rpt_relate_appr.md) | 4 |
| [`biz90_limit`](sql/biz90_limit.md) | 3 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `Biz01_Lookup_Rd_ProvideList` | `client/vi/biz/Biz01_Lookup_Rd_ProvideList.java` | `sys.Sys99_Print.insertRdProvideList` |
| `Biz01_Lookup_Rd_ProvideListSimple` | `client/vi/biz/Biz01_Lookup_Rd_ProvideListSimple.java` | `sys.Sys99_Print.insertRdProvideListSimple` |
| `Biz01_Lookup_Rd_ReceiveList` | `client/vi/biz/Biz01_Lookup_Rd_ReceiveList.java` | `sys.Sys99_Print.insertRdProvideList` |
| `Biz10_Lookup_Rd_ContCorp` | `client/vi/biz/Biz10_Lookup_Rd_ContCorp.java` | `sys.Sys99_Print.insertRdContCorp` |
| `Biz13_Page_WithCorp` | `client/vi/biz/Biz13_Page_WithCorp.java` | `biz.Biz13_WithCorp.getCorpName`, `biz.Biz13_WithCorp.insert`, `biz.Biz13_WithCorp.selectByWithGroupId` |
| `Biz20_Lookup_Rd_FeeCharge` | `client/vi/biz/Biz20_Lookup_Rd_FeeCharge.java` | `sys.Sys99_Print.insertRdFeeCharge` |
