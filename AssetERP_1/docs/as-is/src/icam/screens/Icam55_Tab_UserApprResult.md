# Icam55_Tab_UserApprResult

- 종류: 화면
- 메뉴: KFS > 04. ICAM 사용자ID 관리 > 사용자ID 처리결과 등록 (#1316)
- 파일: `client/vi/icam/Icam55_Tab_UserApprResult.java`
- 함께 쓰는 클래스 1개:
  - `Icam55_Lookup_UserApprResult` `client/vi/icam/Icam55_Lookup_UserApprResult.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Icam55_Tab_UserApprResult:178 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `icam.Icam55_IcamUser.selectByDate` | Icam55_Tab_UserApprResult:250 | [`Icam55_IcamUser.java:39`](../../icam/services/Icam55_IcamUser.md) | [`icam55_icam_user.selectByDate`](../../icam/sql/icam55_icam_user.md) |
| `icam.Icam55_IcamUser.update` | Icam55_Tab_UserApprResult:260 | [`Icam55_IcamUser.java:180`](../../icam/services/Icam55_IcamUser.md) | `UpdateDataModel(icam55_icam_user)` 동적 INSERT/UPDATE → [`icam55_icam_user.selectById`](../../icam/sql/icam55_icam_user.md) |
| `icam.Icam55_IcamUser.updateResult` | Icam55_Lookup_UserApprResult:141 | [`Icam55_IcamUser.java:103`](../../icam/services/Icam55_IcamUser.md) | [`icam55_icam_user.updateResult`](../../icam/sql/icam55_icam_user.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`icam55_icam_user`](../../../db/tables/icam.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icam55_Tab_UserApprResult (`client/vi/icam/Icam55_Tab_UserApprResult.java`, 310줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 신청일자: {startDate} ~: {closeDate} 신청서구분: {icamUserRegComboBox} 검색: {searchText} {resultCheckBox} {retrieveButton} {updateButton} {allUpdateButton}
- 입력·하위 화면: `icamUserRegComboBox` ComboBoxField("IcamUserRegType", "%", "전체") 빈칸="전체", `resultCheckBox` CheckBox, `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="회사명/사용자/처리결과/처리상세", `procStateComboBox` ComboBoxField("ProcStateCode", "(선택안함)"), `editor` Apr01_Edit_ApprDoc, `lookupResult` Icam55_Lookup_UserApprResult
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - regDate 100 "신청일자" Date
  - regTypeName 300 "신청서구분" Text
  - companyName 300 "회사명" Text
  - userName 150 "사용자" Text
  - procTypeName 100 "처리구분" Text
  - actionCell 60 "문서보기" Cell 편집:viewCell
  - regEmpName 80 "등록자" Text
  - procStateName 100 "처리결과" Text 편집:"0069B4"
  - procDate 100 "처리일자" Date 편집:"0069B4"
  - procEmpName 80 "처리자" Text
  - procNote 300 "처리상세" TextArea 편집:TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L67-100) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L118) → retrieve()
[E2] retrieveButton[조회].Select (L127) → retrieve()
[E3] updateButton[저장].Select (L134) → update()
[E4] allUpdateButton[일괄저장].Select (L141) → openLookupResult()
[E5] procStateComboBox[ProcStateCode].Collapse (L152) → 인라인 L152-172 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L225-256 | 생성자,E1,E2,buildGrid,update,openLookupResult | 서비스 icam.Icam55_IcamUser.selectByDate(searchText, companyId, startDate, closeDate, procResult, regType) | 업무 |
| private update() | L258-271 | E3 | 서비스 icam.Icam55_IcamUser.update | 업무 |
| private openLookupResult() | L274-295 | E4 | 조회창 Icam55_Lookup_UserApprResult 열기, 미선택 시 alert "선택된 내역이 없습니다." | 업무 |
| private settings() | L102-147 | 생성자 | 이벤트 연결, 초기값: resultCheckBox=true("미처리만 조회"), startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L149-223 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "관련 상신문서가 존재하지 않습니다", 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L297-300 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L302-304 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L306-308 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '신청일자'),  // L210
  gb.text('regTypeName', 300, '신청서구분'),  // L211 SQL 계산 컬럼(selectByDate: f_cdnm('IcamUserRegType', icam55_reg_Ty…)
  gb.text('companyNm', 300, '회사명'),  // L212
  gb.text('userNm', 150, '사용자'),  // L213
  gb.text('procTypeNm', 100, '처리구분'),  // L214 SQL 계산 컬럼(selectById: CONCAT(CASE WHEN icam55_proc_add_yn = '…)
  // ⚠ 대응 없음 (GridBuilder L215) addCell
  gb.text('regEmpNm', 80, '등록자'),  // L216 SQL 계산 컬럼(selectById: f_emp_kor_nm(icam55_reg_emp_id))
  gb.text('procStateNm', 100, '처리결과', { editor: 'select' }),  // L217 SQL 계산 컬럼(selectById: f_cdnm('ProcStateCode', icam55_proc_sta…)
  gb.date('procDate', 100, '처리일자', { editor: 'date' }),  // L218
  gb.text('procEmpNm', 80, '처리자'),  // L219 SQL 계산 컬럼(selectById: f_emp_kor_nm(icam55_proc_emp_id))
  gb.textArea('procNote', 300, '처리상세', { editor: 'largeText' }),  // L220
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="save" onClick={openLookupResult}>일괄저장</Button>

### Icam55_Lookup_UserApprResult (`client/vi/icam/Icam55_Lookup_UserApprResult.java`, 167줄)

- 입력·하위 화면: `procStateName` ComboBoxField("ProcStateCode", "(선택안함)") 빈칸="선택", `procDate` MyDateField, `procNote` MyTextArea

#### 이벤트
[E1] procStateName[처리결과].Collapse (L93) → 인라인 L93-107 (new CollapseHandler() { @Override pub…)
[E2] updateButton[저장].Select (L109) → update()
[E3] closeButton[닫기].Select (L115) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L51-87 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L89-121 | open | 상태 처리 | 업무 |
| public update() | L123-157 | E2 | 서비스 icam.Icam55_IcamUser.updateResult(procStateCode, procDate, procNote, procEmpId) | 업무 |
| private setHtmlStyle() | L159-161 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L163-165 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

