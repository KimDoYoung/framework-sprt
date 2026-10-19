# sch10_ipo

`server/sch/mapper/sch10_ipo.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 39 | [`sch10_ipo`](../../../db/tables/sch.md) | `f_cdnm`, `f_sysdate` | `sch.Sch10_Ipo.selectById` |
| `selectByDate` | select | 46 | [`icam25_ipo`](../../../db/tables/icam.md), [`sch10_ipo`](../../../db/tables/sch.md), [`sch11_ipo_company`](../../../db/tables/sch.md) | `f_cdnm`, `f_sysdate` | `sch.Sch10_Ipo.selectByDate` |
| `selectBySearchText` | select | 200 | [`icam25_ipo`](../../../db/tables/icam.md), [`sch02_share`](../../../db/tables/sch.md), [`sch10_ipo`](../../../db/tables/sch.md), [`sch11_ipo_company`](../../../db/tables/sch.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate` | `sch.Sch10_Ipo.selectBySearchText`, `sys.Sys99_Print.insertRdIpo` |
| `selectBySearchTextAdmin` | select | 266 | [`icam25_ipo`](../../../db/tables/icam.md), [`sch02_share`](../../../db/tables/sch.md), [`sch10_ipo`](../../../db/tables/sch.md), [`sch11_ipo_company`](../../../db/tables/sch.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate` | `sch.Sch10_Ipo.selectBySearchTextAdmin` |
| `selectByIssCorpCode` | select | 331 | [`sch10_ipo`](../../../db/tables/sch.md), [`sch14_ipo_mismatch`](../../../db/tables/sch.md) |  | - |
| `selectByStkCode` | select | 347 | [`sch10_ipo`](../../../db/tables/sch.md) |  | - |
| `excelInsert` | insert | 355 | [`sch10_ipo`](../../../db/tables/sch.md) |  | - |
| `insert` | insert | 414 | [`sch10_ipo`](../../../db/tables/sch.md) | `f_create_seq` | - |
| `update` | update | 436 | [`sch10_ipo`](../../../db/tables/sch.md) |  | - |
| `updateCancelYn` | update | 457 | [`sch10_ipo`](../../../db/tables/sch.md), [`sch13_ipo_crawling`](../../../db/tables/sch.md), [`sch14_ipo_mismatch`](../../../db/tables/sch.md), [`sch15_ipo_item_matching`](../../../db/tables/sch.md) | `f_today` | - |
| `excelDelete` | delete | 489 | [`sch10_ipo`](../../../db/tables/sch.md) |  | - |
