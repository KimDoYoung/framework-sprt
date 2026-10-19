# tdm96_change_detail

`server/tdm/mapper/tdm96_change_detail.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 24 | [`tdm95_change_history`](../../../db/tables/tdm.md), [`tdm96_change_detail`](../../../db/tables/tdm.md) |  | `tdm.Tdm96_ChangeDetail.selectById` |
| `selectByChangeHistoryId` | select | 39 | [`tdm14_task_type`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm95_change_history`](../../../db/tables/tdm.md), [`tdm96_change_detail`](../../../db/tables/tdm.md) | `f_cdnm` | `tdm.Tdm96_ChangeDetail.selectByChangeHistoryId` |
| `createTdmChangeHistory` | select | 71 | - | `f_create_tdmchangehistory` | - |
