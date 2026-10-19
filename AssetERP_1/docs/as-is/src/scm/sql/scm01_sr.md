# scm01_sr

`server/scm/mapper/scm01_sr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `getSystemCodeName` | sql | 43 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_today` |  |
| `selectById` | select | 96 | [`scm01_sr`](../../../db/tables/scm.md), [`scm10_dev`](../../../db/tables/scm.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_corp_nm`, `f_get_dev_status`, `f_today` | `scm.Scm01_Sr.selectById` |
| `selectByText` | select | 128 | [`emp01_person`](../../../db/tables/emp.md), [`scm01_sr`](../../../db/tables/scm.md), [`scm02_sr_appr_step`](../../../db/tables/scm.md), [`scm10_dev`](../../../db/tables/scm.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_dev_status`, `f_today` | `scm.Scm01_Sr.selectByText` |
| `selectByDevMng` | select | 201 | [`emp01_person`](../../../db/tables/emp.md), [`scm01_sr`](../../../db/tables/scm.md), [`scm10_dev`](../../../db/tables/scm.md), [`scm11_dev_step`](../../../db/tables/scm.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_get_dev_status`, `f_today` | `scm.Scm01_Sr.selectByDevMng` |
| `getSrModel` | select | 275 | [`scm01_sr`](../../../db/tables/scm.md), [`scm10_dev`](../../../db/tables/scm.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_corp_nm`, `f_today` | `scm.Scm01_Sr.getSrModel` |
| `createSrNo` | select | 312 | [`scm01_sr`](../../../db/tables/scm.md) |  | `scm.Scm01_Sr.update` |
| `updateContent` | update | 319 | [`scm01_sr`](../../../db/tables/scm.md) |  | `scm.Scm01_Sr.updateContent` |
| `updateResultContent` | update | 325 | [`scm01_sr`](../../../db/tables/scm.md) |  | `scm.Scm01_Sr.updateResultContent` |
