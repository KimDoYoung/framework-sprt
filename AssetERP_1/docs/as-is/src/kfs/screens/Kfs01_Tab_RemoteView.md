# Kfs01_Tab_RemoteView

- 종류: 화면
- 메뉴: 커뮤니티 > 90. 기타 > 리모트뷰 사용기록관리 (#1334)
- 파일: `client/vi/kfs/Kfs01_Tab_RemoteView.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `kfs.Kfs01_RemoteView.delete` | Kfs01_Tab_RemoteView:269 | [`Kfs01_RemoteView.java:57`](../../kfs/services/Kfs01_RemoteView.md) | `UpdateDataModel(kfs01_remote_view)` 동적 DELETE |
| `kfs.Kfs01_RemoteView.selectByPersonName` | Kfs01_Tab_RemoteView:245 | [`Kfs01_RemoteView.java:38`](../../kfs/services/Kfs01_RemoteView.md) | [`kfs01_remote_view.selectByPersonName`](../../kfs/sql/kfs01_remote_view.md) |
| `kfs.Kfs01_RemoteView.selectByText` | Kfs01_Tab_RemoteView:230 | [`Kfs01_RemoteView.java:24`](../../kfs/services/Kfs01_RemoteView.md) | [`kfs01_remote_view.selectByText`](../../kfs/sql/kfs01_remote_view.md) |
| `kfs.Kfs01_RemoteView.update` | Kfs01_Tab_RemoteView:258 | [`Kfs01_RemoteView.java:52`](../../kfs/services/Kfs01_RemoteView.md) | `UpdateDataModel(kfs01_remote_view)` 동적 INSERT/UPDATE → [`kfs01_remote_view.selectById`](../../kfs/sql/kfs01_remote_view.md) |

## 테이블

[`kfs01_remote_view`](../../../db/tables/kfs.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Kfs01_Tab_RemoteView (`client/vi/kfs/Kfs01_Tab_RemoteView.java`, 309줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 사원명: {personName} {checkBox} {retrieveButton} {updateButton} {deleteButton} {excelUploadButton} {uploadExcelForm}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `personName` TextField, `checkBox` CheckBox
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - personName 120 "사용자" TextCenter
  - date 120 "사용일자" Date
  - startTime 120 "시작시간" TextCenter
  - closeTime 120 "종료시간" TextCenter
  - reason 650 "업무내용" Text 편집:TextField
  - managerYn 100 "관리자확인" Boolean
  - managerYn 100 "관리자확인" BooleanYn

#### 이벤트
[E0] 화면 열림 (생성자 L76-124) → settings(), retrieve()
[E1] personName.KeyPress [Enter] (L144) → retrieve()
[E2] retrieveButton[조회].Select (L158) → retrieve()
[E3] updateButton[저장].Select (L164) → update()
[E4] deleteButton[삭제].Select [YES] (L170) → delete()
[E5] messageBox.DialogHide [YES] (L175) → delete()
[E6] excelUploadButton[엑셀업로드].Select (L186) → excelUpload()
[E7] uploadExcelForm.SubmitComplete (L195) → retrieve()
[E8] fileUploadField.Change (L287) → 인라인 L287-292 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L221-254 | 생성자,E1,E2,E7,update | 서비스 kfs.Kfs01_RemoteView.selectByText, kfs.Kfs01_RemoteView.selectByPersonName(companyId, personName, startDate, closeDate, checkBox, companyId, personName, startDate, closeDate, checkBox) | 업무 |
| public update() | L256-264 | E3 | 서비스 kfs.Kfs01_RemoteView.update | 업무 |
| public delete() | L266-277 | E4,E5 | GridDeleteData kfs.Kfs01_RemoteView.delete(체크된 행 목록) | 업무 |
| private excelUpload() | L279-295 | E6 | 상태 처리 | 업무 |
| private settings() | L126-201 | 생성자 | 확인창 표시, 이벤트 연결, 초기값: checkBox=true("미입력건만 보기"), startDate=ClientDateUtil.toDate(fromDateStr, closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L203-219 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L297-300 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L302-304 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L306-308 | 생성자,settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('personNm', 120, '사용자'),  // L207
  gb.date('date', 120, '사용일자'),  // L208
  gb.textCenter('startTime', 120, '시작시간'),  // L209
  gb.textCenter('closeTime', 120, '종료시간'),  // L210
  gb.text('reason', 650, '업무내용', { editor: 'text' }),  // L211
  gb.boolean('managerYn', 100, '관리자확인'),  // L213
  gb.booleanYn('managerYn', 100, '관리자확인'),  // L215
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="delete" onClick={delete}>삭제</Button>
4. <Button type="upload" onClick={excelUpload}>엑셀업로드</Button>

