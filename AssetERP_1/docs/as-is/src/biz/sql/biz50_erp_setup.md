# biz50_erp_setup

`server/biz/mapper/biz50_erp_setup.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 34 | [`biz50_erp_setup`](../../../db/tables/biz.md) | `f_cdnm` | `biz.Biz50_ErpSetup.selectById` |
| `selectAll` | select | 44 | [`biz50_erp_setup`](../../../db/tables/biz.md) | `f_cdnm` | `biz.Biz50_ErpSetup.selectAll` |
| `selectByStartDate` | select | 54 | [`biz50_erp_setup`](../../../db/tables/biz.md) | `f_cdnm` | `biz.Biz50_ErpSetup.selectByStartDate` |
| `selectDefaultData` | select | 66 | [`biz52_erp_fee`](../../../db/tables/biz.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`sms02_history`](../../../db/tables/sms.md), [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md) | `f_today` | `biz.Biz50_ErpSetup.selectDefaultData` |
| `selectMailForm` | select | 143 | [`biz50_erp_setup`](../../../db/tables/biz.md) |  | `biz.Biz50_ErpSetup.selectMailForm` |
| `getNote` | select | 151 | [`biz50_erp_setup`](../../../db/tables/biz.md) |  | `biz.Biz50_ErpSetup.getNote` |
| `updateNote` | update | 158 | [`biz50_erp_setup`](../../../db/tables/biz.md) | `f_create_seq` | `biz.Biz50_ErpSetup.updateNote` |
