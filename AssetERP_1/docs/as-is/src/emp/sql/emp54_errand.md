# emp54_errand

`server/emp/mapper/emp54_errand.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 30 | [`apr01_appr`](../../../db/tables/apr.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp54_errand`](../../../db/tables/emp.md), [`emp56_share`](../../../db/tables/emp.md), [`sys12_calendar`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate`, `f_today` | `emp.Emp54_Errand.selectById`, `emp.Emp54_Errand.updatePublicYn` |
| `selectByPersonId` | select | 68 | [`apr01_appr`](../../../db/tables/apr.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp54_errand`](../../../db/tables/emp.md), [`emp56_share`](../../../db/tables/emp.md), [`sys12_calendar`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate`, `f_today` | `emp.Emp54_Errand.selectByPersonId` |
| `selectByDate` | select | 107 | [`apr01_appr`](../../../db/tables/apr.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp54_errand`](../../../db/tables/emp.md), [`emp56_share`](../../../db/tables/emp.md), [`sys12_calendar`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate`, `f_today` | `emp.Emp54_Errand.selectByDate` |
| `selectByManager` | select | 147 | [`apr01_appr`](../../../db/tables/apr.md), [`emp54_errand`](../../../db/tables/emp.md), [`emp56_share`](../../../db/tables/emp.md), [`sys12_calendar`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_today`, `getperson` | `emp.Emp54_Errand.selectByManager` |
| `updatePublicYn` | update | 184 | [`emp54_errand`](../../../db/tables/emp.md) |  | `emp.Emp54_Errand.updatePublicYn` |
| `insert` | insert | 190 | [`emp54_errand`](../../../db/tables/emp.md) |  | `emp.Emp54_Errand.modelUpdate` |
| `insertCycle` | insert | 208 | [`emp54_errand`](../../../db/tables/emp.md) | `f_create_seq` | - |
