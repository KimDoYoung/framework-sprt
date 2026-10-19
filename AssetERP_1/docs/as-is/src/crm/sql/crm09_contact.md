# crm09_contact

`server/crm/mapper/crm09_contact.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectShareInfo` | sql | 47 | [`crm14_share_default`](../../../db/tables/crm.md) | `f_emp_kor_nm`, `f_org_nm`, `f_today` |  |
| `selectById` | select | 62 | [`crm09_contact`](../../../db/tables/crm.md), [`crm14_share_default`](../../../db/tables/crm.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_sysdate`, `f_today` | - |
| `selectByName` | select | 81 | [`crm09_contact`](../../../db/tables/crm.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `crm.Crm09_Contact.selectByName` |
| `whereCondition` | sql | 97 | - |  |  |
| `selectByNamePaging` | select | 103 | [`crm09_contact`](../../../db/tables/crm.md), [`crm14_share_default`](../../../db/tables/crm.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_sysdate`, `f_today` | `crm.Crm09_Contact.selectByPaging` |
| `selectByNameTotal` | select | 127 | [`crm09_contact`](../../../db/tables/crm.md) |  | `crm.Crm09_Contact.selectByPaging` |
| `selectByCompanyName` | select | 134 | [`crm09_contact`](../../../db/tables/crm.md) |  | `crm.Crm09_Contact.selectByCompanyName` |
| `selectKeyInCompanyName` | select | 145 | [`biz01_promo`](../../../db/tables/biz.md) |  | `crm.Crm09_Contact.selectKeyInCompanyName` |
| `selectBiz02Company` | select | 155 | [`biz01_promo`](../../../db/tables/biz.md), [`biz02_person`](../../../db/tables/biz.md), [`sys01_company`](../../../db/tables/sys.md) |  | `crm.Crm09_Contact.selectBiz02Company` |
| `selectBiz02Emp` | select | 174 | [`biz01_promo`](../../../db/tables/biz.md), [`biz02_person`](../../../db/tables/biz.md), [`sys01_company`](../../../db/tables/sys.md) | `f_emp_kor_nm` | `crm.Crm09_Contact.selectBiz02Emp` |
