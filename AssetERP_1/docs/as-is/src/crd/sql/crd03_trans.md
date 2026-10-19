# crd03_trans

`server/crd/mapper/crd03_trans.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 35 | [`crd03_trans`](../../../db/tables/crd.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_today` | `crd.Crd03_Trans.selectById` |
| `selectByCardNo` | select | 62 | [`crd01_card`](../../../db/tables/crd.md), [`crd03_trans`](../../../db/tables/crd.md) |  | - |
| `selectByCardId` | select | 72 | [`crd03_trans`](../../../db/tables/crd.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_today` | `crd.Crd03_Trans.selectByCardId` |
| `selectByYear` | select | 119 | [`crd01_card`](../../../db/tables/crd.md), [`crd03_trans`](../../../db/tables/crd.md) | `f_emp_kor_nm` | `sys.Sys99_Print.insertCardReport` |
| `deleteByCardId` | delete | 138 | [`crd03_trans`](../../../db/tables/crd.md) |  | `crd.Crd03_Trans.deleteByCardId` |
