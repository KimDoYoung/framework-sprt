# emp60_sign

`server/emp/mapper/emp60_sign.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 17 | [`emp60_sign`](../../../db/tables/emp.md), [`sys10_file`](../../../db/tables/sys.md) |  | `emp.Emp60_Sign.selectById` |
| `selectByPersonId` | select | 30 | [`emp60_sign`](../../../db/tables/emp.md), [`sys10_file`](../../../db/tables/sys.md) |  | `emp.Emp60_Sign.selectByPersonId` |
| `getSignId` | select | 44 | [`emp60_sign`](../../../db/tables/emp.md) |  | `apr.Apr01_Appr.update` |
| `notSignIdList` | select | 53 | [`emp60_sign`](../../../db/tables/emp.md) |  | `emp.Emp60_Sign.notSignIdList` |
