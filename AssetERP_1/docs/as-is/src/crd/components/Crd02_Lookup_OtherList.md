# Crd02_Lookup_OtherList

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `biz`
- 파일: `client/vi/crd/Crd02_Lookup_OtherList.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `crd.Crd02_Data.selectByCompareAmt` | Crd02_Lookup_OtherList:89 | [`Crd02_Data.java:38`](../../crd/services/Crd02_Data.md) | [`crd02_data.selectByCompareAmt`](../../crd/sql/crd02_data.md) |

## 테이블

[`biz01_promo`](../../../db/tables/biz.md), [`crd02_data`](../../../db/tables/crd.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Crd02_Lookup_OtherList (`client/vi/crd/Crd02_Lookup_OtherList.java`, 105줄)

- 툴바 `buttonBar`: 데이터가 일치하지 않습니다. 아래 항목들을 다시 확인해주세요.:
- 그리드 `uploadGrid` (buildUploadGrid()):
  - cardNo 150 "카드번호" Text
  - approvalDt 100 "승인일" Date
  - franchiseName 200 "가맹점명" Text
  - sectorName 150 "업종" Text
  - approvalAmount 100 "업로드<br>승인금액" Long
  - provideAmt 100 "내역관리<br>승인금액" Long 편집:"0069B4"

#### 이벤트
[E1] cancelButton[닫기].Select (L45) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L32-36 | 공개 메서드 | 상태 처리 | 업무 |
| private buildUploadGrid() | L69-81 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L83-95 | settings | 서비스 crd.Crd02_Data.selectByCompareAmt(companyId, dataYm) | 업무 |
| private settings() | L38-67 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L97-99 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L101-103 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildUploadGrid = () => [
  gb.text('cardNo', 150, '카드번호'),  // L72
  gb.date('approvalDt', 100, '승인일'),  // L73
  gb.text('franchiseNm', 200, '가맹점명'),  // L74
  gb.text('sectorNm', 150, '업종'),  // L75
  gb.long('approvalAmount', 100, '업로드<br>승인금액'),  // L76
  gb.long('provideAmt', 100, '내역관리<br>승인금액'),  // L77
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

