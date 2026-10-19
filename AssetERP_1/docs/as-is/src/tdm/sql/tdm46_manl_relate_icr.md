# tdm46_manl_relate_icr

`server/tdm/mapper/tdm46_manl_relate_icr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 15 | [`icr01_class_tree`](../../../db/tables/icr.md), [`tdm46_manl_relate_icr`](../../../db/tables/tdm.md) |  | `tdm.Tdm46_ManlRelateIcr.selectById` |
| `selectByManlId` | select | 24 | [`icr01_class_tree`](../../../db/tables/icr.md), [`tdm46_manl_relate_icr`](../../../db/tables/tdm.md) |  | `tdm.Tdm46_ManlRelateIcr.selectByManlId` |
| `insert` | insert | 34 | [`tdm46_manl_relate_icr`](../../../db/tables/tdm.md) | `f_create_seq` | `tdm.Tdm46_ManlRelateIcr.insertList` |
| `insertByManlId` | insert | 52 | [`tdm46_manl_relate_icr`](../../../db/tables/tdm.md) | `f_create_seq` | `tdm.Tdm43_Manl.copyDutyList`, `tdm.Tdm43_Manl.copyManlList` |
| `deleteByManlId` | delete | 62 | [`tdm46_manl_relate_icr`](../../../db/tables/tdm.md) |  | `tdm.Tdm43_Manl.delete` |
