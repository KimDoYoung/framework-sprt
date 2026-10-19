# tdm45_manl_relate_ics

`server/tdm/mapper/tdm45_manl_relate_ics.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 22 | [`ics01_class_tree`](../../../db/tables/ics.md), [`tdm45_manl_relate_ics`](../../../db/tables/tdm.md) |  | `tdm.Tdm45_ManlRelateIcs.selectById` |
| `selectByManlId` | select | 31 | [`ics01_class_tree`](../../../db/tables/ics.md), [`tdm45_manl_relate_ics`](../../../db/tables/tdm.md) |  | `tdm.Tdm45_ManlRelateIcs.selectByManlId` |
| `selectByIcsId` | select | 41 | [`tdm42_manl_org`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm45_manl_relate_ics`](../../../db/tables/tdm.md) | `f_today` | `tdm.Tdm45_ManlRelateIcs.selectByIcsId` |
| `insert` | insert | 64 | [`tdm45_manl_relate_ics`](../../../db/tables/tdm.md) | `f_create_seq` | `tdm.Tdm45_ManlRelateIcs.insertList` |
| `insertByManlId` | insert | 82 | [`tdm45_manl_relate_ics`](../../../db/tables/tdm.md) | `f_create_seq` | `tdm.Tdm43_Manl.copyDutyList`, `tdm.Tdm43_Manl.copyManlList` |
| `deleteByManlId` | delete | 92 | [`tdm45_manl_relate_ics`](../../../db/tables/tdm.md) |  | `tdm.Tdm43_Manl.delete` |
