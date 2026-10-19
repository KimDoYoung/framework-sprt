# tdm64_chck_evid_extr

`server/tdm/mapper/tdm64_chck_evid_extr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`tdm64_chck_evid_extr`](../../../db/tables/tdm.md) |  | `tdm.Tdm64_ChckEvidExtr.selectById` |
| `selectByTargetId` | select | 25 | [`tdm64_chck_evid_extr`](../../../db/tables/tdm.md) |  | `tdm.Tdm64_ChckEvidExtr.selectByTargetId` |
| `insertCopy` | insert | 34 | [`tdm64_chck_evid_extr`](../../../db/tables/tdm.md) | `f_create_seq`, `f_sysdate` | `tdm.Tdm52_ChckManl.batchCheckComplete` |
| `deleteByTargetId` | delete | 51 | [`tdm64_chck_evid_extr`](../../../db/tables/tdm.md) |  | `tdm.Tdm52_ChckManl.batchCancelComplete`, `tdm.Tdm52_ChckManl.deleteTmpFile`, `tdm.Tdm52_ChckManl.updateCheckStatus` |
