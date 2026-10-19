# biz04_provide_setup

`server/biz/mapper/biz04_provide_setup.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 15 | [`biz04_provide_setup`](../../../db/tables/biz.md) |  | `biz.Biz04_ProvideSetup.selectById` |
| `selectByProvidePurCode` | select | 21 | [`biz04_provide_setup`](../../../db/tables/biz.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_today` | `biz.Biz04_ProvideSetup.selectByProvidePurCode` |
| `selectByProvideContentCode` | select | 42 | [`biz04_provide_setup`](../../../db/tables/biz.md) |  | `biz.Biz04_ProvideSetup.selectByProvideContentCode` |
| `upsert` | insert | 49 | [`biz04_provide_setup`](../../../db/tables/biz.md) | `f_create_seq` | `biz.Biz04_ProvideSetup.upsert` |
