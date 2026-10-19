# 도메인: tgt

화면 1개, 컴포넌트 0개, 서버 클래스 3개, 매퍼 3개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Tgt01_Tab_Co`](screens/Tgt01_Tab_Co.md) | 고유자산 > (X)02. 부동산 > 매매처정보관리 | 2 | 6 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`tgt.Tgt01_Co`](../tgt/services/Tgt01_Co.md) | 4 |
| [`tgt.Tgt02_CoAcct`](../tgt/services/Tgt02_CoAcct.md) | 4 |
| [`tgt.Tgt03_Trans`](../tgt/services/Tgt03_Trans.md) | 3 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`tgt01_co`](sql/tgt01_co.md) | 2 |
| [`tgt02_co_acct`](sql/tgt02_co_acct.md) | 2 |
| [`tgt03_trans`](sql/tgt03_trans.md) | 1 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `Tgt01_Lookup_Co` | `client/vi/tgt/Tgt01_Lookup_Co.java` | `tgt.Tgt01_Co.selectByText` |
