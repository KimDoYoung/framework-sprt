# com10_form_mapping

`server/com/mapper/com10_form_mapping.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 17 | [`com10_form_mapping`](../../../db/tables/com.md), [`dcr30_link`](../../../db/tables/dcr.md) |  | `com.Com10_FormMapping.selectById` |
| `selectByCompanyId` | select | 26 | [`com10_form_mapping`](../../../db/tables/com.md), [`dcr30_link`](../../../db/tables/dcr.md) |  | `com.Com10_FormMapping.selectByCompanyId` |
| `selectByLinkCode` | select | 35 | [`com10_form_mapping`](../../../db/tables/com.md), [`dcr30_link`](../../../db/tables/dcr.md) |  | `com.Com10_FormMapping.selectByLinkCode` |
| `insertForm` | insert | 45 | [`com10_form_mapping`](../../../db/tables/com.md), [`dcr30_link`](../../../db/tables/dcr.md) |  | `dcr.Dcr30_Link.updateForm` |
| `insertFromCom10` | insert | 60 | [`com10_form_mapping`](../../../db/tables/com.md), [`dcr30_link`](../../../db/tables/dcr.md) |  | - |
