# Emp00_Popup_Emp

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `frm`
- 파일: `client/vi/emp/Emp00_Popup_Emp.java`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp00_Popup_Emp (`client/vi/emp/Emp00_Popup_Emp.java`, 86줄)


#### 이벤트
[E0] 화면 열림 (생성자 L26-53) → 초기화
[E1] closeButton[닫기].Select (L45) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L55-76 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlStyle() | L78-80 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L82-84 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

