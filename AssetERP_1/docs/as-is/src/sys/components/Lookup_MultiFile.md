# Lookup_MultiFile

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `bbs`
- 파일: `client/vi/sys/Lookup_MultiFile.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys10_File.selectByParentId` | Lookup_MultiFile:46 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Lookup_MultiFile (`client/vi/sys/Lookup_MultiFile.java`, 227줄)

- 입력·하위 화면: `file` FileUploadField
- 그리드 `grid` (buildGrid()):
  - fileName 300 "파일명" Text
  - actionCell 80 "받기" Cell 편집:downloadFileCell
  - size 80 "크기(KB)" Double
  - actionCell 80 "삭제" Cell 편집:deleteFileCell
  - regDate 100 "등록일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L38-40) → 초기화
[E1] file.Change (L78) → submit()
[E2] formPanel.SubmitComplete (L100) → uploadMessage(), retrieve()
[E3] msgBox.DialogHide [YES] (L180) → 인라인 L180-198 (YES: Long fileId = grid.getSelectionModel().getSelectedItem().getFileId();, NO: default:
					break;)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L42-47 | E2,makeLayout | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private retrieve() | L49-61 | E2,makeLayout | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private submit() | L156-165 | E1 | 상태 처리 | 업무 |
| private download() | L168-174 | buildGrid | 상태 처리 | 업무 |
| private deleteFile() | L177-201 | buildGrid | 확인창 표시 | 업무 |
| public uploadMessage() | L203-209 | E2 | 상태 처리 | 업무 |
| public changeViewLayout() | L211-217 | 공개 메서드 | 상태 처리 | 업무 |
| private makeLayout() | L74-127 | 미사용 후보 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L129-153 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fileNm', 300, '파일명'),  // L146
  // ⚠ 대응 없음 (GridBuilder L147) addCell
  gb.double('size', 80, '크기(KB)'),  // L148
  // ⚠ 대응 없음 (GridBuilder L149) addCell
  gb.date('regDate', 100, '등록일'),  // L150
];
```

#### 사용된 버튼들
버튼 사용하지 않음

