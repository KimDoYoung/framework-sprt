# sys17_corp_account

`server/sys/mapper/sys17_corp_account.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`sys17_corp_account`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate`, `to_decrypts` | `sys.Sys17_CorpAccount.selectById` |
| `selectByCorpId` | select | 26 | [`sys17_corp_account`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate`, `to_decrypts` | `sys.Sys17_CorpAccount.selectByCorpId` |
