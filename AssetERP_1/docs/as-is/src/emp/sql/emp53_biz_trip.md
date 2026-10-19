# emp53_biz_trip

`server/emp/mapper/emp53_biz_trip.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 36 | [`apr01_appr`](../../../db/tables/apr.md), [`emp53_biz_trip`](../../../db/tables/emp.md), [`emp56_share`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_sysdate`, `f_today` | `emp.Emp53_BizTrip.selectById`, `emp.Emp53_BizTrip.updateShareInfo` |
| `selectByCompanyId` | select | 68 | [`apr01_appr`](../../../db/tables/apr.md), [`emp53_biz_trip`](../../../db/tables/emp.md), [`emp56_share`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_sysdate`, `f_today` | `emp.Emp53_BizTrip.selectByCompanyId` |
| `selectByPersonId` | select | 109 | [`apr01_appr`](../../../db/tables/apr.md), [`emp53_biz_trip`](../../../db/tables/emp.md), [`emp56_share`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_sysdate`, `f_today` | `emp.Emp53_BizTrip.selectByPersonId` |
| `updatePublicYn` | update | 142 | [`emp53_biz_trip`](../../../db/tables/emp.md) |  | `emp.Emp53_BizTrip.updateShareInfo` |
