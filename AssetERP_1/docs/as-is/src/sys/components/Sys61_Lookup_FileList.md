# Sys61_Lookup_FileList

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `apr`
- 파일: `client/vi/sys/Sys61_Lookup_FileList.java`
- 함께 쓰는 클래스 1개:
  - `Sys61_TabPage_DelList` `client/vi/sys/Sys61_TabPage_DelList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Lookup_ApprFileList`](../../apr/components/Apr01_Lookup_ApprFileList.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Sys61_Lookup_FileList:178 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `sys.Sys10_File.selectByParentId` | Sys61_Lookup_FileList:267 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys61_FileDel.insert` | Sys61_Lookup_FileList:250 | [`Sys61_FileDel.java:34`](../../sys/services/Sys61_FileDel.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys10_file.updateParentId`](../../sys/sql/sys10_file.md), [`sys61_file_del.insert`](../../sys/sql/sys61_file_del.md) |
| `sys.Sys61_FileDel.recovery` | Sys61_TabPage_DelList:152 | [`Sys61_FileDel.java:59`](../../sys/services/Sys61_FileDel.md) | [`sys10_file.updateParentId`](../../sys/sql/sys10_file.md), [`sys61_file_del.deleteByFileDelId`](../../sys/sql/sys61_file_del.md) |
| `sys.Sys61_FileDel.selectByParentId` | Sys61_TabPage_DelList:171 | [`Sys61_FileDel.java:28`](../../sys/services/Sys61_FileDel.md) | [`sys61_file_del.selectByParentId`](../../sys/sql/sys61_file_del.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys61_file_del`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys61_Lookup_FileList (`client/vi/sys/Sys61_Lookup_FileList.java`, 317줄)

- 툴바 `buttonBar`: 등록된 첨부파일: {insertButton} {deleteButton} {optionsButton} {fileUploadForm}
- 입력·하위 화면: `tabPage` Sys61_TabPage_DelList, `lookup` Apr01_Lookup_ApprFileList, `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildGrid(), 체크박스):
  - fileName 270 "첨부파일" Text
  - actionCell 50 "보기" Cell 편집:viewCell
  - actionCell 50 "받기" Cell 편집:downloadCell

#### 이벤트
[E0] 화면 열림 (생성자 L88-160) → execute(), settings(), show()
[E1] fileUpload.Change (L108) → 인라인 L108-115 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L117) → retrieve()
[E3] insertButton[추가].Select (L163) → 인라인 L163-168 (new SelectHandler() { @Override publi…)
[E4] deleteButton[삭제].Select (L169) → deleteChk01()
       └ [E7] msgBox.DialogHide [YES] (L212) → deleteChk02()
[E5] optionsButton[옵션설정].Select (L175) → execute()
[E6] closeButton[닫기].Select (L200) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L64-66 | 생성자,E5,deleteChk02,retrieve,buildGrid | 상태 처리 | 업무 |
| public open() | L81-86 | 공개 메서드 | 상태 처리 | 업무 |
| private deleteChk01() | L209-227 | E4 | ConfirmBox → E7 | 업무 |
| private deleteChk02() | L229-242 | E7 | 상태 처리 | 업무 |
| private deleteRow() | L244-262 | deleteChk02 | 서비스 sys.Sys61_FileDel.insert(personId, reason) | 업무 |
| public retrieve() | L264-273 | E2,execute,open,deleteRow | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| public clear() | L310-312 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L162-207 | 생성자 | 조회창 Apr01_Lookup_ApprFileList 열기, 서비스 apr.Apr01_Appr.selectById(apprId), 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L275-304 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L306-308 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L314-316 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fileNm', 270, '첨부파일'),  // L299
  // ⚠ 대응 없음 (GridBuilder L300) addCell
  // ⚠ 대응 없음 (GridBuilder L301) addCell
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={() => /* 인라인 L163-168 (new SelectHandler() { @Override publi…) */}>추가</Button>
2. <Button type="delete" onClick={deleteChk01}>삭제</Button>
3. <Button type="unknown" onClick={execute}>옵션설정</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Sys61_TabPage_DelList (`client/vi/sys/Sys61_TabPage_DelList.java`, 182줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 삭제된 첨부파일: {deleteButton}
- 입력·하위 화면: `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `grid` (buildGrid(), 체크박스):
  - fileName 270 "첨부파일" Text
  - actionCell 50 "보기" Cell 편집:viewCell
  - actionCell 50 "받기" Cell 편집:downloadCell
  - personName 100 "삭제자" TextCenter
  - delDate 150 "삭제일시" DateTime
  - actionCell 50 "사유" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L53-73) → settings()
[E1] deleteButton[복구].Select (L76) → deleteChk()
       └ [E2] msgBox.DialogHide [YES] (L128) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private deleteChk() | L125-144 | E1 | ConfirmBox → E2 | 업무 |
| private deleteRow() | L146-163 | E2 | 서비스 sys.Sys61_FileDel.recovery(personId) | 업무 |
| public retrieve() | L165-177 | 공개 메서드 | 서비스 sys.Sys61_FileDel.selectByParentId(parentId) | 업무 |
| private settings() | L75-82 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L84-123 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L179-181 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fileNm', 270, '첨부파일'),  // L115 SQL 계산 컬럼(selectByParentId: sys10_file_nm)
  // ⚠ 대응 없음 (GridBuilder L116) addCell
  // ⚠ 대응 없음 (GridBuilder L117) addCell
  gb.textCenter('personNm', 100, '삭제자'),  // L118 SQL 계산 컬럼(selectByParentId: f_emp_kor_nm(sys61_person_id))
  gb.dateTime('delDate', 150, '삭제일시'),  // L119
  // ⚠ 대응 없음 (GridBuilder L120) addCell
];
```

#### 사용된 버튼들
1. <Button type="reset" onClick={deleteChk}>복구</Button>

