# Flt03_Tab_AccountAdmin

- 종류: 화면
- 메뉴: 준법감시 > 11. 임직원매매(준감인) > 계좌신고현황 (#1488)
- 파일: `client/vi/flt/Flt03_Tab_AccountAdmin.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `flt.Flt03_Account.selectByDate` | Flt03_Tab_AccountAdmin:142 | [`Flt03_Account.java:50`](../../flt/services/Flt03_Account.md) | [`flt03_account.selectByDate`](../../flt/sql/flt03_account.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`flt03_account`](../../../db/tables/flt.md), [`flt06_account_close`](../../../db/tables/flt.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_itemtype_nm`, `f_sysdate`, `getperson`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Flt03_Tab_AccountAdmin (`client/vi/flt/Flt03_Tab_AccountAdmin.java`, 180줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준일: {baseDateField} {closeYnCheckBox} {retrieveButton}
- 입력·하위 화면: `baseDateField` MyDateField, `closeYnCheckBox` CheckBox, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - orgName 150 "본부(부서)" Text
  - personName 100 "사원명" Text
  - corpName 150 "개설기관" Text
  - accountNoDec 150 "계좌번호" Text
  - accountName 80 "계좌명" TextCenter
  - familyRelateName 70 "관계" TextCenter
  - itemTypeName 130 "종목유형" Text
  - setupDate 90 "계좌개설일" Date
  - apprStatusName 80 "상신상태" TextCenter
  - actionCell 60 "보기" Cell 편집:actionCell01
  - closeDate 90 "계좌폐쇄일" Date
  - closeApprStatusName 80 "상신상태" TextCenter
  - actionCell 60 "보기" Cell 편집:actionCell02

#### 이벤트
[E0] 화면 열림 (생성자 L50-73) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L86) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L133-148 | 생성자,E1 | 서비스 flt.Flt03_Account.selectByDate(companyId, personId, setupDate, closeAccountYn), 건수 표시 | 업무 |
| private viewAppr() | L150-172 | buildGrid | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private settings() | L75-92 | 생성자 | 이벤트 연결, 초기값: baseDateField=date, closeYnCheckBox=true("폐쇄계좌 포함") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L94-131 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L174-176 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L177-179 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L110 newHeaderGroupMap08newHeaderGroupConfig13 100 "계좌개설" (flt10_new_header_group_map08new_header_group_config13 컬럼 없음)
  // ⚠DB없음 L111 newHeaderGroupMap011newHeaderGroupConfig13 100 "계좌폐쇄" (flt10_new_header_group_map011new_header_group_config13 컬럼 없음)
  gb.text('orgNm', 150, '본부(부서)'),  // L114
  gb.text('personNm', 100, '사원명'),  // L115
  gb.text('corpNm', 150, '개설기관'),  // L116
  gb.text('accountNoDec', 150, '계좌번호'),  // L117
  gb.textCenter('accountNm', 80, '계좌명'),  // L118
  gb.textCenter('familyRelateNm', 70, '관계'),  // L119
  gb.text('itemTypeNm', 130, '종목유형'),  // L120
  gb.date('setupDate', 90, '계좌개설일'),  // L121
  gb.textCenter('apprStatusNm', 80, '상신상태'),  // L123
  // ⚠ 대응 없음 (GridBuilder L124) addCell
  gb.date('closeDate', 90, '계좌폐쇄일'),  // L125
  gb.textCenter('closeApprStatusNm', 80, '상신상태'),  // L127
  // ⚠ 대응 없음 (GridBuilder L128) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

