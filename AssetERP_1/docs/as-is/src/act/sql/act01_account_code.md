# act01_account_code

`server/act/mapper/act01_account_code.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `downAccountTree` | sql | 30 | [`act01_account_code`](../../../db/tables/act.md) |  |  |
| `selectById` | select | 60 | [`act01_account_code`](../../../db/tables/act.md) | `f_cdnm`, `f_sysdate` | `act.Act01_AccountCode.selectById` |
| `selectByCompanyId` | select | 79 | [`act01_account_code`](../../../db/tables/act.md) | `f_cdnm`, `f_sysdate` | `act.Act01_AccountCode.selectByCompanyId`, `sys.Sys99_Print.insertRdAccountCode` |
| `selectBySlipYn` | select | 102 | [`act01_account_code`](../../../db/tables/act.md) | `f_cdnm`, `f_sysdate` | `act.Act01_AccountCode.selectBySlipYn` |
| `selectByAccountCode` | select | 118 | [`act01_account_code`](../../../db/tables/act.md) | `f_cdnm`, `f_sysdate` | `act.Act01_AccountCode.insertAdminCopy` |
| `selectTreeByCompanyId` | select | 138 | [`act01_account_code`](../../../db/tables/act.md) |  | `act.Act01_AccountCode.selectTreeByCompanyId` |
| `selectTreeByAccountCode` | select | 178 | [`act01_account_code`](../../../db/tables/act.md) |  | `act.Act01_AccountCode.insertAdminCopy` |
| `selectTreeByAccountCodeAsc` | select | 207 | [`act01_account_code`](../../../db/tables/act.md) |  | `act.Act04_GenLedger.insertClose` |
| `insertAdminAccountCode` | insert | 236 | [`act01_account_code`](../../../db/tables/act.md) | `f_create_seq` | `act.Act01_AccountCode.insertAdminCopy` |
| `insertFromAct01` | insert | 261 | [`act01_account_code`](../../../db/tables/act.md) | `f_create_seq` | - |
| `updateAdminAccountCode` | update | 285 | [`act01_account_code`](../../../db/tables/act.md) |  | `act.Act01_AccountCode.insertAdminCopy` |
