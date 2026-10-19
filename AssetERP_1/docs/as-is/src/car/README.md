# 도메인: car

화면 7개, 컴포넌트 1개, 서버 클래스 5개, 매퍼 5개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Car01_Tab_Info`](screens/Car01_Tab_Info.md) | 경영관리 > 10. 차량관리 > 차량정보관리 | 3 | 7 |
| [`Car03_Tab_List`](screens/Car03_Tab_List.md) | 경영관리 > 10. 차량관리 > 공용차량 예약관리 | 2 | 4 |
| [`Car04_Tab_Journal`](screens/Car04_Tab_Journal.md) | 경영관리 > 10. 차량관리 > 차량 운행일지 | 4 | 17 |
| [`Car04_Tab_PrivateJournal`](screens/Car04_Tab_PrivateJournal.md) | 경영관리 > 10. 차량관리 > 전용차량 운행등록 | 3 | 10 |
| [`Car04_Tab_PrivateJournalAdmin`](screens/Car04_Tab_PrivateJournalAdmin.md) | 경영관리 > 10. 차량관리 > 전용차량 운행변경(경영관리팀) | 4 | 11 |
| [`Car04_Tab_PublicJournal`](screens/Car04_Tab_PublicJournal.md) | 경영관리 > 10. 차량관리 > 공용차량 운행등록 | 3 | 5 |
| [`Car04_Tab_PublicJournalAdmin`](screens/Car04_Tab_PublicJournalAdmin.md) | 경영관리 > 10. 차량관리 > 공용차량 운행변경(경영관리팀) | 4 | 11 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Car03_Popup_BookingReg`](components/Car03_Popup_BookingReg.md) | frm | 3 | 7 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`car.Car01_Info`](../car/services/Car01_Info.md) | 6 |
| [`car.Car02_User`](../car/services/Car02_User.md) | 4 |
| [`car.Car03_Booking`](../car/services/Car03_Booking.md) | 14 |
| [`car.Car04_Journal`](../car/services/Car04_Journal.md) | 15 |
| [`car.Car05_RelateAppr`](../car/services/Car05_RelateAppr.md) | 6 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`car01_info`](sql/car01_info.md) | 5 |
| [`car02_user`](sql/car02_user.md) | 2 |
| [`car03_booking`](sql/car03_booking.md) | 8 |
| [`car04_journal`](sql/car04_journal.md) | 14 |
| [`car05_relate_appr`](sql/car05_relate_appr.md) | 5 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `Car04_Lookup_Rd_Journal` | `client/vi/car/Car04_Lookup_Rd_Journal.java` | `sys.Sys99_Print.insertRdCarJournal` |
