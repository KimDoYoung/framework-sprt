# biz13_with_corp

`server/biz/mapper/biz13_with_corp.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 25 | [`biz13_with_corp`](../../../db/tables/biz.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm`, `f_today` | `biz.Biz13_WithCorp.selectById` |
| `selectByHistoryContCorpId` | select | 35 | [`biz13_with_corp`](../../../db/tables/biz.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm`, `f_today` | `biz.Biz13_WithCorp.selectByHistoryContCorpId` |
| `selectByText` | select | 46 | [`biz13_with_corp`](../../../db/tables/biz.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm`, `f_today` | `biz.Biz13_WithCorp.selectByText` |
| `selectByContCorpId` | select | 58 | [`biz13_with_corp`](../../../db/tables/biz.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_datedif` | - |
| `selectByContCorpId2` | select | 80 | [`biz13_with_corp`](../../../db/tables/biz.md), [`sys15_corp`](../../../db/tables/sys.md) |  | `biz.Biz20_FeeCharge.createFeeCharge` |
| `selectFirstStartDateIsNull` | select | 95 | [`biz13_with_corp`](../../../db/tables/biz.md), [`sys15_corp`](../../../db/tables/sys.md) |  | `biz.Biz20_FeeCharge.createFeeCharge` |
| `selectManageTypeIs1` | select | 105 | [`biz13_with_corp`](../../../db/tables/biz.md), [`sys15_corp`](../../../db/tables/sys.md) |  | `icam.Icam10_Fee.getICAMFundFee`, `icam.Icam13_FeeBookCheck.checkFeeBook` |
| `updateFirstStartDate` | update | 115 | [`biz13_with_corp`](../../../db/tables/biz.md) |  | `biz.Biz20_FeeCharge.createFeeCharge` |
| `deleteContCorpId` | delete | 121 | [`biz13_with_corp`](../../../db/tables/biz.md) |  | `biz.Biz11_ContHistory.deleteContCorpId` |
