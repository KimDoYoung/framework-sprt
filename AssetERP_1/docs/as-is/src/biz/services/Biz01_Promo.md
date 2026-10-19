# biz.Biz01_Promo

`server/biz/Biz01_Promo.java`

서비스 키 `biz.Biz01_Promo.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 27 | [`biz01_promo.selectById`](../../biz/sql/biz01_promo.md) | - |  |
| `selectByCompanyId` | 33 | [`biz01_promo.selectByCompanyId`](../../biz/sql/biz01_promo.md) | - |  |
| `selectByCompareAmt` | 41 | [`biz01_promo.selectByCompareAmt`](../../biz/sql/biz01_promo.md) | - |  |
| `selectByAmt` | 50 | [`biz01_promo.selectByAmt`](../../biz/sql/biz01_promo.md) | `Biz01_Tab_CardContents`, `Biz01_Tab_CardManagement` |  |
| `selectByCard` | 74 | [`biz01_promo.selectByCard`](../../biz/sql/biz01_promo.md) | `Biz01_Tab_Card`, `Biz01_Tab_CardSimple` |  |
| `selectCardContents` | 79 | [`biz01_promo.selectCardContents`](../../biz/sql/biz01_promo.md) | - |  |
| `selectCardContentsPaging` | 84 | [`biz01_promo.selectCardContentsPaging`](../../biz/sql/biz01_promo.md), [`biz01_promo.selectCardContentsTotal`](../../biz/sql/biz01_promo.md) | `Biz01_Tab_CardContents`, `Biz01_Tab_CardContentsSimple` |  |
| `selectCardManagement` | 90 | [`biz01_promo.selectCardManagement`](../../biz/sql/biz01_promo.md) | `Biz01_Tab_CardManagement` |  |
| `selectByPaging` | 95 | [`biz01_promo.selectCardManagementPaging`](../../biz/sql/biz01_promo.md), [`biz01_promo.selectCardManagementTotal`](../../biz/sql/biz01_promo.md) | `Biz01_Tab_CardManagement` |  |
| `selectCardCommonUser` | 101 | [`biz01_promo.selectCardCommonUser`](../../biz/sql/biz01_promo.md) | `Biz01_Tab_CardUserAllocation` |  |
| `selectByOther` | 106 | [`biz01_promo.selectByOther`](../../biz/sql/biz01_promo.md) | `Biz01_Tab_Other`, `Biz01_Tab_OtherSimple` |  |
| `selectByBuyId` | 111 | [`biz01_promo.selectByBuyId`](../../biz/sql/biz01_promo.md) | `Biz01_TabPage_List` |  |
| `selectByPersonDay` | 116 | [`biz01_promo.selectByPersonDay`](../../biz/sql/biz01_promo.md) | `Biz01_TabPage_PersonDay` |  |
| `selectByText` | 121 | `biz01_promo.selectByText`(없음) | - |  |
| `selectByProvideCompany` | 126 | [`biz01_promo.selectByProvideCompany`](../../biz/sql/biz01_promo.md) | `Biz01_Lookup_ProvideCompany` |  |
| `selectByPersonYear` | 131 | [`biz01_promo.selectByPersonYear`](../../biz/sql/biz01_promo.md) | `Biz01_TabPage_PersonYear` |  |
| `selectByCompanyYear` | 136 | [`biz01_promo.selectByCompanyYear`](../../biz/sql/biz01_promo.md) | `Biz01_TabPage_CompanyYear` |  |
| `selectProvideList` | 141 | [`biz01_promo.selectProvideList`](../../biz/sql/biz01_promo.md) | `Biz01_Tab_PriorApproval` |  |
| `selectProvideListSimple` | 146 | [`biz01_promo.selectProvideListSimple`](../../biz/sql/biz01_promo.md) | `Biz01_Tab_PriorApprovalSimple` |  |
| `selectByMonthEntertmExpense` | 151 | [`biz01_promo.selectByMonthEntertmExpense`](../../biz/sql/biz01_promo.md) | `Biz01_TabPage_MonthEntertmExpense` |  |
| `selectByAccountName` | 167 | [`biz01_promo.selectByAccountName`](../../biz/sql/biz01_promo.md) | `Biz01_TabPage_EntertmExpenseHistory` |  |
| `selectByTargetCompanyName` | 172 | [`biz01_promo.selectByTargetCompanyName`](../../biz/sql/biz01_promo.md) | `Biz02_TabPage_CompanyEntertmExpense` |  |
| `getHtmlData` | 177 | [`biz01_promo.getHtmlData`](../../biz/sql/biz01_promo.md) | `Apr01_Edit_ApprDoc` |  |
| `closeCheck` | 182 | [`biz01_promo.closeCheck`](../../biz/sql/biz01_promo.md) | `Biz01_Edit_Account`, `Biz01_Edit_Card`, `Biz01_Edit_CardSimple`, `Biz01_Tab_Card`, `Biz01_Tab_CardManagement`, `Biz01_Tab_CardSimple`, `Biz02_Grid_ExternalList`, `Biz02_Grid_InternalList` |  |
| `targetCheck` | 197 | [`biz01_promo.selectByCardDataId`](../../biz/sql/biz01_promo.md), [`crd02_data.selectByCompanyId`](../../crd/sql/crd02_data.md) | `Crd02_Tab_DataUpload` |  |
| `targetListCheck` | 256 | [`biz01_promo.selectByCardDataId`](../../biz/sql/biz01_promo.md), [`crd02_data.selectByCompanyId`](../../crd/sql/crd02_data.md) | `Crd02_Edit_DataUpload`, `Crd02_Tab_DataUpload` |  |
| `compareCheck` | 336 | [`crd02_data.selectByCompareAmt`](../../crd/sql/crd02_data.md) | `Biz01_Tab_CardManagement` |  |
| `insert` | 377 | [`biz01_promo.checkData`](../../biz/sql/biz01_promo.md), [`biz01_promo.deleteApprovalNo`](../../biz/sql/biz01_promo.md), [`biz01_promo.deleteByCrd02`](../../biz/sql/biz01_promo.md), [`biz01_promo.insert`](../../biz/sql/biz01_promo.md), [`crd01_card.selectByCardNo`](../../crd/sql/crd01_card.md), [`crd02_data.KBCard`](../../crd/sql/crd02_data.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.getTaxType`](../../sys/sql/sys01_company.md) | - |  |
| `insertList` | 452 | [`biz01_promo.checkData`](../../biz/sql/biz01_promo.md), [`biz01_promo.deleteApprovalNo`](../../biz/sql/biz01_promo.md), [`biz01_promo.insert`](../../biz/sql/biz01_promo.md), [`biz01_promo.partCancelUpdate`](../../biz/sql/biz01_promo.md), [`biz01_promo.selectByApprovalNo`](../../biz/sql/biz01_promo.md), [`biz01_promo.update`](../../biz/sql/biz01_promo.md), [`crd01_card.selectCardManager`](../../crd/sql/crd01_card.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.getTaxType`](../../sys/sql/sys01_company.md) | `Crd02_Tab_DataUpload` |  |
| `updateAdd` | 611 | [`biz02_person.insert`](../../biz/sql/biz02_person.md), [`biz02_person.selectByExternal`](../../biz/sql/biz02_person.md), [`biz02_person.update`](../../biz/sql/biz02_person.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz01_promo)` 동적 INSERT/UPDATE | `Biz01_TabPage_List` | `UpdateDataModel` |
| `noteUpdate` | 641 | [`biz01_promo.noteUpdate`](../../biz/sql/biz01_promo.md) | `Biz01_Edit_Account`, `Biz01_Edit_Card`, `Biz01_Edit_CardSimple` |  |
| `modelUpdate` | 655 | `UpdateDataModel(biz01_promo)` 동적 INSERT/UPDATE | `Biz01_Edit_Account`, `Biz01_Edit_Card`, `Biz01_Edit_CardSimple`, `Biz01_Edit_Other`, `Biz01_Edit_OtherSimple` | `UpdateDataModel` |
| `update` | 664 | `UpdateDataModel(biz01_promo)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 669 | [`biz02_person.delete`](../../biz/sql/biz02_person.md), `UpdateDataModel(biz01_promo)` 동적 DELETE | `Biz01_TabPage_List`, `Biz01_Tab_Other`, `Biz01_Tab_OtherSimple` | `UpdateDataModel` |
| `cardClose` | 683 | [`act02_journal.selectByBizId`](../../act/sql/act02_journal.md), [`act04_gen_ledger.selectCloseCount`](../../act/sql/act04_gen_ledger.md), [`biz01_promo.selectCardCloseCount`](../../biz/sql/biz01_promo.md), [`biz01_promo.selectCardManagement`](../../biz/sql/biz01_promo.md), [`biz01_promo.updateCardClose`](../../biz/sql/biz01_promo.md) | `Biz01_Tab_CardManagement` |  |
| `updateAccount` | 774 | [`biz01_promo.updateAccount01`](../../biz/sql/biz01_promo.md), [`biz01_promo.updateAccount02`](../../biz/sql/biz01_promo.md) | `Biz01_Lookup_CardManagement` |  |
| `updateRealPersonId` | 803 | [`biz01_promo.updateRealPersonId`](../../biz/sql/biz01_promo.md) | `Biz01_Tab_CardUserAllocation` |  |
| `sendMessage` | 820 | [`emp01_person.selectById`](../../emp/sql/emp01_person.md) | `Biz01_Lookup_Message` | `SendSMSAPIFunction` |
