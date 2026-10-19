# Sch03_Lookup_IcsUser

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `icr`, `ics`
- 파일: `client/vi/sch/Sch03_Lookup_IcsUser.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sch.Sch03_Deadline.selectByClassTreeId` | Sch03_Lookup_IcsUser:101 | [`Sch03_Deadline.java:27`](../../sch/services/Sch03_Deadline.md) | [`sch03_deadline.selectByClassTreeId`](../../sch/sql/sch03_deadline.md) |

## 테이블

[`ics01_class_tree`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md)

## DB 함수

`f_cdnm`, `f_get_deadline_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch03_Lookup_IcsUser (`client/vi/sch/Sch03_Lookup_IcsUser.java`, 107줄)

- 툴바 `iconBar`: {anchor}
- 그리드 `grid` (buildGrid(), 체크박스):
  - cycleName 120 "주기구분" TextCenter
  - deadlineFullName 500 "처리일 정보" Text
  - startDate 100 "시작일" Date
  - closeDate 100 "종료일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L36-38) → 초기화
[E1] anchor.MouseDown (L55) → retrieve()
[E2] closeButton[닫기].Select (L62) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L40-44 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L98-102 | E1,open | 서비스 sch.Sch03_Deadline.selectByClassTreeId(classTreeId) | 업무 |
| private makeLayout() | L46-83 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L86-96 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L104-106 | makeLayout | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('cycleNm', 120, '주기구분'),  // L90 SQL 계산 컬럼(selectByClassTreeId: f_cdnm('CycleCode', sch03_cycle_cd, sch…)
  gb.text('deadlineFullNm', 500, '처리일 정보'),  // L91 SQL 계산 컬럼(selectByClassTreeId: f_get_deadline_nm(sch03_deadline_id, '2…)
  gb.date('startDate', 100, '시작일'),  // L92
  gb.date('closeDate', 100, '종료일'),  // L93
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

