# com11_form_mapping_multi

`server/com/mapper/com11_form_mapping_multi.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`com11_form_mapping_multi`](../../../db/tables/com.md) |  | `com.Com11_FormMappingMulti.selectById` |
| `selectByCompanyId` | select | 23 | [`com11_form_mapping_multi`](../../../db/tables/com.md) |  | `com.Com11_FormMappingMulti.selectByCompanyId` |
| `selectByLinkCode` | select | 30 | [`com11_form_mapping_multi`](../../../db/tables/com.md) |  | `com.Com11_FormMappingMulti.selectByLinkCode` |
| `selectByDetailCode` | select | 38 | [`com11_form_mapping_multi`](../../../db/tables/com.md) |  | `com.Com11_FormMappingMulti.getUpdateModel`, `com.Com11_FormMappingMulti.selectByDetailCode` |
| `insertFormCom11` | insert | 48 | [`com11_form_mapping_multi`](../../../db/tables/com.md) | `f_create_seq` | - |
