# Apr01_Lookup_ApprFileList

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `sys`
- 파일: `client/vi/apr/Apr01_Lookup_ApprFileList.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys10_File.selectByParentId` | Apr01_Lookup_ApprFileList:187 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.updateOthers` | Apr01_Lookup_ApprFileList:169 | [`Sys10_File.java:634`](../../sys/services/Sys10_File.md) | [`sys10_file.updateOthers`](../../sys/sql/sys10_file.md) |

## 테이블

[`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr01_Lookup_ApprFileList (`client/vi/apr/Apr01_Lookup_ApprFileList.java`, 207줄)

- 툴바 `buttonBar`: >> 첨부파일의 순서를 설정하거나 문서 미리보기 및 PDF생성 시, 파일의 출력여부를 설정합니다.:
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - actionCell 25 "" CellNotSort 편집:upButton
  - fileName 405 "첨부파일" TextNotSort
  - actionCell 25 "" CellNotSort 편집:downButton
  - printYn 120 "파일 표시" Boolean 편집:"456EA6"
  - extYn 120 "확장자 표시" Boolean 편집:"456EA6"

#### 이벤트
[E1] updateButton[저장].Select (L64) → update()
[E2] closeButton[닫기].Select (L70) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L54-91 | 공개 메서드 | 상태 처리 | 업무 |
| public changeRow() | L118-143 | buildGrid | 상태 처리 | 업무 |
| public getSeq() | L145-152 | changeRow | 상태 처리 | 업무 |
| private update() | L154-180 | E1 | 서비스 sys.Sys10_File.updateOthers | 업무 |
| public retrieve() | L182-193 | open,update | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private buildGrid() | L93-116 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L195-198 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L200-202 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L204-206 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L108 newHeaderGroupMap04newHeaderGroupConfigsetHtmlGridStyle12 100 "대외문서" (sys10_new_header_group_map04new_header_group_configset_html_grid_style12 컬럼 없음)
  // ⚠ 대응 없음 (GridBuilder L109) addCellNotSort
  // ⚠ 대응 없음 (GridBuilder L110) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L111) addCellNotSort
  gb.boolean('printYn', 120, '파일 표시'),  // L112
  gb.boolean('extYn', 120, '확장자 표시'),  // L113
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

