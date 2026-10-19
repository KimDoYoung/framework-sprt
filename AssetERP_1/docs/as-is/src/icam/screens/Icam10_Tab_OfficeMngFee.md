# Icam10_Tab_OfficeMngFee

- 종류: 화면
- 메뉴: 관리회계 > 30. 사무보수관리 > ICAM 펀드보수 발생내역 (#1199)
- 파일: `client/vi/icam/Icam10_Tab_OfficeMngFee.java`
- 함께 쓰는 클래스 2개:
  - `Icam10_Lookup_getICAM` `client/vi/icam/Icam10_Lookup_getICAM.java`
  - `Icam10_Lookup_FundFee` `client/vi/icam/Icam10_Lookup_FundFee.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `icam.Icam10_Fee.createFeeBook` | Icam10_Lookup_getICAM:152 | [`Icam10_Fee.java:176`](../../icam/services/Icam10_Fee.md) | [`icam10_fee.createFundFeeBook`](../../icam/sql/icam10_fee.md), [`icam10_fee.createFundFeeBook2`](../../icam/sql/icam10_fee.md) |
| `icam.Icam10_Fee.createFeeRcvTr` | Icam10_Lookup_getICAM:158 | [`Icam10_Fee.java:206`](../../icam/services/Icam10_Fee.md) | [`icam10_fee.createFundFeeRcvTr`](../../icam/sql/icam10_fee.md), [`icam10_fee.createFundFeeRcvTr2`](../../icam/sql/icam10_fee.md), [`sys12_calendar.selectPeriod`](../../sys/sql/sys12_calendar.md) |
| `icam.Icam10_Fee.getICAMFundFee` | Icam10_Lookup_getICAM:146 | [`Icam10_Fee.java:50`](../../icam/services/Icam10_Fee.md) | [`biz13_with_corp.selectManageTypeIs1`](../../biz/sql/biz13_with_corp.md), [`icam10_fee.deleteFundMngFee`](../../icam/sql/icam10_fee.md), [`icam10_fee.deleteOfficeMngFeeByFundCode`](../../icam/sql/icam10_fee.md), [`icam10_fee.insert`](../../icam/sql/icam10_fee.md), [`icam11_fee_deposit.insert`](../../icam/sql/icam11_fee_deposit.md), [`icam11_fee_deposit.selectByFundCode`](../../icam/sql/icam11_fee_deposit.md), [`icam12_fee_book.deleteByFundCode`](../../icam/sql/icam12_fee_book.md), [`icam12_fee_book.insert`](../../icam/sql/icam12_fee_book.md) |
| `icam.Icam10_Fee.selectByFeeTypePaging` | Icam10_Tab_OfficeMngFee:94 | [`Icam10_Fee.java:29`](../../icam/services/Icam10_Fee.md) | [`icam10_fee.selectByFeeTypePaging`](../../icam/sql/icam10_fee.md), [`icam10_fee.selectByFeeTypePagingTotal`](../../icam/sql/icam10_fee.md) |
| `icam.Icam10_Fee.updateFee` | Icam10_Lookup_FundFee:133 | [`Icam10_Fee.java:165`](../../icam/services/Icam10_Fee.md) | [`icam10_fee.updateFee`](../../icam/sql/icam10_fee.md) |

## 테이블

[`biz13_with_corp`](../../../db/tables/biz.md), [`icam10_fee`](../../../db/tables/icam.md), [`icam11_fee_deposit`](../../../db/tables/icam.md), [`icam12_fee_book`](../../../db/tables/icam.md), [`sys12_calendar`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_create_batchseq`, `f_create_fundfeebook`, `f_create_fundfeebook2`, `f_create_fundfeercvtr`, `f_create_fundfeercvtr_officemng`, `f_sysdate`

## 해석 못 한 서비스 호출

- `Icam10_Lookup_getICAM:191` `serviceName`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icam10_Tab_OfficeMngFee (`client/vi/icam/Icam10_Tab_OfficeMngFee.java`, 249줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar`: 기간: {startDate} ~: {closeDate} 검색: {searchTextField} {retrieveButton} {getIcamButton} ※ 더블클릭하여 발생보수를 수정할 수 있습니다.: {batchForm}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchTextField` TextField 빈칸="운용사/펀드/적요", `lookupFee` Icam10_Lookup_FundFee, `lookupGetICAM` Icam10_Lookup_getICAM
- 그리드 `grid` (buildGrid()):
  - stdDate 100 "기준일" Date
  - icamCompanyCode 70 "운용사코드" TextCenter
  - icamCompanyName 200 "운용사명" Text
  - fundCode 70 "펀드코드" TextCenter
  - fundName 250 "펀드명" Text
  - rmkName 180 "적요" Text
  - curCode 55 "통화" TextCenter
  - fee 100 "발생보수" Double
  - fxRate 100 "적용환율" Double
  - afPayDate 100 "다음보수인출일" Date
  - bfPayDate 100 "전보수인출일" Date
  - workDateString 150 "생성일시" TextCenter
  - worker 150 "생성자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L57-105) → setting()
[E1] searchTextField.KeyPress [Enter] (L119) → retrieve()
[E2] grid.RowDoubleClick (L128) → update()
[E3] retrieveButton[조회].Select (L142) → retrieve()
[E4] getIcamButton[ICAM발생내역 가져오기].Select (L148) → lookupGetIcam()
[E5] batchButton[BATCH 재실행].Select (L154) → batch()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L107-160 | 생성자 | 조회창 Icam10_Lookup_FundFee 열기 | 업무 |
| private lookupGetIcam() | L183-186 | E4 | 조회창 Icam10_Lookup_getICAM 열기 | 업무 |
| private batch() | L188-201 | E5 | 상태 처리 | 업무 |
| public retrieve() | L204-227 | E1,E3 | 상태 처리 | 업무 |
| public update() | L230-231 | E2 | 상태 처리 | 업무 |
| public insertRow() | L234-235 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L238-239 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L162-181 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L241-243 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L245-247 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('stdDate', 100, '기준일'),  // L166
  gb.textCenter('icamCompanyCd', 70, '운용사코드'),  // L167
  gb.text('icamCompanyNm', 200, '운용사명'),  // L168
  gb.textCenter('fundCd', 70, '펀드코드'),  // L169
  gb.text('fundNm', 250, '펀드명'),  // L170
  gb.text('rmkNm', 180, '적요'),  // L171
  gb.textCenter('curCd', 55, '통화'),  // L172
  gb.double('fee', 100, '발생보수'),  // L173
  gb.double('fxRate', 100, '적용환율'),  // L174
  gb.date('afPayDate', 100, '다음보수인출일'),  // L175
  gb.date('bfPayDate', 100, '전보수인출일'),  // L176
  gb.textCenter('workDateString', 150, '생성일시'),  // L177 SQL 계산 컬럼(selectByFeeTypePaging: to_char(icam10_work_date,'yyyy-mm-dd HH…)
  gb.textCenter('worker', 150, '생성자'),  // L178
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={lookupGetIcam}>ICAM발생내역 가져오기</Button>
3. <Button type="unknown" onClick={batch}>BATCH 재실행</Button>

### Icam10_Lookup_getICAM (`client/vi/icam/Icam10_Lookup_getICAM.java`, 223줄)

- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `fundCode` TextField 빈칸="전체", `corpCode` TextField, `corpName` LookupTriggerField 빈칸="전체", `lookupCorpCode` Sys15_Lookup_Corp

#### 이벤트
[E1] corpName[운용사].TriggerClick [result != null] (L80) → 인라인 L80-100 (new TriggerClickHandler() { @Override…)
[E2] getICAMButton[보수발생내역 가져오기].Select (L143) → serviceCall()
[E3] createFeeBookButton[보수원장 재생성].Select (L149) → serviceCall()
[E4] createFeeRcvTrButton[보수인출거래 재생성].Select (L155) → serviceCall()
[E5] closeButton[닫기].Select (L161) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L55-175 | 공개 메서드 | 조회창 Sys15_Lookup_Corp 열기, 서비스 icam.Icam10_Fee.getICAMFundFee, icam.Icam10_Fee.createFeeBook, icam.Icam10_Fee.createFeeRcvTr | 업무 |
| private serviceCall() | L177-213 | E2,E3,E4 | 상태 처리 | 업무 |
| private setHtmlStyle() | L215-217 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L219-221 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>
2. <Button type="unknown" onClick={serviceCall}>보수발생내역 가져오기</Button>
3. <Button type="unknown" onClick={serviceCall}>보수원장 재생성</Button>
4. <Button type="unknown" onClick={serviceCall}>보수인출거래 재생성</Button>

### Icam10_Lookup_FundFee (`client/vi/icam/Icam10_Lookup_FundFee.java`, 160줄)

- 입력·하위 화면: `icamCompanyCode` TextField, `icamCompanyName` TextField, `fundCode` TextField, `fundName` MyTextArea, `rmkName` TextField, `curCode` TextField, `fee` DoubleField

#### 이벤트
[E1] updateButton[저장].Select (L108) → update()
[E2] closeButton[닫기].Select (L114) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-125 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L127-150 | E1 | 서비스 icam.Icam10_Fee.updateFee | 업무 |
| private setHtmlStyle() | L152-154 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L156-158 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

