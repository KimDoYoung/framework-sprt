# sch06_alarm

`server/sch/mapper/sch06_alarm.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 35 | [`sch06_alarm`](../../../db/tables/sch.md) | `f_cdnm`, `f_today` | `sch.Sch06_Alarm.selectById` |
| `selectByTargetId` | select | 47 | [`sch06_alarm`](../../../db/tables/sch.md) | `f_cdnm`, `f_today` | `sch.Sch06_Alarm.selectByTargetId` |
| `insertAlarmTarget` | insert | 60 | [`bbs02_notice`](../../../db/tables/bbs.md), [`bbs03_target`](../../../db/tables/bbs.md), [`bbs04_target_company`](../../../db/tables/bbs.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`sch01_info`](../../../db/tables/sch.md), [`sch02_share`](../../../db/tables/sch.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch06_alarm`](../../../db/tables/sch.md), [`sch07_alarm_record`](../../../db/tables/sch.md), [`sch10_ipo`](../../../db/tables/sch.md), [`sch11_ipo_company`](../../../db/tables/sch.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md) | `f_create_batchseq`, `f_get_alarm_date_nm`, `f_get_alarm_datetime`, `f_get_std_date`, `f_sysdate`, `f_today` | - |
| `selectEmp` | sql | 382 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md) | `f_today` |  |
| `insertByTargetId` | insert | 395 | [`sch06_alarm`](../../../db/tables/sch.md) | `f_create_seq` | `sch.Sch01_Info.copySchedule` |
