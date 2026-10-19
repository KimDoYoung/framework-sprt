# Sys15_Lookup_TelInfo

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `pay`
- 파일: `client/vi/sys/Sys15_Lookup_TelInfo.java`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys15_Lookup_TelInfo (`client/vi/sys/Sys15_Lookup_TelInfo.java`, 80줄)

- 입력·하위 화면: `tel` TextField, `addr` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L27-28) → 초기화
[E1] closeButton[닫기].Select (L53) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L30-44 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L46-59 | view | 상태 처리 | 업무 |
| private getEditor() | L61-72 | view | 상태 처리 | 업무 |
| private setHtmlStyle() | L74-76 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L77-79 | view | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

