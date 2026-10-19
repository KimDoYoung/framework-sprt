# 도메인: opr

화면 2개, 컴포넌트 0개, 서버 클래스 3개, 매퍼 3개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Opr01_Tab_Create`](screens/Opr01_Tab_Create.md) | - | 3 | 8 |
| [`Opr01_Tab_Create_Manager`](screens/Opr01_Tab_Create_Manager.md) | - | 4 | 11 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`opr.Opr01_Create`](../opr/services/Opr01_Create.md) | 7 |
| [`opr.Opr02_Fund`](../opr/services/Opr02_Fund.md) | 4 |
| [`opr.Opr03_Reg`](../opr/services/Opr03_Reg.md) | 5 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`opr01_create`](sql/opr01_create.md) | 6 |
| [`opr02_fund`](sql/opr02_fund.md) | 2 |
| [`opr03_reg`](sql/opr03_reg.md) | 4 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `Opr03_Lookup_FileUpDownLoad` | `client/vi/opr/Opr03_Lookup_FileUpDownLoad.java` | `sys.Sys10_File.selectOneFileName` |
