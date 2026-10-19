# apr15_repr_corp

`server/apr/mapper/apr15_repr_corp.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`apr10_stamp`](../../../db/tables/apr.md), [`apr15_repr_corp`](../../../db/tables/apr.md) | `f_cdnm`, `f_today` | `apr.Apr15_ReprCorp.selectById` |
| `selectByCompanyId` | select | 30 | [`apr10_stamp`](../../../db/tables/apr.md), [`apr15_repr_corp`](../../../db/tables/apr.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_today` | `apr.Apr15_ReprCorp.selectByCompanyId` |
| `selectCorpRegYn` | select | 77 | [`apr15_repr_corp`](../../../db/tables/apr.md) |  | `apr.Apr15_ReprCorp.selectCorpRegYn` |
