# Car01_Tab_Info

- 종류: 화면
- 메뉴: 경영관리 > 10. 차량관리 > 차량정보관리 (#1188)
- 파일: `client/vi/car/Car01_Tab_Info.java`
- 함께 쓰는 클래스 2개:
  - `Car02_Grid_User` `client/vi/car/Car02_Grid_User.java`
  - `Car01_Edit_Info` `client/vi/car/Car01_Edit_Info.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `car.Car01_Info.delete` | Car01_Tab_Info:262 | [`Car01_Info.java:74`](../../car/services/Car01_Info.md) | `UpdateDataModel(car01_info)` 동적 DELETE |
| `car.Car01_Info.selectByCompanyId` | Car01_Tab_Info:197 | [`Car01_Info.java:24`](../../car/services/Car01_Info.md) | [`car01_info.selectByCompanyId`](../../car/sql/car01_info.md) |
| `car.Car01_Info.update` | Car01_Edit_Info:156 | [`Car01_Info.java:69`](../../car/services/Car01_Info.md) | `UpdateDataModel(car01_info)` 동적 INSERT/UPDATE → [`car01_info.selectById`](../../car/sql/car01_info.md) |
| `car.Car02_User.delete` | Car02_Grid_User:182 | [`Car02_User.java:33`](../../car/services/Car02_User.md) | `UpdateDataModel(car02_user)` 동적 DELETE |
| `car.Car02_User.selectByInfoId` | Car02_Grid_User:145 | [`Car02_User.java:22`](../../car/services/Car02_User.md) | [`car02_user.selectByInfoId`](../../car/sql/car02_user.md) |
| `car.Car02_User.update` | Car02_Grid_User:168 | [`Car02_User.java:28`](../../car/services/Car02_User.md) | `UpdateDataModel(car02_user)` 동적 INSERT/UPDATE → [`car02_user.selectById`](../../car/sql/car02_user.md) |
| `car.Car03_Booking.selectByInfoId` | Car01_Tab_Info:230 | [`Car03_Booking.java:53`](../../car/services/Car03_Booking.md) | [`car03_booking.selectByInfoId`](../../car/sql/car03_booking.md) |

## 테이블

[`car01_info`](../../../db/tables/car.md), [`car02_user`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Car01_Tab_Info (`client/vi/car/Car01_Tab_Info.java`, 275줄)

- 레이아웃: center=vlc, south=hlc
- 툴바 `buttonBar`: 차량구분: {carTypeName} 검색: {searchText} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `editForm` Car01_Edit_Info, `carTypeName` ComboBoxField("CarTypeCode", "%", "전체"), `searchText` TextField 빈칸="차량번호/차량정보/비고"
- 그리드 `grid` (buildGrid()):
  - carTypeName 100 "차량구분" TextCenter
  - carNo 100 "차량번호" Text
  - carName 250 "차량명" Text
  - carInfo 250 "차량정보" Text
  - note 400 "비고" Text
  - personName 100 "사용자" Text
  - startDate 100 "사용시작일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L61-99) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L106) → retrieve()
[E2] retrieveButton[조회].Select (L114) → retrieve()
[E3] insertButton[등록].Select (L120) → insertRow()
[E4] deleteButton[삭제].Select (L126) → deleteCheck()
       └ [E6] msgBox.DialogHide [YES] (L223) → delete()
[E5] grid.SelectionChanged [선택>0] (L134) → 인라인 L134-166 (new SelectionChangedHandler<Car01_Inf…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L185-211 | 생성자,E1,E2 | 서비스 car.Car01_Info.selectByCompanyId(searchText, companyId, carType) | 업무 |
| public insertRow() | L213-218 | E3 | 상태 처리 | 업무 |
| private deleteCheck() | L220-255 | E4 | ConfirmBox → E6 | 업무 |
| public delete() | L257-270 | E6 | GridDeleteData car.Car01_Info.delete | 업무 |
| private settings() | L101-167 | 생성자 | 이벤트 연결, 초기값: carTypeName="전체"("CarTypeCode") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L169-183 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L272-274 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('carTypeNm', 100, '차량구분'),  // L174
  gb.text('carNo', 100, '차량번호'),  // L175
  gb.text('carNm', 250, '차량명'),  // L176
  gb.text('carInfo', 250, '차량정보'),  // L177
  gb.text('note', 400, '비고'),  // L178
  gb.text('personNm', 100, '사용자'),  // L179
  gb.date('startDate', 100, '사용시작일'),  // L180
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteCheck}>삭제</Button>

### Car02_Grid_User (`client/vi/car/Car02_Grid_User.java`, 203줄)

- 입력·하위 화면: `lookupEmpInfo` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - startDate 100 "시작일자" Date 편집:MyDateField
  - closeDate 100 "종료일자" Date 편집:MyDateField
  - personName 100 "직원" Text 편집:lookupEmpInfo

#### 이벤트
[E0] 화면 열림 (생성자 L52-63) → settings()
[E1] retrieveButton[조회].Select (L66) → retrieve()
[E2] insertButton[등록].Select [infoId == null] (L72) → insertRow()
[E3] updateButton[저장].Select (L83) → update()
[E4] deleteButton[삭제].Select (L89) → deleteRow()
       └ [E6] messageBox.DialogHide (L175) → 서비스 car.Car02_User.delete
[E5] lookupEmpInfo.TriggerClick (L99) → openLookupEmpInfo()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L118-121 | E1 | 상태 처리 | 업무 |
| private openLookupEmpInfo() | L123-137 | E5 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| public retrieve() | L140-146 | E1 | 서비스 car.Car02_User.selectByInfoId(infoId) | 업무 |
| public update() | L149-169 | E3 | 서비스 car.Car02_User.update | 업무 |
| public deleteRow() | L172-195 | E4 | ConfirmBox → E6 | 업무 |
| public insertRow() | L198-202 | E2 | 상태 처리 | 업무 |
| private settings() | L65-95 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L97-116 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 100, '시작일자', { editor: 'date' }),  // L110
  gb.date('closeDate', 100, '종료일자', { editor: 'date' }),  // L111
  gb.text('personNm', 100, '직원'),  // L112 SQL 계산 컬럼(selectByInfoId: f_emp_kor_nm(car02_person_id))
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Car01_Edit_Info (`client/vi/car/Car01_Edit_Info.java`, 172줄)

- 입력·하위 화면: `carType` TextField, `carNo` TextField, `carName` TextField, `carInfo` TextField, `note` MyTextArea, `initMileage` LongField, `carTypeName` ComboBoxField("CarTypeCode") 빈칸="선택"

#### 이벤트
[E0] 화면 열림 (생성자 L58-89) → getEditor()
[E1] updateButton[저장].Select (L72) → update()
[E2] carTypeName[차량구분].Collapse [callback != null] (L79) → 인라인 L79-88 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L91-130 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L132-140 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L142-166 | E1 | 서비스 car.Car01_Info.update | 업무 |
| private setHtmlStyle() | L168-170 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>

