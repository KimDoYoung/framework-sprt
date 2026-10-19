# bbs15_company_rule

`server/bbs/mapper/bbs15_company_rule.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 32 | [`bbs15_company_rule`](../../../db/tables/bbs.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `bbs.Bbs15_CompanyRule.selectById`, `bbs.Bbs15_CompanyRule.update` |
| `selectBySearchText` | select | 45 | [`bbs15_company_rule`](../../../db/tables/bbs.md), [`sys10_file`](../../../db/tables/sys.md), [`tdm11_task_relate_rule`](../../../db/tables/tdm.md) | `f_cdnm`, `f_sysdate` | `bbs.Bbs15_CompanyRule.selectBySearchText` |
| `selectBySearchTextManager` | select | 87 | [`bbs15_company_rule`](../../../db/tables/bbs.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `bbs.Bbs15_CompanyRule.selectBySearchTextManager`, `sys.Sys99_Print.insertRdCompanyRule` |
| `countUseByCompanyRuleCode` | select | 103 | [`bbs15_company_rule`](../../../db/tables/bbs.md) |  | `bbs.Bbs15_CompanyRule.update` |
| `countRelateTask` | select | 112 | [`tdm10_task`](../../../db/tables/tdm.md), [`tdm11_task_relate_rule`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md), [`tdm30_role_allc`](../../../db/tables/tdm.md), [`tdm31_role_desc`](../../../db/tables/tdm.md), [`tdm34_role_allc_detail`](../../../db/tables/tdm.md) |  | `bbs.Bbs15_CompanyRule.delete` |
| `countLastCheck` | select | 139 | [`bbs15_company_rule`](../../../db/tables/bbs.md), [`tdm11_task_relate_rule`](../../../db/tables/tdm.md) |  | `bbs.Bbs15_CompanyRule.delete` |
| `excelInsert` | insert | 152 | [`bbs15_company_rule`](../../../db/tables/bbs.md) | `f_create_seq` | - |
| `insertRequest` | insert | 192 | [`bbs15_company_rule`](../../../db/tables/bbs.md) |  | `bbs.Bbs15_CompanyRule.pushData` |
