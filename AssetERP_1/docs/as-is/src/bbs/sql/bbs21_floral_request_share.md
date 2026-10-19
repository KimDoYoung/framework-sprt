# bbs21_floral_request_share

`server/bbs/mapper/bbs21_floral_request_share.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`bbs20_floral_request`](../../../db/tables/bbs.md), [`bbs21_floral_request_share`](../../../db/tables/bbs.md) | `f_cdnm`, `f_today` | `bbs.Bbs21_FloralRequestShare.selectById` |
| `selectByFloralRequestId` | select | 26 | [`bbs20_floral_request`](../../../db/tables/bbs.md), [`bbs21_floral_request_share`](../../../db/tables/bbs.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_today` | `bbs.Bbs21_FloralRequestShare.selectByFloralRequestId` |
| `selectShareInfo` | select | 42 | [`bbs20_floral_request`](../../../db/tables/bbs.md), [`bbs21_floral_request_share`](../../../db/tables/bbs.md) | `f_emp_kor_nm`, `f_org_nm`, `f_today` | `bbs.Bbs21_FloralRequestShare.insertDefaultShare`, `bbs.Bbs21_FloralRequestShare.selectShareInfo` |
| `insertDefaultShare` | insert | 65 | [`bbs21_floral_request_share`](../../../db/tables/bbs.md), [`crm14_share_default`](../../../db/tables/crm.md) | `f_create_seq` | `bbs.Bbs21_FloralRequestShare.insertDefaultShare` |
| `deleteByFloralRequestId` | delete | 77 | [`bbs21_floral_request_share`](../../../db/tables/bbs.md) |  | `bbs.Bbs21_FloralRequestShare.deleteDefaultShare` |
