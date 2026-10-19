# apr06_appr_step_rule

`server/apr/mapper/apr06_appr_step_rule.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 26 | [`apr06_appr_step_rule`](../../../db/tables/apr.md) |  | `apr.Apr06_ApprStepRule.selectById` |
| `selectByCompanyId` | select | 32 | [`apr06_appr_step_rule`](../../../db/tables/apr.md) |  | `apr.Apr06_ApprStepRule.selectByCompanyId` |
| `selectByApprovalTypeCode` | select | 38 | [`apr06_appr_step_rule`](../../../db/tables/apr.md) | `f_sysdate` | - |
