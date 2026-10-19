# tdm11_task_relate_rule

`server/tdm/mapper/tdm11_task_relate_rule.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 22 | [`tdm11_task_relate_rule`](../../../db/tables/tdm.md) | `f_cdnm`, `f_today`, `getcompanyrule` | `tdm.Tdm11_TaskRelateRule.selectById` |
| `selectBySearchText` | select | 36 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`tdm11_task_relate_rule`](../../../db/tables/tdm.md) | `f_cdnm`, `f_today`, `getcompanyrule` | `tdm.Tdm11_TaskRelateRule.selectBySearchText` |
| `countUseByRuleCode` | select | 68 | [`tdm10_task`](../../../db/tables/tdm.md), [`tdm11_task_relate_rule`](../../../db/tables/tdm.md) |  | `tdm.Tdm11_TaskRelateRule.update` |
| `countRelateByRuleCode` | select | 78 | [`tdm10_task`](../../../db/tables/tdm.md), [`tdm11_task_relate_rule`](../../../db/tables/tdm.md) |  | `bbs.Bbs15_CompanyRule.update` |
