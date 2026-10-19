# Org02_View_Chart

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `emp`
- 파일: `client/vi/org/Org02_View_Chart.java`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Org02_View_Chart (`client/vi/org/Org02_View_Chart.java`, 193줄)

- 레이아웃: center=cp2

#### 이벤트
[E0] 화면 열림 (생성자 L61-66) → 초기화
[E1] zoomDecButton[작게].Select (L93) → 인라인 L93-98 (new SelectHandler() { @Override publi…)
[E2] zoomResetButton[초기화].Select (L99) → 인라인 L99-104 (new SelectHandler() { @Override publi…)
[E3] zoomIncButton[크게].Select (L105) → 인라인 L105-110 (new SelectHandler() { @Override publi…)
[E4] closeButton[닫기].Select (L111) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L85-148 | 미사용 후보 | 상태 처리 | 업무 |
| public getServiceResult() | L152-157 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlStyle() | L161-163 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L165-167 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={() => /* 인라인 L93-98 (new SelectHandler() { @Override publi…) */}>작게</Button>
2. <Button type="reset" onClick={() => /* 인라인 L99-104 (new SelectHandler() { @Override publi…) */}>초기화</Button>
3. <Button type="unknown" onClick={() => /* 인라인 L105-110 (new SelectHandler() { @Override publi…) */}>크게</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

