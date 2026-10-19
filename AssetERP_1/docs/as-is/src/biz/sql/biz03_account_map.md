# biz03_account_map

`server/biz/mapper/biz03_account_map.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 20 | [`act01_account_code`](../../../db/tables/act.md), [`biz03_account_map`](../../../db/tables/biz.md) |  | `biz.Biz03_AccountMap.selectById` |
| `selectByUseItemCode` | select | 34 | [`act01_account_code`](../../../db/tables/act.md), [`biz03_account_map`](../../../db/tables/biz.md) |  | `biz.Biz03_AccountMap.selectByUseItemCode` |
| `selectByYear` | select | 49 | [`act01_account_code`](../../../db/tables/act.md), [`biz01_promo`](../../../db/tables/biz.md), [`biz03_account_map`](../../../db/tables/biz.md), [`crd02_data`](../../../db/tables/crd.md), [`crd03_trans`](../../../db/tables/crd.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_emp_kor_nm` | `sys.Sys99_Print.insertCardReport` |
| `selectByMonth` | select | 139 | [`act01_account_code`](../../../db/tables/act.md), [`biz01_promo`](../../../db/tables/biz.md), [`biz03_account_map`](../../../db/tables/biz.md), [`crd02_data`](../../../db/tables/crd.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys99_Print.insertCardReport2` |
