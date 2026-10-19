# Icam02_Tab_DataAdmin

- 종류: 화면
- 메뉴: I/F > 10. ICAM > ICAM 연계정보(관리자용) (#1109)
- 파일: `client/vi/icam/Icam02_Tab_DataAdmin.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys01_Lookup_Company`](../../sys/components/Sys01_Lookup_Company.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `icam.Icam02_Data.selectByCompanyIdString` | Icam02_Tab_DataAdmin:187 | [`Icam02_Data.java:33`](../../icam/services/Icam02_Data.md) | [`icam02_data.selectByCompanyIdString`](../../icam/sql/icam02_data.md) |

## 테이블

[`icam01_data_info`](../../../db/tables/icam.md), [`icam02_data`](../../../db/tables/icam.md), [`sys01_company`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icam02_Tab_DataAdmin (`client/vi/icam/Icam02_Tab_DataAdmin.java`, 211줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar`: {icamCompanyFieldLabel} {retrieveButton} {batchButton1} {batchButton2} {batchForm}
- 입력·하위 화면: `companyField` LookupTriggerField 빈칸="전체", `lookupCompany` Sys01_Lookup_Company
- 그리드 `grid` (buildGrid(), 체크박스):
  - icamCompanyCode 70 "회사코드" Text
  - icamDate 100 "생성일" Date
  - fundCode 100 "펀드코드" Text
  - fundName 300 "펀드명" Text
  - assetCode 70 "자산구분" Text
  - assetName 150 "자산명" Text
  - itemCode 100 "종목코드" Text
  - itemName 250 "종목명" Text
  - seq 70 "순번" Long
  - infoCode 70 "정보코드" Text
  - infoName 200 "정보명" Text
  - trCode 70 "거래코드" Text
  - trName 200 "거래명" Text
  - tgtDate 100 "예정일자" Date
  - tgtAmt 120 "예정금액" Double
  - tgtStdDate 100 "자료기준일" Date
  - note 500 "비고" Text
  - createDateString 150 "작업일시" Text
  - creater 100 "작업자" Text
  - icsClassTreeId 80 "내부통제ID" Long
  - icsDeadlineId 80 "내부통제-기한ID" Long
  - confirmYn 80 "확인여부" Text
  - confirmPersonId 80 "확인자ID" Long

#### 이벤트
[E0] 화면 열림 (생성자 L49-114) → 초기화
[E1] companyField[ICAM운용사].TriggerClick [result != null] (L53) → 인라인 L53-71 (new TriggerClickHandler() { @Override…)
[E2] retrieveButton[조회].Select (L73) → retrieve()
[E3] batchButton1[ICAM 정보코드 가져오기].Select (L79) → batch()
[E4] batchButton2[ICAM 연계정보 가져오기].Select (L85) → batch()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public batch() | L148-180 | E3,E4 | 상태 처리 | 업무 |
| public retrieve() | L183-196 | E2 | 서비스 icam.Icam02_Data.selectByCompanyIdString(companyId) | 업무 |
| public update() | L199-200 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L203-204 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L207-208 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L116-146 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('icamCompanyCd', 70, '회사코드'),  // L121
  gb.date('icamDate', 100, '생성일'),  // L122
  gb.text('fundCd', 100, '펀드코드'),  // L123
  gb.text('fundNm', 300, '펀드명'),  // L124
  gb.text('assetCd', 70, '자산구분'),  // L125
  gb.text('assetNm', 150, '자산명'),  // L126
  gb.text('itemCd', 100, '종목코드'),  // L127
  gb.text('itemNm', 250, '종목명'),  // L128
  gb.long('seq', 70, '순번'),  // L129
  gb.text('infoCd', 70, '정보코드'),  // L130
  gb.text('infoNm', 200, '정보명'),  // L131 SQL 계산 컬럼(selectByCompanyIdString: icam01_info_nm)
  gb.text('trCd', 70, '거래코드'),  // L132
  gb.text('trNm', 200, '거래명'),  // L133 SQL 계산 컬럼(selectByCompanyIdString: icam01_tr_nm)
  gb.date('tgtDate', 100, '예정일자'),  // L134
  gb.double('tgtAmt', 120, '예정금액'),  // L135
  gb.date('tgtStdDate', 100, '자료기준일'),  // L136
  gb.text('note', 500, '비고'),  // L137
  gb.text('createDateString', 150, '작업일시'),  // L138 SQL 계산 컬럼(selectByCompanyIdString: to_char(icam02_create_date,'yyyy-mm-dd …)
  gb.text('creater', 100, '작업자'),  // L139
  gb.long('icsClassTreeId', 80, '내부통제ID'),  // L140
  gb.long('icsDeadlineId', 80, '내부통제-기한ID'),  // L141
  gb.text('confirmYn', 80, '확인여부'),  // L142
  gb.long('confirmPersonId', 80, '확인자ID'),  // L143
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={batch}>ICAM 정보코드 가져오기</Button>
3. <Button type="unknown" onClick={batch}>ICAM 연계정보 가져오기</Button>

