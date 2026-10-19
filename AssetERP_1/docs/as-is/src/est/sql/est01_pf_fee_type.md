# est01_pf_fee_type

`server/est/mapper/est01_pf_fee_type.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`est01_pf_fee_type`](../../../db/tables/est.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `est.Est01_PfFeeType.selectById` |
| `selectByCompanyId` | select | 33 | [`est01_pf_fee_type`](../../../db/tables/est.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `est.Est01_PfFeeType.selectByCompanyId` |
| `selectByText` | select | 48 | [`est01_pf_fee_type`](../../../db/tables/est.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `est.Est01_PfFeeType.selectByText` |
