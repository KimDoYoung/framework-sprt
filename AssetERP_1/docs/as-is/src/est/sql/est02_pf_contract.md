# est02_pf_contract

`server/est/mapper/est02_pf_contract.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 31 | [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`est01_pf_fee_type`](../../../db/tables/est.md), [`est02_pf_contract`](../../../db/tables/est.md) | `f_cdnm`, `f_get_emptrans`, `f_sysdate` | `est.Est02_PfContract.selectById` |
| `selectByText` | select | 63 | [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`est01_pf_fee_type`](../../../db/tables/est.md), [`est02_pf_contract`](../../../db/tables/est.md), [`est03_pf_history`](../../../db/tables/est.md), [`est04_pf_file`](../../../db/tables/est.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_sysdate` | `est.Est02_PfContract.selectByText` |
| `checkList` | select | 118 | [`est02_pf_contract`](../../../db/tables/est.md) |  | `est.Est02_PfContract.checkList` |
| `updateApprId` | update | 126 | [`est02_pf_contract`](../../../db/tables/est.md) |  | `est.Est02_PfContract.updateApprId` |
| `updateResultApprId` | update | 132 | [`est02_pf_contract`](../../../db/tables/est.md) |  | `est.Est02_PfContract.updateResultApprId` |
