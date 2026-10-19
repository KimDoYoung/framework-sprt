# Sys10_Lookup_File

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `crm`, `ics`, `mkt`
- 파일: `client/vi/sys/Sys10_Lookup_File.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys10_File.selectByParentId` | Sys10_Lookup_File:82 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys10_Lookup_File (`client/vi/sys/Sys10_Lookup_File.java`, 128줄)

- 입력·하위 화면: `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - fileName 270 "첨부파일" Text
  - actionCell 50 "보기" Cell 편집:viewCell
  - actionCell 50 "받기" Cell 편집:downloadCell

#### 이벤트
[E0] 화면 열림 (생성자 L45-77) → show()
[E1] closeButton[닫기].Select (L52) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L40-43 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L79-88 | open | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private buildApprFileGrid() | L90-119 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기 | 업무 |
| public clear() | L125-127 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L121-123 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('fileNm', 270, '첨부파일'),  // L114
  // ⚠ 대응 없음 (GridBuilder L115) addCell
  // ⚠ 대응 없음 (GridBuilder L116) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

