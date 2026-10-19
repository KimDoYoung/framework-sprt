# emp55_benefit_info

`server/emp/mapper/emp55_benefit_info.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 20 | [`emp55_benefit_info`](../../../db/tables/emp.md) | `f_cdnm`, `f_get_account_nm`, `f_sysdate` | `emp.Emp55_BenefitInfo.selectById` |
| `selectBySearchText` | select | 29 | [`emp55_benefit_info`](../../../db/tables/emp.md) | `f_cdnm`, `f_get_account_nm`, `f_sysdate` | `emp.Emp55_BenefitInfo.selectBySearchText` |
| `selectByBenefitCode` | select | 38 | [`emp55_benefit_info`](../../../db/tables/emp.md) | `f_cdnm`, `f_get_account_nm`, `f_sysdate` | `emp.Emp55_BenefitInfo.selectByBenefitCode` |
| `selectByCompanyId` | select | 47 | [`emp55_benefit_info`](../../../db/tables/emp.md) | `f_cdnm`, `f_get_account_nm`, `f_sysdate` | `emp.Emp55_BenefitInfo.selectByCompanyId` |
| `selectAccountName` | select | 56 | [`emp55_benefit_info`](../../../db/tables/emp.md) | `f_cdnm`, `f_get_account_nm`, `f_sysdate` | `emp.Emp55_BenefitInfo.selectAccountName` |
| `insertInitData` | insert | 66 | [`emp55_benefit_info`](../../../db/tables/emp.md) | `f_create_seq` | `emp.Emp55_BenefitInfo.insertInitData` |
| `insertFromEmp55` | insert | 80 | [`emp55_benefit_info`](../../../db/tables/emp.md) | `f_create_seq` | - |
