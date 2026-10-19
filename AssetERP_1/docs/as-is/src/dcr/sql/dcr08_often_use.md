# dcr08_often_use

`server/dcr/mapper/dcr08_often_use.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 28 | [`apr10_stamp`](../../../db/tables/apr.md), [`apr30_appr_step_group`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr07_class_detail`](../../../db/tables/dcr.md), [`dcr08_often_use`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number` | `dcr.Dcr08_OftenUse.selectById` |
| `selectByPersonId` | select | 52 | [`apr10_stamp`](../../../db/tables/apr.md), [`apr30_appr_step_group`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr07_class_detail`](../../../db/tables/dcr.md), [`dcr08_often_use`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number` | `dcr.Dcr08_OftenUse.selectByPersonId` |
| `insertUpdate` | insert | 77 | [`dcr08_often_use`](../../../db/tables/dcr.md) | `f_create_seq` | `dcr.Dcr08_OftenUse.insertUpdate` |
