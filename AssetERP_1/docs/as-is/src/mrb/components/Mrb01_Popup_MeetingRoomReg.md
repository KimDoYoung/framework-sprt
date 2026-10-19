# Mrb01_Popup_MeetingRoomReg

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `frm`
- 파일: `client/vi/mrb/Mrb01_Popup_MeetingRoomReg.java`
- 함께 쓰는 클래스 1개:
  - `Mrb01_TimelineChart` `client/vi/mrb/Mrb01_TimelineChart.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Bbs02_Lookup_File`](../../bbs/components/Bbs02_Lookup_File.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `getSeq` | Mrb01_Popup_MeetingRoomReg:252 | (공통) 채번 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `mrb.Mrb01_Booking.selectByDateUnion` | Mrb01_Popup_MeetingRoomReg:217 | [`Mrb01_Booking.java:62`](../../mrb/services/Mrb01_Booking.md) | [`mrb01_booking.selectByDateUnion`](../../mrb/sql/mrb01_booking.md) |
| `mrb.Mrb01_Booking.selectById` | Mrb01_Popup_MeetingRoomReg:280 | [`Mrb01_Booking.java:23`](../../mrb/services/Mrb01_Booking.md) | [`mrb01_booking.selectById`](../../mrb/sql/mrb01_booking.md) |
| `mrb.Mrb01_Booking.update` | Mrb01_Popup_MeetingRoomReg:374 | [`Mrb01_Booking.java:95`](../../mrb/services/Mrb01_Booking.md) | [`mrb01_booking.confirmUpdate`](../../mrb/sql/mrb01_booking.md), [`mrb01_booking.deleteParentId`](../../mrb/sql/mrb01_booking.md), `UpdateDataModel(mrb01_booking)` 동적 INSERT/UPDATE → [`mrb01_booking.selectById`](../../mrb/sql/mrb01_booking.md) |
| `mrb.Mrb01_Booking.updateList` | Mrb01_Popup_MeetingRoomReg:374 | [`Mrb01_Booking.java:134`](../../mrb/services/Mrb01_Booking.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`mrb01_booking.confirmUpdate`](../../mrb/sql/mrb01_booking.md), [`mrb01_booking.deleteParentId`](../../mrb/sql/mrb01_booking.md), `UpdateDataModel(mrb01_booking)` 동적 INSERT/UPDATE → [`mrb01_booking.selectById`](../../mrb/sql/mrb01_booking.md) |
| `sys.Sys10_File.selectByParentId` | Mrb01_Popup_MeetingRoomReg:235 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`mrb01_booking`](../../../db/tables/mrb.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_booking_check1`, `f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Mrb01_Popup_MeetingRoomReg (`client/vi/mrb/Mrb01_Popup_MeetingRoomReg.java`, 434줄)

- 툴바 `buttonBarL01`: 일  시: {bookingDate} ~: {bookingCloseDate} {startHour} {startMinute} ~: {closeHour} {closeMinute}
- 툴바 `buttonBarR01`: 예약자: {empName}
- 툴바 `buttonBar02`: 장  소: {roomName} 참석자: {attendance}
- 툴바 `buttonBar03`: 제  목: {subject}
- 툴바 `buttonBar04`: 메 모: {forwarding}
- 입력·하위 화면: `bookingId` LongField, `companyId` LongField, `empId` LongField, `parentId` LongField, `subject` TextField, `roomCode` TextField, `attendance` TextField, `empName` LookupTriggerField, `forwarding` TextArea, `bookingDate` MyDateField, `bookingCloseDate` MyDateField, `startHour` ComboBoxField("HourCode"), `startMinute` ComboBoxField("MinuteCode"), `closeHour` ComboBoxField("HourCode"), `closeMinute` ComboBoxField("MinuteCode"), `roomName` ComboBoxField("MeetingRoomCode"), `lookupFile` Bbs02_Lookup_File, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L91-152) → settings()
[E1] updateButton[저장].Select (L169) → update()
[E2] closeButton[닫기].Select (L176) → hide()
[E3] changeButton[변경].Select (L182) → changeCheck()
       └ [E6] msgBox.DialogHide [YES] (L396) → update()
[E4] empName[예약자].TriggerClick [userCheckYn == true] (L189) → openLookupPerson()
[E5] addFileButton[첨부파일(0)].Select [userCheckYn == true] (L197) → setFileButtonText()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveTimeChart() | L216-232 | open,retrieve,getList | 서비스 mrb.Mrb01_Booking.selectByDateUnion(bookingDate, companyId, empId, type) | 업무 |
| private setFileButtonText() | L234-245 | E5,open,retrieve,getList | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| public open() | L247-277 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L279-290 | 공개 메서드 | 서비스 mrb.Mrb01_Booking.selectById(bookingId) | 업무 |
| public retrieve() | L292-302 | 공개 메서드 | 상태 처리 | 업무 |
| public getList() | L304-314 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L316-391 | E1,E6 | 상태 처리 | 업무 |
| private changeCheck() | L393-412 | E3 | ConfirmBox → E6 | 업무 |
| public openLookupPerson() | L414-424 | E4 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private settings() | L154-214 | 생성자 | 조회창 Bbs02_Lookup_File 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L426-428 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L430-432 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="change" onClick={changeCheck}>변경</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>
4. <Button type="unknown" onClick={setFileButtonText}>첨부파일(0)</Button>

### Mrb01_TimelineChart (`client/vi/mrb/Mrb01_TimelineChart.java`, 72줄)


#### 이벤트
[E0] 화면 열림 (생성자 L23-25) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private draw() | L27-38 | retrieve | 상태 처리 | 업무 |
| public retrieve() | L40-70 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

