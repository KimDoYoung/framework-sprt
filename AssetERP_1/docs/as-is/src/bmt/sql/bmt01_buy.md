# bmt01_buy

`server/bmt/mapper/bmt01_buy.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 26 | [`apr01_appr`](../../../db/tables/apr.md), [`biz01_promo`](../../../db/tables/biz.md), [`biz02_person`](../../../db/tables/biz.md), [`bmt01_buy`](../../../db/tables/bmt.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `bmt.Bmt01_Buy.selectById` |
| `selectByCompanyId` | select | 52 | [`apr01_appr`](../../../db/tables/apr.md), [`biz01_promo`](../../../db/tables/biz.md), [`biz02_person`](../../../db/tables/biz.md), [`bmt01_buy`](../../../db/tables/bmt.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `bmt.Bmt01_Buy.selectByCompanyId` |
