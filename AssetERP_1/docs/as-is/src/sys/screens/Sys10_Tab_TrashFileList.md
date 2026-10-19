# Sys10_Tab_TrashFileList

- 종류: 화면
- 메뉴: 관리자 > 02. 시스템관리 > 미사용 파일조회 (#1353)
- 파일: `client/vi/sys/Sys10_Tab_TrashFileList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys10_File.findTrashFile` | Sys10_Tab_TrashFileList:164 | [`Sys10_File.java:257`](../../sys/services/Sys10_File.md) | [`sys10_file.findTrashFile`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Sys10_Tab_TrashFileList:175 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`find_orphan_sys10_files`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys10_Tab_TrashFileList (`client/vi/sys/Sys10_Tab_TrashFileList.java`, 206줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton} {deleteAllButton}
- 입력·하위 화면: `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildFileGrid()):
  - parentId 160 "parentId" Long 편집:LongField
  - regDate 100 "등록일" Date
  - fileName 400 "첨부파일" Text
  - serverPath 300 "경로" Text
  - size 50 "용량(KB)" Double
  - actionCell 50 "보기" Cell 편집:viewCell
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L48-79) → settings(), retrieve()
[E1] fileDeleteForm.SubmitComplete (L84) → retrieve()
[E2] retrieveButton[조회].Select (L90) → retrieve()
[E3] deleteAllButton[일괄삭제].Select (L96) → deleteAll()
[E4] msgBox.DialogHide [YES] (L122) → checkFileDelete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buildFileGrid() | L104-158 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 확인창 표시 | 업무 |
| public retrieve() | L160-170 | 생성자,E1,E2,checkFileDelete | 서비스 sys.Sys10_File.findTrashFile | 업무 |
| private checkFileDelete() | L172-197 | E4 | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| private deleteAll() | L199-201 | E3 | 상태 처리 | 업무 |
| public clear() | L203-205 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L81-102 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
```javascript
const buildFileGrid = () => [
  gb.long('parentId', 160, 'parentId', { editor: 'number' }),  // L148
  gb.date('regDate', 100, '등록일'),  // L149
  gb.text('fileNm', 400, '첨부파일'),  // L150
  gb.text('serverPath', 300, '경로'),  // L151
  gb.double('size', 50, '용량(KB)'),  // L152
  // ⚠ 대응 없음 (GridBuilder L153) addCell
  // ⚠ 대응 없음 (GridBuilder L154) addCell
  // ⚠ 대응 없음 (GridBuilder L155) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={deleteAll}>일괄삭제</Button>

