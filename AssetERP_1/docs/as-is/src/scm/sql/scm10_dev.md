# scm10_dev

`server/scm/mapper/scm10_dev.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 31 | [`scm01_sr`](../../../db/tables/scm.md), [`scm10_dev`](../../../db/tables/scm.md), [`scm11_dev_step`](../../../db/tables/scm.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_corp_nm`, `f_get_dev_status`, `f_sysdate` | `scm.Scm10_Dev.selectById` |
| `selectByText` | select | 54 | [`emp01_person`](../../../db/tables/emp.md), [`scm01_sr`](../../../db/tables/scm.md), [`scm10_dev`](../../../db/tables/scm.md), [`scm11_dev_step`](../../../db/tables/scm.md) | `f_cdnm`, `f_get_corp_nm`, `f_get_dev_status`, `f_sysdate`, `f_trunc` | `scm.Scm10_Dev.selectByText` |
| `selectBySrId` | select | 117 | [`scm01_sr`](../../../db/tables/scm.md), [`scm10_dev`](../../../db/tables/scm.md), [`scm11_dev_step`](../../../db/tables/scm.md), [`scm13_dev_program`](../../../db/tables/scm.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_corp_nm`, `f_get_dev_status`, `f_sysdate` | `scm.Scm10_Dev.selectBySrId` |
| `updateDate` | update | 159 | [`scm10_dev`](../../../db/tables/scm.md) |  | `scm.Scm11_DevStep.modelUpdate`, `scm.Scm11_DevStep.updateStatus` |
