# 도메인: icam

화면 22개, 컴포넌트 1개, 서버 클래스 13개, 매퍼 13개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Icam00_Tab_FundExpectDate`](screens/Icam00_Tab_FundExpectDate.md) | KFS > 10. ICAM 계약사관리 > 펀드예정일정보 | 1 | 1 |
| [`Icam01_Tab_DataInfo`](screens/Icam01_Tab_DataInfo.md) | I/F > 10. ICAM > ICAM 연계정보구분 관리 | 1 | 5 |
| [`Icam02_Tab_CashFlow`](screens/Icam02_Tab_CashFlow.md) | I/F > 10. ICAM > ICAM 현금흐름 | 3 | 2 |
| [`Icam02_Tab_Data`](screens/Icam02_Tab_Data.md) | I/F > 10. ICAM > ICAM 연계정보 | 1 | 1 |
| [`Icam02_Tab_DataAdmin`](screens/Icam02_Tab_DataAdmin.md) | I/F > 10. ICAM > ICAM 연계정보(관리자용) | 1 | 1 |
| [`Icam03_Tab_Fund`](screens/Icam03_Tab_Fund.md) | I/F > 10. ICAM > ICAM 펀드정보 | 2 | 2 |
| [`Icam06_Tab_FundOperateStatus`](screens/Icam06_Tab_FundOperateStatus.md) | 펀드관리 > 20. 운용현황 > 펀드운용현황(펀드합계) | 2 | 3 |
| [`Icam06_Tab_FundPrice`](screens/Icam06_Tab_FundPrice.md) | 펀드관리 > 20. 운용현황 > 펀드별 기준가 현황 | 1 | 2 |
| [`Icam10_Tab_CurrentFeeByFund`](screens/Icam10_Tab_CurrentFeeByFund.md) | 펀드관리 > 20. 운용현황 > 펀드별 발생보수현황; 관리회계 > 30. 펀드운용보수관리 > 월별 펀드보수현황 | 1 | 2 |
| [`Icam10_Tab_FeeAdmin`](screens/Icam10_Tab_FeeAdmin.md) | I/F > 10. ICAM > ICAM 보수(관리자용) | 1 | 1 |
| [`Icam10_Tab_FundMngFee`](screens/Icam10_Tab_FundMngFee.md) | 관리회계 > 30. 펀드운용보수관리 > ICAM 운용보수 발생내역 | 3 | 6 |
| [`Icam10_Tab_OfficeMngFee`](screens/Icam10_Tab_OfficeMngFee.md) | 관리회계 > 30. 사무보수관리 > ICAM 펀드보수 발생내역 | 3 | 5 |
| [`Icam11_Tab_FundMngFeeDeposit`](screens/Icam11_Tab_FundMngFeeDeposit.md) | 관리회계 > 30. 펀드운용보수관리 > 운용보수 입금계좌 관리 | 2 | 4 |
| [`Icam11_Tab_OfficeMngFeeDeposit`](screens/Icam11_Tab_OfficeMngFeeDeposit.md) | 관리회계 > 30. 사무보수관리 > 펀드별 보수입금계좌 등록 | 2 | 4 |
| [`Icam12_Tab_FundMngFeeBook`](screens/Icam12_Tab_FundMngFeeBook.md) | 관리회계 > 30. 펀드운용보수관리 > ICAM 운용보수 월말잔액 | 1 | 1 |
| [`Icam12_Tab_OfficeMngFeeBook`](screens/Icam12_Tab_OfficeMngFeeBook.md) | 관리회계 > 30. 사무보수관리 > ICAM 펀드보수 월말잔액 | 2 | 3 |
| [`Icam50_Tab_DbSource`](screens/Icam50_Tab_DbSource.md) | I/F > 10. ICAM > ICAM DB Source Get | 2 | 2 |
| [`Icam55_Tab_UserApprResult`](screens/Icam55_Tab_UserApprResult.md) | KFS > 04. ICAM 사용자ID 관리 > 사용자ID 처리결과 등록 | 2 | 4 |
| [`Icam55_Tab_UserRegAppr`](screens/Icam55_Tab_UserRegAppr.md) | KFS > 04. ICAM 사용자ID 관리 > 사용자ID 신청서 작성 | 3 | 8 |
| [`Icam55_Tab_UserStopAuth`](screens/Icam55_Tab_UserStopAuth.md) | KFS > 04. ICAM 사용자ID 관리 > 미사용ID 기록관리 | 3 | 3 |
| [`Icam55_Tab_UserStopAuthAppr`](screens/Icam55_Tab_UserStopAuthAppr.md) | KFS > 04. ICAM 사용자ID 관리 > 미사용ID 권한정지 신청 | 1 | 7 |
| [`Icam99_Tab_Test`](screens/Icam99_Tab_Test.md) | I/F > 10. ICAM > 작업용 | 1 | 4 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Icam10_Lookup_FundCode`](components/Icam10_Lookup_FundCode.md) | ast | 1 | 1 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`icam.Icam00_Common`](../icam/services/Icam00_Common.md) | 1 |
| [`icam.Icam01_DataInfo`](../icam/services/Icam01_DataInfo.md) | 4 |
| [`icam.Icam02_Data`](../icam/services/Icam02_Data.md) | 5 |
| [`icam.Icam03_Fund`](../icam/services/Icam03_Fund.md) | 5 |
| [`icam.Icam06_FundBook`](../icam/services/Icam06_FundBook.md) | 4 |
| [`icam.Icam10_Fee`](../icam/services/Icam10_Fee.md) | 9 |
| [`icam.Icam11_FeeDeposit`](../icam/services/Icam11_FeeDeposit.md) | 5 |
| [`icam.Icam12_FeeBook`](../icam/services/Icam12_FeeBook.md) | 2 |
| [`icam.Icam13_FeeBookCheck`](../icam/services/Icam13_FeeBookCheck.md) | 3 |
| [`icam.Icam20_Price`](../icam/services/Icam20_Price.md) | 2 |
| [`icam.Icam50_Source`](../icam/services/Icam50_Source.md) | 3 |
| [`icam.Icam55_IcamUser`](../icam/services/Icam55_IcamUser.md) | 13 |
| [`icam.Icam99_Test`](../icam/services/Icam99_Test.md) | 1 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`icam00_common`](sql/icam00_common.md) | 1 |
| [`icam01_data_info`](sql/icam01_data_info.md) | 5 |
| [`icam02_data`](sql/icam02_data.md) | 7 |
| [`icam03_fund`](sql/icam03_fund.md) | 9 |
| [`icam06_fund_book`](sql/icam06_fund_book.md) | 8 |
| [`icam10_fee`](sql/icam10_fee.md) | 25 |
| [`icam11_fee_deposit`](sql/icam11_fee_deposit.md) | 5 |
| [`icam12_fee_book`](sql/icam12_fee_book.md) | 8 |
| [`icam13_fee_book_check`](sql/icam13_fee_book_check.md) | 4 |
| [`icam20_price`](sql/icam20_price.md) | 12 |
| [`icam25_ipo`](sql/icam25_ipo.md) | 4 |
| [`icam50_source`](sql/icam50_source.md) | 8 |
| [`icam55_icam_user`](sql/icam55_icam_user.md) | 9 |

