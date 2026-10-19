# scm.Scm01_Sr

`server/scm/Scm01_Sr.java`

서비스 키 `scm.Scm01_Sr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`scm01_sr.selectById`](../../scm/sql/scm01_sr.md) | `Scm01_Edit_Sr` |  |
| `selectByText` | 26 | [`scm01_sr.selectByText`](../../scm/sql/scm01_sr.md) | `Scm01_Tab_Sr` |  |
| `selectByDevMng` | 51 | [`scm01_sr.selectByDevMng`](../../scm/sql/scm01_sr.md) | `Scm01_Tab_DevMng` |  |
| `getSrModel` | 72 | [`scm01_sr.getSrModel`](../../scm/sql/scm01_sr.md) | `Scm10_Tab_Dev`, `Scm11_Edit_DevStep`, `Scm11_Tab_DevTest`, `Scm13_Tab_Deploy` |  |
| `update` | 77 | [`scm01_sr.createSrNo`](../../scm/sql/scm01_sr.md), `UpdateDataModel(scm01_sr)` 동적 INSERT/UPDATE | `Scm01_Edit_DevMng`, `Scm01_Edit_Sr` | `UpdateDataModel` |
| `updateContent` | 96 | [`scm01_sr.updateContent`](../../scm/sql/scm01_sr.md) | `Scm01_Lookup_SrContent` |  |
| `updateResultContent` | 107 | [`scm01_sr.updateResultContent`](../../scm/sql/scm01_sr.md) | `Scm01_Lookup_ResultContent` |  |
| `delete` | 118 | `UpdateDataModel(scm01_sr)` 동적 DELETE | `Scm01_Tab_Sr` | `UpdateDataModel` |
