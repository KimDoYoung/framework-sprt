# emp17_benefit

`server/emp/mapper/emp17_benefit.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 39 | [`apr01_appr`](../../../db/tables/apr.md), [`emp17_benefit`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `emp.Emp17_Benefit.selectById` |
| `selectByCompanyId` | select | 51 | [`apr01_appr`](../../../db/tables/apr.md), [`emp17_benefit`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `emp.Emp17_Benefit.selectByCompanyId` |
| `selectByText` | select | 66 | [`apr01_appr`](../../../db/tables/apr.md), [`emp17_benefit`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `emp.Emp17_Benefit.selectByText` |
| `selectByBenefitCode` | select | 85 | [`act01_account_code`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`emp17_benefit`](../../../db/tables/emp.md), [`emp55_benefit_info`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `emp.Emp17_Benefit.selectByBenefitCode` |
| `selectByPersonId` | select | 110 | [`apr01_appr`](../../../db/tables/apr.md), [`emp17_benefit`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `emp.Emp17_Benefit.selectByPersonId` |
| `selectByYyyymm` | select | 127 | [`apr01_appr`](../../../db/tables/apr.md), [`emp17_benefit`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | `emp.Emp17_Benefit.payRequestApprCheck`, `emp.Emp17_Benefit.selectApprId`, `emp.Emp17_Benefit.selectByYyyymm` |
| `deleteApprId` | update | 140 | [`emp17_benefit`](../../../db/tables/emp.md) |  | `emp.Emp17_Benefit.deleteApprId` |
| `updateApprId` | update | 146 | [`emp17_benefit`](../../../db/tables/emp.md) |  | `emp.Emp17_Benefit.updateApprId` |
| `updateModel` | update | 152 | [`emp17_benefit`](../../../db/tables/emp.md) |  | `emp.Emp17_Benefit.updatePayRequestApprId`, `emp.Emp17_Benefit.updatePayRequestYm` |
| `deleteBenefitId` | delete | 171 | [`emp17_benefit`](../../../db/tables/emp.md) |  | `emp.Emp17_Benefit.deleteBenefitId` |
