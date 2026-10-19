# Sys60_Tab_FilePolicy

- 종류: 화면
- 메뉴: 관리자 > 09. 기타 > 파일보안정책 (#1500)
- 파일: `client/vi/sys/Sys60_Tab_FilePolicy.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys60_FilePolicy.delete` | Sys60_Tab_FilePolicy:174 | [`Sys60_FilePolicy.java:41`](../../sys/services/Sys60_FilePolicy.md) | `UpdateDataModel(sys60_file_policy)` 동적 DELETE |
| `sys.Sys60_FilePolicy.selectByText` | Sys60_Tab_FilePolicy:128 | [`Sys60_FilePolicy.java:23`](../../sys/services/Sys60_FilePolicy.md) | [`sys60_file_policy.selectByText`](../../sys/sql/sys60_file_policy.md) |
| `sys.Sys60_FilePolicy.update` | Sys60_Tab_FilePolicy:140 | [`Sys60_FilePolicy.java:36`](../../sys/services/Sys60_FilePolicy.md) | `UpdateDataModel(sys60_file_policy)` 동적 INSERT/UPDATE → [`sys60_file_policy.selectById`](../../sys/sql/sys60_file_policy.md) |

## 테이블

[`sys60_file_policy`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys60_Tab_FilePolicy (`client/vi/sys/Sys60_Tab_FilePolicy.java`, 180줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `searchText` TextField 빈칸="확장자/MIME/비고"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - ext 100 "확장자" Text 편집:TextField
  - mimeType 800 "MIME규칙" Text 편집:TextField
  - note 600 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L49-74) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L79) → retrieve()
[E2] retrieveButton[조회].Select (L87) → retrieve()
[E3] insertButton[등록].Select (L93) → insertRow()
[E4] updateButton[저장].Select (L99) → update()
[E5] deleteButton[삭제].Select (L105) → deleteChk()
       └ [E6] msgBox.DialogHide [YES] (L153) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L124-134 | 생성자,E1,E2 | 서비스 sys.Sys60_FilePolicy.selectByText(searchText) | 업무 |
| public update() | L137-141 | E4 | 서비스 sys.Sys60_FilePolicy.update(personId) | 업무 |
| public insertRow() | L144-148 | E3 | 상태 처리 | 업무 |
| private deleteChk() | L150-168 | E5 | ConfirmBox → E6 | 업무 |
| public deleteRow() | L171-175 | E6 | GridDeleteData sys.Sys60_FilePolicy.delete(체크된 행 목록) | 업무 |
| private settings() | L76-111 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L113-121 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L177-179 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('ext', 100, '확장자', { editor: 'text' }),  // L116
  gb.text('mimeType', 800, 'MIME규칙', { editor: 'text' }),  // L117
  gb.text('note', 600, '비고', { editor: 'text' }),  // L118
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

