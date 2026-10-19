# tdm91_company_setup

`server/tdm/mapper/tdm91_company_setup.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`tdm91_company_setup`](../../../db/tables/tdm.md) |  | `tdm.Tdm91_CompanySetup.selectById` |
| `selectByCompanyId` | select | 25 | [`tdm91_company_setup`](../../../db/tables/tdm.md) | `f_create_seq` | `tdm.Tdm91_CompanySetup.selectByCompanyId` |
| `selectByDate` | select | 43 | [`tdm91_company_setup`](../../../db/tables/tdm.md) | `f_create_seq` | `tdm.Tdm52_ChckManl.updateComplete`, `tdm.Tdm54_ChckInsuff.updateComplete` |
| `countByDate` | select | 66 | [`tdm91_company_setup`](../../../db/tables/tdm.md) |  | `tdm.Tdm91_CompanySetup.update` |
