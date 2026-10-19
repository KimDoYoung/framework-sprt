# Icam55_Tab_UserRegAppr

- 종류: 화면
- 메뉴: KFS > 04. ICAM 사용자ID 관리 > 사용자ID 신청서 작성 (#1314)
- 파일: `client/vi/icam/Icam55_Tab_UserRegAppr.java`
- 함께 쓰는 클래스 2개:
  - `Icam55_Edit_UserRegAppr` `client/vi/icam/Icam55_Edit_UserRegAppr.java`
  - `Icam55_Lookup_RegContent` `client/vi/icam/Icam55_Lookup_RegContent.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.deleteByApprId` | Icam55_Tab_UserRegAppr:486 | [`Apr01_Appr.java:996`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md), [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md), [`apr03_relate_fund.deleteByApprId`](../../apr/sql/apr03_relate_fund.md), [`apr04_appr_step.deleteByApprId`](../../apr/sql/apr04_appr_step.md), [`apr11_advert_book.deleteByApprId`](../../apr/sql/apr11_advert_book.md), [`opr01_create.updateApprIdByApprId`](../../opr/sql/opr01_create.md), [`pln02_plan.updateApprIdByApprId`](../../pln/sql/pln02_plan.md), [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), [`sys10_file.deleteCheck`](../../sys/sql/sys10_file.md) |
| `apr.Apr01_Appr.selectById` | Icam55_Tab_UserRegAppr:219 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Icam55_Tab_UserRegAppr:270 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `icam.Icam55_IcamUser.delete` | Icam55_Tab_UserRegAppr:521 | [`Icam55_IcamUser.java:185`](../../icam/services/Icam55_IcamUser.md) | `UpdateDataModel(icam55_icam_user)` 동적 DELETE |
| `icam.Icam55_IcamUser.deleteApprId` | Icam55_Tab_UserRegAppr:511 | [`Icam55_IcamUser.java:64`](../../icam/services/Icam55_IcamUser.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md) |
| `icam.Icam55_IcamUser.selectBySearchText` | Icam55_Tab_UserRegAppr:321 | [`Icam55_IcamUser.java:26`](../../icam/services/Icam55_IcamUser.md) | [`icam55_icam_user.selectBySearchText`](../../icam/sql/icam55_icam_user.md) |
| `icam.Icam55_IcamUser.update` | Icam55_Edit_UserRegAppr:263, Icam55_Lookup_RegContent:121 | [`Icam55_IcamUser.java:180`](../../icam/services/Icam55_IcamUser.md) | `UpdateDataModel(icam55_icam_user)` 동적 INSERT/UPDATE → [`icam55_icam_user.selectById`](../../icam/sql/icam55_icam_user.md) |
| `icam.Icam55_IcamUser.updateApprId` | Icam55_Tab_UserRegAppr:290 | [`Icam55_IcamUser.java:76`](../../icam/services/Icam55_IcamUser.md) | [`icam55_icam_user.updateApprId`](../../icam/sql/icam55_icam_user.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr11_advert_book`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`icam55_icam_user`](../../../db/tables/icam.md), [`opr01_create`](../../../db/tables/opr.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`pln02_plan`](../../../db/tables/pln.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icam55_Tab_UserRegAppr (`client/vi/icam/Icam55_Tab_UserRegAppr.java`, 582줄)

- 레이아웃: center=vlc, south=editForm
- 툴바 `buttonBar`: 신청일자: {startDate} ~: {closeDate} 검색: {searchText} {resultCheckBox} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="회사명/사용자/처리상세", `resultCheckBox` CheckBox, `editForm` Icam55_Edit_UserRegAppr, `editor` Apr01_Edit_ApprDoc, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - regDate 100 "신청일자" Date
  - companyName 300 "회사명" Text
  - userName 150 "사용자" Text
  - procAddYnStr 80 "추가" TextCenter
  - procModiYnStr 80 "변경" TextCenter
  - procdelYnStr 80 "삭제" TextCenter
  - apprStatusName 100 "결재상태" TextCenter
  - actionCell 60 "결재요청" Cell 편집:actionCell
  - actionCell 60 "문서보기" Cell 편집:viewCell
  - regEmpName 80 "등록자" TextCenter
  - procStateName 100 "처리결과" TextCenter
  - procDate 100 "처리일자" Date
  - procEmpName 80 "처리자" TextCenter
  - procNote 300 "처리상세" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L79-118) → retrieveDoc(), settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L135) → retrieve()
[E2] retrieveButton[조회].Select (L144) → retrieve()
[E3] insertButton[등록].Select (L151) → insertRow()
[E4] deleteButton[삭제].Select (L165) → deleteCheck()
       └ [E7] msgBox.DialogHide [YES] (L468) → delete()
[E5] grid.SelectionChanged [선택>0] (L172) → retrieveEditPage()
[E6] msgBox.DialogHide [YES] (L355) → aprDelete(), updateApprId()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveEditPage() | L188-204 | E5 | 상태 처리 | 업무 |
| private retrieveDoc() | L269-287 | 생성자 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private updateApprId() | L289-301 | E6,insertLinkApproval | 서비스 icam.Icam55_IcamUser.updateApprId(apprId, icamUserId) | 업무 |
| public retrieve() | L303-334 | 생성자,E1,E2,buildGrid,updateApprId | 서비스 icam.Icam55_IcamUser.selectBySearchText(searchText, companyId, startDate, closeDate, procResult, regType) | 업무 |
| private insertLinkApproval() | L336-397 | buildGrid | 팝업 Apr01_Edit_ApprDoc 열기, 확인창 표시 | 업무 |
| public insertRow() | L399-411 | E3 | 상태 처리 | 업무 |
| private deleteCheck() | L447-483 | E4 | ConfirmBox → E7 | 업무 |
| private aprDelete() | L485-502 | E6 | 서비스 apr.Apr01_Appr.deleteByApprId | 업무 |
| private delete() | L504-528 | E7 | GridDeleteData icam.Icam55_IcamUser.deleteApprId, icam.Icam55_IcamUser.delete(체크된 행 목록) | 업무 |
| public createMapping() | L530-547 | insertLinkApproval | 상태 처리 | 업무 |
| private checkStringNull() | L549-557 | createMapping | 상태 처리 | 업무 |
| private checkBooleanNull() | L559-567 | createMapping | 상태 처리 | 업무 |
| private settings() | L120-186 | 생성자 | 이벤트 연결, 초기값: resultCheckBox=true("미처리만 조회"), startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L206-267 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L569-572 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L574-576 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L578-580 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L250 newHeaderGroupMap04newHeaderGroupConfigsetHtmlGridStyle13 100 "처리구분" (icam55_new_header_group_map04new_header_group_configset_html_grid_style13 컬럼 없음)
  gb.date('regDate', 100, '신청일자'),  // L251
  gb.text('companyNm', 300, '회사명'),  // L252
  gb.text('userNm', 150, '사용자'),  // L253
  gb.textCenter('procAddYnStr', 80, '추가'),  // L254 SQL 계산 컬럼(selectById: CASE WHEN COALESCE(icam55_proc_add_yn ,…)
  gb.textCenter('procModiYnStr', 80, '변경'),  // L255 SQL 계산 컬럼(selectById: CASE WHEN COALESCE(icam55_proc_modi_yn,…)
  gb.textCenter('procDelYnStr', 80, '삭제'),  // L256 SQL 계산 컬럼(selectById: CASE WHEN COALESCE(icam55_proc_del_yn ,…)
  gb.textCenter('apprStatusNm', 100, '결재상태'),  // L257 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', apr01.apr01_sta…)
  // ⚠ 대응 없음 (GridBuilder L258) addCell
  // ⚠ 대응 없음 (GridBuilder L259) addCell
  gb.textCenter('regEmpNm', 80, '등록자'),  // L260 SQL 계산 컬럼(selectById: f_emp_kor_nm(icam55_reg_emp_id))
  gb.textCenter('procStateNm', 100, '처리결과'),  // L261 SQL 계산 컬럼(selectById: f_cdnm('ProcStateCode', icam55_proc_sta…)
  gb.date('procDate', 100, '처리일자'),  // L262
  gb.textCenter('procEmpNm', 80, '처리자'),  // L263 SQL 계산 컬럼(selectById: f_emp_kor_nm(icam55_proc_emp_id))
  gb.textArea('procNote', 300, '처리상세'),  // L264
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteCheck}>삭제</Button>

### Icam55_Edit_UserRegAppr (`client/vi/icam/Icam55_Edit_UserRegAppr.java`, 305줄)

- 툴바 `toolBar`: {anchor}
- 입력·하위 화면: `regDate` MyDateField, `companyName` TextField, `userName` TextField, `procAddYn` CheckBox, `procModiYn` CheckBox, `procdelYn` CheckBox, `regContent` MyTextArea, `regEmpId` LongField, `regEmpName` TextField, `regType` TextField, `apprStatusCode` TextField, `lookupRegContent` Icam55_Lookup_RegContent

#### 이벤트
[E0] 화면 열림 (생성자 L85-119) → getEditor()
[E1] updateButton[저장].Select (L100) → updateRow()
[E2] anchor.MouseDown (L125) → 인라인 L125-139 (new MouseDownHandler() { @Override pu…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L121-192 | 생성자 | 조회창 Icam55_Lookup_RegContent 열기 | 업무 |
| public retrieve() | L194-207 | 공개 메서드 | 상태 처리 | 업무 |
| public updateRow() | L209-277 | E1 | 서비스 icam.Icam55_IcamUser.update | 업무 |
| public init() | L279-281 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlStyle() | L294-296 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L298-300 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L302-304 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateRow}>저장</Button>

### Icam55_Lookup_RegContent (`client/vi/icam/Icam55_Lookup_RegContent.java`, 153줄)

- 입력·하위 화면: `regContent` MyTextArea, `apprStatusCode` TextField

#### 이벤트
[E1] updateButton[저장].Select (L85) → update()
[E2] closeButton[닫기].Select (L91) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L55-102 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L104-132 | E1 | 서비스 icam.Icam55_IcamUser.update | 업무 |
| private setHtml() | L134-137 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L149-151 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

