# 도메인: flt

화면 20개, 컴포넌트 0개, 서버 클래스 14개, 매퍼 15개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Flt00_Tab_Info`](screens/Flt00_Tab_Info.md) | 준법감시 > 10. 임직원매매 > 화면사용순서 | 6 | 21 |
| [`Flt01_Tab_CompanyStd`](screens/Flt01_Tab_CompanyStd.md) | 준법감시 > 11. 임직원매매(준감인) > 기준관리 | 4 | 11 |
| [`Flt02_Tab_EmpInfo`](screens/Flt02_Tab_EmpInfo.md) | 준법감시 > 11. 임직원매매(준감인) > 임직원매매현황 | 5 | 8 |
| [`Flt03_Tab_AccountAdmin`](screens/Flt03_Tab_AccountAdmin.md) | 준법감시 > 11. 임직원매매(준감인) > 계좌신고현황 | 1 | 1 |
| [`Flt03_Tab_AccountReport`](screens/Flt03_Tab_AccountReport.md) | 준법감시 > 10. 임직원매매 > 계좌신고 | 10 | 33 |
| [`Flt05_Tab_ItemTypeAdmin`](screens/Flt05_Tab_ItemTypeAdmin.md) | 기초자료 > 00. 내부통제 > 임직원매매 종목유형관리 | 1 | 4 |
| [`Flt10_Tab_AcntTransfer`](screens/Flt10_Tab_AcntTransfer.md) | 준법감시 > 10. 임직원매매 > 계좌대체 | 4 | 8 |
| [`Flt10_Tab_BuyReport`](screens/Flt10_Tab_BuyReport.md) | 준법감시 > 10. 임직원매매 > 매수 사전신고 | 4 | 23 |
| [`Flt10_Tab_CeoReport`](screens/Flt10_Tab_CeoReport.md) | 준법감시 > 11. 임직원매매(준감인) > 책임자보고 | 4 | 8 |
| [`Flt10_Tab_EmpAppr`](screens/Flt10_Tab_EmpAppr.md) | 준법감시 > 11. 임직원매매(준감인) > 정기보고현황 | 2 | 4 |
| [`Flt10_Tab_PreApprove`](screens/Flt10_Tab_PreApprove.md) | 준법감시 > 11. 임직원매매(준감인) > 사전승인 | 2 | 5 |
| [`Flt10_Tab_RealTransaction`](screens/Flt10_Tab_RealTransaction.md) | 준법감시 > 10. 임직원매매 > 정기보고 | 6 | 32 |
| [`Flt10_Tab_RightsExercise`](screens/Flt10_Tab_RightsExercise.md) | 준법감시 > 10. 임직원매매 > 권리행사/기타입출고 | 5 | 11 |
| [`Flt10_Tab_SellReport`](screens/Flt10_Tab_SellReport.md) | 준법감시 > 10. 임직원매매 > 매도 사전신고 | 4 | 22 |
| [`Flt10_Tab_TrList`](screens/Flt10_Tab_TrList.md) | 준법감시 > 10. 임직원매매 > 매매내역조회 | 1 | 3 |
| [`Flt10_Tab_TrListAdmin`](screens/Flt10_Tab_TrListAdmin.md) | 준법감시 > 11. 임직원매매(준감인) > 매매내역조회 | 1 | 3 |
| [`Flt10_Tab_Violate`](screens/Flt10_Tab_Violate.md) | 준법감시 > 11. 임직원매매(준감인) > 위반내역조회 | 1 | 2 |
| [`Flt10_Tab_ViolateUser`](screens/Flt10_Tab_ViolateUser.md) | 준법감시 > 10. 임직원매매 > 위반내역조회 | 1 | 0 |
| [`Flt11_Tab_BookList`](screens/Flt11_Tab_BookList.md) | 준법감시 > 10. 임직원매매 > 보유내역조회 | 5 | 16 |
| [`Flt11_Tab_BookListAdmin`](screens/Flt11_Tab_BookListAdmin.md) | 준법감시 > 11. 임직원매매(준감인) > 보유내역조회 | 1 | 5 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`flt.Flt01_CompanyStd`](../flt/services/Flt01_CompanyStd.md) | 7 |
| [`flt.Flt02_Emp`](../flt/services/Flt02_Emp.md) | 7 |
| [`flt.Flt03_Account`](../flt/services/Flt03_Account.md) | 9 |
| [`flt.Flt04_Oath`](../flt/services/Flt04_Oath.md) | 6 |
| [`flt.Flt05_ItemType`](../flt/services/Flt05_ItemType.md) | 6 |
| [`flt.Flt06_AccountClose`](../flt/services/Flt06_AccountClose.md) | 6 |
| [`flt.Flt07_FamilyConsent`](../flt/services/Flt07_FamilyConsent.md) | 4 |
| [`flt.Flt08_BuyLockup`](../flt/services/Flt08_BuyLockup.md) | 5 |
| [`flt.Flt10_Tr`](../flt/services/Flt10_Tr.md) | 32 |
| [`flt.Flt11_Book`](../flt/services/Flt11_Book.md) | 7 |
| [`flt.Flt12_BookMonth`](../flt/services/Flt12_BookMonth.md) | 6 |
| [`flt.Flt13_BookInit`](../flt/services/Flt13_BookInit.md) | 6 |
| [`flt.Flt14_RelateAppr`](../flt/services/Flt14_RelateAppr.md) | 5 |
| [`flt.Flt15_TrStatus`](../flt/services/Flt15_TrStatus.md) | 4 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`flt01_company_std`](sql/flt01_company_std.md) | 8 |
| [`flt02_emp`](sql/flt02_emp.md) | 6 |
| [`flt03_account`](sql/flt03_account.md) | 9 |
| [`flt04_oath`](sql/flt04_oath.md) | 6 |
| [`flt05_item_type`](sql/flt05_item_type.md) | 6 |
| [`flt06_account_close`](sql/flt06_account_close.md) | 4 |
| [`flt07_family_consent`](sql/flt07_family_consent.md) | 3 |
| [`flt08_buy_lockup`](sql/flt08_buy_lockup.md) | 3 |
| [`flt09_fund_item`](sql/flt09_fund_item.md) | 3 |
| [`flt10_tr`](sql/flt10_tr.md) | 41 |
| [`flt11_book`](sql/flt11_book.md) | 13 |
| [`flt12_book_month`](sql/flt12_book_month.md) | 5 |
| [`flt13_book_init`](sql/flt13_book_init.md) | 7 |
| [`flt14_relate_appr`](sql/flt14_relate_appr.md) | 4 |
| [`flt15_tr_status`](sql/flt15_tr_status.md) | 3 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `Flt10_Lookup_ItemStk` | `client/vi/flt/Flt10_Lookup_ItemStk.java` | `icam.Icam20_Price.selectByStdDatePaging`, `sys.Sys12_Calendar.selectBizDate2` |
| `Flt10_TabPage_Appr` | `client/vi/flt/Flt10_TabPage_Appr.java` | `flt.Flt03_Account.selectByDate`, `flt.Flt10_Tr.delete`, `flt.Flt10_Tr.selectByAccountId`, `flt.Flt10_Tr.update` |
