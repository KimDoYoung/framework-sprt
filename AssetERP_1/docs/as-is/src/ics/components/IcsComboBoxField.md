# IcsComboBoxField

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `sch`
- 파일: `client/vi/ics/IcsComboBoxField.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics01_ClassTree.selectByParentTreeId` | IcsComboBoxField:35 | [`Ics01_ClassTree.java:131`](../../ics/services/Ics01_ClassTree.md) | [`ics01_class_tree.selectByParentTreeId`](../../ics/sql/ics01_class_tree.md) |

## 테이블

[`ics01_class_tree`](../../../db/tables/ics.md)

## DB 함수

`f_cdnm`, `f_get_ics_nm`, `f_ics_class_tree_nm`, `f_ics_class_tree_nm_allpath`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### IcsComboBoxField (`client/vi/ics/IcsComboBoxField.java`, 93줄)


#### 이벤트
[E0] 화면 열림 (생성자 L23-26) → makeComboBoxField()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private makeComboBoxField() | L28-32 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L34-40 | makeComboBoxField | 서비스 ics.Ics01_ClassTree.selectByParentTreeId | 업무 |
| public getClassTreeName() | L42-50 | 공개 메서드 | 상태 처리 | 업무 |
| public getClassTreeId() | L52-60 | 공개 메서드 | 상태 처리 | 업무 |
| public getServiceResult() | L63-92 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

