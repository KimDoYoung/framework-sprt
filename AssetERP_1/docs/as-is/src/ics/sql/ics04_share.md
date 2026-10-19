# ics04_share

`server/ics/mapper/ics04_share.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 20 | [`ics04_share`](../../../db/tables/ics.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate` | `ics.Ics04_Share.selectById` |
| `selectByManagerId` | select | 31 | [`ics04_share`](../../../db/tables/ics.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate` | `icr.Icr05_RelateManager.relateUpdate`, `icr.Icr05_RelateManager.updateList`, `ics.Ics02_Manager.insert`, `ics.Ics04_Share.selectByManagerId`, `ics.Ics05_RelateManager.relateUpdate`, `ics.Ics05_RelateManager.updateList` |
