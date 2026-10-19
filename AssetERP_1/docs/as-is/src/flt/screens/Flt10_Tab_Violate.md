# Flt10_Tab_Violate

- 종류: 화면
- 메뉴: 준법감시 > 11. 임직원매매(준감인) > 위반내역조회 (#1157)
- 파일: `client/vi/flt/Flt10_Tab_Violate.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `flt.Flt10_Tr.selectViolate` | Flt10_Tab_Violate:167 | [`Flt10_Tr.java:85`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.selectViolate`](../../flt/sql/flt10_tr.md) |
| `sys.Sys99_Print.insertRdViolate` | Flt10_Tab_Violate:178 | [`Sys99_Print.java:4658`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`flt10_tr.selectViolate`](../../flt/sql/flt10_tr.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_get_emptrans`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Flt10_Tab_Violate (`client/vi/flt/Flt10_Tab_Violate.java`, 244줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준일: {stdDate} 사원명: {empKorName} {retrieveButton} {downloadButton} {rdFileDownloadForm}
- 입력·하위 화면: `stdDate` MyDateField, `empKorName` LookupTriggerField 빈칸="전체", `empSearch` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid()):
  - orgName 200 "본부(부서)" Text
  - personName 120 "사원명" TextCenter
  - checkName 250 "위반내역" Text
  - checkStd 120 "기준정보" TextCenter
  - checkViolate 120 "위반정보" TextCenter
  - trDate 120 "위반거래일" Date
  - trItemName 200 "위반종목명" Text
  - rejectReason 200 "사전승인의견" TextArea
  - trNote 200 "매매사유" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L64-92) → settings()
[E1] empKorName.TriggerClick [result == null] (L101) → 인라인 L101-119 (new TriggerClickHandler(){ @Override …)
[E2] empKorName.Change (L120) → 인라인 L120-127 (new ChangeHandler() { @Override publi…)
[E3] retrieveButton[조회].Select (L131) → retrieve()
[E4] downloadButton[엑셀다운로드].Select (L137) → createRdExcel()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L160-173 | E3 | 서비스 flt.Flt10_Tr.selectViolate(companyId, stdDate, personId) | 업무 |
| private createRdExcel() | L175-227 | E4 | 서비스 sys.Sys99_Print.insertRdViolate(companyId, personId, stdDate, retrievePersonId, windowClassName) | 업무 |
| private setInitData() | L229-235 | settings | 상태 처리 | 업무 |
| private settings() | L94-143 | 생성자 | 조회창 Emp00_Lookup_SelectSingle 열기, 이벤트 연결, 초기값: empKorName="전체", empKorName=codeModel.getEmpPersonModel(, empKorName=LoginUser.getUserName( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L145-158 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L237-239 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L241-243 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('orgNm', 200, '본부(부서)'),  // L147
  gb.textCenter('personNm', 120, '사원명'),  // L148
  gb.text('checkNm', 250, '위반내역'),  // L149
  gb.textCenter('checkStd', 120, '기준정보'),  // L150
  gb.textCenter('checkViolate', 120, '위반정보'),  // L151
  gb.date('trDate', 120, '위반거래일'),  // L152
  gb.text('trItemNm', 200, '위반종목명'),  // L153
  gb.textArea('rejectReason', 200, '사전승인의견'),  // L154
  gb.textArea('trNote', 200, '매매사유'),  // L155
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>

