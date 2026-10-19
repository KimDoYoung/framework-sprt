# crm12_work_detail

`server/crm/mapper/crm12_work_detail.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectShareInfo` | sql | 27 | [`crm15_share`](../../../db/tables/crm.md) | `f_emp_kor_nm`, `f_org_nm`, `f_today` |  |
| `selectById` | select | 42 | [`crm09_contact`](../../../db/tables/crm.md), [`crm12_work_detail`](../../../db/tables/crm.md), [`crm13_relate_fund`](../../../db/tables/crm.md), [`crm15_share`](../../../db/tables/crm.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_get_fund_nm`, `f_org_nm`, `f_sysdate`, `f_today` | `crm.Crm12_WorkDetail.selectById` |
| `selectByContactId` | select | 78 | [`crm09_contact`](../../../db/tables/crm.md), [`crm12_work_detail`](../../../db/tables/crm.md), [`crm13_relate_fund`](../../../db/tables/crm.md), [`crm15_share`](../../../db/tables/crm.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_get_fund_nm`, `f_org_nm`, `f_sysdate`, `f_today` | `crm.Crm12_WorkDetail.selectByContactId` |
| `selectByRegDate` | select | 131 | [`crm09_contact`](../../../db/tables/crm.md), [`crm12_work_detail`](../../../db/tables/crm.md), [`crm13_relate_fund`](../../../db/tables/crm.md), [`crm15_share`](../../../db/tables/crm.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_get_fund_nm`, `f_org_nm`, `f_sysdate`, `f_today` | `crm.Crm12_WorkDetail.selectByRegDate` |
| `selectByRegDatePaging` | select | 141 | [`crm09_contact`](../../../db/tables/crm.md), [`crm12_work_detail`](../../../db/tables/crm.md), [`crm13_relate_fund`](../../../db/tables/crm.md), [`crm15_share`](../../../db/tables/crm.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_get_fund_nm`, `f_org_nm`, `f_sysdate`, `f_today` | `crm.Crm12_WorkDetail.selectByRegDatePaging` |
| `selectByRegDatePagingTotal` | select | 152 | [`crm09_contact`](../../../db/tables/crm.md), [`crm12_work_detail`](../../../db/tables/crm.md), [`crm13_relate_fund`](../../../db/tables/crm.md), [`crm15_share`](../../../db/tables/crm.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_get_fund_nm`, `f_org_nm`, `f_sysdate`, `f_today` | `crm.Crm12_WorkDetail.selectByRegDatePaging` |
| `selectWorkDetail` | sql | 162 | [`crm09_contact`](../../../db/tables/crm.md), [`crm12_work_detail`](../../../db/tables/crm.md), [`crm13_relate_fund`](../../../db/tables/crm.md), [`crm15_share`](../../../db/tables/crm.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_get_fund_nm`, `f_org_nm`, `f_sysdate`, `f_today` |  |
| `checkByContactId` | select | 215 | [`crm12_work_detail`](../../../db/tables/crm.md) |  | `crm.Crm12_WorkDetail.checkByContactId` |
