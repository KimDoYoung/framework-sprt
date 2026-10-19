# Emp43_Tab_FirstAppr

- 종류: 화면
- 메뉴: 경영관리 > 05. 인사평가 > 인사평가결과(인사부) (#1394)
- 파일: `client/vi/emp/Emp43_Tab_FirstAppr.java`
- 함께 쓰는 클래스 1개:
  - `Emp43_Edit_Score` `client/vi/emp/Emp43_Edit_Score.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Emp43_Tab_FirstAppr:243 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Emp43_Tab_FirstAppr:280, Emp43_Tab_FirstAppr:489 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `emp.Emp43_EvalTarget.modelUpdate` | Emp43_Edit_Score:94 | [`Emp43_EvalTarget.java:112`](../../emp/services/Emp43_EvalTarget.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(emp43_eval_target)` 동적 INSERT/UPDATE → [`emp43_eval_target.selectById`](../../emp/sql/emp43_eval_target.md) |
| `emp.Emp43_EvalTarget.selectByTextAdmin` | Emp43_Tab_FirstAppr:232 | [`Emp43_EvalTarget.java:44`](../../emp/services/Emp43_EvalTarget.md) | [`emp43_eval_target.selectByTextAdmin`](../../emp/sql/emp43_eval_target.md) |
| `emp.Emp45_EvalRelateAppr.insert` | Emp43_Tab_FirstAppr:468 | [`Emp45_EvalRelateAppr.java:31`](../../emp/services/Emp45_EvalRelateAppr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp45_eval_relate_appr.insert`](../../emp/sql/emp45_eval_relate_appr.md), [`emp45_eval_relate_appr.selectByTermCode`](../../emp/sql/emp45_eval_relate_appr.md), [`emp45_eval_relate_appr.updateApprId`](../../emp/sql/emp45_eval_relate_appr.md) |
| `emp.Emp45_EvalRelateAppr.selectByTermCode` | Emp43_Tab_FirstAppr:398 | [`Emp45_EvalRelateAppr.java:25`](../../emp/services/Emp45_EvalRelateAppr.md) | [`emp45_eval_relate_appr.selectByTermCode`](../../emp/sql/emp45_eval_relate_appr.md) |
| `emp.Emp45_EvalRelateAppr.updateApprId` | Emp43_Tab_FirstAppr:544 | [`Emp45_EvalRelateAppr.java:97`](../../emp/services/Emp45_EvalRelateAppr.md) | [`emp45_eval_relate_appr.updateApprId`](../../emp/sql/emp45_eval_relate_appr.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Emp43_Tab_FirstAppr:184 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys01_Company.selectById` | Emp43_Tab_FirstAppr:152 | [`Sys01_Company.java:20`](../../sys/services/Sys01_Company.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.updateMainImageId`](../../sys/sql/sys01_company.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp40_eval_list_std`](../../../db/tables/emp.md), [`emp42_eval_grade`](../../../db/tables/emp.md), [`emp43_eval_target`](../../../db/tables/emp.md), [`emp44_eval_write`](../../../db/tables/emp.md), [`emp45_eval_relate_appr`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_empevalgradeid`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `f_trunc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp43_Tab_FirstAppr (`client/vi/emp/Emp43_Tab_FirstAppr.java`, 573줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 평가기간: {dataYearText} 년: {termComboBox} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `dataYearText` TextField, `searchText` TextField 빈칸="조직/직위/성명", `classTreeFullName` LookupTriggerField 빈칸="미선택시 자동으로 관리자가 지정한 문서분류에 상신이 진행됩니다.", `apprStepCode` TextField, `apprStepName` TextField, `termComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode"), `editor` Apr01_Edit_ApprDoc, `lookup01` LookupTriggerField, `lookup02` LookupTriggerField, `lookup` Emp43_Edit_Score, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - orgName 180 "부서" Text
  - personName 80 "성명" TextCenter
  - posName 80 "직위" TextCenter
  - orgHeadName 60 "구분" TextCenter
  - firstPersonName 80 "성명" TextCenter
  - firstEvalScore 60 "점수" DoubleCenter
  - firstEvalGrade 60 "등급" TextCenter
  - firstOrderReason 100 "사유" TextCenter 편집:lookup01
  - secondPersonName 80 "성명" TextCenter
  - secondEvalScore 60 "점수" DoubleCenter
  - secondEvalGrade 60 "등급" TextCenter
  - secondOrderReason 100 "사유" TextCenter 편집:lookup02
  - totalEvalScore 60 "점수" DoubleCenter
  - totalEvalGrade 60 "등급" TextCenter
  - totalEvalStatus 100 "결과" TextCenter
  - actionCell 30 "" Cell 편집:actionCell03
  - plusScore 60 "상" LongCenter
  - minusScore 60 "벌" LongCenter
  - reasonAdjustScore 60 "평정사유<br>가감" LongCenter
  - adjustEvalScore 60 "점수" DoubleCenter
  - adjustEvalGrade 60 "등급" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L91-134) → settings(), retrieve()
[E1] dataYearText.ValueChange (L145) → retrieve()
[E2] classTreeFullName[문서분류].TriggerClick (L197) → openLookupDoc()
[E3] apprButton[상신].Select (L203) → insertRelateAppr()
[E4] apprOpenButton[문서보기].Select (L240) → 서비스 apr.Apr01_Appr.selectById(apprId)
[E5] termComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L265) → retrieve()
[E6] retrieveButton[조회].Select (L271) → retrieve()
[E7] lookup01.TriggerClick (L303) → 인라인 L303-311 (new TriggerClickHandler() { @Override…)
[E8] lookup02.TriggerClick (L314) → 인라인 L314-322 (new TriggerClickHandler() { @Override…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private defaultName() | L279-298 | settings | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private retrieve() | L374-393 | 생성자,E1,E5,E6,buildGrid,updateApprId | 서비스 emp.Emp43_EvalTarget.selectByTextAdmin(companyId, stdYear, searchText, stdTermCode, stdTermCode) | 업무 |
| private retrieveApprStatus() | L395-448 | retrieve | 서비스 emp.Emp45_EvalRelateAppr.selectByTermCode(companyId, stdYear, searchText, stdTermCode, stdTermCode) | 업무 |
| private openLookupDoc() | L451-460 | E2 | 상태 처리 | 업무 |
| private insertRelateAppr() | L462-485 | E3 | 서비스 emp.Emp45_EvalRelateAppr.insert(companyId, stdYear, stdTermCode, stdTermCode) | 업무 |
| private insertLinkApprovals() | L487-533 | insertRelateAppr | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private getGridList() | L535-541 | insertLinkApprovals | 상태 처리 | 업무 |
| private updateApprId() | L543-555 | insertLinkApprovals | 서비스 emp.Emp45_EvalRelateAppr.updateApprId(relateApprId, apprId) | 업무 |
| private settings() | L136-277 | 생성자 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 sys.Sys01_Company.selectById, sys.Sys00_Common.selectByKindGroupCode, emp.Emp43_EvalTarget.selectByTextAdmin, apr.Apr01_Appr.selectById(companyId, stdYear, searchText, stdTermCode, stdTermCode, apprId), 이벤트 연결, 초기값: dataYearText=startYear, dataYearText=DateTimeFormat.getFormat("yyyy" | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L300-372 | 필드 초기화 | 팝업 Emp43_Edit_Score 열기, 미선택 시 alert "상신 중이거나 완료된 문서는 수정이 불가능합니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L557-560 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L562-564 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L566-568 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L570-572 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L341 newHeaderGroupMap02newHeaderGroupConfig14 100 "인사평가 대상자" (emp03_new_header_group_map02new_header_group_config14 컬럼 없음)
  // ⚠DB없음 L342 newHeaderGroupMap06newHeaderGroupConfigsetHtmlGridStyle14 100 "1차 평가결과" (emp03_new_header_group_map06new_header_group_configset_html_grid_style14 컬럼 없음)
  // ⚠DB없음 L343 newHeaderGroupMap010newHeaderGroupConfigsetHtmlGridStyle14 100 "2차 평가결과" (emp03_new_header_group_map010new_header_group_configset_html_grid_style14 컬럼 없음)
  // ⚠DB없음 L344 newHeaderGroupMap014newHeaderGroupConfigsetHtmlGridStyle13 100 "평가결과 합계" (emp03_new_header_group_map014new_header_group_configset_html_grid_style13 컬럼 없음)
  // ⚠DB없음 L345 newHeaderGroupMap018newHeaderGroupConfigsetHtmlGridStyle12 100 "상벌가감" (emp03_new_header_group_map018new_header_group_configset_html_grid_style12 컬럼 없음)
  // ⚠DB없음 L346 newHeaderGroupMap021newHeaderGroupConfigsetHtmlGridStyle12 100 "변경결과" (emp03_new_header_group_map021new_header_group_configset_html_grid_style12 컬럼 없음)
  gb.text('orgNm', 180, '부서'),  // L349
  gb.textCenter('personNm', 80, '성명'),  // L350
  gb.textCenter('posNm', 80, '직위'),  // L351
  gb.textCenter('orgHeadNm', 60, '구분'),  // L352
  gb.textCenter('firstPersonNm', 80, '성명'),  // L353
  gb.doubleCenter('firstEvalScore', 60, '점수'),  // L354
  gb.textCenter('firstEvalGrade', 60, '등급'),  // L355
  gb.textCenter('firstOrderReason', 100, '사유'),  // L356
  gb.textCenter('secondPersonNm', 80, '성명'),  // L357
  gb.doubleCenter('secondEvalScore', 60, '점수'),  // L358
  gb.textCenter('secondEvalGrade', 60, '등급'),  // L359
  gb.textCenter('secondOrderReason', 100, '사유'),  // L360
  gb.doubleCenter('totalEvalScore', 60, '점수'),  // L361
  gb.textCenter('totalEvalGrade', 60, '등급'),  // L362
  gb.textCenter('totalEvalStatus', 100, '결과'),  // L363
  // ⚠ 대응 없음 (GridBuilder L364) addCell
  gb.longCenter('plusScore', 60, '상'),  // L365
  gb.longCenter('minusScore', 60, '벌'),  // L366
  gb.longCenter('reasonAdjustScore', 60, '평정사유<br>가감'),  // L367
  gb.doubleCenter('adjustEvalScore', 60, '점수'),  // L368
  gb.textCenter('adjustEvalGrade', 60, '등급'),  // L369
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRelateAppr}>상신</Button>
3. <Button type="search" onClick={() => /* 서비스 apr.Apr01_Appr.selectById(apprId) */}>문서보기</Button>

### Emp43_Edit_Score (`client/vi/emp/Emp43_Edit_Score.java`, 114줄)

- 입력·하위 화면: `plusScore` LongField, `minusScore` LongField, `reasonAdjustScore` LongField

#### 이벤트
[E1] updateButton[저장].Select (L64) → update()
[E2] closeButton[닫기].Select (L70) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L42-61 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L78-89 | edit | 상태 처리 | 업무 |
| private update() | L91-105 | E1 | 서비스 emp.Emp43_EvalTarget.modelUpdate | 업무 |
| private settings() | L63-76 | edit | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L107-109 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L111-113 | edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

