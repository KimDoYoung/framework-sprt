# Bbs11_Tab_ApplicationMng

- 종류: 화면
- 메뉴: 경영관리 > 90. 신청서관리 > 기타신청서 확인 (#1332)
- 파일: `client/vi/bbs/Bbs11_Tab_ApplicationMng.java`
- 함께 쓰는 클래스 1개:
  - `Bbs12_Lookup_ApplicationMng` `client/vi/bbs/Bbs12_Lookup_ApplicationMng.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `bbs.Bbs11_Application.modelUpdate` | Bbs11_Tab_ApplicationMng:320 | [`Bbs11_Application.java:59`](../../bbs/services/Bbs11_Application.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bbs11_application)` 동적 INSERT/UPDATE → [`bbs11_application.selectById`](../../bbs/sql/bbs11_application.md) |
| `bbs.Bbs11_Application.selectByResultCheck` | Bbs11_Tab_ApplicationMng:271 | [`Bbs11_Application.java:38`](../../bbs/services/Bbs11_Application.md) | [`bbs11_application.selectByResultCheck`](../../bbs/sql/bbs11_application.md) |
| `bbs.Bbs11_Application.update` | Bbs11_Tab_ApplicationMng:298 | [`Bbs11_Application.java:80`](../../bbs/services/Bbs11_Application.md) | `UpdateDataModel(bbs11_application)` 동적 INSERT/UPDATE → [`bbs11_application.selectById`](../../bbs/sql/bbs11_application.md) |
| `bbs.Bbs12_ApplicationForm.formCheck` | Bbs12_Lookup_ApplicationMng:191 | [`Bbs12_ApplicationForm.java:35`](../../bbs/services/Bbs12_ApplicationForm.md) | [`bbs12_application_form.insert`](../../bbs/sql/bbs12_application_form.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys09_code.selectByApplicationForm`](../../sys/sql/sys09_code.md) |
| `bbs.Bbs12_ApplicationForm.modelUpdate` | Bbs12_Lookup_ApplicationMng:216 | [`Bbs12_ApplicationForm.java:82`](../../bbs/services/Bbs12_ApplicationForm.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bbs12_application_form)` 동적 INSERT/UPDATE → [`bbs12_application_form.selectById`](../../bbs/sql/bbs12_application_form.md) |
| `bbs.Bbs12_ApplicationForm.selectByCompanyId` | Bbs12_Lookup_ApplicationMng:182 | [`Bbs12_ApplicationForm.java:27`](../../bbs/services/Bbs12_ApplicationForm.md) | [`bbs12_application_form.selectByCompanyId`](../../bbs/sql/bbs12_application_form.md) |
| `bbs.Bbs12_ApplicationForm.update` | Bbs12_Lookup_ApplicationMng:206 | [`Bbs12_ApplicationForm.java:95`](../../bbs/services/Bbs12_ApplicationForm.md) | `UpdateDataModel(bbs12_application_form)` 동적 INSERT/UPDATE → [`bbs12_application_form.selectById`](../../bbs/sql/bbs12_application_form.md) |
| `sms.Sms02_History.sendMessage` | Bbs11_Tab_ApplicationMng:342 | [`Sms02_History.java:100`](../../sms/services/Sms02_History.md) | [`dbConfig.getEtcSeq`](../../utils/sql/dbConfig.md), [`sms02_history.insert`](../../sms/sql/sms02_history.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |

## 테이블

[`bbs11_application`](../../../db/tables/bbs.md), [`bbs12_application_form`](../../../db/tables/bbs.md), [`sms02_history`](../../../db/tables/sms.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Bbs11_Tab_ApplicationMng (`client/vi/bbs/Bbs11_Tab_ApplicationMng.java`, 381줄)

- 레이아웃: north=buttonBar, center=vlc01, east=vlc02
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 신청구분: {applicationComboBox} {resultCheckBox} {retrieveButton} {updateButton} {updateFormButton} {certButton}
- 툴바 `buttonBarCenter`: 내&nbsp;&nbsp;&nbsp;&nbsp;용:
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `resultCheckBox` CheckBox, `applicationComboBox` ComboBoxField("ApplicationType", "%", "전체") 빈칸="전체", `lookup` Bbs12_Lookup_ApplicationMng, `appStatusComboBox` ComboBoxField("ApplicationStatusCode")
- 그리드 `grid` (buildGrid(), 체크박스):
  - appDate 100 "신청일" Date
  - appEmpName 80 "신청자" Text
  - appTypeName 150 "신청구분" Text
  - appStatusName 80 "신청상태" Text 편집:appStatusComboBox
  - closeDate 100 "완료일" Date 편집:MyDateField
  - actionCell 100 "완료문자발송" Cell 편집:actionCell
  - note 190 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L82-142) → settings(), retrieve()
[E1] startDate.ValueChange (L152) → 인라인 L152-157 (new ValueChangeHandler<Date>() { @Ove…)
[E2] grid.Selection (L167) → 인라인 L167-177 (new SelectionHandler<Bbs11_Applicatio…)
[E3] retrieveButton[조회].Select (L179) → retrieve()
[E4] updateButton[저장].Select (L186) → update()
[E5] updateFormButton[신청구분별 내용관리].Select (L193) → 인라인 L193-204 (new SelectHandler(){ @Override public…)
[E6] certButton[증명서 발급 바로가기].Select (L206) → 인라인 L206-217 (new SelectHandler() { @Override publi…)
[E7] appStatusComboBox[ApplicationStatusCode].Collapse (L225) → 인라인 L225-237 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L263-277 | 생성자,E3,updateContent | 서비스 bbs.Bbs11_Application.selectByResultCheck(companyId, startDate, closeDate, appTypeCode, resultCheck) | 업무 |
| public retrieveContent() | L279-281 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L283-311 | E4 | 서비스 bbs.Bbs11_Application.update | 업무 |
| public updateContent() | L313-335 | update | 미선택 시 alert "저장이 완료되었습니다.", 서비스 bbs.Bbs11_Application.modelUpdate | 업무 |
| private sendTagetMessage() | L337-358 | buildGrid | 서비스 sms.Sms02_History.sendMessage(companyId, personId, msg) | 업무 |
| private settings() | L144-218 | 생성자 | 조회창 Bbs12_Lookup_ApplicationMng 열기 → 콜백: unmask, 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday(, resultCheckBox=true("미완료건만 보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L220-261 | 필드 초기화 | 미선택 시 alert "완료되지 않은 신청서는 문자발송이 제한됩니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L370-372 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L374-376 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L378-380 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('appDate', 100, '신청일'),  // L251
  gb.text('appEmpNm', 80, '신청자'),  // L252 SQL 계산 컬럼(selectByResultCheck: f_emp_kor_nm(bbs11_app_emp_id))
  gb.text('appTypeNm', 150, '신청구분'),  // L253 SQL 계산 컬럼(selectByResultCheck: f_cdnm('ApplicationType', bbs11_app_typ…)
  gb.text('appStatusNm', 80, '신청상태', { editor: 'select' }),  // L254 SQL 계산 컬럼(selectByResultCheck: f_cdnm('ApplicationStatusCode', bbs11_a…)
  gb.date('closeDate', 100, '완료일', { editor: 'date' }),  // L255
  // ⚠ 대응 없음 (GridBuilder L256) addCell
  gb.text('note', 190, '비고', { editor: 'text' }),  // L257
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={() => /* 인라인 L193-204 (new SelectHandler(){ @Override public…) */}>신청구분별 내용관리</Button>
4. <Button type="goto" onClick={() => /* 인라인 L206-217 (new SelectHandler() { @Override publi…) */}>증명서 발급 바로가기</Button>

### Bbs12_Lookup_ApplicationMng (`client/vi/bbs/Bbs12_Lookup_ApplicationMng.java`, 246줄)

- 레이아웃: west=grid, center=htmlLayoutContainer, east=contentMobi
- 툴바 `buttonBarL`: {notice}
- 툴바 `buttonBarR`: {anchor}
- 입력·하위 화면: `contentMobi` MyTextArea
- 그리드 `grid` (buildGrid()):
  - appTypeName 155 "신청구분" Text
  - publicYn 70 "공개여부" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L76-135) → settings(), show()
[E1] anchor.MouseDown (L87) → retrieve()
[E2] grid.RowClick (L140) → 인라인 L140-155 (new RowClickHandler() { @Override pub…)
[E3] updateButton[저장].Select (L156) → update(), modelUpdate()
[E4] cancleButton[닫기].Select (L163) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L68-74 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L179-188 | E1,formCheck,modelUpdate | 서비스 bbs.Bbs12_ApplicationForm.selectByCompanyId(companyId) | 업무 |
| private formCheck() | L190-202 | open | 서비스 bbs.Bbs12_ApplicationForm.formCheck | 업무 |
| private update() | L204-207 | E3 | 서비스 bbs.Bbs12_ApplicationForm.update | 업무 |
| private modelUpdate() | L209-227 | E3 | 서비스 bbs.Bbs12_ApplicationForm.modelUpdate | 업무 |
| private settings() | L137-170 | 생성자 | 이벤트 연결, 초기값: contentMobi=grid.getSelectionModel( | UI구성 (이벤트 절로 대체) |
| package buildGrid() | L172-177 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L239-241 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L243-245 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('appTypeNm', 155, '신청구분'),  // L174 SQL 계산 컬럼(selectByCompanyId: f_cdnm('ApplicationType', bbs12_app_typ…)
  gb.boolean('publicYn', 70, '공개여부'),  // L175
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={() => /* update(), modelUpdate() */}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

