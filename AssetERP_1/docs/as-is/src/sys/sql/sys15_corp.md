# sys15_corp

`server/sys/mapper/sys15_corp.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 25 | [`sys15_corp`](../../../db/tables/sys.md), [`sys17_corp_account`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `sys.Sys15_Corp.selectById`, `sys.Sys15_Corp.update` |
| `selectByCompanyId` | select | 37 | [`sys15_corp`](../../../db/tables/sys.md), [`sys17_corp_account`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `sys.Sys15_Corp.selectByCompanyId` |
| `selectByUseYn` | select | 61 | [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp14_account`](../../../db/tables/emp.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys17_corp_account`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate`, `f_today`, `to_decrypts` | `sys.Sys15_Corp.selectByUseYn` |
| `selectByCorpName` | select | 127 | [`sys15_corp`](../../../db/tables/sys.md), [`sys17_corp_account`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | - |
| `selectByCorpName2` | select | 141 | [`sys15_corp`](../../../db/tables/sys.md) |  | - |
| `selectByKFS` | select | 149 | [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `sys.Sys15_Corp.selectByKFS` |
| `selectCorpCodeCheck` | select | 166 | [`sys15_corp`](../../../db/tables/sys.md) |  | `sys.Sys15_Corp.update` |
| `selectNewCorpCodeByBizNo` | select | 175 | [`sys15_corp`](../../../db/tables/sys.md) |  | `sys.Sys15_Corp.update` |
| `checkExcelUpload` | select | 184 | [`sys15_corp`](../../../db/tables/sys.md), [`sys17_corp_account`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate`, `to_decrypts` | - |
| `checkUseCorpId` | select | 209 | - | `f_check_use_corp_id` | `sys.Sys15_Corp.delete` |
| `insert` | insert | 213 | [`sys15_corp`](../../../db/tables/sys.md) |  | `sys.Sys15_Corp.update` |
| `insertInitData` | insert | 230 | [`sys15_corp`](../../../db/tables/sys.md) | `f_create_seq` | `sys.Sys15_Corp.insertInitData` |
| `update` | update | 249 | [`sys15_corp`](../../../db/tables/sys.md) |  | `sys.Sys15_Corp.update` |
| `updateCorpCode` | update | 265 | [`sys15_corp`](../../../db/tables/sys.md) |  | - |
| `insertFormSys15` | insert | 271 | [`sys15_corp`](../../../db/tables/sys.md) | `f_create_seq` | - |
