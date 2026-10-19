# tdm01_hr

`server/tdm/mapper/tdm01_hr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 45 | [`tdm01_hr`](../../../db/tables/tdm.md), [`tdm03_add_title`](../../../db/tables/tdm.md) | `f_cdnm`, `f_get_tdmpersoninfo`, `f_today` | `tdm.Tdm01_Hr.selectById` |
| `selectByPersonId` | select | 62 | [`tdm01_hr`](../../../db/tables/tdm.md) | `f_cdnm`, `f_today` | `tdm.Tdm01_Hr.updateHrInfo` |
| `selectByCompanyId` | select | 71 | [`tdm01_hr`](../../../db/tables/tdm.md), [`tdm03_add_title`](../../../db/tables/tdm.md) | `f_cdnm`, `f_get_tdmpersoninfo`, `f_today` | `tdm.Tdm01_Hr.selectByCompanyId` |
| `selectByEndDate` | select | 99 | [`tdm01_hr`](../../../db/tables/tdm.md) | `f_cdnm`, `f_today` | `tdm.Tdm01_Hr.selectByEndDate` |
| `selectPersonModifyed` | select | 116 | [`emp04_add_title`](../../../db/tables/emp.md), [`tdm01_hr`](../../../db/tables/tdm.md) | `f_cdnm`, `f_today`, `getperson` | `tdm.Tdm01_Hr.selectPersonModifyed` |
| `insert` | insert | 230 | [`tdm01_hr`](../../../db/tables/tdm.md) | `f_create_seq`, `f_sysdate` | `tdm.Tdm01_Hr.updateHrInfo` |
| `updateHrChange` | update | 250 | [`tdm01_hr`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm01_Hr.updateHrInfo` |
| `updateEndDate` | update | 267 | [`tdm01_hr`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm01_Hr.updateHrInfo` |
