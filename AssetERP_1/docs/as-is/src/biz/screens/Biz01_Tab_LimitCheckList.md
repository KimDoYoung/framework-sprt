# Biz01_Tab_LimitCheckList

- 종류: 화면
- 메뉴: 준법감시 > 40. 이익제공(수령)현황 > 이익제공 한도초과현황 (#1133)
- 파일: `client/vi/biz/Biz01_Tab_LimitCheckList.java`
- 함께 쓰는 클래스 3개:
  - `Biz01_TabPage_PersonYear` `client/vi/biz/Biz01_TabPage_PersonYear.java`
  - `Biz01_TabPage_PersonDay` `client/vi/biz/Biz01_TabPage_PersonDay.java`
  - `Biz01_TabPage_CompanyYear` `client/vi/biz/Biz01_TabPage_CompanyYear.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `biz.Biz01_Promo.selectByCompanyYear` | Biz01_TabPage_CompanyYear:60 | [`Biz01_Promo.java:136`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.selectByCompanyYear`](../../biz/sql/biz01_promo.md) |
| `biz.Biz01_Promo.selectByPersonDay` | Biz01_TabPage_PersonDay:65 | [`Biz01_Promo.java:116`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.selectByPersonDay`](../../biz/sql/biz01_promo.md) |
| `biz.Biz01_Promo.selectByPersonYear` | Biz01_TabPage_PersonYear:61 | [`Biz01_Promo.java:131`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.selectByPersonYear`](../../biz/sql/biz01_promo.md) |

## 테이블

[`biz01_promo`](../../../db/tables/biz.md), [`biz02_person`](../../../db/tables/biz.md), [`biz90_limit`](../../../db/tables/biz.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_company_nm`, `f_get_crdmanagerid`, `f_nvl`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Biz01_Tab_LimitCheckList (`client/vi/biz/Biz01_Tab_LimitCheckList.java`, 164줄)

- 레이아웃: north=buttonBar, center=tabPanel
- 툴바 `buttonBar`: 기준년도: {yearText} 제공/수령: {provideRcvComboBox} {retrieveButton} {downloadButton} {downloadForm}
- 입력·하위 화면: `yearText` TextField 빈칸="YYYY", `provideRcvComboBox` ComboBoxField("ProvideRcvType", "%", "전체") 빈칸="전체", `overCheckBox` CheckBox, `personDay` Biz01_TabPage_PersonDay, `personYear` Biz01_TabPage_PersonYear, `companyYear` Biz01_TabPage_CompanyYear

#### 이벤트
[E0] 화면 열림 (생성자 L45-75) → setting(), retrieveTabpage()
[E1] yearText.KeyPress [Enter] (L82) → retrieveTabpage()
[E2] retrieveButton[조회].Select (L95) → retrieveTabpage()
[E3] downloadButton[엑셀다운로드].Select (L101) → downloadExcel()
[E4] tabPanel.Selection (L116) → retrieveTabpage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L77-122 | 생성자 | 상태 처리 | 업무 |
| private downloadExcel() | L124-135 | E3 | 상태 처리 | 업무 |
| private retrieveTabpage() | L137-155 | 생성자,E1,E2,E4 | 선택 회사로 탭페이지 retrieve | 업무 |
| private setHtmlBarStyle() | L157-159 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L161-163 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieveTabpage}>조회</Button>
2. <Button type="download" onClick={downloadExcel}>엑셀다운로드</Button>

### Biz01_TabPage_PersonYear (`client/vi/biz/Biz01_TabPage_PersonYear.java`, 74줄)

- 그리드 `grid` (buildGrid()):
  - provideRcvTypeName 150 "제공/수령" TextCenter
  - targetCompanyName 250 "제공(수령) 회사명" TextCenter
  - targetEmpName 150 "제공(수령) 성명" TextCenter
  - averagePrice 120 "경제적가치" Long

#### 이벤트
[E0] 화면 열림 (생성자 L23-25) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L40-42 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L45-48 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L50-67 | 공개 메서드 | 서비스 biz.Biz01_Promo.selectByPersonYear(companyId, personId, yearText, provideRcvType, overCheck) | 업무 |
| public getGrid() | L70-73 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L27-37 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('provideRcvTypeNm', 150, '제공/수령'),  // L31
  gb.textCenter('targetCompanyNm', 250, '제공(수령) 회사명'),  // L32
  gb.textCenter('targetEmpNm', 150, '제공(수령) 성명'),  // L33
  gb.long('averagePrice', 120, '경제적가치'),  // L34
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Biz01_TabPage_PersonDay (`client/vi/biz/Biz01_TabPage_PersonDay.java`, 78줄)

- 그리드 `grid` (buildGrid()):
  - provideRcvTypeName 150 "제공/수령" TextCenter
  - regEmpName 150 "제공(수령)자" TextCenter
  - provideDate 100 "일자" Date
  - providePurName 150 "목적" TextCenter
  - provideContentName 150 "내용" TextCenter
  - targetEmpName 300 "거래상대방" TextCenter
  - averagePrice 120 "인당 경제적가치" Long
  - note 300 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L23-25) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L44-46 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L49-52 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L54-71 | 공개 메서드 | 서비스 biz.Biz01_Promo.selectByPersonDay(companyId, personId, yearText, provideRcvType, overCheck) | 업무 |
| public getGrid() | L74-77 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L27-41 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('provideRcvTypeNm', 150, '제공/수령'),  // L31
  gb.textCenter('regEmpNm', 150, '제공(수령)자'),  // L32
  gb.date('provideDate', 100, '일자'),  // L33
  gb.textCenter('providePurNm', 150, '목적'),  // L34
  gb.textCenter('provideContentNm', 150, '내용'),  // L35
  gb.textCenter('targetEmpNm', 300, '거래상대방'),  // L36
  gb.long('averagePrice', 120, '인당 경제적가치'),  // L37
  gb.text('note', 300, '비고'),  // L38
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Biz01_TabPage_CompanyYear (`client/vi/biz/Biz01_TabPage_CompanyYear.java`, 73줄)

- 그리드 `grid` (buildGrid()):
  - provideRcvTypeName 150 "제공/수령" TextCenter
  - targetCompanyName 250 "제공(수령) 회사명" TextCenter
  - averagePrice 120 "경제적가치" Long

#### 이벤트
[E0] 화면 열림 (생성자 L23-25) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L39-41 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L44-47 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L49-66 | 공개 메서드 | 서비스 biz.Biz01_Promo.selectByCompanyYear(companyId, personId, yearText, provideRcvType, overCheck) | 업무 |
| public getGrid() | L69-72 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L27-36 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('provideRcvTypeNm', 150, '제공/수령'),  // L31
  gb.textCenter('targetCompanyNm', 250, '제공(수령) 회사명'),  // L32
  gb.long('averagePrice', 120, '경제적가치'),  // L33
];
```

#### 사용된 버튼들
버튼 사용하지 않음

