# emp15_cert

`server/emp/mapper/emp15_cert.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 43 | [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp11_reward`](../../../db/tables/emp.md), [`emp15_cert`](../../../db/tables/emp.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_sysdate`, `to_decrypts` | `emp.Emp15_Cert.selectById` |
| `selectByCompanyId` | select | 171 | [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp11_reward`](../../../db/tables/emp.md), [`emp15_cert`](../../../db/tables/emp.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_sysdate`, `to_decrypts` | `emp.Emp15_Cert.selectByCompanyId` |
| `getCertData` | select | 279 | [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | - |
| `updateApprId` | update | 311 | [`emp15_cert`](../../../db/tables/emp.md) |  | `emp.Emp15_Cert.updateApprId` |
