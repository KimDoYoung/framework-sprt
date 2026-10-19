# sys90_after_service

`server/sys/mapper/sys90_after_service.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 29 | [`sys01_company`](../../../db/tables/sys.md), [`sys90_after_service`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `sys.Sys90_AfterService.selectById` |
| `selectByFileId` | select | 40 | [`sys10_file`](../../../db/tables/sys.md) |  | `sys.Sys90_AfterService.selectByFileId`, `sys.Sys90_AfterService.view` |
| `selectBySearchText` | select | 46 | [`sys01_company`](../../../db/tables/sys.md), [`sys90_after_service`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate`, `f_trunc` | `sys.Sys90_AfterService.selectBySearchText` |
| `selectByAdmin` | select | 70 | [`sys01_company`](../../../db/tables/sys.md), [`sys90_after_service`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate`, `f_trunc` | `sys.Sys90_AfterService.selectByAdmin` |
| `selectByIncomplete` | select | 87 | [`sys01_company`](../../../db/tables/sys.md), [`sys90_after_service`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate`, `f_trunc` | `sys.Sys90_AfterService.selectByIncomplete` |
| `updateHappenRemedy` | update | 104 | [`sys90_after_service`](../../../db/tables/sys.md) |  | `sys.Sys90_AfterService.updateHappenRemedy` |
| `updateRemarks` | update | 110 | [`sys90_after_service`](../../../db/tables/sys.md) |  | `sys.Sys90_AfterService.updateRemarks` |
| `userUpdate` | insert | 116 | [`sys90_after_service`](../../../db/tables/sys.md) |  | `sys.Sys90_AfterService.userUpdate` |
| `adminUpdate` | insert | 148 | [`sys90_after_service`](../../../db/tables/sys.md) |  | `sys.Sys90_AfterService.adminUpdate` |
