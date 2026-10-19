# Biz01_Tab_CardUserAllocation

- 종류: 화면
- 메뉴: 자금관리 > 30. 법인카드관리 > 법인카드 실사용자 배분 (#1406)
- 파일: `client/vi/biz/Biz01_Tab_CardUserAllocation.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `biz.Biz01_Promo.selectCardCommonUser` | Biz01_Tab_CardUserAllocation:150 | [`Biz01_Promo.java:101`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.selectCardCommonUser`](../../biz/sql/biz01_promo.md) |
| `biz.Biz01_Promo.updateRealPersonId` | Biz01_Tab_CardUserAllocation:182, Biz01_Tab_CardUserAllocation:197 | [`Biz01_Promo.java:803`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.updateRealPersonId`](../../biz/sql/biz01_promo.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`biz01_promo`](../../../db/tables/biz.md), [`crd01_card`](../../../db/tables/crd.md), [`crd02_data`](../../../db/tables/crd.md), [`crd03_trans`](../../../db/tables/crd.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_emp_kor_nm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Biz01_Tab_CardUserAllocation (`client/vi/biz/Biz01_Tab_CardUserAllocation.java`, 228줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준년월: {dataYMText} {checkBox} {retrieveButton} {selectUpdateButton}
- 입력·하위 화면: `dataYMText` TextField 빈칸="YYYY.MM", `checkBox` CheckBox, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - closeName 70 "마감구분" TextCenter
  - htmlCardName 110 "카드명" Text
  - approvalDt 100 "카드승인일" Date
  - franchiseName 200 "가맹점명" Text
  - sectorName 150 "업종" Text
  - provideAmt 100 "승인금액" Long
  - regEmpName 70 "사용자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L55-123) → retrieve()
[E1] dataYMText.KeyPress [Enter] (L71) → retrieve()
[E2] retrieveButton[조회].Select (L79) → retrieve()
[E3] selectUpdateButton[일괄저장].Select (L85) → selectUpdate()
[E4] dataYMText.KeyPress [Enter] (L102) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L142-158 | 생성자,E1,E2,E4,selectUpdate | 서비스 biz.Biz01_Promo.selectCardCommonUser(dataYm, companyId, managerId, providePurCode, realPersonCheck) | 업무 |
| private selectUpdate() | L160-213 | E3 | 조회창 Emp00_Lookup_SelectSingle 열기, 미선택 시 alert "선택된 내역이 없습니다.", 서비스 biz.Biz01_Promo.updateRealPersonId, biz.Biz01_Promo.updateRealPersonId(realPersonId, realPersonId) | 업무 |
| private getDataYm() | L215-220 | retrieve | 상태 처리 | 업무 |
| public buildGrid() | L125-140 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L222-224 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L225-227 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('closeNm', 70, '마감구분'),  // L131
  gb.text('htmlCardNm', 110, '카드명'),  // L132
  gb.date('approvalDt', 100, '카드승인일'),  // L133
  gb.text('franchiseNm', 200, '가맹점명'),  // L134
  gb.text('sectorNm', 150, '업종'),  // L135
  gb.long('provideAmt', 100, '승인금액'),  // L136
  gb.textCenter('regEmpNm', 70, '사용자'),  // L137
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={selectUpdate}>일괄저장</Button>

