# ics.Ics11_ChecklistCompany

`server/ics/Ics11_ChecklistCompany.java`

서비스 키 `ics.Ics11_ChecklistCompany.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`ics11_checklist_company.selectById`](../../ics/sql/ics11_checklist_company.md) | - |  |
| `selectByChecklistIdStatus` | 26 | [`ics11_checklist_company.selectByChecklistIdStatus`](../../ics/sql/ics11_checklist_company.md) | `Ics15_Lookup_ChecklistStatusDetail` |  |
| `selectChecklistStatusPaging` | 40 | [`ics11_checklist_company.selectChecklistStatusPaging`](../../ics/sql/ics11_checklist_company.md), [`ics11_checklist_company.selectChecklistStatusPagingTotal`](../../ics/sql/ics11_checklist_company.md) | `Ics15_Tab_ChecklistConfirm`, `Ics15_Tab_ChecklistStatusDetail` |  |
| `updateUseYn` | 59 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics10_checklist.updateUseYn`](../../ics/sql/ics10_checklist.md), [`ics11_checklist_company.insert`](../../ics/sql/ics11_checklist_company.md), [`ics11_checklist_company.selectByChecklistId`](../../ics/sql/ics11_checklist_company.md), [`ics11_checklist_company.updateUseYn`](../../ics/sql/ics11_checklist_company.md) | `Ics10_Lookup_UseYn` |  |
| `updateWriteGroupId` | 101 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics11_checklist_company.insert`](../../ics/sql/ics11_checklist_company.md), [`ics11_checklist_company.selectByChecklistId`](../../ics/sql/ics11_checklist_company.md), [`ics11_checklist_company.updateWriteGroupId`](../../ics/sql/ics11_checklist_company.md) | `Ics10_Tab_Checklist` |  |
| `update` | 137 | `UpdateDataModel(ics11_checklist_company)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 142 | `UpdateDataModel(ics11_checklist_company)` 동적 DELETE | - | `UpdateDataModel` |
