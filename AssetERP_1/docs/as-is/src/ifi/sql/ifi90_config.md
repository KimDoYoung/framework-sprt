# ifi90_config

`server/ifi/mapper/ifi90_config.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 30 | [`ifi90_config`](../../../db/tables/ifi.md) | `f_cdnm`, `f_today`, `to_decrypts` | `ifi.Ifi90_Config.selectById` |
| `selectByIfType` | select | 39 | [`ifi90_config`](../../../db/tables/ifi.md) | `f_cdnm`, `f_today`, `to_decrypts` | `ifi.Ifi90_Config.selectByIfType` |
| `checkConfigId` | select | 54 | [`ifi91_config_api`](../../../db/tables/ifi.md), [`ifi95_config_file`](../../../db/tables/ifi.md) |  | `ifi.Ifi90_Config.delete` |
