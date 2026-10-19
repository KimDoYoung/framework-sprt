# biz14_relate_appr

`server/biz/mapper/biz14_relate_appr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`apr01_appr`](../../../db/tables/apr.md), [`biz14_relate_appr`](../../../db/tables/biz.md) | `f_cdnm`, `f_emp_kor_nm` | `biz.Biz14_RelateAppr.selectById` |
| `selectByContHistoryId` | select | 30 | [`apr01_appr`](../../../db/tables/apr.md), [`biz14_relate_appr`](../../../db/tables/biz.md) | `f_cdnm`, `f_emp_kor_nm` | `biz.Biz14_RelateAppr.selectByContHistoryId` |
| `deleteContCorpId` | delete | 42 | [`biz11_cont_history`](../../../db/tables/biz.md), [`biz14_relate_appr`](../../../db/tables/biz.md) |  | `biz.Biz11_ContHistory.deleteContCorpId` |
