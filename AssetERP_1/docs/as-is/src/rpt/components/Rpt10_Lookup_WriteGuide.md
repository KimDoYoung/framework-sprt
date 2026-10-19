# Rpt10_Lookup_WriteGuide

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `emp`, `org`, `sys`
- 파일: `client/vi/rpt/Rpt10_Lookup_WriteGuide.java`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Rpt10_Lookup_WriteGuide (`client/vi/rpt/Rpt10_Lookup_WriteGuide.java`, 89줄)

- 입력·하위 화면: `writeGuide` MyTextArea, `reviseHistorty` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L34-61) → show()
[E1] closeButton[닫기].Select (L70) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L29-32 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L78-80 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L63-76 | view | 이벤트 연결, 초기값: writeGuide=submitModel.getWriteGuide(("작성요령"), reviseHistorty=submitModel.getReviseHistory(("변경이력") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L82-84 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L86-88 | view | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

