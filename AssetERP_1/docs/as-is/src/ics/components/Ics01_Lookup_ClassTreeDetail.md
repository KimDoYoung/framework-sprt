# Ics01_Lookup_ClassTreeDetail

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `sch`, `tdm`
- 파일: `client/vi/ics/Ics01_Lookup_ClassTreeDetail.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ics01_Page_IcsFile`](../../ics/components/Ics01_Page_IcsFile.md), [`Ics01_Page_RevisionHistory`](../../ics/components/Ics01_Page_RevisionHistory.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics01_ClassTree.selectById` | Ics01_Lookup_ClassTreeDetail:66 | [`Ics01_ClassTree.java:22`](../../ics/services/Ics01_ClassTree.md) | [`ics01_class_tree.selectById`](../../ics/sql/ics01_class_tree.md) |

## 테이블

[`ics01_class_tree`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md)

## DB 함수

`f_cdnm`, `f_get_deadline_nm`, `f_get_ics_nm`, `f_ics_class_tree_nm_allpath`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics01_Lookup_ClassTreeDetail (`client/vi/ics/Ics01_Lookup_ClassTreeDetail.java`, 166줄)

- 입력·하위 화면: `title` MyTextArea, `content` MyTextArea, `relatedLaw` MyTextArea, `submitTo` MyTextArea, `deadlineName` MyTextArea, `pageIcsFile` Ics01_Page_IcsFile, `pageRevisionHistory` Ics01_Page_RevisionHistory

#### 이벤트
[E0] 화면 열림 (생성자 L41-52) → getEditor(), show()
[E1] closeButton[닫기].Select (L95) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L54-77 | 공개 메서드 | 서비스 ics.Ics01_ClassTree.selectById(classTreeId) | 업무 |
| private getEditor() | L103-156 | 생성자 | 상태 처리 | 업무 |
| private settings() | L79-101 | open | 이벤트 연결, 초기값: title="(" + classTreeModel.getClassTreeCode(("법규명"), content=classTreeModel.getContent(("상세내용"), relatedLaw=classTreeModel.getRelatedLaw(("관련조문"), submitTo=classTreeModel.getSubmitTo(("제출처"), deadlineName=classTreeModel.getDeadlineName(("기한") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L158-160 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L162-164 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

