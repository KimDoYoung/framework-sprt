# Icam00_Tab_FundExpectDate

- 종류: 화면
- 메뉴: KFS > 10. ICAM 계약사관리 > 펀드예정일정보 (#1374)
- 파일: `client/vi/icam/Icam00_Tab_FundExpectDate.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `icam.Icam00_Common.selectICAM2700` | Icam00_Tab_FundExpectDate:91 | [`Icam00_Common.java:16`](../../icam/services/Icam00_Common.md) | - |

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icam00_Tab_FundExpectDate (`client/vi/icam/Icam00_Tab_FundExpectDate.java`, 102줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준일: {stdDate} {retrieveButton}
- 입력·하위 화면: `stdDate` MyDateField
- 그리드 `grid` (buildGrid()):
  - icamCompanyCode 80 "회사코드" TextCenter
  - icamCompanyName 200 "회사명" Text
  - setupType 80 "설정/상환" TextCenter
  - expectDate 100 "예정일" Date
  - fundName 350 "펀드명" Text
  - fundType 100 "펀드유형" Text
  - note 500 "비고" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L34-58) → setting(), retrieve()
[E1] retrieveButton[조회].Select (L64) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L60-70 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L87-97 | 생성자,E1 | 서비스 icam.Icam00_Common.selectICAM2700(stdDate) | 업무 |
| public buildGrid() | L72-85 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L99-101 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('icamCompanyCd', 80, '회사코드'),  // L76
  gb.text('icamCompanyNm', 200, '회사명'),  // L77
  gb.textCenter('setupType', 80, '설정/상환'),  // L78
  gb.date('expectDate', 100, '예정일'),  // L79
  gb.text('fundNm', 350, '펀드명'),  // L80
  gb.text('fundType', 100, '펀드유형'),  // L81
  gb.textArea('note', 500, '비고'),  // L82
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

