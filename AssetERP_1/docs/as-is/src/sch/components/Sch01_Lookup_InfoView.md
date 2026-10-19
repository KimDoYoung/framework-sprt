# Sch01_Lookup_InfoView

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `frm`
- 파일: `client/vi/sch/Sch01_Lookup_InfoView.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Bbs02_Lookup_File`](../../bbs/components/Bbs02_Lookup_File.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sch.Sch01_Info.selectByDeadLineId` | Sch01_Lookup_InfoView:74 | [`Sch01_Info.java:69`](../../sch/services/Sch01_Info.md) | [`sch01_info.selectByDeadLineId`](../../sch/sql/sch01_info.md) |
| `sys.Sys10_File.selectByParentId` | Sch01_Lookup_InfoView:153 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`sch01_info`](../../../db/tables/sch.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch08_class`](../../../db/tables/sch.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_get_deadline_nm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch01_Lookup_InfoView (`client/vi/sch/Sch01_Lookup_InfoView.java`, 173줄)

- 입력·하위 화면: `title` MyTextArea, `content` MyTextArea, `deadlineFullName` TextField, `note` TextField, `report` TextField, `className` TextField, `infoId` LongField, `lookupFile` Bbs02_Lookup_File

#### 이벤트
[E0] 화면 열림 (생성자 L45-71) → getEditor(), show()
[E1] closeButton[닫기].Select (L52) → hide()
[E2] fileButton[첨부파일 확인].Select (L58) → 인라인 L58-64 (new SelectHandler(){ @Override public…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L73-86 | 공개 메서드 | 서비스 sch.Sch01_Info.selectByDeadLineId | 업무 |
| public open() | L88-90 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L113-150 | 생성자 | 상태 처리 | 업무 |
| private setFileButtonText() | L152-163 | settings | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private settings() | L92-111 | open | 이벤트 연결, 초기값: className=schModel.getClassName(("분류"), title=schModel.getTitle(("일정명"), content=schModel.getContent(("상세내용"), report=schModel.getReport(, deadlineFullName=schModel.getDeadlineName(("기한"), note=schModel.getNote(("비고"), infoId=schModel.getInfoId( | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L165-167 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L169-171 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>
2. <Button type="unknown" onClick={() => /* 인라인 L58-64 (new SelectHandler(){ @Override public…) */}>첨부파일 확인</Button>

