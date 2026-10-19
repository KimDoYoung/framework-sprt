# tdm02_hr_record

`server/tdm/mapper/tdm02_hr_record.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 27 | [`tdm02_hr_record`](../../../db/tables/tdm.md) | `f_cdnm`, `f_sysdate` | `tdm.Tdm02_HrRecord.selectById` |
| `selectByCompanyId` | select | 45 | [`tdm02_hr_record`](../../../db/tables/tdm.md) | `f_cdnm`, `f_sysdate` | `tdm.Tdm02_HrRecord.selectByCompanyId` |
| `selectChangeList` | select | 76 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm01_hr`](../../../db/tables/tdm.md), [`tdm10_task`](../../../db/tables/tdm.md), [`tdm14_task_type`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md), [`tdm23_role_relate_org`](../../../db/tables/tdm.md) | `f_cdnm`, `f_emp_kor_nm`, `getperson`, `gettdm30roleallc` | `tdm.Tdm02_HrRecord.selectChangeList` |
| `insert` | insert | 241 | [`tdm02_hr_record`](../../../db/tables/tdm.md) | `f_create_seq`, `f_sysdate`, `f_today` | `tdm.Tdm01_Hr.updateHrInfo` |
| `updateApplyCode` | update | 258 | [`tdm02_hr_record`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm02_HrRecord.updateApplyCode` |
