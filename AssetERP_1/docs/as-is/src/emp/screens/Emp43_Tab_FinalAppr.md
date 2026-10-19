# Emp43_Tab_FinalAppr

- 종류: 화면
- 메뉴: 경영관리 > 05. 인사평가 > 인사평가보고(대표이사) (#1395)
- 파일: `client/vi/emp/Emp43_Tab_FinalAppr.java`
- 함께 쓰는 클래스 1개:
  - `Emp43_Edit_CeoScore` `client/vi/emp/Emp43_Edit_CeoScore.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Emp43_Tab_FinalAppr:248 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Emp43_Tab_FinalAppr:285, Emp43_Tab_FinalAppr:496 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `emp.Emp43_EvalTarget.modelUpdate` | Emp43_Edit_CeoScore:92 | [`Emp43_EvalTarget.java:112`](../../emp/services/Emp43_EvalTarget.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(emp43_eval_target)` 동적 INSERT/UPDATE → [`emp43_eval_target.selectById`](../../emp/sql/emp43_eval_target.md) |
| `emp.Emp43_EvalTarget.selectByTextAdmin` | Emp43_Tab_FinalAppr:237 | [`Emp43_EvalTarget.java:44`](../../emp/services/Emp43_EvalTarget.md) | [`emp43_eval_target.selectByTextAdmin`](../../emp/sql/emp43_eval_target.md) |
| `emp.Emp45_EvalRelateAppr.insertFinal` | Emp43_Tab_FinalAppr:475 | [`Emp45_EvalRelateAppr.java:64`](../../emp/services/Emp45_EvalRelateAppr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp45_eval_relate_appr.insert`](../../emp/sql/emp45_eval_relate_appr.md), [`emp45_eval_relate_appr.selectByTermCode`](../../emp/sql/emp45_eval_relate_appr.md), [`emp45_eval_relate_appr.updateFinalApprId`](../../emp/sql/emp45_eval_relate_appr.md) |
| `emp.Emp45_EvalRelateAppr.selectByTermCode` | Emp43_Tab_FinalAppr:405 | [`Emp45_EvalRelateAppr.java:25`](../../emp/services/Emp45_EvalRelateAppr.md) | [`emp45_eval_relate_appr.selectByTermCode`](../../emp/sql/emp45_eval_relate_appr.md) |
| `emp.Emp45_EvalRelateAppr.updateFinalApprId` | Emp43_Tab_FinalAppr:551 | [`Emp45_EvalRelateAppr.java:106`](../../emp/services/Emp45_EvalRelateAppr.md) | [`emp45_eval_relate_appr.updateFinalApprId`](../../emp/sql/emp45_eval_relate_appr.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Emp43_Tab_FinalAppr:184 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys01_Company.selectById` | Emp43_Tab_FinalAppr:152 | [`Sys01_Company.java:20`](../../sys/services/Sys01_Company.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.updateMainImageId`](../../sys/sql/sys01_company.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp40_eval_list_std`](../../../db/tables/emp.md), [`emp42_eval_grade`](../../../db/tables/emp.md), [`emp43_eval_target`](../../../db/tables/emp.md), [`emp44_eval_write`](../../../db/tables/emp.md), [`emp45_eval_relate_appr`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_empevalgradeid`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `f_trunc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp43_Tab_FinalAppr (`client/vi/emp/Emp43_Tab_FinalAppr.java`, 580줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 평가기간: {dataYearText} 년: {termComboBox} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `dataYearText` TextField, `searchText` TextField 빈칸="조직/직위/성명", `classTreeFullName` LookupTriggerField 빈칸="미선택시 자동으로 관리자가 지정한 문서분류에 상신이 진행됩니다.", `apprStepCode` TextField, `apprStepName` TextField, `termComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode"), `editor` Apr01_Edit_ApprDoc, `lookup01` LookupTriggerField, `lookup02` LookupTriggerField, `lookup` Emp43_Edit_CeoScore, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - orgName 180 "부서" Text
  - personName 100 "성명" TextCenter
  - posName 100 "직위" TextCenter
  - orgHeadName 80 "구분" TextCenter
  - adjustEvalScore 80 "점수" DoubleCenter
  - adjustEvalGrade 80 "등급" TextCenter
  - apprStatus 100 "결과" TextCenter
  - totalOrderReason 100 "평정사유" TextCenter
  - actionCell 30 "" Cell 편집:actionCell01
  - actionCell 30 "" Cell 편집:actionCell02
  - ceoEvalBonus 80 "가점" LongCenter
  - ceoEvalPenalty 80 "감점" LongCenter
  - finalEvalScore 80 "점수" DoubleCenter
  - finalEvalGrade 80 "등급" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L91-134) → settings(), retrieve()
[E1] dataYearText.ValueChange (L145) → retrieve()
[E2] classTreeFullName[문서분류].TriggerClick (L197) → openLookupDoc()
[E3] apprButton[상신].Select (L203) → insertRelateAppr()
[E4] apprOpenButton[문서보기].Select (L245) → 서비스 apr.Apr01_Appr.selectById(apprId)
[E5] termComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L270) → retrieve()
[E6] retrieveButton[조회].Select (L276) → retrieve()
[E7] lookup01.TriggerClick (L308) → 인라인 L308-313 (new TriggerClickHandler() { @Override…)
[E8] lookup02.TriggerClick (L316) → 인라인 L316-321 (new TriggerClickHandler() { @Override…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private defaultName() | L284-303 | settings | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private retrieve() | L381-400 | 생성자,E1,E5,E6,buildGrid,updateFinalApprId | 서비스 emp.Emp43_EvalTarget.selectByTextAdmin(companyId, stdYear, searchText, stdTermCode, stdTermCode) | 업무 |
| private retrieveApprStatus() | L402-455 | retrieve | 서비스 emp.Emp45_EvalRelateAppr.selectByTermCode(companyId, stdYear, searchText, stdTermCode, stdTermCode) | 업무 |
| private openLookupDoc() | L458-467 | E2 | 상태 처리 | 업무 |
| private insertRelateAppr() | L469-492 | E3 | 서비스 emp.Emp45_EvalRelateAppr.insertFinal(companyId, stdYear, stdTermCode, stdTermCode) | 업무 |
| private insertLinkApprovals() | L494-540 | insertRelateAppr | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private getGridList() | L542-548 | insertLinkApprovals | 상태 처리 | 업무 |
| private updateFinalApprId() | L550-562 | insertLinkApprovals | 서비스 emp.Emp45_EvalRelateAppr.updateFinalApprId(relateApprId, finalApprId) | 업무 |
| private settings() | L136-282 | 생성자 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 sys.Sys01_Company.selectById, sys.Sys00_Common.selectByKindGroupCode, emp.Emp43_EvalTarget.selectByTextAdmin, apr.Apr01_Appr.selectById(companyId, stdYear, searchText, stdTermCode, stdTermCode, apprId), 이벤트 연결, 초기값: dataYearText=startYear, dataYearText=DateTimeFormat.getFormat("yyyy" | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L305-379 | 필드 초기화 | 팝업 Emp43_Edit_CeoScore 열기, 미선택 시 alert "상신 중이거나 완료된 문서는 수정이 불가능합니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L564-567 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L569-571 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L573-575 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L577-579 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L358 newHeaderGroupMap02newHeaderGroupConfig14 100 "인사평가 대상자" (emp03_new_header_group_map02new_header_group_config14 컬럼 없음)
  // ⚠DB없음 L359 newHeaderGroupMap06newHeaderGroupConfigsetHtmlGridStyle13 100 "평가결과(상벌가감후)" (emp03_new_header_group_map06new_header_group_configset_html_grid_style13 컬럼 없음)
  // ⚠DB없음 L360 newHeaderGroupMap012newHeaderGroupConfigsetHtmlGridStyle12 100 "대표이사 평가" (emp03_new_header_group_map012new_header_group_configset_html_grid_style12 컬럼 없음)
  // ⚠DB없음 L361 newHeaderGroupMap014newHeaderGroupConfigsetHtmlGridStyle12 100 "최종결과" (emp03_new_header_group_map014new_header_group_configset_html_grid_style12 컬럼 없음)
  gb.text('orgNm', 180, '부서'),  // L363
  gb.textCenter('personNm', 100, '성명'),  // L364
  gb.textCenter('posNm', 100, '직위'),  // L365
  gb.textCenter('orgHeadNm', 80, '구분'),  // L366
  gb.doubleCenter('adjustEvalScore', 80, '점수'),  // L367
  gb.textCenter('adjustEvalGrade', 80, '등급'),  // L368
  gb.textCenter('apprStatus', 100, '결과'),  // L369
  gb.textCenter('totalOrderReason', 100, '평정사유'),  // L370
  // ⚠ 대응 없음 (GridBuilder L371) addCell
  // ⚠ 대응 없음 (GridBuilder L372) addCell
  gb.longCenter('ceoEvalBonus', 80, '가점'),  // L373
  gb.longCenter('ceoEvalPenalty', 80, '감점'),  // L374
  gb.doubleCenter('finalEvalScore', 80, '점수'),  // L375
  gb.textCenter('finalEvalGrade', 80, '등급'),  // L376
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRelateAppr}>상신</Button>
3. <Button type="search" onClick={() => /* 서비스 apr.Apr01_Appr.selectById(apprId) */}>문서보기</Button>

### Emp43_Edit_CeoScore (`client/vi/emp/Emp43_Edit_CeoScore.java`, 112줄)

- 입력·하위 화면: `ceoEvalBonus` LongField, `ceoEvalPenalty` LongField

#### 이벤트
[E1] updateButton[저장].Select (L63) → update()
[E2] closeButton[닫기].Select (L69) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L41-60 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L77-87 | edit | 상태 처리 | 업무 |
| private update() | L89-103 | E1 | 서비스 emp.Emp43_EvalTarget.modelUpdate | 업무 |
| private settings() | L62-75 | edit | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L105-107 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L109-111 | edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

