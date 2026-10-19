# emp56_share

`server/emp/mapper/emp56_share.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`emp56_share`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_today` | `emp.Emp56_Share.selectById` |
| `selectByParentId` | select | 28 | [`emp56_share`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_today` | `emp.Emp56_Share.selectByParentId` |
| `selectShareInfo` | select | 38 | [`emp56_share`](../../../db/tables/emp.md) | `f_emp_kor_nm`, `f_org_nm`, `f_today` | `emp.Emp56_Share.selectShareInfo` |
