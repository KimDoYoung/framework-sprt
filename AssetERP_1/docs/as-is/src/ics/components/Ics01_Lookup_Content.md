# Ics01_Lookup_Content

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `sch`
- 파일: `client/vi/ics/Ics01_Lookup_Content.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics01_ClassTree.modelUpdate` | Ics01_Lookup_Content:98 | [`Ics01_ClassTree.java:309`](../../ics/services/Ics01_ClassTree.md) | `UpdateDataModel(ics01_class_tree)` 동적 INSERT/UPDATE → [`ics01_class_tree.selectById`](../../ics/sql/ics01_class_tree.md) |

## 테이블

[`ics01_class_tree`](../../../db/tables/ics.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics01_Lookup_Content (`client/vi/ics/Ics01_Lookup_Content.java`, 118줄)

- 입력·하위 화면: `content` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L59-84) → getEditor(), show()
[E1] updateButton[저장].Select (L65) → update()
[E2] closeButton[닫기].Select (L71) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L39-50 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L52-57 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L86-95 | 생성자 | 상태 처리 | 업무 |
| public update() | L97-113 | E1 | 서비스 ics.Ics01_ClassTree.modelUpdate(classTreeModel) | 업무 |
| private setHtmlHeaderStyle() | L115-117 | view,open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

