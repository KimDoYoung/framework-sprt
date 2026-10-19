# Sch05_Page_RelateIcs

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `ics`
- 파일: `client/vi/sch/Sch05_Page_RelateIcs.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ics01_Lookup_Info`](../../ics/components/Ics01_Lookup_Info.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sch.Sch05_RelateIcs.delete` | Sch05_Page_RelateIcs:63 | [`Sch05_RelateIcs.java:68`](../../sch/services/Sch05_RelateIcs.md) | `UpdateDataModel(sch05_relate_ics)` 동적 DELETE |
| `sch.Sch05_RelateIcs.selectByInfoId` | Sch05_Page_RelateIcs:56 | [`Sch05_RelateIcs.java:26`](../../sch/services/Sch05_RelateIcs.md) | [`sch05_relate_ics.selectByInfoId`](../../sch/sql/sch05_relate_ics.md) |

## 테이블

[`ics01_class_tree`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch05_relate_ics`](../../../db/tables/sch.md)

## DB 함수

`f_cdnm`, `f_get_deadline_nm`, `f_ics_class_tree_nm_allpath`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch05_Page_RelateIcs (`client/vi/sch/Sch05_Page_RelateIcs.java`, 65줄)

- 입력·하위 화면: `lookup` Ics01_Lookup_Info
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - icsClassTreeFullName 410 "법규명" TextArea
  - cycleName 80 "주기" TextArea
  - actionCell 60 "상세보기" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L27-29) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L48-58 | 공개 메서드 | 서비스 sch.Sch05_RelateIcs.selectByInfoId(infoId) | 업무 |
| public delete() | L60-64 | 공개 메서드 | GridDeleteData sch.Sch05_RelateIcs.delete(체크된 행 목록) | 업무 |
| private buildGrid() | L31-46 | 필드 초기화 | 조회창 Ics01_Lookup_Info 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textArea('icsClassTreeFullNm', 410, '법규명'),  // L41 SQL 계산 컬럼(selectByInfoId: f_ics_class_tree_nm_allpath(ics01_class…)
  gb.textArea('cycleNm', 80, '주기'),  // L42 SQL 계산 컬럼(selectByInfoId: f_cdnm('CycleCode', sch03_cycle_cd, sch…)
  // ⚠ 대응 없음 (GridBuilder L43) addCell
];
```

#### 사용된 버튼들
버튼 사용하지 않음

