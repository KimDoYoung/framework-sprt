# bbs33_role

`server/bbs/mapper/bbs33_role.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`bbs33_role`](../../../db/tables/bbs.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_org_parent_full_nm`, `f_sysdate` | `bbs.Bbs33_Role.selectById` |
| `selectByClassTreeId` | select | 34 | [`bbs33_role`](../../../db/tables/bbs.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_org_parent_full_nm`, `f_sysdate` | `bbs.Bbs33_Role.selectByClassTreeId` |
| `checkRole` | select | 49 | [`bbs33_role`](../../../db/tables/bbs.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_org_parent_full_nm`, `f_sysdate` | `bbs.Bbs33_Role.checkRole` |
