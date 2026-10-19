# scm12_dev_step_rule

`server/scm/mapper/scm12_dev_step_rule.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 14 | [`scm12_dev_step_rule`](../../../db/tables/scm.md) | `f_cdnm`, `f_sysdate` | `scm.Scm12_DevStepRule.selectById` |
| `getList` | select | 22 | [`scm12_dev_step_rule`](../../../db/tables/scm.md) | `f_cdnm`, `f_sysdate` | `scm.Scm10_Dev.updateList`, `scm.Scm12_DevStepRule.getList` |
