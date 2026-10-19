# PDFViewer

- 종류: 프레임 (로그인·메인 화면 등, 메뉴로 열지 않음)
- 파일: `client/vi/PDFViewer.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys10_Lookup_File`](../../sys/components/Sys10_Lookup_File.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys10_File.selectByParentId` | PDFViewer:268 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### PDFViewer (`client/vi/PDFViewer.java`, 287줄)

- 툴바 `buttonBar`: {radio01} 기본 양식: {radio02} 증명서 양식: {radio03} 계약서 양식:
- 툴바 `hintBar`: * 한글(HWP)의 일부 특수문자는 지원하지않습니다. (비표준 유니코드문자):
- 입력·하위 화면: `radio01` Radio, `radio02` Radio, `radio03` Radio, `lookup` Sys10_Lookup_File

#### 이벤트
[E0] 화면 열림 (생성자 L82-90) → 초기화
[E1] sendButton[결재요청].Select (L174) → hide()
[E2] cancelButton[닫기].Select (L184) → hide()
[E3] fileButton[첨부파일(0건)].Select (L195) → 인라인 L195-201 (new SelectHandler() { @Override publi…)
[E4] toggle.ValueChange (L241) → 인라인 L241-264 (new ValueChangeHandler<HasValue<Boole…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L92-95 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L97-106 | view,preview | 상태 처리 | 업무 |
| public preview() | L108-112 | 공개 메서드 | 상태 처리 | 업무 |
| public preview() | L114-123 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L125-135 | view,preview | 상태 처리 | 업무 |
| public open() | L137-210 | view,preview | 조회창 Sys10_Lookup_File 열기 | 업무 |
| private radioSetting() | L212-265 | open | 상태 처리 | 업무 |
| private setFileButtonText() | L267-278 | preview | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private setHtmlCheckBoxStyle() | L280-282 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L284-286 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="register" onClick={hide}>결재요청</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="unknown" onClick={() => /* 인라인 L195-201 (new SelectHandler() { @Override publi…) */}>첨부파일(0건)</Button>

