# kfs01_remote_view

`server/kfs/mapper/kfs01_remote_view.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`kfs01_remote_view`](../../../db/tables/kfs.md) |  | `kfs.Kfs01_RemoteView.selectById` |
| `selectByText` | select | 24 | [`kfs01_remote_view`](../../../db/tables/kfs.md) |  | `kfs.Kfs01_RemoteView.selectByText` |
| `selectByPersonName` | select | 41 | [`kfs01_remote_view`](../../../db/tables/kfs.md) |  | `kfs.Kfs01_RemoteView.selectByPersonName` |
| `excelInsert` | insert | 56 | [`kfs01_remote_view`](../../../db/tables/kfs.md) | `f_create_seq` | - |
| `excelDelete` | delete | 70 | [`kfs01_remote_view`](../../../db/tables/kfs.md) |  | - |
