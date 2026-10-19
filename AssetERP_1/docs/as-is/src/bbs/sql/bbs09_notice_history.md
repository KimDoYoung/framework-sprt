# bbs09_notice_history

`server/bbs/mapper/bbs09_notice_history.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 20 | [`bbs09_notice_history`](../../../db/tables/bbs.md) | `f_emp_kor_nm` | `bbs.Bbs09_NoticeHistory.selectById` |
| `selectByNoticeId` | select | 34 | [`bbs09_notice_history`](../../../db/tables/bbs.md) | `f_emp_kor_nm` | `bbs.Bbs09_NoticeHistory.selectByNoticeId` |
| `insert` | insert | 49 | [`bbs09_notice_history`](../../../db/tables/bbs.md) | `f_create_seq`, `f_sysdate` | `bbs.Bbs09_NoticeHistory.insert` |
