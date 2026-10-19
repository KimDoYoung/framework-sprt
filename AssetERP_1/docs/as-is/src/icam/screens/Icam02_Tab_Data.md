# Icam02_Tab_Data

- 종류: 화면
- 메뉴: I/F > 10. ICAM > ICAM 연계정보 (#1101)
- 파일: `client/vi/icam/Icam02_Tab_Data.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `icam.Icam02_Data.selectByCompanyIdString` | Icam02_Tab_Data:93 | [`Icam02_Data.java:33`](../../icam/services/Icam02_Data.md) | [`icam02_data.selectByCompanyIdString`](../../icam/sql/icam02_data.md) |

## 테이블

[`icam01_data_info`](../../../db/tables/icam.md), [`icam02_data`](../../../db/tables/icam.md), [`sys01_company`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icam02_Tab_Data (`client/vi/icam/Icam02_Tab_Data.java`, 117줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar`: {retrieveButton}
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
[E0] 화면 열림 (생성자 L29-54) → retrieve()
[E1] retrieveButton[조회].Select (L31) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L89-102 | 생성자,E1 | 서비스 icam.Icam02_Data.selectByCompanyIdString(companyId) | 업무 |
| public update() | L105-106 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L109-110 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L113-114 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L56-86 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('icamCompanyCd', 70, '회사코드'),  // L61
  gb.date('icamDate', 100, '생성일'),  // L62
  gb.text('fundCd', 100, '펀드코드'),  // L63
  gb.text('fundNm', 300, '펀드명'),  // L64
  gb.text('assetCd', 70, '자산구분'),  // L65
  gb.text('assetNm', 150, '자산명'),  // L66
  gb.text('itemCd', 100, '종목코드'),  // L67
  gb.text('itemNm', 250, '종목명'),  // L68
  gb.long('seq', 70, '순번'),  // L69
  gb.text('infoCd', 70, '정보코드'),  // L70
  gb.text('infoNm', 200, '정보명'),  // L71 SQL 계산 컬럼(selectByCompanyIdString: icam01_info_nm)
  gb.text('trCd', 70, '거래코드'),  // L72
  gb.text('trNm', 200, '거래명'),  // L73 SQL 계산 컬럼(selectByCompanyIdString: icam01_tr_nm)
  gb.date('tgtDate', 100, '예정일자'),  // L74
  gb.double('tgtAmt', 120, '예정금액'),  // L75
  gb.date('tgtStdDate', 100, '자료기준일'),  // L76
  gb.text('note', 500, '비고'),  // L77
  gb.text('createDateString', 150, '작업일시'),  // L78 SQL 계산 컬럼(selectByCompanyIdString: to_char(icam02_create_date,'yyyy-mm-dd …)
  gb.text('creater', 100, '작업자'),  // L79
  gb.long('icsClassTreeId', 80, '내부통제ID'),  // L80
  gb.long('icsDeadlineId', 80, '내부통제-기한ID'),  // L81
  gb.text('confirmYn', 80, '확인여부'),  // L82
  gb.long('confirmPersonId', 80, '확인자ID'),  // L83
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

