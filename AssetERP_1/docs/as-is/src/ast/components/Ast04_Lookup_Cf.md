# Ast04_Lookup_Cf

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `frm`
- 파일: `client/vi/ast/Ast04_Lookup_Cf.java`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast04_Lookup_Cf (`client/vi/ast/Ast04_Lookup_Cf.java`, 97줄)

- 입력·하위 화면: `trName` TextField, `corpNm` TextField, `contAmt` LongField, `tax` LongField, `settleAmt` LongField

#### 이벤트
[E0] 화면 열림 (생성자 L55-73) → getEditor(), show()
[E1] closeButton[닫기].Select (L62) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L32-35 | 공개 메서드 | 상태 처리 | 업무 |
| private modelSettings() | L37-53 | open | 상태 처리 | 업무 |
| private getEditor() | L75-87 | 생성자 | 상태 처리 | 업무 |
| private setHtmlStyle() | L89-91 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L93-95 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

