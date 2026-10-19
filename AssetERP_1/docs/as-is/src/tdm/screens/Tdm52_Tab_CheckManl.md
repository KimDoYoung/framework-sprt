# Tdm52_Tab_CheckManl

- 종류: 화면
- 메뉴: 책무 > 04. 책무이행점검 > 책무이행점검 (#1457)
- 파일: `client/vi/tdm/Tdm52_Tab_CheckManl.java`
- 함께 쓰는 클래스 8개:
  - `Tdm55_Lookup_ChckRecord` `client/vi/tdm/Tdm55_Lookup_ChckRecord.java`
  - `Tdm52_TabPage_CheckManl` `client/vi/tdm/Tdm52_TabPage_CheckManl.java`
  - `Tdm52_Edit_ChckManlBatch` `client/vi/tdm/Tdm52_Edit_ChckManlBatch.java`
  - `Tdm00_Lookup_RelateAppr` `client/vi/tdm/Tdm00_Lookup_RelateAppr.java`
  - `Tdm52_Edit_ChckManl` `client/vi/tdm/Tdm52_Edit_ChckManl.java`
  - `Tdm54_Edit_ChckInsuff` `client/vi/tdm/Tdm54_Edit_ChckInsuff.java`
  - `Tdm43_Page_Relate` `client/vi/tdm/Tdm43_Page_Relate.java`
  - `Tdm43_Lookup_RelateFormFileList` `client/vi/tdm/Tdm43_Lookup_RelateFormFileList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Com01_Lookup_RelateAppr`](../../com/components/Com01_Lookup_RelateAppr.md), [`Dcr01_Lookup_SelectMulti`](../../dcr/components/Dcr01_Lookup_SelectMulti.md), [`Emp00_Lookup_SelectSingleTdm`](../../emp/components/Emp00_Lookup_SelectSingleTdm.md), [`Icr01_Lookup_ClassTreeDetail`](../../icr/components/Icr01_Lookup_ClassTreeDetail.md), [`Icr01_Lookup_SelectMulti`](../../icr/components/Icr01_Lookup_SelectMulti.md), [`Ics01_Lookup_ClassTreeDetail`](../../ics/components/Ics01_Lookup_ClassTreeDetail.md), [`Ics01_Lookup_SelectMulti`](../../ics/components/Ics01_Lookup_SelectMulti.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `getSeq` | Tdm52_Edit_ChckManlBatch:78 | (공통) 채번 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `sys.Sys00_Common.selectByKindGroupCode` | Tdm52_Edit_ChckManl:174, Tdm52_Edit_ChckManlBatch:96 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys10_File.selectUnConnTdmFormFile` | Tdm43_Lookup_RelateFormFileList:174 | [`Sys10_File.java:97`](../../sys/services/Sys10_File.md) | [`sys10_file.selectUnConnTdmFormFile`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.delete` | Tdm43_Page_Relate:458 | [`Sys11_RelateFile.java:199`](../../sys/services/Sys11_RelateFile.md) | `UpdateDataModel(sys11_relate_file)` 동적 DELETE |
| `sys.Sys11_RelateFile.selectByParentId` | Tdm43_Page_Relate:295 | [`Sys11_RelateFile.java:33`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.selectByParentId`](../../sys/sql/sys11_relate_file.md) |
| `tdm.Tdm08_ManagerInfo.checkIsManager` | Tdm52_Tab_CheckManl:254 | [`Tdm08_ManagerInfo.java:42`](../../tdm/services/Tdm08_ManagerInfo.md) | [`tdm08_manager_info.checkIsManager`](../../tdm/sql/tdm08_manager_info.md) |
| `tdm.Tdm43_Manl.selectById` | Tdm52_Edit_ChckManl:142 | [`Tdm43_Manl.java:20`](../../tdm/services/Tdm43_Manl.md) | [`tdm43_manl.selectById`](../../tdm/sql/tdm43_manl.md) |
| `tdm.Tdm45_ManlRelateIcs.delete` | Tdm43_Page_Relate:386 | [`Tdm45_ManlRelateIcs.java:68`](../../tdm/services/Tdm45_ManlRelateIcs.md) | `UpdateDataModel(tdm45_manl_relate_ics)` 동적 DELETE |
| `tdm.Tdm45_ManlRelateIcs.selectByManlId` | Tdm43_Page_Relate:271 | [`Tdm45_ManlRelateIcs.java:26`](../../tdm/services/Tdm45_ManlRelateIcs.md) | [`tdm45_manl_relate_ics.selectByManlId`](../../tdm/sql/tdm45_manl_relate_ics.md) |
| `tdm.Tdm46_ManlRelateIcr.delete` | Tdm43_Page_Relate:422 | [`Tdm46_ManlRelateIcr.java:63`](../../tdm/services/Tdm46_ManlRelateIcr.md) | `UpdateDataModel(tdm46_manl_relate_icr)` 동적 DELETE |
| `tdm.Tdm46_ManlRelateIcr.selectByManlId` | Tdm43_Page_Relate:283 | [`Tdm46_ManlRelateIcr.java:26`](../../tdm/services/Tdm46_ManlRelateIcr.md) | [`tdm46_manl_relate_icr.selectByManlId`](../../tdm/sql/tdm46_manl_relate_icr.md) |
| `tdm.Tdm47_ManlRelateDcr.delete` | Tdm43_Page_Relate:487 | [`Tdm47_ManlRelateDcr.java:60`](../../tdm/services/Tdm47_ManlRelateDcr.md) | `UpdateDataModel(tdm47_manl_relate_dcr)` 동적 DELETE |
| `tdm.Tdm47_ManlRelateDcr.selectByManlId` | Tdm43_Page_Relate:307 | [`Tdm47_ManlRelateDcr.java:26`](../../tdm/services/Tdm47_ManlRelateDcr.md) | [`tdm47_manl_relate_dcr.selectByManlId`](../../tdm/sql/tdm47_manl_relate_dcr.md) |
| `tdm.Tdm50_ChckJob.selectByCheckYm` | Tdm52_Tab_CheckManl:466 | [`Tdm50_ChckJob.java:30`](../../tdm/services/Tdm50_ChckJob.md) | [`tdm50_chck_job.selectByCheckYm`](../../tdm/sql/tdm50_chck_job.md) |
| `tdm.Tdm51_ChckOrg.selectByOrgId` | Tdm52_Tab_CheckManl:333 | [`Tdm51_ChckOrg.java:29`](../../tdm/services/Tdm51_ChckOrg.md) | [`tdm51_chck_org.selectByOrgId`](../../tdm/sql/tdm51_chck_org.md) |
| `tdm.Tdm52_ChckManl.batchCancelComplete` | Tdm52_TabPage_CheckManl:232 | [`Tdm52_ChckManl.java:407`](../../tdm/services/Tdm52_ChckManl.md) | [`com01_relate_appr.deleteByKeyTableId`](../../com/sql/com01_relate_appr.md), [`sys10_file.delete`](../../sys/sql/sys10_file.md), [`sys10_file.deleteCheck`](../../sys/sql/sys10_file.md), [`tdm50_chck_job.selectCheckStartDate`](../../tdm/sql/tdm50_chck_job.md), [`tdm52_chck_manl.updateByChckManlId`](../../tdm/sql/tdm52_chck_manl.md), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), [`tdm64_chck_evid_extr.deleteByTargetId`](../../tdm/sql/tdm64_chck_evid_extr.md) |
| `tdm.Tdm52_ChckManl.batchCheckComplete` | Tdm52_Edit_ChckManlBatch:158 | [`Tdm52_ChckManl.java:338`](../../tdm/services/Tdm52_ChckManl.md) | [`com01_relate_appr.insertCopy`](../../com/sql/com01_relate_appr.md), [`tdm50_chck_job.selectCheckStartDate`](../../tdm/sql/tdm50_chck_job.md), [`tdm52_chck_manl.updateByChckManlId`](../../tdm/sql/tdm52_chck_manl.md), [`tdm54_chck_insuff.deleteById`](../../tdm/sql/tdm54_chck_insuff.md), [`tdm54_chck_insuff.selectByChckManlId`](../../tdm/sql/tdm54_chck_insuff.md), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), [`tdm64_chck_evid_extr.insertCopy`](../../tdm/sql/tdm64_chck_evid_extr.md) |
| `tdm.Tdm52_ChckManl.deleteTmpFile` | Tdm52_Edit_ChckManlBatch:210 | [`Tdm52_ChckManl.java:458`](../../tdm/services/Tdm52_ChckManl.md) | [`com01_relate_appr.deleteByKeyTableId`](../../com/sql/com01_relate_appr.md), [`sys10_file.delete`](../../sys/sql/sys10_file.md), [`sys10_file.deleteCheck`](../../sys/sql/sys10_file.md), [`tdm64_chck_evid_extr.deleteByTargetId`](../../tdm/sql/tdm64_chck_evid_extr.md) |
| `tdm.Tdm52_ChckManl.getBotCheckCmnt` | Tdm52_Edit_ChckManl:467 | [`Tdm52_ChckManl.java:550`](../../tdm/services/Tdm52_ChckManl.md) | - |
| `tdm.Tdm52_ChckManl.getFileCountStr` | Tdm52_Edit_ChckManlBatch:194 | [`Tdm52_ChckManl.java:70`](../../tdm/services/Tdm52_ChckManl.md) | [`tdm52_chck_manl.getFileCountStr`](../../tdm/sql/tdm52_chck_manl.md) |
| `tdm.Tdm52_ChckManl.modelUpdate` | Tdm52_Edit_ChckManl:325 | [`Tdm52_ChckManl.java:588`](../../tdm/services/Tdm52_ChckManl.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(tdm52_chck_manl)` 동적 INSERT/UPDATE → [`tdm52_chck_manl.selectById`](../../tdm/sql/tdm52_chck_manl.md) |
| `tdm.Tdm52_ChckManl.selectById` | Tdm52_Edit_ChckManl:410 | [`Tdm52_ChckManl.java:30`](../../tdm/services/Tdm52_ChckManl.md) | [`tdm52_chck_manl.selectById`](../../tdm/sql/tdm52_chck_manl.md) |
| `tdm.Tdm52_ChckManl.selectByPersonId` | Tdm52_TabPage_CheckManl:114 | [`Tdm52_ChckManl.java:35`](../../tdm/services/Tdm52_ChckManl.md) | [`tdm52_chck_manl.selectByPersonId`](../../tdm/sql/tdm52_chck_manl.md) |
| `tdm.Tdm52_ChckManl.updateCheckStatus` | Tdm52_Tab_CheckManl:428 | [`Tdm52_ChckManl.java:94`](../../tdm/services/Tdm52_ChckManl.md) | [`com01_relate_appr.deleteByKeyTableId`](../../com/sql/com01_relate_appr.md), [`sys10_file.delete`](../../sys/sql/sys10_file.md), [`sys10_file.deleteCheck`](../../sys/sql/sys10_file.md), [`tdm50_chck_job.selectCheckStartDate`](../../tdm/sql/tdm50_chck_job.md), [`tdm52_chck_manl.selectCheckTargetByCheckerId`](../../tdm/sql/tdm52_chck_manl.md), [`tdm52_chck_manl.updateByChckManlId`](../../tdm/sql/tdm52_chck_manl.md), [`tdm52_chck_manl.updateCheckStatusById`](../../tdm/sql/tdm52_chck_manl.md), [`tdm54_chck_insuff.deleteByChckManlId`](../../tdm/sql/tdm54_chck_insuff.md), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), [`tdm64_chck_evid_extr.deleteByTargetId`](../../tdm/sql/tdm64_chck_evid_extr.md) |
| `tdm.Tdm52_ChckManl.updateComplete` | Tdm52_Edit_ChckManl:366 | [`Tdm52_ChckManl.java:203`](../../tdm/services/Tdm52_ChckManl.md) | [`tdm50_chck_job.selectCheckStartDate`](../../tdm/sql/tdm50_chck_job.md), [`tdm52_chck_manl.countEvidFile`](../../tdm/sql/tdm52_chck_manl.md), [`tdm52_chck_manl.selectById`](../../tdm/sql/tdm52_chck_manl.md), [`tdm52_chck_manl.updateByChckManlId`](../../tdm/sql/tdm52_chck_manl.md), [`tdm54_chck_insuff.deleteById`](../../tdm/sql/tdm54_chck_insuff.md), [`tdm54_chck_insuff.selectByChckManlId`](../../tdm/sql/tdm54_chck_insuff.md), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), [`tdm59_chck_appr_cmnt.selectByChckManlId`](../../tdm/sql/tdm59_chck_appr_cmnt.md), [`tdm61_chck_insuff_appr.deleteByChckManlId`](../../tdm/sql/tdm61_chck_insuff_appr.md), [`tdm91_company_setup.selectByDate`](../../tdm/sql/tdm91_company_setup.md) |
| `tdm.Tdm54_ChckInsuff.modelUpdate` | Tdm54_Edit_ChckInsuff:227 | [`Tdm54_ChckInsuff.java:54`](../../tdm/services/Tdm54_ChckInsuff.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`tdm55_chck_record.insert`](../../tdm/sql/tdm55_chck_record.md), `UpdateDataModel(tdm54_chck_insuff)` 동적 INSERT/UPDATE → [`tdm54_chck_insuff.selectById`](../../tdm/sql/tdm54_chck_insuff.md) |
| `tdm.Tdm54_ChckInsuff.selectByChckManlId` | Tdm54_Edit_ChckInsuff:91 | [`Tdm54_ChckInsuff.java:28`](../../tdm/services/Tdm54_ChckInsuff.md) | [`tdm54_chck_insuff.selectByChckManlId`](../../tdm/sql/tdm54_chck_insuff.md) |
| `tdm.Tdm55_ChckRecord.selectByChckOrgId` | Tdm55_Lookup_ChckRecord:114 | [`Tdm55_ChckRecord.java:27`](../../tdm/services/Tdm55_ChckRecord.md) | [`tdm55_chck_record.selectByChckOrgId`](../../tdm/sql/tdm55_chck_record.md) |
| `tdm.Tdm55_ChckRecord.selectByInsuffId` | Tdm55_Lookup_ChckRecord:118 | [`Tdm55_ChckRecord.java:33`](../../tdm/services/Tdm55_ChckRecord.md) | [`tdm55_chck_record.selectByInsuffId`](../../tdm/sql/tdm55_chck_record.md) |
| `tdm.Tdm55_ChckRecord.selectByRelateId` | Tdm55_Lookup_ChckRecord:122 | [`Tdm55_ChckRecord.java:21`](../../tdm/services/Tdm55_ChckRecord.md) | [`tdm55_chck_record.selectByRelateId`](../../tdm/sql/tdm55_chck_record.md) |
| `tdm.Tdm64_ChckEvidExtr.delete` | Tdm00_Lookup_RelateAppr:226 | [`Tdm64_ChckEvidExtr.java:31`](../../tdm/services/Tdm64_ChckEvidExtr.md) | `UpdateDataModel(tdm64_chck_evid_extr)` 동적 DELETE |
| `tdm.Tdm64_ChckEvidExtr.selectByTargetId` | Tdm00_Lookup_RelateAppr:160 | [`Tdm64_ChckEvidExtr.java:21`](../../tdm/services/Tdm64_ChckEvidExtr.md) | [`tdm64_chck_evid_extr.selectByTargetId`](../../tdm/sql/tdm64_chck_evid_extr.md) |
| `tdm.Tdm64_ChckEvidExtr.update` | Tdm00_Lookup_RelateAppr:202 | [`Tdm64_ChckEvidExtr.java:26`](../../tdm/services/Tdm64_ChckEvidExtr.md) | `UpdateDataModel(tdm64_chck_evid_extr)` 동적 INSERT/UPDATE → [`tdm64_chck_evid_extr.selectById`](../../tdm/sql/tdm64_chck_evid_extr.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`com01_relate_appr`](../../../db/tables/com.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`tdm08_manager_info`](../../../db/tables/tdm.md), [`tdm10_task`](../../../db/tables/tdm.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm13_task_relate_duty`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm45_manl_relate_ics`](../../../db/tables/tdm.md), [`tdm46_manl_relate_icr`](../../../db/tables/tdm.md), [`tdm47_manl_relate_dcr`](../../../db/tables/tdm.md), [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md), [`tdm54_chck_insuff`](../../../db/tables/tdm.md), [`tdm55_chck_record`](../../../db/tables/tdm.md), [`tdm56_chck_relate_appr`](../../../db/tables/tdm.md), [`tdm59_chck_appr_cmnt`](../../../db/tables/tdm.md), [`tdm60_chck_manl_appr`](../../../db/tables/tdm.md), [`tdm61_chck_insuff_appr`](../../../db/tables/tdm.md), [`tdm62_chck_cmnt_relate_org`](../../../db/tables/tdm.md), [`tdm64_chck_evid_extr`](../../../db/tables/tdm.md), [`tdm91_company_setup`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_exctdutymap_nm`, `f_get_tdmcheckcycle`, `f_get_tdmevidcount`, `f_get_tdmorg_id2`, `f_org_nm`, `f_sysdate`, `f_today`, `f_trunc`, `getperson`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm52_Tab_CheckManl (`client/vi/tdm/Tdm52_Tab_CheckManl.java`, 548줄)

- 레이아웃: north=vlc, center=tabPage
- 툴바 `buttonBarL`: 점검년월: {quickMoveField} 점검자: {checkEmpLookup} 검색: {searchText} {undoneCheckBox} {retrieveButton} {noticeEndDate}
- 툴바 `buttonBarR`: {selectCheckButton} {selectCancelButton}
- 입력·하위 화면: `quickMoveField` QuickMoveField, `undoneCheckBox` CheckBox, `searchText` TextField 빈칸="점검항목", `checkEmpLookup` LookupTriggerField, `tabPage` Tdm52_TabPage_CheckManl, `lookup` Emp00_Lookup_SelectSingleTdm
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - roleName 200 "직책" Text
  - exctName 80 "임원" TextCenter
  - monthManlCnt 80 "당월대상" LongCnt 편집:"404040"
  - monthCheckCnt 80 "점검건수" LongCnt 편집:"456EA6"
  - monthCheck1Cnt 80 "적정" LongCnt 편집:"456EA6"
  - monthCheck2Cnt 80 "미흡" LongCnt 편집:"456EA6"
  - monthCheck9Cnt 80 "해당없음" LongCnt 편집:"456EA6"
  - checkStatusName 100 "점검상태" TextStatus
  - actionCell 70 "점검시작" Cell 편집:startCell
  - actionCell 70 "시작취소" Cell 편집:cancelCell
  - orgStatusName 100 "승인상태" TextStatus
  - actionCell 70 "승인이력" Cell 편집:recordCell

#### 이벤트
[E0] 화면 열림 (생성자 L107-156) → settings()
[E1] checkEmpLookup.TriggerClick (L172) → execute(), retrieve()
[E2] searchText.KeyPress [Enter] (L200) → retrieve()
[E3] undoneCheckBox[진행&반려건만].ValueChange (L211) → retrieveTabPage()
[E4] selectCheckButton[일괄점검].Select (L220) → 인라인 L220-225 (new SelectHandler() { @Override publi…)
[E5] selectCancelButton[일괄점검취소].Select (L228) → 인라인 L228-233 (new SelectHandler() { @Override publi…)
[E6] retrieveButton[조회].Select (L235) → retrieve()
[E7] grid.SelectionChanged [선택>0] (L242) → retrieveTabPage()
[E8] messageBox.DialogHide (L415) → updateCheckStatus()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L69-72 | E1,buildGrid,retrieve | 상태 처리 | 업무 |
| public execute() | L76-79 | E1,buildGrid,retrieve | 상태 처리 | 업무 |
| public execute() | L102-104 | E1,buildGrid,retrieve | 상태 처리 | 업무 |
| private setIsManager() | L252-271 | settings | 서비스 tdm.Tdm08_ManagerInfo.checkIsManager(companyId, personId, stdDate) | 업무 |
| public retrieve() | L319-355 | E1,E2,E6,execute,updateCheckStatus | 서비스 tdm.Tdm51_ChckOrg.selectByOrgId(companyId, stdDate, checkYm, orgId, personId) | 업무 |
| private retrieveTabPage() | L357-370 | E3,E7,retrieve | 상태 처리 | 업무 |
| private checkPreStart() | L372-425 | buildGrid | 확인창 표시 | 업무 |
| private updateCheckStatus() | L427-453 | E8 | 미선택 시 alert, 서비스 tdm.Tdm52_ChckManl.updateCheckStatus(personId, actionType, stdDate) | 업무 |
| private setCheckEndInfo() | L455-504 | retrieve | 서비스 tdm.Tdm50_ChckJob.selectByCheckYm(companyId, checkYm, stdDate) | 업무 |
| private setNoticeStyle() | L544-547 | settings,setCheckEndInfo | 상태 처리 | 업무 |
| private settings() | L158-250 | 생성자 | 조회창 Emp00_Lookup_SelectSingleTdm 열기, 이벤트 연결, 초기값: undoneCheckBox=false("진행&반려건만") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L273-317 | 필드 초기화 | 조회창 Tdm55_Lookup_ChckRecord 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L531-534 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L535-537 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L538-540 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlSpace() | L541-543 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L301 newHeaderGroupMap05newHeaderGroupConfigsetHtmlGridStyle13 100 "점검결과" (tdm51_new_header_group_map05new_header_group_configset_html_grid_style13 컬럼 없음)
  gb.text('roleNm', 200, '직책'),  // L303 SQL 계산 컬럼(selectByOrgId: tdm20_role_nm)
  gb.textCenter('exctNm', 80, '임원'),  // L304 SQL 계산 컬럼(selectByOrgId: f_emp_kor_nm(tdm51_exct_id))
  // ⚠ 대응 없음 (GridBuilder L305) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L306) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L307) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L308) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L309) addLongCnt
  gb.textStatus('checkStatusNm', 100, '점검상태'),  // L310 SQL 계산 컬럼(selectByOrgId: f_cdnm('TdmCheckStatus', tdm51_check_st…)
  // ⚠ 대응 없음 (GridBuilder L311) addCell
  // ⚠ 대응 없음 (GridBuilder L312) addCell
  gb.textStatus('orgStatusNm', 100, '승인상태'),  // L313 SQL 계산 컬럼(selectByOrgId: f_cdnm('TdmCheckStatus', tdm51_org_stat…)
  // ⚠ 대응 없음 (GridBuilder L314) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={() => /* 인라인 L220-225 (new SelectHandler() { @Override publi…) */}>일괄점검</Button>
3. <Button type="unknown" onClick={() => /* 인라인 L228-233 (new SelectHandler() { @Override publi…) */}>일괄점검취소</Button>

### Tdm55_Lookup_ChckRecord (`client/vi/tdm/Tdm55_Lookup_ChckRecord.java`, 141줄)

- 툴바 `buttonBar`: * 의견이 잘린 경우 해당 컬럼을 더블 클릭하여 확인하세요:
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - rowNum 50 " " LongCenter
  - updDateStr 150 "처리일시" TextCenter
  - procType 100 "구분" Text
  - personInfo 200 "처리자" Text
  - procResult 80 "결과" TextCenter
  - resultCmnt 500 "의견" Text

#### 이벤트
[E0] 화면 열림 (생성자 L48-69) → settings(), show()
[E1] grid.CellDoubleClick [cellIndex == 6] (L72) → 인라인 L72-83 (new CellDoubleClickHandler() { @Overr…)
[E2] closeButton[닫기].Select (L85) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L37-40 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L42-46 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L107-132 | open | 서비스 tdm.Tdm55_ChckRecord.selectByChckOrgId, tdm.Tdm55_ChckRecord.selectByInsuffId, tdm.Tdm55_ChckRecord.selectByRelateId(chckOrgId, chckInsuffId, relateId) | 업무 |
| private settings() | L71-91 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L93-105 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L134-136 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L138-140 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.longCenter('rowNum', 50, ' '),  // L97 SQL 계산 컬럼(selectByChckOrgId: ROW_NUMBER() OVER(ORDER BY tdm55_upd_da…)
  gb.textCenter('updDateStr', 150, '처리일시'),  // L98 SQL 계산 컬럼(selectByChckOrgId: COALESCE(TO_CHAR(tdm55_upd_date, 'yyyy-…)
  gb.text('procType', 100, '구분'),  // L99
  gb.text('personInfo', 200, '처리자'),  // L100
  gb.textCenter('procResult', 80, '결과'),  // L101
  gb.text('resultCmnt', 500, '의견'),  // L102
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm52_TabPage_CheckManl (`client/vi/tdm/Tdm52_TabPage_CheckManl.java`, 254줄)

- 레이아웃: center=grid
- 입력·하위 화면: `searchText` TextField, `lookup` Tdm55_Lookup_ChckRecord
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - roleName 150 "직책" Text
  - commonTypeName 70 "구분" TextCenter
  - checkItem 650 "점검항목" TextArea
  - checkResultName 100 "점검결과" TextStatus
  - checkStatusName 100 "점검상태" TextStatus
  - checkStatusCode 80 "점검" DynamicCell 편집:actionCell01
  - actionCell 80 "점검이력" Cell 편집:actionCell02

#### 이벤트
[E0] 화면 열림 (생성자 L49-56) → 초기화
[E1] messageBox.DialogHide (L209) → lookupBatchCheckManl2()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public clear() | L87-89 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L91-100 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L102-123 | 미사용 후보 | 서비스 tdm.Tdm52_ChckManl.selectByPersonId(chckOrgId, personId, undoneYn, searchText) | 업무 |
| private lookupCheckManl() | L125-155 | buildGrid | 팝업 Tdm52_Edit_ChckManl 열기 | 업무 |
| public lookupBatchCheckManl() | L157-219 | 공개 메서드 | 확인창 표시 | 업무 |
| private lookupBatchCheckManl2() | L221-252 | E1 | 팝업 Tdm52_Edit_ChckManlBatch 열기, 서비스 tdm.Tdm52_ChckManl.batchCancelComplete(companyId, personId, stdDate) | 업무 |
| public buildGrid() | L58-85 | 필드 초기화 | 조회창 Tdm55_Lookup_ChckRecord 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('roleNm', 150, '직책'),  // L76 SQL 계산 컬럼(selectByPersonId: tdm43_role_nm)
  gb.textCenter('commonTypeNm', 70, '구분'),  // L77 SQL 계산 컬럼(selectByPersonId: CASE WHEN tdm10_common_yn = 'true' THEN…)
  gb.textArea('checkItem', 650, '점검항목'),  // L78 SQL 계산 컬럼(selectByPersonId: CONCAT('('||tdm43_manl_cd||') ', tdm43_…)
  gb.textStatus('checkResultNm', 100, '점검결과'),  // L79 SQL 계산 컬럼(selectByPersonId: f_cdnm('TdmCheckResult', tdm52_check_re…)
  gb.textStatus('checkStatusNm', 100, '점검상태'),  // L80 SQL 계산 컬럼(selectByPersonId: f_cdnm('TdmCheckStatus', tdm52_check_st…)
  // ⚠ 대응 없음 (GridBuilder L81) addDynamicCell
  // ⚠ 대응 없음 (GridBuilder L82) addCell
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Tdm52_Edit_ChckManlBatch (`client/vi/tdm/Tdm52_Edit_ChckManlBatch.java`, 236줄)

- 입력·하위 화면: `checkDate` MyDateField, `checkCmnt` MyTextArea, `checkResultName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택하세요", `lookup` Tdm00_Lookup_RelateAppr

#### 이벤트
[E0] 화면 열림 (생성자 L51-58) → 초기화
[E1] fileButton[증빙자료(0건)].Select (L100) → lookupFile()
[E2] completeButton[점검완료].Select (L107) → update()
[E3] closeButton[닫기].Select (L113) → close()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L60-75 | 공개 메서드 | 상태 처리 | 업무 |
| private getTmpFileParentId() | L77-87 | open | 상태 처리 | 업무 |
| private getEditor() | L121-144 | open | 상태 처리 | 업무 |
| private update() | L146-187 | E2 | 서비스 tdm.Tdm52_ChckManl.batchCheckComplete(companyId, personId, stdDate, checkDate, checkResultCode, checkResultName, checkCmnt, tmpFileParentId) | 업무 |
| private lookupFile() | L189-206 | E1 | 조회창 Tdm00_Lookup_RelateAppr 열기, 서비스 tdm.Tdm52_ChckManl.getFileCountStr(chckManlId) | 업무 |
| private close() | L208-225 | E3,update | 서비스 tdm.Tdm52_ChckManl.deleteTmpFile(tmpFileParentId) | 업무 |
| private settings() | L89-119 | open | 서비스 sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결, 초기값: checkDate=LoginUser.getToday(("점검일자") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L227-229 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L230-232 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L233-235 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={lookupFile}>증빙자료(0건)</Button>
2. <Button type="save" onClick={update}>점검완료</Button>
3. <Button type="unknown" onClick={close}>닫기</Button>

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

