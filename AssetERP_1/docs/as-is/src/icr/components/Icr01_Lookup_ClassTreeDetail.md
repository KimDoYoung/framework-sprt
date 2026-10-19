# Icr01_Lookup_ClassTreeDetail

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `sch`, `tdm`
- 파일: `client/vi/icr/Icr01_Lookup_ClassTreeDetail.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Icr01_Page_IcrFile`](../../icr/components/Icr01_Page_IcrFile.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `icr.Icr01_ClassTree.selectById` | Icr01_Lookup_ClassTreeDetail:65 | [`Icr01_ClassTree.java:22`](../../icr/services/Icr01_ClassTree.md) | [`icr01_class_tree.selectById`](../../icr/sql/icr01_class_tree.md) |

## 테이블

[`icr01_class_tree`](../../../db/tables/icr.md), [`sch03_deadline`](../../../db/tables/sch.md)

## DB 함수

`f_cdnm`, `f_get_deadline_nm`, `f_get_icr_nm`, `f_icr_class_tree_nm_allpath`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icr01_Lookup_ClassTreeDetail (`client/vi/icr/Icr01_Lookup_ClassTreeDetail.java`, 147줄)

- 입력·하위 화면: `title` MyTextArea, `content` MyTextArea, `relatedLaw` MyTextArea, `submitTo` MyTextArea, `deadlineName` MyTextArea, `pageIcrFile` Icr01_Page_IcrFile

#### 이벤트
[E0] 화면 열림 (생성자 L40-51) → getEditor(), show()
[E1] closeButton[닫기].Select (L93) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-76 | 공개 메서드 | 서비스 icr.Icr01_ClassTree.selectById(classTreeId) | 업무 |
| private getEditor() | L101-137 | 생성자 | 상태 처리 | 업무 |
| private settings() | L78-99 | open | 이벤트 연결, 초기값: title="(" + classTreeModel.getClassTreeCode(("내규명"), content=classTreeModel.getContent(("상세내용"), relatedLaw=classTreeModel.getRelatedLaw(("관련조문"), submitTo=classTreeModel.getSubmitTo(("제출처"), deadlineName=classTreeModel.getDeadlineName(("기한") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L139-141 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L143-145 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

