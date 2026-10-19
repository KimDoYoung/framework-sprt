# Bbs11_Tab_Application

- 종류: 화면
- 메뉴: 신청 > 90. 기타신청 > 기타신청서 작성 (#1331)
- 파일: `client/vi/bbs/Bbs11_Tab_Application.java`
- 함께 쓰는 클래스 1개:
  - `Bbs11_Edit_Application` `client/vi/bbs/Bbs11_Edit_Application.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `bbs.Bbs11_Application.delete` | Bbs11_Tab_Application:265 | [`Bbs11_Application.java:85`](../../bbs/services/Bbs11_Application.md) | `UpdateDataModel(bbs11_application)` 동적 DELETE |
| `bbs.Bbs11_Application.modelUpdate` | Bbs11_Edit_Application:206 | [`Bbs11_Application.java:59`](../../bbs/services/Bbs11_Application.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bbs11_application)` 동적 INSERT/UPDATE → [`bbs11_application.selectById`](../../bbs/sql/bbs11_application.md) |
| `bbs.Bbs11_Application.selectByPersonId` | Bbs11_Tab_Application:232 | [`Bbs11_Application.java:26`](../../bbs/services/Bbs11_Application.md) | [`bbs11_application.selectByPersonId`](../../bbs/sql/bbs11_application.md) |
| `bbs.Bbs12_ApplicationForm.appTypeCall` | Bbs11_Edit_Application:168 | [`Bbs12_ApplicationForm.java:69`](../../bbs/services/Bbs12_ApplicationForm.md) | [`bbs12_application_form.selectByAppType`](../../bbs/sql/bbs12_application_form.md) |
| `sms.Sms02_History.sendMessage` | Bbs11_Tab_Application:206 | [`Sms02_History.java:100`](../../sms/services/Sms02_History.md) | [`dbConfig.getEtcSeq`](../../utils/sql/dbConfig.md), [`sms02_history.insert`](../../sms/sql/sms02_history.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |

## 테이블

[`bbs11_application`](../../../db/tables/bbs.md), [`bbs12_application_form`](../../../db/tables/bbs.md), [`sms02_history`](../../../db/tables/sms.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Bbs11_Tab_Application (`client/vi/bbs/Bbs11_Tab_Application.java`, 308줄)

- 레이아웃: north=buttonBar, center=grid
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 신청구분: {applicationComboBox} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `applicationComboBox` ComboBoxField("ApplicationType", "%", "전체") 빈칸="전체", `lookup` Bbs11_Edit_Application, `lookupEmpTransInfo` Emp00_Lookup_SelectMulti
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - appDate 100 "신청일" Date
  - appEmpName 80 "신청자" Text
  - appTypeName 140 "신청구분" Text
  - appStatusName 80 "신청상태" TextCenter
  - closeDate 100 "완료일" Date
  - actionCell 50 "상세보기" Cell 편집:actionCell01
  - actionCell 100 "신청문자발송" Cell 편집:actionCell02
  - note 190 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L60-88) → settings(), retrieve()
[E1] startDate.ValueChange (L97) → 인라인 L97-102 (new ValueChangeHandler<Date>() { @Ove…)
[E2] retrieveButton[조회].Select (L109) → retrieve()
[E3] insertButton[등록].Select (L115) → retrieve()
[E4] deleteButton[삭제].Select (L127) → delete()
       └ [E5] msgBox.DialogHide [YES] (L258) → 서비스 bbs.Bbs11_Application.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private lookupEmpTransInfo() | L189-201 | buildGrid | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| private sendMessage() | L203-222 | lookupEmpTransInfo | 서비스 sms.Sms02_History.sendMessage(companyId, msg) | 업무 |
| private retrieve() | L224-241 | 생성자,E2,E3,buildGrid | 서비스 bbs.Bbs11_Application.selectByPersonId(companyId, personId, startDate, closeDate, appTypeCode) | 업무 |
| private delete() | L243-276 | E4 | ConfirmBox → E5 | 업무 |
| private settings() | L90-133 | 생성자 | 팝업 Bbs11_Edit_Application 열기, 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L135-187 | 필드 초기화 | 팝업 Bbs11_Edit_Application 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L297-299 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L301-303 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L305-307 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('appDate', 100, '신청일'),  // L178
  gb.text('appEmpNm', 80, '신청자'),  // L179 SQL 계산 컬럼(selectById: f_emp_kor_nm(bbs11_app_emp_id))
  gb.text('appTypeNm', 140, '신청구분'),  // L180 SQL 계산 컬럼(selectById: f_cdnm('ApplicationType', bbs11_app_typ…)
  gb.textCenter('appStatusNm', 80, '신청상태'),  // L181 SQL 계산 컬럼(selectById: f_cdnm('ApplicationStatusCode', bbs11_a…)
  gb.date('closeDate', 100, '완료일'),  // L182
  // ⚠ 대응 없음 (GridBuilder L183) addCell
  // ⚠ 대응 없음 (GridBuilder L184) addCell
  gb.text('note', 190, '비고'),  // L185
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={retrieve}>등록</Button>
3. <Button type="delete" onClick={delete}>삭제</Button>

### Bbs11_Edit_Application (`client/vi/bbs/Bbs11_Edit_Application.java`, 249줄)

- 입력·하위 화면: `appEmpName` TextField, `appType` TextField, `note` TextField 빈칸="중복 신청을 방지하기 위해 수신처를 정확히 입력해 주세요", `content` MyTextArea, `appDate` MyDateField, `appTypeName` ComboBoxField("ApplicationType")

#### 이벤트
[E0] 화면 열림 (생성자 L104-143) → settings(), getEditor(), show()
[E1] appTypeName[신청구분].Collapse (L164) → 서비스 bbs.Bbs12_ApplicationForm.appTypeCall
[E2] updateButton[저장].Select (L185) → update()
[E3] closeButton[닫기].Select (L191) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L71-86 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L88-102 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L145-157 | 생성자 | 상태 처리 | 업무 |
| private update() | L199-218 | E2 | 서비스 bbs.Bbs11_Application.modelUpdate | 업무 |
| private settings() | L159-197 | 생성자 | 서비스 bbs.Bbs12_ApplicationForm.appTypeCall, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L230-232 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L234-236 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L238-240 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L242-244 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L246-248 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

