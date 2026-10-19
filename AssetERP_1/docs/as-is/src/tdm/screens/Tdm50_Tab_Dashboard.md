# Tdm50_Tab_Dashboard

- 종류: 화면
- 파일: `client/vi/tdm/Tdm50_Tab_Dashboard.java`
- 함께 쓰는 클래스 6개:
  - `Tdm54_Lookup_ChckInsuffCmnt` `client/vi/tdm/Tdm54_Lookup_ChckInsuffCmnt.java`
  - `Tdm52_Edit_ChckManl` `client/vi/tdm/Tdm52_Edit_ChckManl.java`
  - `Tdm54_Edit_ChckInsuff` `client/vi/tdm/Tdm54_Edit_ChckInsuff.java`
  - `Tdm43_Page_Relate` `client/vi/tdm/Tdm43_Page_Relate.java`
  - `Tdm43_Lookup_RelateFormFileList` `client/vi/tdm/Tdm43_Lookup_RelateFormFileList.java`
  - `Tdm00_Lookup_RelateAppr` `client/vi/tdm/Tdm00_Lookup_RelateAppr.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Com01_Lookup_RelateAppr`](../../com/components/Com01_Lookup_RelateAppr.md), [`Dcr01_Lookup_SelectMulti`](../../dcr/components/Dcr01_Lookup_SelectMulti.md), [`Emp00_Lookup_SelectSingleTdm`](../../emp/components/Emp00_Lookup_SelectSingleTdm.md), [`Icr01_Lookup_ClassTreeDetail`](../../icr/components/Icr01_Lookup_ClassTreeDetail.md), [`Icr01_Lookup_SelectMulti`](../../icr/components/Icr01_Lookup_SelectMulti.md), [`Ics01_Lookup_ClassTreeDetail`](../../ics/components/Ics01_Lookup_ClassTreeDetail.md), [`Ics01_Lookup_SelectMulti`](../../ics/components/Ics01_Lookup_SelectMulti.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys00_Common.selectByKindGroupCode` | Tdm52_Edit_ChckManl:174 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys10_File.selectUnConnTdmFormFile` | Tdm43_Lookup_RelateFormFileList:174 | [`Sys10_File.java:97`](../../sys/services/Sys10_File.md) | [`sys10_file.selectUnConnTdmFormFile`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.delete` | Tdm43_Page_Relate:458 | [`Sys11_RelateFile.java:199`](../../sys/services/Sys11_RelateFile.md) | `UpdateDataModel(sys11_relate_file)` 동적 DELETE |
| `sys.Sys11_RelateFile.selectByParentId` | Tdm43_Page_Relate:295 | [`Sys11_RelateFile.java:33`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.selectByParentId`](../../sys/sql/sys11_relate_file.md) |
| `tdm.Tdm43_Manl.selectById` | Tdm52_Edit_ChckManl:142 | [`Tdm43_Manl.java:20`](../../tdm/services/Tdm43_Manl.md) | [`tdm43_manl.selectById`](../../tdm/sql/tdm43_manl.md) |
| `tdm.Tdm45_ManlRelateIcs.delete` | Tdm43_Page_Relate:386 | [`Tdm45_ManlRelateIcs.java:68`](../../tdm/services/Tdm45_ManlRelateIcs.md) | `UpdateDataModel(tdm45_manl_relate_ics)` 동적 DELETE |
| `tdm.Tdm45_ManlRelateIcs.selectByManlId` | Tdm43_Page_Relate:271 | [`Tdm45_ManlRelateIcs.java:26`](../../tdm/services/Tdm45_ManlRelateIcs.md) | [`tdm45_manl_relate_ics.selectByManlId`](../../tdm/sql/tdm45_manl_relate_ics.md) |
| `tdm.Tdm46_ManlRelateIcr.delete` | Tdm43_Page_Relate:422 | [`Tdm46_ManlRelateIcr.java:63`](../../tdm/services/Tdm46_ManlRelateIcr.md) | `UpdateDataModel(tdm46_manl_relate_icr)` 동적 DELETE |
| `tdm.Tdm46_ManlRelateIcr.selectByManlId` | Tdm43_Page_Relate:283 | [`Tdm46_ManlRelateIcr.java:26`](../../tdm/services/Tdm46_ManlRelateIcr.md) | [`tdm46_manl_relate_icr.selectByManlId`](../../tdm/sql/tdm46_manl_relate_icr.md) |
| `tdm.Tdm47_ManlRelateDcr.delete` | Tdm43_Page_Relate:487 | [`Tdm47_ManlRelateDcr.java:60`](../../tdm/services/Tdm47_ManlRelateDcr.md) | `UpdateDataModel(tdm47_manl_relate_dcr)` 동적 DELETE |
| `tdm.Tdm47_ManlRelateDcr.selectByManlId` | Tdm43_Page_Relate:307 | [`Tdm47_ManlRelateDcr.java:26`](../../tdm/services/Tdm47_ManlRelateDcr.md) | [`tdm47_manl_relate_dcr.selectByManlId`](../../tdm/sql/tdm47_manl_relate_dcr.md) |
| `tdm.Tdm50_ChckJob.selectByCheckYm` | Tdm50_Tab_Dashboard:303 | [`Tdm50_ChckJob.java:30`](../../tdm/services/Tdm50_ChckJob.md) | [`tdm50_chck_job.selectByCheckYm`](../../tdm/sql/tdm50_chck_job.md) |
| `tdm.Tdm51_ChckOrg.selectDashboardExct` | Tdm50_Tab_Dashboard:337 | [`Tdm51_ChckOrg.java:69`](../../tdm/services/Tdm51_ChckOrg.md) | [`tdm51_chck_org.selectDashboardExct`](../../tdm/sql/tdm51_chck_org.md) |
| `tdm.Tdm51_ChckOrg.selectDashboardOrg` | Tdm50_Tab_Dashboard:353 | [`Tdm51_ChckOrg.java:81`](../../tdm/services/Tdm51_ChckOrg.md) | [`tdm51_chck_org.selectDashboardOrg`](../../tdm/sql/tdm51_chck_org.md) |
| `tdm.Tdm51_ChckOrg.selectDashboardProgress` | Tdm50_Tab_Dashboard:274 | [`Tdm51_ChckOrg.java:56`](../../tdm/services/Tdm51_ChckOrg.md) | [`tdm51_chck_org.selectDashboardProgress`](../../tdm/sql/tdm51_chck_org.md) |
| `tdm.Tdm52_ChckManl.getBotCheckCmnt` | Tdm52_Edit_ChckManl:467 | [`Tdm52_ChckManl.java:550`](../../tdm/services/Tdm52_ChckManl.md) | - |
| `tdm.Tdm52_ChckManl.modelUpdate` | Tdm52_Edit_ChckManl:325 | [`Tdm52_ChckManl.java:588`](../../tdm/services/Tdm52_ChckManl.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(tdm52_chck_manl)` 동적 INSERT/UPDATE → [`tdm52_chck_manl.selectById`](../../tdm/sql/tdm52_chck_manl.md) |
| `tdm.Tdm52_ChckManl.selectById` | Tdm52_Edit_ChckManl:410, Tdm54_Lookup_ChckInsuffCmnt:192 | [`Tdm52_ChckManl.java:30`](../../tdm/services/Tdm52_ChckManl.md) | [`tdm52_chck_manl.selectById`](../../tdm/sql/tdm52_chck_manl.md) |
| `tdm.Tdm52_ChckManl.updateComplete` | Tdm52_Edit_ChckManl:366 | [`Tdm52_ChckManl.java:203`](../../tdm/services/Tdm52_ChckManl.md) | [`tdm50_chck_job.selectCheckStartDate`](../../tdm/sql/tdm50_chck_job.md), [`tdm52_chck_manl.countEvidFile`](../../tdm/sql/tdm52_chck_manl.md), [`tdm52_chck_manl.selectById`](../../tdm/sql/tdm52_chck_manl.md), [`tdm52_chck_manl.updateByChckManlId`](../../tdm/sql/tdm52_chck_manl.md), [`tdm54_chck_insuff.deleteById`](../../tdm/sql/tdm54_chck_insuff.md), [`tdm54_chck_insuff.selectByChckManlId`](../../tdm/sql/tdm54_chck_insuff.md), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), [`tdm59_chck_appr_cmnt.selectByChckManlId`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm61_chck_insuff_appr.deleteByChckManlId`](../../tdm/sql/tdm61_chck_insuff_appr.md), [`tdm91_company_setup.selectByDate`](../../tdm/sql/tdm91_company_setup.md) |
| `tdm.Tdm54_ChckInsuff.modelUpdate` | Tdm54_Edit_ChckInsuff:227 | [`Tdm54_ChckInsuff.java:54`](../../tdm/services/Tdm54_ChckInsuff.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), `UpdateDataModel(tdm54_chck_insuff)` 동적 INSERT/UPDATE → [`tdm54_chck_insuff.selectById`](../../tdm/sql/tdm54_chck_insuff.md) |
| `tdm.Tdm54_ChckInsuff.selectByChckManlId` | Tdm54_Edit_ChckInsuff:91 | [`Tdm54_ChckInsuff.java:28`](../../tdm/services/Tdm54_ChckInsuff.md) | [`tdm54_chck_insuff.selectByChckManlId`](../../tdm/sql/tdm54_chck_insuff.md) |
| `tdm.Tdm54_ChckInsuff.selectById` | Tdm54_Lookup_ChckInsuffCmnt:139 | [`Tdm54_ChckInsuff.java:23`](../../tdm/services/Tdm54_ChckInsuff.md) | [`tdm54_chck_insuff.selectById`](../../tdm/sql/tdm54_chck_insuff.md) |
| `tdm.Tdm54_ChckInsuff.selectDashboardInsuff` | Tdm50_Tab_Dashboard:368 | [`Tdm54_ChckInsuff.java:43`](../../tdm/services/Tdm54_ChckInsuff.md) | [`tdm54_chck_insuff.selectDashboardInsuff`](../../tdm/sql/tdm54_chck_insuff.md) |
| `tdm.Tdm61_ChckInsuffAppr.updateApprCmnt` | Tdm54_Lookup_ChckInsuffCmnt:432 | [`Tdm61_ChckInsuffAppr.java:25`](../../tdm/services/Tdm61_ChckInsuffAppr.md) | [`tdm61_chck_insuff_appr.updateById`](../../tdm/sql/tdm61_chck_insuff_appr.md) |
| `tdm.Tdm61_ChckInsuffAppr.updateApprStatus` | Tdm54_Lookup_ChckInsuffCmnt:447 | [`Tdm61_ChckInsuffAppr.java:38`](../../tdm/services/Tdm61_ChckInsuffAppr.md) | [`tdm54_chck_insuff.updateStatusCode`](../../tdm/sql/tdm54_chck_insuff.md), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), [`tdm61_chck_insuff_appr.updateById`](../../tdm/sql/tdm61_chck_insuff_appr.md) |
| `tdm.Tdm63_ChckInsuffRecord.selectBychckInsuffId` | Tdm54_Lookup_ChckInsuffCmnt:421 | [`Tdm63_ChckInsuffRecord.java:22`](../../tdm/services/Tdm63_ChckInsuffRecord.md) | [`tdm63_chck_insuff_record.selectBychckInsuffId`](../../tdm/sql/tdm63_chck_insuff_record.md) |
| `tdm.Tdm64_ChckEvidExtr.delete` | Tdm00_Lookup_RelateAppr:226 | [`Tdm64_ChckEvidExtr.java:31`](../../tdm/services/Tdm64_ChckEvidExtr.md) | `UpdateDataModel(tdm64_chck_evid_extr)` 동적 DELETE |
| `tdm.Tdm64_ChckEvidExtr.selectByTargetId` | Tdm00_Lookup_RelateAppr:160 | [`Tdm64_ChckEvidExtr.java:21`](../../tdm/services/Tdm64_ChckEvidExtr.md) | [`tdm64_chck_evid_extr.selectByTargetId`](../../tdm/sql/tdm64_chck_evid_extr.md) |
| `tdm.Tdm64_ChckEvidExtr.update` | Tdm00_Lookup_RelateAppr:202 | [`Tdm64_ChckEvidExtr.java:26`](../../tdm/services/Tdm64_ChckEvidExtr.md) | `UpdateDataModel(tdm64_chck_evid_extr)` 동적 INSERT/UPDATE → [`tdm64_chck_evid_extr.selectById`](../../tdm/sql/tdm64_chck_evid_extr.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`tdm10_task`](../../../db/tables/tdm.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm13_task_relate_duty`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm45_manl_relate_ics`](../../../db/tables/tdm.md), [`tdm46_manl_relate_icr`](../../../db/tables/tdm.md), [`tdm47_manl_relate_dcr`](../../../db/tables/tdm.md), [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md), [`tdm54_chck_insuff`](../../../db/tables/tdm.md), [`tdm55_chck_record`](../../../db/tables/tdm.md), [`tdm56_chck_relate_appr`](../../../db/tables/tdm.md), [`tdm59_chck_appr_cmnt`](../../../db/tables/tdm.md), [`tdm60_chck_manl_appr`](../../../db/tables/tdm.md), [`tdm61_chck_insuff_appr`](../../../db/tables/tdm.md), [`tdm63_chck_insuff_record`](../../../db/tables/tdm.md), [`tdm64_chck_evid_extr`](../../../db/tables/tdm.md), [`tdm91_company_setup`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_exctdutymap_nm`, `f_get_tdmcheckcycle`, `f_get_tdmevidcount`, `f_get_tdmorg_id2`, `f_org_nm`, `f_sysdate`, `f_today`, `f_trunc`, `getorg`, `getperson`, `gettdm30roleallc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm50_Tab_Dashboard (`client/vi/tdm/Tdm50_Tab_Dashboard.java`, 404줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 점검년월: {quickMoveField} {radio1} {radio2} {retrieveButton} {labelHlc}
- 입력·하위 화면: `quickMoveField` QuickMoveField, `radio1` Radio, `radio2` Radio, `lookup` Tdm54_Lookup_ChckInsuffCmnt
- 그리드 `grid01` (buildGrid01()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - exctName 100 "임원" TextCenter
  - roleName 160 "직책" Text
  - progRate 70 "진행율(%)" Double 편집:"404040"
  - monthCheckCnt 70 "대상" LongCnt 편집:"404040"
  - monthManlUndoneCnt 70 "미점검" LongCnt 편집:"404040"
  - monthCheck1Cnt 70 "적정" LongCnt 편집:"404040"
  - monthCheck2Cnt 70 "미흡" LongCnt 편집:"404040"
  - monthCheck9Cnt 70 "해당없음" LongCnt 편집:"404040"
- 그리드 `grid02` (buildGrid02()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - orgName 240 "점검부서" Text
  - progRate 70 "진행율(%)" Double 편집:"404040"
  - monthCheckCnt 70 "대상" LongCnt 편집:"404040"
  - monthManlUndoneCnt 70 "미점검" LongCnt 편집:"404040"
  - monthCheck1Cnt 70 "적정" LongCnt 편집:"404040"
  - monthCheck2Cnt 70 "미흡" LongCnt 편집:"404040"
  - monthCheck9Cnt 70 "해당없음" LongCnt 편집:"404040"
- 그리드 `grid03` (buildGrid03()):
  - checkYm 100 "발생년월" TextCenter
  - dueDate 100 "조치예정일" Date
  - actionDate 100 "조치완료일" Date
  - statusName 100 "조치상태" TextCenter
  - orgName 200 "조치부서" Text
  - actionEmpName 100 "조치(예정)자" Text
  - actionName 650 "조치명" Text
  - actionCell 80 "상세보기" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L106-160) → init(), settings()
[E1] toggleGroup.ValueChange (L174) → retrieve()
[E2] retrieveButton[새로고침].Select (L210) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L52-55 | buildGrid03,retrieve01,retrieve02,retrieve03 | 상태 처리 | 업무 |
| public execute() | L59-62 | buildGrid03,retrieve01,retrieve02,retrieve03 | 상태 처리 | 업무 |
| public buildGrid01() | L218-232 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid02() | L234-247 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid03() | L249-269 | 공개 메서드 | 조회창 Tdm54_Lookup_ChckInsuffCmnt 열기 | 업무 |
| private retrieve() | L271-293 | E1,E2,execute | 서비스 tdm.Tdm51_ChckOrg.selectDashboardProgress(companyId, checkYm, stdDate, statusType) | 업무 |
| private retrieveAll() | L295-300 | retrieve | 상태 처리 | 업무 |
| private setCheckEndInfo() | L302-327 | retrieveAll | 서비스 tdm.Tdm50_ChckJob.selectByCheckYm(companyId, checkYm, stdDate) | 업무 |
| private retrieve01() | L329-343 | retrieveAll | 서비스 tdm.Tdm51_ChckOrg.selectDashboardExct(companyId, checkYm, stdDate, statusType) | 업무 |
| private retrieve02() | L345-359 | retrieveAll | 서비스 tdm.Tdm51_ChckOrg.selectDashboardOrg(companyId, checkYm, stdDate, statusType) | 업무 |
| private retrieve03() | L361-374 | retrieveAll | 서비스 tdm.Tdm54_ChckInsuff.selectDashboardInsuff(companyId, checkYm, stdDate) | 업무 |
| private rateStr() | L376-382 | retrieve | 상태 처리 | 업무 |
| private init() | L384-394 | 생성자,retrieve | 상태 처리 | 업무 |
| private settings() | L162-216 | 생성자 | 이벤트 연결, 초기값: radio1=true("최종승인"), radio2=false("점검완료") | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L396-398 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L400-403 | 생성자,settings,buildGrid01,buildGrid02 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid01 = () => [
  // ⚠DB없음 L220 newHeaderGroupMap06newHeaderGroupConfigsetHtmlGridStyle13 100 "점검" (tdm51_new_header_group_map06new_header_group_configset_html_grid_style13 컬럼 없음)
  gb.textCenter('exctNm', 100, '임원'),  // L221 SQL 계산 컬럼(selectDashboardExct: emp00_kor_nm)
  gb.text('roleNm', 160, '직책'),  // L222 SQL 계산 컬럼(selectDashboardExct: tdm20_role_nm)
  gb.double('progRate', 70, '진행율(%)'),  // L223 SQL 계산 컬럼(selectDashboardProgress: (SUM(tdm51_month_check_cnt) - SUM(tdm51…)
  // ⚠ 대응 없음 (GridBuilder L224) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L225) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L226) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L227) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L228) addLongCnt
];

const buildGrid02 = () => [
  // ⚠DB없음 L236 newHeaderGroupMap05newHeaderGroupConfigsetHtmlGridStyle13 100 "점검" (tdm51_new_header_group_map05new_header_group_configset_html_grid_style13 컬럼 없음)
  gb.text('orgNm', 240, '점검부서'),  // L237 SQL 계산 컬럼(selectDashboardProgress: org00_kor_nm)
  gb.double('progRate', 70, '진행율(%)'),  // L238 SQL 계산 컬럼(selectDashboardProgress: (SUM(tdm51_month_check_cnt) - SUM(tdm51…)
  // ⚠ 대응 없음 (GridBuilder L239) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L240) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L241) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L242) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L243) addLongCnt
];

const buildGrid03 = () => [
  gb.textCenter('checkYm', 100, '발생년월'),  // L259 SQL 계산 컬럼(selectDashboardInsuff: tdm54_occ_ym)
  gb.date('dueDate', 100, '조치예정일'),  // L260
  gb.date('actionDate', 100, '조치완료일'),  // L261
  gb.textCenter('statusNm', 100, '조치상태'),  // L262 SQL 계산 컬럼(selectDashboardInsuff: f_cdnm( 'TdmInsuffStatus' , CASE WHEN t…)
  gb.text('orgNm', 200, '조치부서'),  // L263 SQL 계산 컬럼(selectDashboardInsuff: org00_kor_nm)
  gb.text('actionEmpNm', 100, '조치(예정)자'),  // L264 SQL 계산 컬럼(selectDashboardInsuff: emp00_kor_nm)
  gb.text('actionNm', 650, '조치명'),  // L265
  // ⚠ 대응 없음 (GridBuilder L266) addCell
];
```

#### 사용된 버튼들
1. <Button type="reset" onClick={retrieve}>새로고침</Button>

### Tdm54_Lookup_ChckInsuffCmnt (`client/vi/tdm/Tdm54_Lookup_ChckInsuffCmnt.java`, 523줄)

- 입력·하위 화면: `regDate` MyDateField, `dueDate` MyDateField, `planRegEmpName` TextField, `planActionEmpName` TextField, `actionName` TextField, `actionPlan` MyTextArea, `statusName` TextField, `actionDate` MyDateField, `actionEmpName` TextField, `orgName` TextField, `actionCmnt` MyTextArea, `apprStatusCode` TextField, `apprStatusName` TextField, `apprCmnt` MyTextArea, `lookup` Tdm52_Edit_ChckManl
- 그리드 `recordGrid` (recordGirdBuilder()):
  - regDate 100 "등록일" Date
  - regEmpName 100 "등록자" TextCenter
  - content 470 "조치내용" TextArea
  - note 420 "비고" TextArea
  - fileCountStr 80 "증빙자료" TextCenter
  - actionCell 30 " " Cell 편집:fileCell

#### 이벤트
[E0] 화면 열림 (생성자 L92-119) → setting(), getEditor(), show()
[E1] manlButton[발생 점검항목 보기].Select (L189) → 서비스 tdm.Tdm52_ChckManl.selectById(chckManlId)
[E2] agreeButton[승인].Select (L208) → updateApprStatus()
[E3] messageBox.DialogHide (L217) → updateApprStatus()
[E4] rejectButton[반려].Select (L229) → updateApprStatus()
[E5] messageBox.DialogHide (L238) → updateApprStatus()
[E6] cancelButton[취소].Select (L250) → updateApprStatus()
[E7] messageBox.DialogHide (L254) → updateApprStatus()
[E8] updateButton[임시저장].Select (L266) → update()
[E9] closeButton[닫기].Select (L272) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L131-149 | 공개 메서드 | 서비스 tdm.Tdm54_ChckInsuff.selectById(chckInsuffId) | 업무 |
| public edit() | L151-161 | 공개 메서드 | 상태 처리 | 업무 |
| private open() | L163-171 | view,edit | 상태 처리 | 업무 |
| private setting() | L173-278 | 생성자 | 팝업 Tdm52_Edit_ChckManl 열기, 확인창 표시, 서비스 tdm.Tdm52_ChckManl.selectById(chckManlId) | 업무 |
| private getEditor() | L280-391 | 생성자 | 상태 처리 | 업무 |
| package recordGirdBuilder() | L393-414 | 필드 초기화 | 조회창 Tdm00_Lookup_RelateAppr 열기 | 업무 |
| private retrieveRecord() | L416-427 | open | 서비스 tdm.Tdm63_ChckInsuffRecord.selectBychckInsuffId(chckInsuffId) | 업무 |
| private update() | L429-442 | E8 | 서비스 tdm.Tdm61_ChckInsuffAppr.updateApprCmnt | 업무 |
| private updateApprStatus() | L444-476 | E2,E3,E4,E5,E6,E7 | 서비스 tdm.Tdm61_ChckInsuffAppr.updateApprStatus(actionType, personId, stdDate, updName) | 업무 |
| private setButton() | L478-494 | open,updateApprStatus | 상태 처리 | 업무 |
| private titleSetting() | L508-521 | getEditor | 상태 처리 | 업무 |
| private setHtmlStyle() | L496-498 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L500-502 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L504-506 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const recordGirdBuilder = () => [
  gb.date('regDate', 100, '등록일'),  // L406
  gb.textCenter('regEmpNm', 100, '등록자'),  // L407 SQL 계산 컬럼(selectById: f_emp_kor_nm(tdm63_reg_emp_id))
  gb.textArea('content', 470, '조치내용'),  // L408
  gb.textArea('note', 420, '비고'),  // L409
  gb.textCenter('fileCountStr', 80, '증빙자료'),  // L410 SQL 계산 컬럼(selectById: f_get_tdmEvidCount(tdm63_chck_insuff_re…)
  // ⚠ 대응 없음 (GridBuilder L411) addCell
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={updateApprStatus}>승인</Button>
2. <Button type="cancel" onClick={updateApprStatus}>반려</Button>
3. <Button type="cancel" onClick={updateApprStatus}>취소</Button>
4. <Button type="unknown" onClick={update}>임시저장</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>
6. <Button type="search" onClick={() => /* 서비스 tdm.Tdm52_ChckManl.selectById(chckManlId) */}>발생 점검항목 보기</Button>

### Tdm52_Edit_ChckManl (`client/vi/tdm/Tdm52_Edit_ChckManl.java`, 498줄)

- 입력·하위 화면: `checkItem` MyTextArea, `checkCycleInfo` TextField, `checkEvidDocName` MyTextArea, `checkHow` MyTextArea, `checkStatusName` TextField, `checkerName` TextField, `checkDate` MyDateField, `checkResultCode` TextField, `checkCmnt` MyTextArea, `relateList` Tdm43_Page_Relate, `checkResultName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택하세요", `lookup` Tdm54_Edit_ChckInsuff

#### 이벤트
[E0] 화면 열림 (생성자 L83-99) → settings(), show()
[E1] checkResultName[점검결과].Collapse (L177) → 인라인 L177-187 (new CollapseHandler() { @Override pub…)
[E2] planButton[조치계획등록].Select [isReadOnly()] (L190) → isReadOnly()
[E3] botButton[AI].Select (L204) → callBot()
[E4] fileButton[증빙자료(0건)].Select (L212) → lookupFile()
[E5] completeButton[점검완료].Select (L219) → complete()
[E6] cancelButton[완료취소].Select (L225) → complete()
[E7] messageBox.DialogHide (L229) → complete()
[E8] updateButton[저장].Select (L241) → update()
[E9] closeButton[닫기].Select (L247) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L101-114 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L116-130 | 공개 메서드 | 상태 처리 | 업무 |
| private open() | L132-155 | view,edit | 서비스 yyyy.MM.dd, tdm.Tdm43_Manl.selectById(manlId) | 업무 |
| private getEditor() | L255-320 | open | 상태 처리 | 업무 |
| private update() | L322-343 | E8 | 서비스 tdm.Tdm52_ChckManl.modelUpdate | 업무 |
| private complete() | L345-398 | E5,E6,E7 | 서비스 tdm.Tdm52_ChckManl.updateComplete(companyId, personId, stdDate, actionType) | 업무 |
| private lookupFile() | L400-424 | E4 | 조회창 Tdm00_Lookup_RelateAppr 열기, 서비스 tdm.Tdm52_ChckManl.selectById(chckManlId) | 업무 |
| private isReadOnly() | L426-433 | E2,lookupFile | 상태 처리 | 업무 |
| private setButton() | L435-456 | open,complete | 상태 처리 | 업무 |
| private callBot() | L458-484 | E3 | 서비스 tdm.Tdm52_ChckManl.getBotCheckCmnt | 업무 |
| private settings() | L157-253 | 생성자 | 팝업 Tdm54_Edit_ChckInsuff 열기, 확인창 표시, 서비스 sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L486-488 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L489-491 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L492-494 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlButtonBarStyle() | L495-497 | view | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={lookupFile}>증빙자료(0건)</Button>
2. <Button type="save" onClick={complete}>점검완료</Button>
3. <Button type="cancel" onClick={complete}>완료취소</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>
6. <Button type="register" onClick={isReadOnly}>조치계획등록</Button>
7. <Button type="register" onClick={callBot}>AI</Button>

### Tdm54_Edit_ChckInsuff (`client/vi/tdm/Tdm54_Edit_ChckInsuff.java`, 263줄)

- 입력·하위 화면: `regDate` MyDateField, `dueDate` MyDateField, `planActionEmpName` LookupTriggerField, `planActionEmpId` LongField, `actionName` TextField, `actionPlan` MyTextArea, `lookup` Emp00_Lookup_SelectSingleTdm

#### 이벤트
[E0] 화면 열림 (생성자 L60-73) → settings(), show()
[E1] planActionEmpName[조치 예정자].TriggerClick [result != null] (L129) → 인라인 L129-147 (new TriggerClickHandler(){ @Override …)
[E2] updateButton[저장].Select (L148) → update()
[E3] closeButton[닫기].Select (L154) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L75-78 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L80-84 | 공개 메서드 | 상태 처리 | 업무 |
| private open() | L86-125 | view,edit | 서비스 tdm.Tdm54_ChckInsuff.selectByChckManlId(chckManlId) | 업무 |
| private getEditor() | L162-196 | open | 상태 처리 | 업무 |
| private update() | L198-245 | E2 | 서비스 tdm.Tdm54_ChckInsuff.modelUpdate(personId, stdDate) | 업무 |
| private setReadOnly() | L247-254 | view,edit | 상태 처리 | 업무 |
| private settings() | L127-160 | 생성자 | 조회창 Emp00_Lookup_SelectSingleTdm 열기, 이벤트 연결, 초기값: planActionEmpName=empModel.getKorName(("조치 예정자"), planActionEmpId=empModel.getPersonId(, planActionEmpName=null("조치 예정자"), planActionEmpId=null | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L256-258 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L260-262 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm43_Page_Relate (`client/vi/tdm/Tdm43_Page_Relate.java`, 774줄)

- 툴바 `buttonBar`: {insertButton}
- 입력·하위 화면: `relateRefBasisArea` TextArea, `lookupIcs` Ics01_Lookup_ClassTreeDetail, `lookupIcr` Icr01_Lookup_ClassTreeDetail, `lookupForm` Sys10_Lookup_FileViewer, `lookup` Ics01_Lookup_SelectMulti
- 그리드 `relateIcsGrid` (buildRelateIcsGrid()):
  - icsClassTreeName 350 "법규명" Text
  - actionCell 35 "보기" Cell 편집:viewCell
  - actionCell 35 "삭제" Cell 편집:deleteCell
- 그리드 `relateIcrGrid` (buildRelateIcrGrid()):
  - icrClassTreeName 350 "내규명" Text
  - actionCell 35 "보기" Cell 편집:viewCell
  - actionCell 35 "삭제" Cell 편집:deleteCell
- 그리드 `relateFormGrid` (buildRelateFormGrid()):
  - fileName 350 "파일명" Text
  - actionCell 35 "보기" Cell 편집:viewCell
  - actionCell 35 "삭제" Cell 편집:deleteCell
- 그리드 `relateDcrGrid` (buildRelateDcrGrid()):
  - dcrClassTreeFullName 450 "문서분류명" TextArea
  - actionCell 35 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L90-121) → settings()
[E1] plainTabPanel.Selection [arg0 != null] (L163) → buttonSettings()
[E2] insertButton[추가].Select (L181) → insert()
[E3] relateIcsGrid.getStore().StoreAdd (L189) → clearPanel()
[E4] relateIcsGrid.getStore().StoreRemove (L195) → clearPanel()
[E5] relateIcrGrid.getStore().StoreAdd (L203) → clearPanel()
[E6] relateIcrGrid.getStore().StoreRemove (L209) → clearPanel()
[E7] relateFormGrid.getStore().StoreAdd (L217) → clearPanel()
[E8] relateFormGrid.getStore().StoreRemove (L223) → clearPanel()
[E9] relateDcrGrid.getStore().StoreAdd (L231) → clearPanel()
[E10] relateDcrGrid.getStore().StoreRemove (L237) → clearPanel()
[E11] messageBox.DialogHide [YES] (L380) → 서비스 tdm.Tdm45_ManlRelateIcs.delete
[E12] messageBox.DialogHide [YES] (L416) → 서비스 tdm.Tdm46_ManlRelateIcr.delete
[E13] messageBox.DialogHide [YES] (L452) → 서비스 sys.Sys11_RelateFile.delete
[E14] messageBox.DialogHide [YES] (L481) → 서비스 tdm.Tdm47_ManlRelateDcr.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public updateYn() | L123-125 | 공개 메서드 | 상태 처리 | 업무 |
| private buttonSettings() | L127-135 | E1,settings | 상태 처리 | 업무 |
| private setGridColumn() | L137-157 | buttonSettings | 상태 처리 | 업무 |
| private insert() | L245-255 | E2 | 상태 처리 | 업무 |
| public retrieve() | L257-265 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieveRelateIcsGrid() | L268-277 | retrieve | 서비스 tdm.Tdm45_ManlRelateIcs.selectByManlId(manlId) | 업무 |
| public retrieveRelateIcrGrid() | L280-289 | retrieve | 서비스 tdm.Tdm46_ManlRelateIcr.selectByManlId(manlId) | 업무 |
| public retrieveRelateFormGrid() | L292-301 | retrieve | 서비스 sys.Sys11_RelateFile.selectByParentId(parentId) | 업무 |
| public retrieveRelateDcrGrid() | L304-313 | retrieve | 서비스 tdm.Tdm47_ManlRelateDcr.selectByManlId(manlId) | 업무 |
| public inputIcsLine() | L315-326 | 공개 메서드 | 상태 처리 | 업무 |
| public inputIcrLine() | L328-339 | 공개 메서드 | 상태 처리 | 업무 |
| public inputFormLine() | L341-352 | 공개 메서드 | 상태 처리 | 업무 |
| public inputDcrLine() | L354-365 | 공개 메서드 | 상태 처리 | 업무 |
| private buildRelateIcsGrid() | L367-401 | 필드 초기화 | 조회창 Ics01_Lookup_ClassTreeDetail 열기, 확인창 표시, GridDeleteData tdm.Tdm45_ManlRelateIcs.delete(체크된 행 목록) | 업무 |
| private buildRelateIcrGrid() | L403-437 | 필드 초기화 | 조회창 Icr01_Lookup_ClassTreeDetail 열기, 확인창 표시, GridDeleteData tdm.Tdm46_ManlRelateIcr.delete(체크된 행 목록) | 업무 |
| private buildRelateFormGrid() | L439-473 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 확인창 표시, GridDeleteData sys.Sys11_RelateFile.delete(체크된 행 목록) | 업무 |
| private buildRelateDcrGrid() | L475-502 | 필드 초기화 | 확인창 표시, GridDeleteData tdm.Tdm47_ManlRelateDcr.delete(체크된 행 목록) | 업무 |
| public getRelateIcsList() | L505-518 | 공개 메서드 | 상태 처리 | 업무 |
| public getRelateIcrList() | L520-533 | 공개 메서드 | 상태 처리 | 업무 |
| public getRelateFormList() | L535-548 | 공개 메서드 | 상태 처리 | 업무 |
| public getRelateDcrList() | L550-563 | 공개 메서드 | 상태 처리 | 업무 |
| public getRefBasis() | L565-567 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRelateIcsList() | L569-602 | insert | 조회창 Ics01_Lookup_SelectMulti 열기 | 업무 |
| public insertRelateIcrList() | L604-637 | insert | 조회창 Icr01_Lookup_SelectMulti 열기 | 업무 |
| public insertRelateFormList() | L639-672 | insert | 조회창 Tdm43_Lookup_RelateFormFileList 열기 | 업무 |
| public insertRelateDcrList() | L674-708 | insert | 조회창 Dcr01_Lookup_SelectMulti 열기 | 업무 |
| public clearPanel() | L709-767 | E3,E4,E5,E6,E7,E8,E9,E10,retrieveRelateIcsGrid,retrieveRelateIcrGrid,retrieveRelateFormGrid,retrieveRelateDcrGrid | 상태 처리 | 업무 |
| private specialCharacters() | L769-773 | clearPanel | 상태 처리 | 업무 |
| private settings() | L159-243 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
```javascript
const buildRelateIcsGrid = () => [
  gb.text('icsClassTreeNm', 350, '법규명'),  // L396 SQL 계산 컬럼(selectByManlId: ics01_class_tree_nm)
  // ⚠ 대응 없음 (GridBuilder L397) addCell
  // ⚠ 대응 없음 (GridBuilder L398) addCell
];

const buildRelateIcrGrid = () => [
  gb.text('icrClassTreeNm', 350, '내규명'),  // L432 SQL 계산 컬럼(selectByManlId: icr01_class_tree_nm)
  // ⚠ 대응 없음 (GridBuilder L433) addCell
  // ⚠ 대응 없음 (GridBuilder L434) addCell
];

const buildRelateFormGrid = () => [
  gb.text('fileNm', 350, '파일명'),  // L468 SQL 계산 컬럼(selectByParentId: sys10_file_nm)
  // ⚠ 대응 없음 (GridBuilder L469) addCell
  // ⚠ 대응 없음 (GridBuilder L470) addCell
];

const buildRelateDcrGrid = () => [
  gb.textArea('dcrClassTreeFNm', 450, '문서분류명'),  // L498 SQL 계산 컬럼(selectByManlId: f_class_tree_nm_allpath(tdm47_dcr_class…)
  // ⚠ 대응 없음 (GridBuilder L499) addCell
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insert}>추가</Button>

### Tdm43_Lookup_RelateFormFileList (`client/vi/tdm/Tdm43_Lookup_RelateFormFileList.java`, 203줄)

- 툴바 `buttonBar`: 구분: {typeComboBox} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `typeComboBox` ComboBoxField("TdmCheckFormType", "%", "전체", "전체"), `searchText` TextField 빈칸="파일명/비고"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - tdmCheckFormTypeName 200 "구분" Text
  - fileName 500 "파일명" Text
  - note 200 "비고" Text
  - regDate 100 "등록일" Date
  - actionCell 70 "다운로드" Cell 편집:downloadCell

#### 이벤트
[E0] 화면 열림 (생성자 L64-69) → 초기화
[E1] typeComboBox[TdmCheckFormType].Collapse (L101) → retrieve()
[E2] searchText.KeyPress [Enter] (L110) → retrieve()
[E3] retrieveButton[조회].Select (L121) → retrieve()
[E4] confirmButton[확인].Select (L127) → confirm()
[E5] closeButton[닫기].Select (L133) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L47-50 | buildGrid,retrieve | 상태 처리 | 업무 |
| public open() | L71-97 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L99-139 | open | 상태 처리 | 업무 |
| private retrieve() | L166-180 | E1,E2,E3,execute | 서비스 sys.Sys10_File.selectUnConnTdmFormFile(companyId, tdmCheckFormType, searchText, relateId) | 업무 |
| private confirm() | L182-194 | E4 | 미선택 시 alert "선택한 파일이 없습니다" | 업무 |
| private buildGrid() | L141-164 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L196-198 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L199-201 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('tdmCheckFormTypeNm', 200, '구분'),  // L157 SQL 계산 컬럼(selectUnConnTdmFormFile: f_cdnm('TdmCheckFormType', sys10_tdm_ch…)
  gb.text('fileNm', 500, '파일명'),  // L158
  gb.text('note', 200, '비고'),  // L159
  gb.date('regDate', 100, '등록일'),  // L160
  // ⚠ 대응 없음 (GridBuilder L161) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm00_Lookup_RelateAppr (`client/vi/tdm/Tdm00_Lookup_RelateAppr.java`, 245줄)

- 툴바 `extrEvidButtonBar`: ※ 외부보관 증빙자료: {retrieveExtrEvidButton} {insertExtrEvidButton} {updateExtrEvidButton} {deleteExtrEvidButton}
- 그리드 `extrEvidGrid` (extrEvidBuildGrid(), 체크박스(다중)):
  - docNo 100 "문서번호" Text 편집:TextField
  - docName 300 "문서명" Text 편집:TextField
  - docDate 100 "작성일" Date 편집:MyDateField
  - systemName 150 "시스템명" Text 편집:TextField
  - note 200 "비고" Text 편집:TextField
  - actionCell 50 " " Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L50-73) → setButtonEvent()
[E1] retrieveExtrEvidButton[조회].Select (L76) → retrieveExtrEvid()
[E2] insertExtrEvidButton[등록].Select (L82) → insertExtrEvid()
[E3] updateExtrEvidButton[저장].Select (L88) → updateExtrEvid()
[E4] deleteExtrEvidButton[삭제].Select (L94) → deleteExtrEvid()
       └ [E5] messageBox.DialogHide (L221) → 서비스 tdm.Tdm64_ChckEvidExtr.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setButtonEvent() | L75-100 | 생성자 | 상태 처리 | 업무 |
| private extrEvidBuildGrid() | L102-137 | 필드 초기화 | 미선택 시 alert "변경사항을 먼저 저장후에 이용 가능합니다" | 업무 |
| protected setDisable() | L140-146 | 미사용 후보 | 상태 처리 | 업무 |
| public retrieve() | L149-152 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieveExtrEvid() | L154-166 | E1,retrieve | 서비스 tdm.Tdm64_ChckEvidExtr.selectByTargetId(targetId) | 업무 |
| private insertExtrEvid() | L168-174 | E2 | 상태 처리 | 업무 |
| private updateExtrEvid() | L176-211 | E3 | 서비스 tdm.Tdm64_ChckEvidExtr.update | 업무 |
| private deleteExtrEvid() | L213-239 | E4 | 미선택 시 alert "선택한 문서가 없습니다" → 확인창 E5 | 업무 |
| private setHtmlBarNoticeStyleNoSpace() | L241-243 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const extrEvidBuildGrid = () => [
  gb.text('docNo', 100, '문서번호', { editor: 'text' }),  // L126
  gb.text('docNm', 300, '문서명', { editor: 'text' }),  // L127
  gb.date('docDate', 100, '작성일', { editor: 'date' }),  // L128
  gb.text('systemNm', 150, '시스템명', { editor: 'text' }),  // L129
  gb.text('note', 200, '비고', { editor: 'text' }),  // L130
  // ⚠ 대응 없음 (GridBuilder L133) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieveExtrEvid}>조회</Button>
2. <Button type="register" onClick={insertExtrEvid}>등록</Button>
3. <Button type="save" onClick={updateExtrEvid}>저장</Button>
4. <Button type="delete" onClick={deleteExtrEvid}>삭제</Button>

