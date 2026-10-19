# bbs.Bbs15_CompanyRule

`server/bbs/Bbs15_CompanyRule.java`

서비스 키 `bbs.Bbs15_CompanyRule.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 27 | [`bbs15_company_rule.selectById`](../../bbs/sql/bbs15_company_rule.md) | - |  |
| `selectBySearchText` | 33 | [`bbs15_company_rule.selectBySearchText`](../../bbs/sql/bbs15_company_rule.md) | `Bbs15_Lookup_CompanyRule`, `Bbs15_Tab_CompanyRule` |  |
| `selectBySearchTextManager` | 38 | [`bbs15_company_rule.selectBySearchTextManager`](../../bbs/sql/bbs15_company_rule.md) | `Bbs15_Tab_CompanyRuleManager` |  |
| `update` | 43 | [`bbs15_company_rule.countUseByCompanyRuleCode`](../../bbs/sql/bbs15_company_rule.md), [`bbs15_company_rule.selectById`](../../bbs/sql/bbs15_company_rule.md), [`tdm11_task_relate_rule.countRelateByRuleCode`](../../tdm/sql/tdm11_task_relate_rule.md), `UpdateDataModel(bbs15_company_rule)` 동적 INSERT/UPDATE | `Bbs15_Edit_CompanyRuleManager` | `UpdateDataModel` |
| `pushData` | 83 | [`bbs15_company_rule.insertRequest`](../../bbs/sql/bbs15_company_rule.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys10_file.insertUpdate`](../../sys/sql/sys10_file.md), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) | `Bbs15_Tab_CompanyRuleManager` | `File` |
| `delete` | 172 | [`bbs15_company_rule.countLastCheck`](../../bbs/sql/bbs15_company_rule.md), [`bbs15_company_rule.countRelateTask`](../../bbs/sql/bbs15_company_rule.md), `UpdateDataModel(bbs15_company_rule)` 동적 DELETE | `Bbs15_Tab_CompanyRuleManager` | `UpdateDataModel` |
