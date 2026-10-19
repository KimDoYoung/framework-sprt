# bbs.Bbs12_ApplicationForm

`server/bbs/Bbs12_ApplicationForm.java`

서비스 키 `bbs.Bbs12_ApplicationForm.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`bbs12_application_form.selectById`](../../bbs/sql/bbs12_application_form.md) | - |  |
| `selectByCompanyId` | 27 | [`bbs12_application_form.selectByCompanyId`](../../bbs/sql/bbs12_application_form.md) | `Bbs12_Lookup_ApplicationMng` |  |
| `formCheck` | 35 | [`bbs12_application_form.insert`](../../bbs/sql/bbs12_application_form.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys09_code.selectByApplicationForm`](../../sys/sql/sys09_code.md) | `Bbs12_Lookup_ApplicationMng` |  |
| `appTypeCall` | 69 | [`bbs12_application_form.selectByAppType`](../../bbs/sql/bbs12_application_form.md) | `Bbs11_Edit_Application` |  |
| `modelUpdate` | 82 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bbs12_application_form)` 동적 INSERT/UPDATE | `Bbs12_Lookup_ApplicationMng` | `UpdateDataModel` |
| `update` | 95 | `UpdateDataModel(bbs12_application_form)` 동적 INSERT/UPDATE | `Bbs12_Lookup_ApplicationMng` | `UpdateDataModel` |
| `delete` | 100 | `UpdateDataModel(bbs12_application_form)` 동적 DELETE | - | `UpdateDataModel` |
