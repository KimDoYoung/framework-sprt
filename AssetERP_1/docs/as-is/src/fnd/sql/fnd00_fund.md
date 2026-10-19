# fnd00_fund

`server/fnd/mapper/fnd00_fund.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 79 | [`fnd00_fund`](../../../db/views.md) | `f_max_workdate`, `f_sysdate`, `f_trunc` | `fnd.Fnd00_Fund.selectById` |
| `selectByCodeName` | select | 86 | [`fnd00_fund`](../../../db/views.md) | `f_max_workdate`, `f_sysdate`, `f_trunc` | - |
| `selectByLookupFundInfo` | select | 99 | [`fnd00_fund`](../../../db/views.md) | `f_max_workdate`, `f_sysdate`, `f_trunc` | `fnd.Fnd00_Fund.selectByLookupFundInfo` |
| `selectByfund` | select | 111 | [`fnd00_fund`](../../../db/views.md) | `f_max_workdate`, `f_sysdate`, `f_trunc` | - |
| `selectBySearchText` | select | 122 | [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_today` | `fnd.Fnd00_Fund.selectBySearchText` |
| `selectBySearchTextAdmin` | select | 323 | [`fnd00_fund_sysdate`](../../../db/views.md) |  | `fnd.Fnd00_Fund.selectBySearchText` |
| `selectByDocIdText` | select | 346 | [`fnd00_fund`](../../../db/views.md) | `f_max_workdate`, `f_sysdate`, `f_trunc` | `fnd.Fnd00_Fund.selectByDocIdText` |
| `selectByLookupFundCode` | select | 366 | [`fnd00_fund`](../../../db/views.md) | `f_max_workdate`, `f_sysdate`, `f_trunc` | `fnd.Fnd00_Fund.selectByLookupFundCode` |
| `selectByLookupFundPlan` | select | 383 | [`fnd00_fund`](../../../db/views.md) | `f_max_workdate`, `f_sysdate`, `f_trunc` | `fnd.Fnd00_Fund.selectByLookupFundPlan` |
| `selectCorpCode` | select | 394 | - | `f_get_corp_cd` | - |
| `selectByOprfund` | select | 398 | [`fnd00_fund`](../../../db/views.md), [`fnd08_org_auth`](../../../db/tables/fnd.md) | `f_max_workdate`, `f_sysdate`, `f_trunc` | `fnd.Fnd00_Fund.selectByOprfund` |
