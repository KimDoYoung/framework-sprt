# tdm47_manl_relate_dcr

`server/tdm/mapper/tdm47_manl_relate_dcr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`tdm47_manl_relate_dcr`](../../../db/tables/tdm.md) | `f_class_tree_nm_allpath` | `tdm.Tdm47_ManlRelateDcr.selectById` |
| `selectByManlId` | select | 26 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`tdm47_manl_relate_dcr`](../../../db/tables/tdm.md) | `f_class_tree_nm_allpath` | `tdm.Tdm47_ManlRelateDcr.selectByManlId` |
| `insert` | insert | 37 | [`tdm47_manl_relate_dcr`](../../../db/tables/tdm.md) | `f_create_seq` | `tdm.Tdm47_ManlRelateDcr.insertList` |
| `insertByManlId` | insert | 55 | [`tdm47_manl_relate_dcr`](../../../db/tables/tdm.md) | `f_create_seq` | `tdm.Tdm43_Manl.copyDutyList`, `tdm.Tdm43_Manl.copyManlList` |
| `deleteByManlId` | delete | 65 | [`tdm47_manl_relate_dcr`](../../../db/tables/tdm.md) |  | `tdm.Tdm43_Manl.delete` |
