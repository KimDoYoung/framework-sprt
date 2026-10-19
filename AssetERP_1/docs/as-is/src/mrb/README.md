# 도메인: mrb

화면 1개, 컴포넌트 1개, 서버 클래스 1개, 매퍼 1개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Mrb01_Tab_List`](screens/Mrb01_Tab_List.md) | 신청 > 02. 회의실 예약관리 > 회의실 예약관리 | 2 | 4 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Mrb01_Popup_MeetingRoomReg`](components/Mrb01_Popup_MeetingRoomReg.md) | frm | 2 | 6 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`mrb.Mrb01_Booking`](../mrb/services/Mrb01_Booking.md) | 12 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`mrb01_booking`](sql/mrb01_booking.md) | 12 |

