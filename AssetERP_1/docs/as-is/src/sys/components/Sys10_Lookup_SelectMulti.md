# Sys10_Lookup_SelectMulti

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `bbs`, `pln`
- 파일: `client/vi/sys/Sys10_Lookup_SelectMulti.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys10_File.selectByParentId` | Sys10_Lookup_SelectMulti:161 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Sys10_Lookup_SelectMulti:175 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys10_Lookup_SelectMulti (`client/vi/sys/Sys10_Lookup_SelectMulti.java`, 198줄)

- 그리드 `grid` (buildGrid()):
  - fileName 300 "파일명" Text
  - size 60 "Size(KB)" Double
  - actionCell 80 "파일받기" Cell 편집:downloadCell
  - actionCell 80 "파일삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L44-46) → makeLayout()
[E1] uploadForm.SubmitComplete (L60) → retrieve()
[E2] uploadButton[파일등록].Select (L69) → fileUpload()
[E3] fileDeleteForm.SubmitComplete (L85) → retrieve()
[E4] fileUploadField.Change (L110) → 인라인 L110-115 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private fileUpload() | L102-118 | E2 | 상태 처리 | 업무 |
| public retrieve() | L153-155 | E1,E3,checkFileDelete | 상태 처리 | 업무 |
| public retrieve() | L157-162 | E1,E3,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| public changeViewLayout() | L164-170 | 공개 메서드 | 상태 처리 | 업무 |
| private checkFileDelete() | L172-197 | buildGrid | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| private makeLayout() | L55-100 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L121-151 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fileNm', 300, '파일명'),  // L127
  gb.double('size', 60, 'Size(KB)'),  // L128
  // ⚠ 대응 없음 (GridBuilder L140) addCell
  // ⚠ 대응 없음 (GridBuilder L148) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={fileUpload}>파일등록</Button>

