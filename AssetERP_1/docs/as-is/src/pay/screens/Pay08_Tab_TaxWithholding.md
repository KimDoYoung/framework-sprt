# Pay08_Tab_TaxWithholding

- 종류: 화면
- 메뉴: 경영관리 > 04. 급여관리 > 원천징수영수증(사본) (#1219)
- 파일: `client/vi/pay/Pay08_Tab_TaxWithholding.java`
- 함께 쓰는 클래스 1개:
  - `Pay08_PDFViewer` `client/vi/pay/Pay08_PDFViewer.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `pay.Pay08_TaxWithholding.selectByPersonId` | Pay08_Tab_TaxWithholding:117 | [`Pay08_TaxWithholding.java:34`](../../pay/services/Pay08_TaxWithholding.md) | [`pay08_tax_withholding.selectByPersonId`](../../pay/sql/pay08_tax_withholding.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`pay08_tax_withholding`](../../../db/tables/pay.md), [`sys10_file`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay08_Tab_TaxWithholding (`client/vi/pay/Pay08_Tab_TaxWithholding.java`, 139줄)

- 레이아웃: west=vlc, center=viewer, center=blc
- 툴바 `buttonBar`: {retrieveButton}
- 그리드 `grid` (buildGrid()):
  - fileName 300 "파일명" Text
  - note 200 "비고" Text
  - actionCell 30 "" Cell 편집:downloadCell

#### 이벤트
[E0] 화면 열림 (생성자 L37-69) → settings(), retrieve()
[E1] grid.CellClick (L72) → 인라인 L72-84 (new CellClickHandler() { @Override pu…)
[E2] retrieveButton[조회].Select (L85) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L113-138 | 생성자,E2 | 서비스 pay.Pay08_TaxWithholding.selectByPersonId(personId) | 업무 |
| private settings() | L71-91 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L93-111 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fileNm', 300, '파일명'),  // L106 SQL 계산 컬럼(selectByPersonId: sys10_file_nm)
  gb.text('note', 200, '비고'),  // L107
  // ⚠ 대응 없음 (GridBuilder L108) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Pay08_PDFViewer (`client/vi/pay/Pay08_PDFViewer.java`, 69줄)


#### 이벤트
[E0] 화면 열림 (생성자 L24-28) → show()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L30-32 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L34-68 | view | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

