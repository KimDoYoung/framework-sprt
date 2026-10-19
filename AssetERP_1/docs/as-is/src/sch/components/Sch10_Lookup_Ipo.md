# Sch10_Lookup_Ipo

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `frm`
- 파일: `client/vi/sch/Sch10_Lookup_Ipo.java`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch10_Lookup_Ipo (`client/vi/sch/Sch10_Lookup_Ipo.java`, 157줄)

- 입력·하위 화면: `itemName` TextField, `marketName` TextField, `demandStartDate` MyDateField, `demandCloseDate` MyDateField, `subscriptionStartDate` MyDateField, `subscriptionCloseDate` MyDateField, `payDate` MyDateField, `listDate` MyDateField, `price` LongField, `note` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L51-56) → init()
[E1] closeButton[닫기].Select [callback != null] (L90) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L58-74 | 생성자 | 상태 처리 | 업무 |
| private getEditor() | L101-148 | init | 상태 처리 | 업무 |
| private settings() | L76-99 | init | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L150-152 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L154-156 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

