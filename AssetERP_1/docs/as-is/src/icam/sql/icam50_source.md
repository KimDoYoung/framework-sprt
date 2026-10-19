# icam50_source

`server/icam/mapper/icam50_source.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`icam50_source`](../../../db/tables/icam.md) |  | `icam.Icam50_Source.selectById` |
| `whereCondition` | sql | 28 | [`icam50_source`](../../../db/tables/icam.md) |  |  |
| `selectByServerTypePaging` | select | 38 | [`icam50_source`](../../../db/tables/icam.md) |  | `icam.Icam50_Source.selectByServerTypePaging` |
| `selectByServerTypePagingTotal` | select | 49 | [`icam50_source`](../../../db/tables/icam.md) |  | `icam.Icam50_Source.selectByServerTypePaging` |
| `countByStdDate` | select | 56 | [`icam50_source`](../../../db/tables/icam.md) | `f_today` | `icam.Icam50_Source.insertIcamDbSource` |
| `insertIcam50` | select | 62 | - | `f_insert_icam50`, `f_today` | `icam.Icam50_Source.insertIcamDbSource` |
| `selectIcamAllSource` | select | 67 | [`all_source`](../../../db/views.md) |  | - |
| `insertIcamDbSource` | insert | 78 | [`icam51_source_tmp`](../../../db/tables/icam.md) | `f_create_batchseq`, `f_sysdate`, `f_today` | `icam.Icam50_Source.insertIcamDbSource` |
