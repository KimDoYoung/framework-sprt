# pcd01_pickup

`server/pcd/mapper/pcd01_pickup.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 41 | [`pcd01_pickup`](../../../db/tables/pcd.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | - |
| `selectByTimeCheck` | select | 52 | - |  | - |
| `selectByDate` | select | 57 | [`pcd01_pickup`](../../../db/tables/pcd.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate`, `f_trunc` | `pcd.Pcd01_Pickup.selectByDate` |
| `selectByDateUnion` | select | 79 | [`pcd01_pickup`](../../../db/tables/pcd.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate`, `f_trunc` | `pcd.Pcd01_Pickup.selectByDateUnion` |
| `deleteBypickupId` | delete | 167 | [`pcd01_pickup`](../../../db/tables/pcd.md) |  | `pcd.Pcd01_Pickup.deleteBypickupId` |
