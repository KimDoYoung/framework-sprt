# Sys10_BoxDocList

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `fbx`
- 파일: `client/vi/sys/Sys10_BoxDocList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fbx.Fbx03_File.selectByDcrTreeId` | Sys10_BoxDocList:189 | [`Fbx03_File.java:91`](../../fbx/services/Fbx03_File.md) | [`fbx03_file.selectByDcrTreeId`](../../fbx/sql/fbx03_file.md) |

## 테이블

[`dcr01_class_tree`](../../../db/tables/dcr.md), [`fbx01_box`](../../../db/tables/fbx.md), [`fbx03_file`](../../../db/tables/fbx.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys10_BoxDocList (`client/vi/sys/Sys10_BoxDocList.java`, 229줄)

- 입력·하위 화면: `viewer` Sys10_Lookup_FileViewer
- 그리드 `grid` (buildGrid(), 체크박스):
  - empName 100 "생성자" Text
  - dcrClassName 200 "문서분류" Text
  - crtDate 100 "생성일" Date
  - fileName 200 "파일명" Text
  - actionCell 80 "미리보기" Cell 편집:viewCell
  - actionCell 80 "파일받기" Cell 편집:downloadCell
  - actionCell 80 "파일삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L55-119) → 초기화
[E1] fileDeleteForm.SubmitComplete (L64) → retrieve()
[E2] uploadFileButton[파일업로드].Select (L70) → 메시지 "좌측 문서분류를 재선택해주세요"
[E3] fileUpload.Change (L81) → 인라인 L81-94 (new ChangeHandler() { @Override publi…)
[E4] fileUploadForm.SubmitComplete (L99) → resetFileUpload(), retrieve()
[E5] messageBox.DialogHide [YES] (L147) → 인라인 L147-162 (new DialogHideHandler() { @Override p…)
[E6] fileUpload.Change (L204) → 인라인 L204-218 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L181-195 | E1,E4 | 서비스 fbx.Fbx03_File.selectByDcrTreeId(dcrClassId, boxId, companyId) | 업무 |
| private resetFileUpload() | L197-219 | E4 | 상태 처리 | 업무 |
| public setDcrTypeCode() | L221-223 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L121-179 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 확인창 표시, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('empNm', 100, '생성자'),  // L170 SQL 계산 컬럼(selectByDcrTreeId: f_emp_kor_nm(a.fbx03_emp_id))
  gb.text('dcrClassNm', 200, '문서분류'),  // L171 SQL 계산 컬럼(selectByDcrTreeId: f_class_tree_nm_allpath(a.fbx03_dcr_cla…)
  gb.date('crtDate', 100, '생성일'),  // L172
  gb.text('fileNm', 200, '파일명'),  // L173
  // ⚠ 대응 없음 (GridBuilder L174) addCell
  // ⚠ 대응 없음 (GridBuilder L175) addCell
  // ⚠ 대응 없음 (GridBuilder L176) addCell
];
```

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 메시지 "좌측 문서분류를 재선택해주세요" */}>파일업로드</Button>

