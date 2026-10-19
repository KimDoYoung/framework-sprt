# 도메인: bmt

화면 4개, 컴포넌트 0개, 서버 클래스 5개, 매퍼 5개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Bmt01_Tab_Buy`](screens/Bmt01_Tab_Buy.md) | 준법감시 > 40. 이익제공(수령)현황 > 판촉물 구매 및 제공내역 | 1 | 6 |
| [`Bmt10_Tab_Info`](screens/Bmt10_Tab_Info.md) | 고유자산 > 30. 고유자산 현황 > 전산장비관리 | 7 | 15 |
| [`Bmt12_Tab_EmpIct`](screens/Bmt12_Tab_EmpIct.md) | 경영관리 > 20. 대외보고서 > 임직원 정보통신수단 | 1 | 2 |
| [`Bmt12_Tab_PcList`](screens/Bmt12_Tab_PcList.md) | 고유자산 > 30. 고유자산 현황 > PC장비상세 | 5 | 10 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`bmt.Bmt01_Buy`](../bmt/services/Bmt01_Buy.md) | 4 |
| [`bmt.Bmt10_Info`](../bmt/services/Bmt10_Info.md) | 7 |
| [`bmt.Bmt11_History`](../bmt/services/Bmt11_History.md) | 4 |
| [`bmt.Bmt12_PcHistory`](../bmt/services/Bmt12_PcHistory.md) | 9 |
| [`bmt.Bmt20_RelateAppr`](../bmt/services/Bmt20_RelateAppr.md) | 5 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`bmt01_buy`](sql/bmt01_buy.md) | 2 |
| [`bmt10_info`](sql/bmt10_info.md) | 5 |
| [`bmt11_history`](sql/bmt11_history.md) | 2 |
| [`bmt12_pc_history`](sql/bmt12_pc_history.md) | 5 |
| [`bmt20_relate_appr`](sql/bmt20_relate_appr.md) | 2 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `Bmt11_Lookup_History` | `client/vi/bmt/Bmt11_Lookup_History.java` | `bmt.Bmt11_History.delete`, `bmt.Bmt11_History.selectByInfoId`, `bmt.Bmt11_History.update` |
| `Bmt12_Lookup_History` | `client/vi/bmt/Bmt12_Lookup_History.java` | `bmt.Bmt12_PcHistory.delete`, `bmt.Bmt12_PcHistory.selectByInfoId` |
