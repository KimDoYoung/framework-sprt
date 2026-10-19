# crm14_share_default

`server/crm/mapper/crm14_share_default.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`crm14_share_default`](../../../db/tables/crm.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_today` | `crm.Crm14_ShareDefault.selectById` |
| `selectByContactId` | select | 28 | [`crm14_share_default`](../../../db/tables/crm.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_today` | `crm.Crm14_ShareDefault.selectByContactId` |
| `selectShareInfo` | select | 43 | [`crm14_share_default`](../../../db/tables/crm.md) | `f_emp_kor_nm`, `f_org_nm`, `f_today` | `crm.Crm14_ShareDefault.selectShareInfo` |
