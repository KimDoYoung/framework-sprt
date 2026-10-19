# 도메인: mkt

화면 2개, 컴포넌트 3개, 서버 클래스 6개, 매퍼 6개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Mkt01_Tab_TargetCompany`](screens/Mkt01_Tab_TargetCompany.md) | 커뮤니티 > 03. 업무활동 > 업무활동등록 | 9 | 22 |
| [`Mkt03_Tab_HistoryManager`](screens/Mkt03_Tab_HistoryManager.md) | 커뮤니티 > 03. 업무활동 > 업무활동등록(관리자) | 3 | 6 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Mkt01_Lookup_Select`](components/Mkt01_Lookup_Select.md) | bbs, biz | 4 | 13 |
| [`Mkt01_Lookup_Select2`](components/Mkt01_Lookup_Select2.md) | biz | 1 | 2 |
| [`Mkt03_Lookup_History`](components/Mkt03_Lookup_History.md) | frm | 4 | 20 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`mkt.Mkt01_TargetCompany`](../mkt/services/Mkt01_TargetCompany.md) | 10 |
| [`mkt.Mkt02_Manager`](../mkt/services/Mkt02_Manager.md) | 5 |
| [`mkt.Mkt03_History`](../mkt/services/Mkt03_History.md) | 7 |
| [`mkt.Mkt04_RelateFund`](../mkt/services/Mkt04_RelateFund.md) | 5 |
| [`mkt.Mkt05_Share`](../mkt/services/Mkt05_Share.md) | 7 |
| [`mkt.Mkt06_Favorite`](../mkt/services/Mkt06_Favorite.md) | 5 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`mkt01_target_company`](sql/mkt01_target_company.md) | 17 |
| [`mkt02_manager`](sql/mkt02_manager.md) | 5 |
| [`mkt03_history`](sql/mkt03_history.md) | 7 |
| [`mkt04_relate_fund`](sql/mkt04_relate_fund.md) | 3 |
| [`mkt05_share`](sql/mkt05_share.md) | 5 |
| [`mkt06_favorite`](sql/mkt06_favorite.md) | 3 |

