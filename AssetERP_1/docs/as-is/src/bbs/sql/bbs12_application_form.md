# bbs12_application_form

`server/bbs/mapper/bbs12_application_form.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`bbs12_application_form`](../../../db/tables/bbs.md) | `f_cdnm`, `f_sysdate` | `bbs.Bbs12_ApplicationForm.selectById` |
| `selectByCompanyId` | select | 25 | [`bbs12_application_form`](../../../db/tables/bbs.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_cdnm`, `f_today` | `bbs.Bbs12_ApplicationForm.selectByCompanyId` |
| `selectByAppType` | select | 42 | [`bbs12_application_form`](../../../db/tables/bbs.md) | `f_cdnm`, `f_sysdate` | `bbs.Bbs12_ApplicationForm.appTypeCall` |
| `selectByFormCheck` | select | 50 | [`bbs12_application_form`](../../../db/tables/bbs.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | - |
| `insert` | insert | 62 | [`bbs12_application_form`](../../../db/tables/bbs.md) |  | `bbs.Bbs12_ApplicationForm.formCheck` |
| `insertFormBbs12` | insert | 81 | [`bbs12_application_form`](../../../db/tables/bbs.md) | `f_create_seq` | - |
| `deleteApplicationFormId` | delete | 93 | [`bbs12_application_form`](../../../db/tables/bbs.md) |  | - |
