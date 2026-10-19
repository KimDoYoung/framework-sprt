# 도메인: sch

화면 15개, 컴포넌트 12개, 서버 클래스 15개, 매퍼 17개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Sch01_Tab_Info`](screens/Sch01_Tab_Info.md) | 스케줄 > 01. 업무일정 > 업무일정 등록 | 15 | 24 |
| [`Sch01_Tab_List`](screens/Sch01_Tab_List.md) | 스케줄 > 01. 업무일정 > 기간별 업무일정 조회 | 1 | 4 |
| [`Sch01_Tab_ListOrg`](screens/Sch01_Tab_ListOrg.md) | 스케줄 > 01. 업무일정 > 부서별 업무일정 조회 | 1 | 3 |
| [`Sch04_Tab_BizReClass`](screens/Sch04_Tab_BizReClass.md) | 준법감시 > 01. 법규관리 > 법규 담당자 변경(일회성) | 1 | 2 |
| [`Sch04_Tab_CheckList`](screens/Sch04_Tab_CheckList.md) | 준법감시 > 90. 법규통제 현황(사용X) > 법규통제 상세내역 | 1 | 3 |
| [`Sch04_Tab_DailyCheckList`](screens/Sch04_Tab_DailyCheckList.md) | 스케줄 > 02. 업무일정 체크 > 데일리 체크리스트(상신) | 2 | 8 |
| [`Sch04_Tab_DailyCheckListStatus`](screens/Sch04_Tab_DailyCheckListStatus.md) | 스케줄 > 02. 업무일정 체크 > 업무일정 체크내역 | 1 | 4 |
| [`Sch04_Tab_IcsList`](screens/Sch04_Tab_IcsList.md) | 준법감시 > 00. 법규정보 > 법규보고 점검 | 3 | 5 |
| [`Sch04_Tab_IcsListManager`](screens/Sch04_Tab_IcsListManager.md) | 준법감시 > 01. 법규관리 > 법규보고 점검(관리자) | 3 | 4 |
| [`Sch04_Tab_List`](screens/Sch04_Tab_List.md) | 스케줄 > 01. 업무일정 > (X)기간별 스케줄 조회 | 1 | 3 |
| [`Sch04_Tab_ToDoList`](screens/Sch04_Tab_ToDoList.md) | 스케줄 > 01. 업무일정 > 업무일정 처리 | 1 | 4 |
| [`Sch10_Tab_Ipo`](screens/Sch10_Tab_Ipo.md) | 펀드관리 > 04. 공모주청약 > 공모주 일정조회 | 4 | 9 |
| [`Sch10_Tab_Ipo2`](screens/Sch10_Tab_Ipo2.md) | 고유자산 > 20. 고유자산 거래처리 > 공모주일정 | 4 | 9 |
| [`Sch10_Tab_IpoAdmin`](screens/Sch10_Tab_IpoAdmin.md) | 기초자료 > 30. 자산&경영 > 공모주 일정등록 | 3 | 9 |
| [`Sch20_Tab_AddChecklist`](screens/Sch20_Tab_AddChecklist.md) | 스케줄 > (X)02. 체크리스트 > (X)체크리스트 생성 | 15 | 24 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Sch01_Lookup_InfoView`](components/Sch01_Lookup_InfoView.md) | frm | 1 | 2 |
| [`Sch03_Lookup_Icr`](components/Sch03_Lookup_Icr.md) | icr | 10 | 6 |
| [`Sch03_Lookup_Ics`](components/Sch03_Lookup_Ics.md) | icr, ics | 10 | 6 |
| [`Sch03_Lookup_IcsUser`](components/Sch03_Lookup_IcsUser.md) | icr, ics | 1 | 1 |
| [`Sch04_Lookup_IcrList`](components/Sch04_Lookup_IcrList.md) | frm | 1 | 4 |
| [`Sch04_Lookup_IcsList`](components/Sch04_Lookup_IcsList.md) | frm | 1 | 4 |
| [`Sch04_Lookup_SchList`](components/Sch04_Lookup_SchList.md) | frm | 1 | 4 |
| [`Sch05_Page_RelateIcs`](components/Sch05_Page_RelateIcs.md) | ics | 1 | 2 |
| [`Sch06_Lookup_AlarmSetup`](components/Sch06_Lookup_AlarmSetup.md) | bbs | 2 | 5 |
| [`Sch10_Lookup_Ipo`](components/Sch10_Lookup_Ipo.md) | frm | 1 | 0 |
| [`Sch14_Lookup_IpoMismatch`](components/Sch14_Lookup_IpoMismatch.md) | frm | 1 | 3 |
| [`Sch22_Lookup_WriteGroup`](components/Sch22_Lookup_WriteGroup.md) | chk, ics | 2 | 9 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`sch.Sch01_Info`](../sch/services/Sch01_Info.md) | 15 |
| [`sch.Sch02_Share`](../sch/services/Sch02_Share.md) | 10 |
| [`sch.Sch03_Deadline`](../sch/services/Sch03_Deadline.md) | 9 |
| [`sch.Sch04_List`](../sch/services/Sch04_List.md) | 17 |
| [`sch.Sch05_RelateIcs`](../sch/services/Sch05_RelateIcs.md) | 7 |
| [`sch.Sch06_Alarm`](../sch/services/Sch06_Alarm.md) | 4 |
| [`sch.Sch08_Class`](../sch/services/Sch08_Class.md) | 5 |
| [`sch.Sch10_Ipo`](../sch/services/Sch10_Ipo.md) | 6 |
| [`sch.Sch11_IpoCompany`](../sch/services/Sch11_IpoCompany.md) | 5 |
| [`sch.Sch12_IpoCorp`](../sch/services/Sch12_IpoCorp.md) | 6 |
| [`sch.Sch14_IpoMismatch`](../sch/services/Sch14_IpoMismatch.md) | 5 |
| [`sch.Sch15_IpoItemMatching`](../sch/services/Sch15_IpoItemMatching.md) | 4 |
| [`sch.Sch20_Checklist`](../sch/services/Sch20_Checklist.md) | 5 |
| [`sch.Sch21_ChecklistContent`](../sch/services/Sch21_ChecklistContent.md) | 5 |
| [`sch.Sch22_WriteGroup`](../sch/services/Sch22_WriteGroup.md) | 7 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`sch01_info`](sql/sch01_info.md) | 19 |
| [`sch02_share`](sql/sch02_share.md) | 11 |
| [`sch03_deadline`](sql/sch03_deadline.md) | 8 |
| [`sch04_list`](sql/sch04_list.md) | 20 |
| [`sch05_relate_ics`](sql/sch05_relate_ics.md) | 4 |
| [`sch06_alarm`](sql/sch06_alarm.md) | 5 |
| [`sch07_alarm_record`](sql/sch07_alarm_record.md) | 3 |
| [`sch08_class`](sql/sch08_class.md) | 3 |
| [`sch10_ipo`](sql/sch10_ipo.md) | 11 |
| [`sch11_ipo_company`](sql/sch11_ipo_company.md) | 3 |
| [`sch12_ipo_corp`](sql/sch12_ipo_corp.md) | 5 |
| [`sch13_ipo_crawling`](sql/sch13_ipo_crawling.md) | 4 |
| [`sch14_ipo_mismatch`](sql/sch14_ipo_mismatch.md) | 6 |
| [`sch15_ipo_item_matching`](sql/sch15_ipo_item_matching.md) | 2 |
| [`sch20_checklist`](sql/sch20_checklist.md) | 3 |
| [`sch21_checklist_content`](sql/sch21_checklist_content.md) | 3 |
| [`sch22_write_group`](sql/sch22_write_group.md) | 4 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `Sch04_Lookup_DcrClass` | `client/vi/sch/Sch04_Lookup_DcrClass.java` | `dcr.Dcr01_ClassTree.selectByCompanyId` |
| `Sch05_Lookup_IcsClass_backup` | `client/vi/sch/Sch05_Lookup_IcsClass_backup.java` | `ics.Ics01_ClassTree.selectByClassTreeId`, `ics.Ics01_ClassTree.selectByCompanyId`, `sch.Sch05_RelateIcs.selectByIcsClassTreeId` |
