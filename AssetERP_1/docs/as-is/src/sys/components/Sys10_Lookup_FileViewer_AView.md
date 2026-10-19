# Sys10_Lookup_FileViewer_AView

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `scm`
- 파일: `client/vi/sys/Sys10_Lookup_FileViewer_AView.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys10_File.selectByFileId` | Sys10_Lookup_FileViewer_AView:53 | [`Sys10_File.java:45`](../../sys/services/Sys10_File.md) | [`sys10_file.selectById`](../../sys/sql/sys10_file.md) |

## 테이블

[`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys10_Lookup_FileViewer_AView (`client/vi/sys/Sys10_Lookup_FileViewer_AView.java`, 155줄)


#### 이벤트
[E0] 화면 열림 (생성자 L40-47) → 초기화
[E1] closeButton[닫기].Select (L133) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L49-71 | 공개 메서드 | 서비스 sys.Sys10_File.selectByFileId(fileId) | 업무 |
| private openPdf() | L73-87 | open | LabelHtml 래퍼 | 업무 |
| private openOther() | L89-130 | open | 상태 처리 | 업무 |
| private settings() | L132-144 | openPdf,openOther | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L151-153 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

