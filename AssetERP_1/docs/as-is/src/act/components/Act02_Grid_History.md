# Act02_Grid_History

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `ast`
- 파일: `client/vi/act/Act02_Grid_History.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act02_Journal.selectByAstClassTreeId` | Act02_Grid_History:44 | [`Act02_Journal.java:55`](../../act/services/Act02_Journal.md) | [`act02_journal.selectByAstClassTreeId`](../../act/sql/act02_journal.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md)

## DB 함수

`f_cdnm`, `f_get_journal_tr_cd`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act02_Grid_History (`client/vi/act/Act02_Grid_History.java`, 57줄)

- 그리드 `grid` (buildGrid()):
  - date 120 "일자" Date
  - astClassTreeNm 300 "자산명" Text
  - trName 200 "거래구분" Text
  - journalAmt 150 "금액" Long
  - note 500 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L19-22) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L36-50 | 공개 메서드 | 서비스 act.Act02_Journal.selectByAstClassTreeId(companyId, astClassTreeId) | 업무 |
| public clear() | L52-54 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L24-34 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 120, '일자'),  // L27
  gb.text('astClassTreeNm', 300, '자산명'),  // L28
  gb.text('trNm', 200, '거래구분'),  // L29
  gb.long('journalAmt', 150, '금액'),  // L30
  gb.text('note', 500, '비고'),  // L31
];
```

#### 사용된 버튼들
버튼 사용하지 않음

