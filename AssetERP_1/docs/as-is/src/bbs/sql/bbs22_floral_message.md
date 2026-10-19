# bbs22_floral_message

`server/bbs/mapper/bbs22_floral_message.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 15 | [`bbs22_floral_message`](../../../db/tables/bbs.md) | `f_cdnm`, `f_sysdate` | `bbs.Bbs22_FloralMessage.selectById` |
| `selectByCompanyId` | select | 22 | [`bbs22_floral_message`](../../../db/tables/bbs.md) | `f_cdnm`, `f_sysdate` | `bbs.Bbs22_FloralMessage.selectByCompanyId` |
| `getMessage` | select | 30 | [`bbs22_floral_message`](../../../db/tables/bbs.md) | `f_cdnm`, `f_sysdate` | `bbs.Bbs22_FloralMessage.getMessage` |
| `insertCode` | insert | 38 | [`bbs22_floral_message`](../../../db/tables/bbs.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_create_seq` | `bbs.Bbs22_FloralMessage.checkOccasionsCode` |
| `deleteCode` | delete | 60 | [`bbs22_floral_message`](../../../db/tables/bbs.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `bbs.Bbs22_FloralMessage.checkOccasionsCode` |
