# dcr30_link

`server/dcr/mapper/dcr30_link.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`dcr30_link`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate` | `dcr.Dcr30_Link.selectById` |
| `selectByCompanyId` | select | 30 | [`dcr30_link`](../../../db/tables/dcr.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_class_tree_nm_allpath` | `dcr.Dcr30_Link.selectByCompanyId`, `dcr.Dcr30_Link.updateDcrAuth` |
| `selectByLinkCodeList` | select | 66 | [`dcr30_link`](../../../db/tables/dcr.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate` | `dcr.Dcr30_Link.selectByLinkCodeList` |
| `selectBySearchId` | select | 110 | [`dcr30_link`](../../../db/tables/dcr.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_class_tree_nm_allpath` | `dcr.Dcr30_Link.selectBySearchId` |
| `selectByLinkCode` | select | 149 | [`dcr30_link`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate` | `dcr.Dcr30_Link.insertCheck`, `dcr.Dcr30_Link.linkCheck` |
| `selectByClassTreeId` | select | 159 | [`dcr30_link`](../../../db/tables/dcr.md) | `f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate` | `dcr.Dcr03_OrgAuth.update`, `dcr.Dcr30_Link.selectByClassTreeId`, `org.Org01_Code.updateDcrAuth` |
| `insert` | insert | 169 | [`dcr30_link`](../../../db/tables/dcr.md) |  | `dcr.Dcr30_Link.insertCheck`, `dcr.Dcr30_Link.linkCheck` |
| `insertFromDcr30` | insert | 182 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md) | `f_create_seq` | - |
| `updateFormDcr30` | update | 201 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md) | `f_create_seq` | `dcr.Dcr30_Link.updateForm` |
| `updateLink` | update | 224 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md) | `f_create_seq` | `dcr.Dcr30_Link.updateLink` |
| `updateFormMappingId` | update | 254 | [`dcr30_link`](../../../db/tables/dcr.md) |  | `com.Com10_FormMapping.modelUpdate` |
| `update` | update | 260 | [`dcr30_link`](../../../db/tables/dcr.md) |  | - |
| `updateNote` | update | 266 | [`dcr30_link`](../../../db/tables/dcr.md) |  | `dcr.Dcr30_Link.updateNote` |
