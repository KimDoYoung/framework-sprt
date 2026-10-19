# Icam55_Tab_UserStopAuthAppr

- 종류: 화면
- 메뉴: KFS > 04. ICAM 사용자ID 관리 > 미사용ID 권한정지 신청 (#1315)
- 파일: `client/vi/icam/Icam55_Tab_UserStopAuthAppr.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Icam55_Tab_UserStopAuthAppr:239 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Icam55_Tab_UserStopAuthAppr:518 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `icam.Icam55_IcamUser.delete` | Icam55_Tab_UserStopAuthAppr:436 | [`Icam55_IcamUser.java:185`](../../icam/services/Icam55_IcamUser.md) | `UpdateDataModel(icam55_icam_user)` 동적 DELETE |
| `icam.Icam55_IcamUser.deleteApprId` | Icam55_Tab_UserStopAuthAppr:426 | [`Icam55_IcamUser.java:64`](../../icam/services/Icam55_IcamUser.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md) |
| `icam.Icam55_IcamUser.selectBySearchText` | Icam55_Tab_UserStopAuthAppr:303 | [`Icam55_IcamUser.java:26`](../../icam/services/Icam55_IcamUser.md) | [`icam55_icam_user.selectBySearchText`](../../icam/sql/icam55_icam_user.md) |
| `icam.Icam55_IcamUser.update` | Icam55_Tab_UserStopAuthAppr:350 | [`Icam55_IcamUser.java:180`](../../icam/services/Icam55_IcamUser.md) | `UpdateDataModel(icam55_icam_user)` 동적 INSERT/UPDATE → [`icam55_icam_user.selectById`](../../icam/sql/icam55_icam_user.md) |
| `icam.Icam55_IcamUser.updateApprIds` | Icam55_Tab_UserStopAuthAppr:502 | [`Icam55_IcamUser.java:88`](../../icam/services/Icam55_IcamUser.md) | [`icam55_icam_user.updateApprId`](../../icam/sql/icam55_icam_user.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`icam55_icam_user`](../../../db/tables/icam.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icam55_Tab_UserStopAuthAppr (`client/vi/icam/Icam55_Tab_UserStopAuthAppr.java`, 595줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준 분기: {yearText} {quarterComboBox} 분기: 검색: {searchText} {retrieveButton} {updateButton} {insertButton} {deleteButton} {tempDownloadButton} {excelUploadButton} {uploadExcelForm} {downloadForm} {apprButton}
- 입력·하위 화면: `searchText` TextField 빈칸="회사명/사용자/처리상세", `yearText` TextField, `quarterComboBox` StringComboBox, `editor` Apr01_Edit_ApprDoc, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid()):
  - regDate 100 "기준일자" Date
  - companyName 300 "회사명" Text 편집:"0069B4"
  - userId 150 "사용자ID" Text 편집:"0069B4"
  - userName 150 "사용자명" Text 편집:"0069B4"
  - email 150 "이메일" Text 편집:TextField
  - apprStatusName 80 "결재상태" Text
  - actionCell 60 "문서보기" Cell 편집:viewCell
  - regEmpName 80 "등록자" Text
  - procStateName 100 "처리결과" Text
  - procDate 100 "처리일자" Date
  - procEmpName 80 "처리자" Text
  - procNote 300 "처리상세" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L95-132) → retrieveDoc(), settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L162) → retrieve()
[E2] retrieveButton[조회].Select (L171) → retrieve()
[E3] insertButton[등록].Select (L178) → insertRow()
[E4] updateButton[저장].Select (L185) → update()
[E5] deleteButton[삭제].Select (L192) → deleteCheck()
       └ [E11] msgBox.DialogHide [YES] (L402) → delete()
[E6] apprButton[상신].Select (L199) → insertLinkApprovals()
       └ [E12] msgBox.DialogHide [YES] (L465) → updateApprId()
[E7] tempDownloadButton[템플릿].Select (L206) → 인라인 L206-211 (new SelectHandler(){ @Override public…)
[E8] excelUploadButton[엑셀업로드].Select (L213) → excelUpload()
[E9] uploadExcelForm.SubmitComplete (L226) → retrieve()
[E10] fileUploadField.Change (L371) → 인라인 L371-376 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L286-309 | 생성자,E1,E2,E9,buildGrid,update,updateApprId | 서비스 icam.Icam55_IcamUser.selectBySearchText(searchText, companyId, startDate, closeDate, regType) | 업무 |
| public insertRow() | L311-323 | E3 | 상태 처리 | 업무 |
| private update() | L325-361 | E4 | 서비스 icam.Icam55_IcamUser.update | 업무 |
| private excelUpload() | L363-379 | E8 | 상태 처리 | 업무 |
| private deleteCheck() | L381-417 | E5 | ConfirmBox → E11 | 업무 |
| private delete() | L419-443 | E11 | GridDeleteData icam.Icam55_IcamUser.deleteApprId, icam.Icam55_IcamUser.delete(체크된 행 목록) | 업무 |
| private insertLinkApprovals() | L445-493 | E6 | 팝업 Apr01_Edit_ApprDoc 열기, ConfirmBox → E12 | 업무 |
| private updateApprId() | L495-515 | E12 | 서비스 icam.Icam55_IcamUser.updateApprIds(apprId) | 업무 |
| private retrieveDoc() | L517-535 | 생성자 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private getStdDate() | L537-580 | retrieve,insertRow | 상태 처리 | 업무 |
| private settings() | L134-232 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L234-284 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L582-585 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L587-589 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L591-593 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '기준일자'),  // L270
  gb.text('companyNm', 300, '회사명', { editor: 'text' }),  // L271
  gb.text('userId', 150, '사용자ID', { editor: 'text' }),  // L272
  gb.text('userNm', 150, '사용자명', { editor: 'text' }),  // L273
  gb.text('email', 150, '이메일', { editor: 'text' }),  // L274
  gb.text('apprStatusNm', 80, '결재상태'),  // L275 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', apr01.apr01_sta…)
  // ⚠ 대응 없음 (GridBuilder L276) addCell
  gb.text('regEmpNm', 80, '등록자'),  // L277 SQL 계산 컬럼(selectById: f_emp_kor_nm(icam55_reg_emp_id))
  gb.text('procStateNm', 100, '처리결과'),  // L278 SQL 계산 컬럼(selectById: f_cdnm('ProcStateCode', icam55_proc_sta…)
  gb.date('procDate', 100, '처리일자'),  // L279
  gb.text('procEmpNm', 80, '처리자'),  // L280 SQL 계산 컬럼(selectById: f_emp_kor_nm(icam55_proc_emp_id))
  gb.textArea('procNote', 300, '처리상세'),  // L281
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteCheck}>삭제</Button>
5. <Button type="download" onClick={() => /* 인라인 L206-211 (new SelectHandler(){ @Override public…) */}>템플릿</Button>
6. <Button type="upload" onClick={excelUpload}>엑셀업로드</Button>
7. <Button type="register" onClick={insertLinkApprovals}>상신</Button>

