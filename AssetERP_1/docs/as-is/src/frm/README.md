# 도메인: frm

화면 0개, 컴포넌트 2개, 서버 클래스 1개, 매퍼 1개.

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Monitoring_Page_Schedule`](components/Monitoring_Page_Schedule.md) | msc | 2 | 1 |
| [`ScheduleCalendar`](components/ScheduleCalendar.md) | msc | 1 | 0 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`frm.Frm01_List`](../frm/services/Frm01_List.md) | 5 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`frm01_list`](sql/frm01_list.md) | 6 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `Calendar` | `client/vi/frm/Calendar.java` | `bbs.Bbs02_Notice.selectByTargetCompany` |
| `Frm01_Lookup_CheckList` | `client/vi/frm/Frm01_Lookup_CheckList.java` | `frm.Frm01_List.getNoticeCnt` |
| `Frm01_Lookup_DailyCheckList` | `client/vi/frm/Frm01_Lookup_DailyCheckList.java` | `sch.Sch04_List.selectByManagerId`, `sch.Sch04_List.statusUpdateCheck`, `sch.Sch10_Ipo.selectById` |
| `Frm01_Lookup_NoticeList` | `client/vi/frm/Frm01_Lookup_NoticeList.java` | `bbs.Bbs02_Notice.selectByTargetPerson` |
| `Frm01_Lookup_Outstanding` | `client/vi/frm/Frm01_Lookup_Outstanding.java` | `apr.Apr01_Appr.selectOutstandingPopup` |
| `Monitoring_Page_Appr` | `client/vi/frm/Monitoring_Page_Appr.java` | `apr.Apr01_Appr.selectMonitorngAppr`, `apr.Apr01_Appr.selectOutstanding`, `apr.Apr01_Appr.selectTemporary` |
| `Monitoring_Page_DayList` | `client/vi/frm/Monitoring_Page_DayList.java` | `ast.Ast04_Cf.selectByRelateId`, `frm.Frm01_List.selectToDoList`, `sch.Sch10_Ipo.selectById` |
| `Monitoring_Page_Emp` | `client/vi/frm/Monitoring_Page_Emp.java` | `emp.Emp03_Trans.MonitoringByText` |
| `Monitoring_Page_IcsNotice` | `client/vi/frm/Monitoring_Page_IcsNotice.java` | `frm.Frm01_List.selectIcsNotice` |
| `Monitoring_Page_Notice` | `client/vi/frm/Monitoring_Page_Notice.java` | `bbs.Bbs02_Notice.selectByTabBorder` |
| `Monitoring_Page_Outstanding` | `client/vi/frm/Monitoring_Page_Outstanding.java` | `apr.Apr01_Appr.selectOutstanding` |
| `Monitoring_Page_Relate` | `client/vi/frm/Monitoring_Page_Relate.java` | `bbs.Bbs02_Notice.selectById`, `bbs.Bbs02_Notice.selectPersonNotice`, `emp.Emp20_Leave.selectByDate`, `mkt.Mkt03_History.selectByRegDate`, `mrb.Mrb01_Booking.selectByBookingDate`, `sch.Sch01_Info.selectMyPageOrgSchedule`, `sch.Sch01_Info.selectMyPageSchedule`, `sch.Sch04_List.selectByToDoList` |
