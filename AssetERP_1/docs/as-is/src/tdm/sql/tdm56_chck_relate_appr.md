# tdm56_chck_relate_appr

`server/tdm/mapper/tdm56_chck_relate_appr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm56_chck_relate_appr`](../../../db/tables/tdm.md) | `f_cdnm` | `tdm.Tdm56_ChckRelateAppr.selectById` |
| `selectByCeoRoleId` | select | 27 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm56_chck_relate_appr`](../../../db/tables/tdm.md) | `f_cdnm` | `tdm.Tdm56_ChckRelateAppr.selectByCeoRoleId` |
| `selectApprStatus` | select | 37 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm56_chck_relate_appr`](../../../db/tables/tdm.md) | `f_cdnm` | `tdm.Tdm56_ChckRelateAppr.selectApprStatus` |
| `insertApprId` | insert | 49 | [`tdm56_chck_relate_appr`](../../../db/tables/tdm.md) | `f_create_seq`, `f_sysdate` | `tdm.Tdm56_ChckRelateAppr.insertApprId` |
