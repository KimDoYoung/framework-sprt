# Icam10_Tab_FeeAdmin

- 종류: 화면
- 메뉴: I/F > 10. ICAM > ICAM 보수(관리자용) (#1203)
- 파일: `client/vi/icam/Icam10_Tab_FeeAdmin.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys01_Lookup_Company`](../../sys/components/Sys01_Lookup_Company.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `icam.Icam10_Fee.selectByFeeTypePaging` | Icam10_Tab_FeeAdmin:104 | [`Icam10_Fee.java:29`](../../icam/services/Icam10_Fee.md) | [`icam10_fee.selectByFeeTypePaging`](../../icam/sql/icam10_fee.md), [`icam10_fee.selectByFeeTypePagingTotal`](../../icam/sql/icam10_fee.md) |

## 테이블

[`icam10_fee`](../../../db/tables/icam.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icam10_Tab_FeeAdmin (`client/vi/icam/Icam10_Tab_FeeAdmin.java`, 322줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar`: 기간: {startDate} ~: {closeDate} 구분: {feeTypecomboBox} ICAM운용사: {companyField} 검색: {searchTextField} {retrieveButton} {batchButton} {batchForm}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchTextField` TextField, `feeTypecomboBox` ComboBoxField("FundFeeType"), `companyField` LookupTriggerField 빈칸="전체", `lookupCompany` Sys01_Lookup_Company
- 그리드 `grid` (buildGrid()):
  - stdDate 100 "기준일" Date
  - icamCompanyCode 70 "운용사코드" TextCenter
  - icamCompanyName 200 "운용사명" Text
  - fundName 250 "펀드" Text
  - rmkName 180 "적요" Text
  - fee 100 "금액" Double
  - afPayDate 100 "다음보수인출일" Date
  - bfPayDate 100 "전보수인출일" Date
  - workDateString 150 "생성일시" TextCenter
  - worker 150 "생성자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L70-115) → setting()
[E1] feeTypecomboBox[FundFeeType].Collapse (L129) → 인라인 L129-140 (new CollapseHandler() { @Override pub…)
[E2] searchTextField.KeyPress [Enter] (L143) → retrieve()
[E3] companyField.TriggerClick [result != null] (L156) → 인라인 L156-174 (new TriggerClickHandler() { @Override…)
[E4] retrieveButton[조회].Select (L176) → retrieve()
[E5] batchButton[ICAM 발생보수 가져오기].Select (L182) → batch()
       └ [E6] msgBox.DialogHide [YES] (L220) → batchRun()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L117-188 | 생성자 | 조회창 Sys01_Lookup_Company 열기 | 업무 |
| public batch() | L208-240 | E5 | ConfirmBox → E6 | 업무 |
| private batchRun() | L242-265 | E6,batch | 상태 처리 | 업무 |
| public retrieve() | L268-304 | E2,E4 | 상태 처리 | 업무 |
| public update() | L307-308 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L311-312 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L315-316 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L190-206 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L318-320 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('stdDate', 100, '기준일'),  // L194
  gb.textCenter('icamCompanyCd', 70, '운용사코드'),  // L195
  gb.text('icamCompanyNm', 200, '운용사명'),  // L196
  gb.text('fundNm', 250, '펀드'),  // L197
  gb.text('rmkNm', 180, '적요'),  // L198
  gb.double('fee', 100, '금액'),  // L199
  gb.date('afPayDate', 100, '다음보수인출일'),  // L200
  gb.date('bfPayDate', 100, '전보수인출일'),  // L201
  gb.textCenter('workDateString', 150, '생성일시'),  // L202 SQL 계산 컬럼(selectByFeeTypePaging: to_char(icam10_work_date,'yyyy-mm-dd HH…)
  gb.textCenter('worker', 150, '생성자'),  // L203
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={batch}>ICAM 발생보수 가져오기</Button>

