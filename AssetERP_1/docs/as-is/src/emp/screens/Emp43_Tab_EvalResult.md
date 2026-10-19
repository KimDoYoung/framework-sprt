# Emp43_Tab_EvalResult

- 종류: 화면
- 메뉴: 경영관리 > 05. 인사평가 > 인사평가 결과조회 (#1396)
- 파일: `client/vi/emp/Emp43_Tab_EvalResult.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp43_EvalTarget.selectByTextAdmin` | Emp43_Tab_EvalResult:295 | [`Emp43_EvalTarget.java:44`](../../emp/services/Emp43_EvalTarget.md) | [`emp43_eval_target.selectByTextAdmin`](../../emp/sql/emp43_eval_target.md) |
| `emp.Emp43_EvalTarget.selectByTextAdminAll` | Emp43_Tab_EvalResult:298 | [`Emp43_EvalTarget.java:50`](../../emp/services/Emp43_EvalTarget.md) | [`emp43_eval_target.selectByTextAdminAll`](../../emp/sql/emp43_eval_target.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Emp43_Tab_EvalResult:202 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys01_Company.selectById` | Emp43_Tab_EvalResult:170 | [`Sys01_Company.java:20`](../../sys/services/Sys01_Company.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.updateMainImageId`](../../sys/sql/sys01_company.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp40_eval_list_std`](../../../db/tables/emp.md), [`emp42_eval_grade`](../../../db/tables/emp.md), [`emp43_eval_target`](../../../db/tables/emp.md), [`emp44_eval_write`](../../../db/tables/emp.md), [`emp45_eval_relate_appr`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_empevalgradeid`, `f_get_emptrans`, `f_sysdate`, `f_today`, `f_trunc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp43_Tab_EvalResult (`client/vi/emp/Emp43_Tab_EvalResult.java`, 335줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 평가기간: {dataYearText} 년: {termComboBox} {termNotinclude} 사원명: {personName} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `dataYearText` TextField, `searchText` TextField 빈칸="조직/직위", `termNotinclude` CheckBox, `personName` LookupTriggerField, `personId` LongField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle, `termComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - evalDateStr 200 "평가기간" TextCenter
  - orgName 180 "부서" Text
  - personName 80 "성명" TextCenter
  - posName 80 "직위" TextCenter
  - titleName 80 "직책" TextCenter
  - firstEvalScore 60 "점수" DoubleCenter
  - firstEvalGrade 60 "등급" TextCenter
  - secondEvalScore 60 "점수" DoubleCenter
  - secondEvalGrade 60 "등급" TextCenter
  - totalEvalScore 60 "점수" DoubleCenter
  - totalEvalGrade 60 "등급" TextCenter
  - totalOrderReason 100 "평정사유" TextCenter
  - actionCell 30 "" Cell 편집:actionCell01
  - plusScore 60 "상" LongCenter
  - minusScore 60 "벌" LongCenter
  - reasonAdjustScore 60 "사유" LongCenter
  - adjustEvalScore 80 "변경점수" DoubleCenter
  - adjustEvalGrade 80 "변경등급" TextCenter
  - ceoEvalScore 100 "대표이사<br>평가" LongCenter
  - finalEvalScore 60 "점수" DoubleCenter
  - finalEvalGrade 60 "등급" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L75-105) → settings(), retrieve()
[E1] termNotinclude[기간조건 제외].ValueChange [event.getValue()] (L110) → 인라인 L110-126 (new ValueChangeHandler<Boolean>() { @…)
[E2] personName.TriggerClick [result != null] (L128) → 인라인 L128-147 (new TriggerClickHandler(){ @Override …)
[E3] searchText.KeyPress [Enter] (L151) → retrieve()
[E4] dataYearText.ValueChange (L163) → retrieve()
[E5] termComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L212) → retrieve()
[E6] retrieveButton[조회].Select (L218) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L278-317 | 생성자,E3,E4,E5,E6 | 서비스 emp.Emp43_EvalTarget.selectByTextAdmin, emp.Emp43_EvalTarget.selectByTextAdminAll(companyId, stdYear, searchText, stdTermCode, targetPersonId) | 업무 |
| private settings() | L107-224 | 생성자 | 조회창 Emp00_Lookup_SelectSingle 열기, 서비스 sys.Sys01_Company.selectById, sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결, 초기값: termNotinclude=false("기간조건 제외"), personName=empTransInfoModel.getEmpPersonModel(, personId=empTransInfoModel.getPersonId(, personName=null, personId=null, dataYearText=startYear, dataYearText=DateTimeFormat.getFormat("yyyy" | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L226-276 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L319-322 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L324-326 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L328-330 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L332-334 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L246 newHeaderGroupMap03newHeaderGroupConfig14 100 "인사평가 대상자" (emp03_new_header_group_map03new_header_group_config14 컬럼 없음)
  // ⚠DB없음 L247 newHeaderGroupMap07newHeaderGroupConfigsetHtmlGridStyle12 100 "1차 평가" (emp03_new_header_group_map07new_header_group_configset_html_grid_style12 컬럼 없음)
  // ⚠DB없음 L248 newHeaderGroupMap09newHeaderGroupConfigsetHtmlGridStyle12 100 "2차 평가" (emp03_new_header_group_map09new_header_group_configset_html_grid_style12 컬럼 없음)
  // ⚠DB없음 L249 newHeaderGroupMap011newHeaderGroupConfigsetHtmlGridStyle12 100 "평가합계" (emp03_new_header_group_map011new_header_group_configset_html_grid_style12 컬럼 없음)
  // ⚠DB없음 L250 newHeaderGroupMap015newHeaderGroupConfigsetHtmlGridStyle15 100 "상벌 및 평정사유 가감" (emp03_new_header_group_map015new_header_group_configset_html_grid_style15 컬럼 없음)
  // ⚠DB없음 L251 newHeaderGroupMap021newHeaderGroupConfigsetHtmlGridStyle12 100 "최종결과" (emp03_new_header_group_map021new_header_group_configset_html_grid_style12 컬럼 없음)
  // ⚠DB없음 L253 evalDateStr 200 "평가기간" (emp03_eval_date_str 컬럼 없음)
  gb.text('orgNm', 180, '부서'),  // L254
  gb.textCenter('personNm', 80, '성명'),  // L255
  gb.textCenter('posNm', 80, '직위'),  // L256
  gb.textCenter('titleNm', 80, '직책'),  // L257
  gb.doubleCenter('firstEvalScore', 60, '점수'),  // L258
  gb.textCenter('firstEvalGrade', 60, '등급'),  // L259
  gb.doubleCenter('secondEvalScore', 60, '점수'),  // L260
  gb.textCenter('secondEvalGrade', 60, '등급'),  // L261
  gb.doubleCenter('totalEvalScore', 60, '점수'),  // L262
  gb.textCenter('totalEvalGrade', 60, '등급'),  // L263
  gb.textCenter('totalOrderReason', 100, '평정사유'),  // L264
  // ⚠ 대응 없음 (GridBuilder L265) addCell
  gb.longCenter('plusScore', 60, '상'),  // L266
  gb.longCenter('minusScore', 60, '벌'),  // L267
  gb.longCenter('reasonAdjustScore', 60, '사유'),  // L268
  gb.doubleCenter('adjustEvalScore', 80, '변경점수'),  // L269
  gb.textCenter('adjustEvalGrade', 80, '변경등급'),  // L270
  gb.longCenter('ceoEvalScore', 100, '대표이사<br>평가'),  // L271
  gb.doubleCenter('finalEvalScore', 60, '점수'),  // L272
  gb.textCenter('finalEvalGrade', 60, '등급'),  // L273
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

