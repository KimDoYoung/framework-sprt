# sch11_ipo_company

`server/sch/mapper/sch11_ipo_company.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 20 | [`sch11_ipo_company`](../../../db/tables/sch.md) |  | `sch.Sch11_IpoCompany.selectById` |
| `selectByIpoId` | select | 26 | [`sch11_ipo_company`](../../../db/tables/sch.md) |  | `sch.Sch11_IpoCompany.selectByIpoId` |
| `insertInterest` | insert | 33 | [`sch11_ipo_company`](../../../db/tables/sch.md) | `f_create_seq` | `sch.Sch11_IpoCompany.insertInterest` |
