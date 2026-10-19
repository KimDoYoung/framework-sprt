# 도메인: crm

화면 6개, 컴포넌트 1개, 서버 클래스 10개, 매퍼 10개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Crm01_Tab_ItemTreeGrid`](screens/Crm01_Tab_ItemTreeGrid.md) | 커뮤니티 > 03. 업무활동 > (X)영업활동관리 | 2 | 9 |
| [`Crm02_Tab_Inspection`](screens/Crm02_Tab_Inspection.md) | - | 3 | 4 |
| [`Crm02_Tab_InspectionManager`](screens/Crm02_Tab_InspectionManager.md) | - | 3 | 5 |
| [`Crm05_Tab_CounselInfo_in`](screens/Crm05_Tab_CounselInfo_in.md) | - | 2 | 4 |
| [`Crm05_Tab_CounselInfo_out`](screens/Crm05_Tab_CounselInfo_out.md) | - | 3 | 4 |
| [`Crm09_Tab_ContactPointTreeGrid`](screens/Crm09_Tab_ContactPointTreeGrid.md) | 커뮤니티 > 03. 업무활동 > (X)거래처 및 업무활동 등록 | 7 | 22 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Crm09_Lookup_SelectSingle`](components/Crm09_Lookup_SelectSingle.md) | biz | 1 | 4 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`crm.Crm01_Item`](../crm/services/Crm01_Item.md) | 4 |
| [`crm.Crm02_Inspection`](../crm/services/Crm02_Inspection.md) | 4 |
| [`crm.Crm05_Counsel`](../crm/services/Crm05_Counsel.md) | 4 |
| [`crm.Crm09_Contact`](../crm/services/Crm09_Contact.md) | 10 |
| [`crm.Crm10_Comment`](../crm/services/Crm10_Comment.md) | 3 |
| [`crm.Crm11_Count`](../crm/services/Crm11_Count.md) | 2 |
| [`crm.Crm12_WorkDetail`](../crm/services/Crm12_WorkDetail.md) | 8 |
| [`crm.Crm13_RelateFund`](../crm/services/Crm13_RelateFund.md) | 5 |
| [`crm.Crm14_ShareDefault`](../crm/services/Crm14_ShareDefault.md) | 5 |
| [`crm.Crm15_Share`](../crm/services/Crm15_Share.md) | 7 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`crm01_item`](sql/crm01_item.md) | 3 |
| [`crm02_inspection`](sql/crm02_inspection.md) | 2 |
| [`crm05_counsel`](sql/crm05_counsel.md) | 2 |
| [`crm09_contact`](sql/crm09_contact.md) | 10 |
| [`crm10_cmnt`](sql/crm10_cmnt.md) | 2 |
| [`crm11_count`](sql/crm11_count.md) | 2 |
| [`crm12_work_detail`](sql/crm12_work_detail.md) | 8 |
| [`crm13_relate_fund`](sql/crm13_relate_fund.md) | 3 |
| [`crm14_share_default`](sql/crm14_share_default.md) | 3 |
| [`crm15_share`](sql/crm15_share.md) | 5 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `Crm09_Edit_ContactPoint` | `client/vi/crm/Crm09_Edit_ContactPoint.java` | `crm.Crm09_Contact.delete`, `crm.Crm09_Contact.update` |
| `Crm09_Lookup_Select` | `client/vi/crm/Crm09_Lookup_Select.java` | `crm.Crm09_Contact.selectByPaging` |
| `Crm09_Lookup_SelectMulti` | `client/vi/crm/Crm09_Lookup_SelectMulti.java` | `crm.Crm09_Contact.selectByPaging` |
