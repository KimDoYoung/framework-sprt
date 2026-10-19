# Icam10_Tab_CurrentFeeByFund

- 종류: 화면
- 메뉴: 펀드관리 > 20. 운용현황 > 펀드별 발생보수현황 (#1268)
- 메뉴: 관리회계 > 30. 펀드운용보수관리 > 월별 펀드보수현황 (#1494)
- 파일: `client/vi/icam/Icam10_Tab_CurrentFeeByFund.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `icam.Icam10_Fee.getCurrentFeeByFund` | Icam10_Tab_CurrentFeeByFund:176 | [`Icam10_Fee.java:45`](../../icam/services/Icam10_Fee.md) | [`icam10_fee.getCurrentFeeByFund`](../../icam/sql/icam10_fee.md) |
| `sys.Sys99_Print.insertRdCurrentFeeByFund` | Icam10_Tab_CurrentFeeByFund:188 | [`Sys99_Print.java:4984`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`icam10_fee.getCurrentFeeByFund`](../../icam/sql/icam10_fee.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`ast33_fund_trans`](../../../db/tables/ast.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`icam10_fee`](../../../db/tables/icam.md), [`ifi29_am_corp_mapping`](../../../db/tables/ifi.md), [`ifi31_fund_fee`](../../../db/tables/ifi.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icam10_Tab_CurrentFeeByFund (`client/vi/icam/Icam10_Tab_CurrentFeeByFund.java`, 241줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준년도: {yearText} {retrieveButton} {downloadButton}
- 입력·하위 화면: `yearText` TextField 빈칸="YYYY"
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - fundName 400 "펀드명" TextFrozen 편집:"left"
  - beforefee1 100 "전기" Double 편집:"DD5E5E"
  - afterfee1 100 "당기" Double 편집:"456EA6"
  - beforefee2 100 "전기" Double 편집:"DD5E5E"
  - afterfee2 100 "당기" Double 편집:"456EA6"
  - beforefee3 100 "전기" Double 편집:"DD5E5E"
  - afterfee3 100 "당기" Double 편집:"456EA6"
  - beforefee4 100 "전기" Double 편집:"DD5E5E"
  - afterfee4 100 "당기" Double 편집:"456EA6"
  - beforefee5 100 "전기" Double 편집:"DD5E5E"
  - afterfee5 100 "당기" Double 편집:"456EA6"
  - beforefee6 100 "전기" Double 편집:"DD5E5E"
  - afterfee6 100 "당기" Double 편집:"456EA6"
  - beforefee7 100 "전기" Double 편집:"DD5E5E"
  - afterfee7 100 "당기" Double 편집:"456EA6"
  - beforefee8 100 "전기" Double 편집:"DD5E5E"
  - afterfee8 100 "당기" Double 편집:"456EA6"
  - beforefee9 100 "전기" Double 편집:"DD5E5E"
  - afterfee9 100 "당기" Double 편집:"456EA6"
  - beforefee10 100 "전기" Double 편집:"DD5E5E"
  - afterfee10 100 "당기" Double 편집:"456EA6"
  - beforefee11 100 "전기" Double 편집:"DD5E5E"
  - afterfee11 100 "당기" Double 편집:"456EA6"
  - beforefee12 100 "전기" Double 편집:"DD5E5E"
  - afterfee12 100 "당기" Double 편집:"456EA6"
  - totalBeforefee 100 "전기" Double 편집:"DD5E5E"
  - totalAfterfee 100 "당기" Double 편집:"456EA6"

#### 이벤트
[E0] 화면 열림 (생성자 L51-74) → settings()
[E1] yearText.KeyPress [Enter] (L81) → retrieve()
[E2] retrieveButton[조회].Select (L89) → retrieve()
[E3] downloadButton[엑셀다운로드].Select (L95) → createRdExcel()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L167-182 | E1,E2 | 서비스 icam.Icam10_Fee.getCurrentFeeByFund(companyId, yearText, preYearText) | 업무 |
| private createRdExcel() | L184-236 | E3 | 서비스 sys.Sys99_Print.insertRdCurrentFeeByFund(companyId, personId, windowClassName, yearText, preYearText) | 업무 |
| private settings() | L76-101 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L103-165 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L238-240 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L106 newHeaderGroupMap02newHeaderGroupConfig12 100 "1월" (icam10_new_header_group_map02new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L107 newHeaderGroupMap04newHeaderGroupConfig12 100 "2월" (icam10_new_header_group_map04new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L108 newHeaderGroupMap06newHeaderGroupConfig12 100 "3월" (icam10_new_header_group_map06new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L109 newHeaderGroupMap08newHeaderGroupConfig12 100 "4월" (icam10_new_header_group_map08new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L110 newHeaderGroupMap010newHeaderGroupConfig12 100 "5월" (icam10_new_header_group_map010new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L111 newHeaderGroupMap012newHeaderGroupConfig12 100 "6월" (icam10_new_header_group_map012new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L112 newHeaderGroupMap014newHeaderGroupConfig12 100 "7월" (icam10_new_header_group_map014new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L113 newHeaderGroupMap016newHeaderGroupConfig12 100 "8월" (icam10_new_header_group_map016new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L114 newHeaderGroupMap018newHeaderGroupConfig12 100 "9월" (icam10_new_header_group_map018new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L115 newHeaderGroupMap020newHeaderGroupConfig12 100 "10월" (icam10_new_header_group_map020new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L116 newHeaderGroupMap022newHeaderGroupConfig12 100 "11월" (icam10_new_header_group_map022new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L117 newHeaderGroupMap024newHeaderGroupConfig12 100 "12월" (icam10_new_header_group_map024new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L118 newHeaderGroupMap026newHeaderGroupConfig12 100 "합계" (icam10_new_header_group_map026new_header_group_config12 컬럼 없음)
  // ⚠ 대응 없음 (GridBuilder L122) addTextFrozen
  gb.double('beforeFee1', 100, '전기'),  // L125 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'PRE' AND mon…)
  gb.double('afterFee1', 100, '당기'),  // L126 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'CURR' AND mo…)
  gb.double('beforeFee2', 100, '전기'),  // L128 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'PRE' AND mon…)
  gb.double('afterFee2', 100, '당기'),  // L129 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'CURR' AND mo…)
  gb.double('beforeFee3', 100, '전기'),  // L131 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'PRE' AND mon…)
  gb.double('afterFee3', 100, '당기'),  // L132 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'CURR' AND mo…)
  gb.double('beforeFee4', 100, '전기'),  // L134 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'PRE' AND mon…)
  gb.double('afterFee4', 100, '당기'),  // L135 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'CURR' AND mo…)
  gb.double('beforeFee5', 100, '전기'),  // L137 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'PRE' AND mon…)
  gb.double('afterFee5', 100, '당기'),  // L138 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'CURR' AND mo…)
  gb.double('beforeFee6', 100, '전기'),  // L140 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'PRE' AND mon…)
  gb.double('afterFee6', 100, '당기'),  // L141 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'CURR' AND mo…)
  gb.double('beforeFee7', 100, '전기'),  // L143 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'PRE' AND mon…)
  gb.double('afterFee7', 100, '당기'),  // L144 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'CURR' AND mo…)
  gb.double('beforeFee8', 100, '전기'),  // L146 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'PRE' AND mon…)
  gb.double('afterFee8', 100, '당기'),  // L147 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'CURR' AND mo…)
  gb.double('beforeFee9', 100, '전기'),  // L149 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'PRE' AND mon…)
  gb.double('afterFee9', 100, '당기'),  // L150 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'CURR' AND mo…)
  gb.double('beforeFee10', 100, '전기'),  // L152 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'PRE' AND mon…)
  gb.double('afterFee10', 100, '당기'),  // L153 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'CURR' AND mo…)
  gb.double('beforeFee11', 100, '전기'),  // L155 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'PRE' AND mon…)
  gb.double('afterFee11', 100, '당기'),  // L156 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'CURR' AND mo…)
  gb.double('beforeFee12', 100, '전기'),  // L158 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'PRE' AND mon…)
  gb.double('afterFee12', 100, '당기'),  // L159 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'CURR' AND mo…)
  gb.double('totalBeforeFee', 100, '전기'),  // L161 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'PRE' THEN fe…)
  gb.double('totalAfterFee', 100, '당기'),  // L162 SQL 계산 컬럼(getCurrentFeeByFund: SUM(CASE WHEN year_type = 'CURR' THEN f…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>

