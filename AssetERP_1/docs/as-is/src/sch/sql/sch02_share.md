# sch02_share

`server/sch/mapper/sch02_share.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`sch02_share`](../../../db/tables/sch.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate` | `sch.Sch02_Share.selectById` |
| `selectByClassTreeId` | select | 33 | [`ics01_class_tree`](../../../db/tables/ics.md), [`sch02_share`](../../../db/tables/sch.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate` | `sch.Sch02_Share.selectByClassTreeId` |
| `selectByInfoId` | select | 45 | [`sch01_info`](../../../db/tables/sch.md), [`sch02_share`](../../../db/tables/sch.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate` | `sch.Sch02_Share.selectByInfoId` |
| `selectByInfoId2` | select | 57 | [`org01_code`](../../../db/tables/org.md), [`sch02_share`](../../../db/tables/sch.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate` | `sch.Sch02_Share.selectByInfoId2` |
| `selectByInfoId3` | select | 69 | [`sch02_share`](../../../db/tables/sch.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate` | `sch.Sch02_Share.selectByInfoId3` |
| `selectShareInto` | select | 80 | [`sch02_share`](../../../db/tables/sch.md) | `f_emp_kor_nm`, `f_org_nm`, `f_sysdate` | `sch.Sch02_Share.selectShareInto` |
| `checkWriteGroup` | select | 93 | [`chk02_daily_list`](../../../db/tables/chk.md), [`chk03_daily_list_write`](../../../db/tables/chk.md), [`ics11_checklist_company`](../../../db/tables/ics.md), [`ics15_checklist_write`](../../../db/tables/ics.md), [`sch02_share`](../../../db/tables/sch.md) | `f_get_emptrans`, `f_get_last_day` | `sch.Sch02_Share.checkWriteGroup` |
| `insert` | insert | 129 | [`sch02_share`](../../../db/tables/sch.md) | `f_create_seq` | `icr.Icr05_RelateManager.relateUpdate`, `icr.Icr05_RelateManager.updateList`, `ics.Ics02_Manager.insert`, `ics.Ics05_RelateManager.relateUpdate`, `ics.Ics05_RelateManager.updateList` |
| `insertByInfoId` | insert | 155 | [`sch02_share`](../../../db/tables/sch.md) | `f_create_seq` | `sch.Sch01_Info.copySchedule` |
| `deleteByInfoId` | delete | 170 | [`sch02_share`](../../../db/tables/sch.md) |  | `sch.Sch02_Share.deleteByInfoId` |
| `delete` | delete | 177 | [`sch02_share`](../../../db/tables/sch.md) |  | `icr.Icr05_RelateManager.relateUpdate`, `icr.Icr05_RelateManager.updateList`, `ics.Ics02_Manager.insert`, `ics.Ics05_RelateManager.relateUpdate`, `ics.Ics05_RelateManager.updateList` |
