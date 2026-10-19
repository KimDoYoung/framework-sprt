# fbx02_history

`server/fbx/mapper/fbx02_history.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 20 | [`fbx01_box`](../../../db/tables/fbx.md), [`fbx02_history`](../../../db/tables/fbx.md) | `f_cdnm`, `f_sysdate` | `fbx.Fbx02_History.selectById` |
| `selectByBoxId` | select | 29 | [`fbx01_box`](../../../db/tables/fbx.md), [`fbx02_history`](../../../db/tables/fbx.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate` | `fbx.Fbx02_History.selectByBoxId` |
| `insert` | insert | 43 | [`fbx02_history`](../../../db/tables/fbx.md) |  | - |
| `insertHistory` | insert | 71 | [`fbx02_history`](../../../db/tables/fbx.md) | `f_create_seq`, `f_sysdate` | - |
