# 도메인: dbm

화면 4개, 컴포넌트 0개, 서버 클래스 4개, 매퍼 3개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Dbm01_RD_TabComments`](screens/Dbm01_RD_TabComments.md) | - | 3 | 1 |
| [`Dbm01_Tab_TabComments`](screens/Dbm01_Tab_TabComments.md) | 관리자 > 09. 기타 > Table Spec,(Model)Properties | 4 | 9 |
| [`Dbm10_Tab_MakePdf`](screens/Dbm10_Tab_MakePdf.md) | 관리자 > 09. 기타 > PDF 생성 테스트 | 1 | 2 |
| [`Dbm99_Tab_RDTest`](screens/Dbm99_Tab_RDTest.md) | - | 2 | 1 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`dbm.Dbm00_DDLRun`](../dbm/services/Dbm00_DDLRun.md) | 1 |
| [`dbm.Dbm01_TabComments`](../dbm/services/Dbm01_TabComments.md) | 3 |
| [`dbm.Dbm02_ColComments`](../dbm/services/Dbm02_ColComments.md) | 2 |
| [`dbm.Dbm03_TabColumns`](../dbm/services/Dbm03_TabColumns.md) | 4 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`dbm01_tab_comments`](sql/dbm01_tab_comments.md) | 4 |
| [`dbm02_col_comments`](sql/dbm02_col_comments.md) | 3 |
| [`dbm03_tab_columns`](sql/dbm03_tab_columns.md) | 4 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `TabPage_Company` | `client/vi/dbm/TabPage_Company.java` | `sys.Sys01_Company.delete`, `sys.Sys01_Company.update` |
