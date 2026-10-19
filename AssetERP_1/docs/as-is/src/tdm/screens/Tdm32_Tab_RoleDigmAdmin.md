# Tdm32_Tab_RoleDigmAdmin

- 종류: 화면
- 메뉴: 기초자료 > 10. 책무 > 책무체계도 재생성 (#1498)
- 파일: `client/vi/tdm/Tdm32_Tab_RoleDigmAdmin.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys01_Lookup_Company`](../../sys/components/Sys01_Lookup_Company.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys10_File.checkFileStatus` | Tdm32_Tab_RoleDigmAdmin:487 | [`Sys10_File.java:591`](../../sys/services/Sys10_File.md) | - |
| `sys.Sys10_File.copyFile` | Tdm32_Tab_RoleDigmAdmin:549 | [`Sys10_File.java:417`](../../sys/services/Sys10_File.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md), [`sys11_relate_file.insert`](../../sys/sql/sys11_relate_file.md) |
| `sys.Sys10_File.fileReName` | Tdm32_Tab_RoleDigmAdmin:494 | [`Sys10_File.java:557`](../../sys/services/Sys10_File.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys10_file.insertUpdate`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.getServerPath` | Tdm32_Tab_RoleDigmAdmin:442 | [`Sys10_File.java:231`](../../sys/services/Sys10_File.md) | [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `sys.Sys10_File.selectByParentId` | Tdm32_Tab_RoleDigmAdmin:203, Tdm32_Tab_RoleDigmAdmin:296 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys99_Print.CreateTdmRoleDigm` | Tdm32_Tab_RoleDigmAdmin:315, Tdm32_Tab_RoleDigmAdmin:427 | [`Sys99_Print.java:151`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPJobTp`](../../sys/sql/sys99_print.md), [`sys99_print.tdmCreateData`](../../sys/sql/sys99_print.md) |
| `tdm.Tdm32_RoleDigm.fileCheck` | Tdm32_Tab_RoleDigmAdmin:406 | [`Tdm32_RoleDigm.java:35`](../../tdm/services/Tdm32_RoleDigm.md) | [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `tdm.Tdm32_RoleDigm.selectByRegDateAdmin` | Tdm32_Tab_RoleDigmAdmin:267 | [`Tdm32_RoleDigm.java:30`](../../tdm/services/Tdm32_RoleDigm.md) | [`tdm32_role_digm.selectByRegDateAdmin`](../../tdm/sql/tdm32_role_digm.md) |
| `tdm.Tdm33_RoleDigmFile.selectByFileType` | Tdm32_Tab_RoleDigmAdmin:192, Tdm32_Tab_RoleDigmAdmin:277 | [`Tdm33_RoleDigmFile.java:32`](../../tdm/services/Tdm33_RoleDigmFile.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md), [`tdm33_role_digm_file.deleteByRoleDigmId`](../../tdm/sql/tdm33_role_digm_file.md), [`tdm33_role_digm_file.selectByFileType`](../../tdm/sql/tdm33_role_digm_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md), [`tdm32_role_digm`](../../../db/tables/tdm.md), [`tdm33_role_digm_file`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_get_company_nm`, `f_sysdate`, `f_today`, `tdm_create_data`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm32_Tab_RoleDigmAdmin (`client/vi/tdm/Tdm32_Tab_RoleDigmAdmin.java`, 590줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 고객사: {companyField} 조회기간: {startDate} ~: {closeDate} {notPeriodYn} {retrieveButton} {reCreateButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `notPeriodYn` CheckBox, `companyField` LookupTriggerField, `lookupCompany` Sys01_Lookup_Company, `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - companyName 180 "회사명" Text
  - regDate 120 "생성일" Date
  - allcStdDate 120 "책무배분기준일" Date
  - reasonName 300 "생성사유" Text
  - actionCell 80 "책무체계도" Cell 편집:actionCell01
  - useFileTypeName 150 "사용파일구분" Text
  - apprStatusName 80 "결재상태" TextStatus

#### 이벤트
[E0] 화면 열림 (생성자 L77-108) → settings()
[E1] notPeriodYn[전체보기].ValueChange [event.getValue()] (L123) → retrieve()
[E2] companyField[ADMIN].TriggerClick [result != null] (L137) → 인라인 L137-156 (new TriggerClickHandler() { @Override…)
[E3] retrieveButton[조회].Select (L158) → retrieve()
[E4] reCreateButton[재생성].Select (L165) → reCreateFile()
[E5] button01[닫기].Select (L375) → 인라인 L375-380 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L241-274 | E1,E3 | 서비스 tdm.Tdm32_RoleDigm.selectByRegDateAdmin(companyId, startDate, closeDate, endYn, notPeriodYn) | 업무 |
| private openRelateFile01() | L276-293 | buildGrid | 서비스 tdm.Tdm33_RoleDigmFile.selectByFileType(roleDigmId, fileType) | 업무 |
| private openRelateFile02() | L295-310 | openRelateFile01 | 조회창 Sys10_Lookup_FileViewer 열기 → 콜백: unmask, 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private viewRd() | L312-353 | buildGrid,openRelateFile01 | 서비스 sys.Sys99_Print.CreateTdmRoleDigm(companyId, personId, windowClassName, pJobTp, allcStdDate, pId) | 업무 |
| private reCreateFile() | L355-387 | E4 | 확인창 표시 | 업무 |
| private processRecreate() | L389-422 | reCreateFile | 확인창 표시, 서비스 tdm.Tdm32_RoleDigm.fileCheck(parentId) | 업무 |
| private createRd() | L424-544 | processRecreate | 확인창 표시, 서비스 sys.Sys99_Print.CreateTdmRoleDigm, sys.Sys10_File.getServerPath, sys.Sys10_File.checkFileStatus, sys.Sys10_File.fileReName(companyId, personId, windowClassName, pJobTp, allcStdDate, pId, companyId, filePathFull, parentId, companyId, filePath, filePathFull, fileName, fileType) | 업무 |
| private relateRdFile() | L546-573 | createRd | 확인창 표시, 서비스 sys.Sys10_File.copyFile(apprId, companyId, parentId, tableName) | 업무 |
| private settings() | L110-172 | 생성자 | 조회창 Sys01_Lookup_Company 열기, 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday(, notPeriodYn=true("전체보기"), companyField=companyModel.getCompanyName(("ADMIN"), companyField="전체"("ADMIN") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L174-239 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기 → 콜백: unmask, 서비스 tdm.Tdm33_RoleDigmFile.selectByFileType, sys.Sys10_File.selectByParentId(roleDigmId, fileType, parentId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L575-577 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlContentStyle() | L579-581 | reCreateFile,processRecreate,createRd,relateRdFile | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L583-585 | reCreateFile | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L587-589 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 180, '회사명'),  // L230 SQL 계산 컬럼(selectByRegDateAdmin: f_get_company_nm(tdm32_company_id))
  gb.date('regDate', 120, '생성일'),  // L231
  gb.date('allcStdDate', 120, '책무배분기준일'),  // L232
  gb.text('reasonNm', 300, '생성사유'),  // L233 SQL 계산 컬럼(selectByRegDateAdmin: f_cdnm('TdmDescRegReason', tdm32_reason…)
  // ⚠ 대응 없음 (GridBuilder L234) addCell
  gb.text('useFileTypeNm', 150, '사용파일구분'),  // L235 SQL 계산 컬럼(selectByRegDateAdmin: f_cdnm('TdmUseFileType', tdm32_use_file…)
  gb.textStatus('apprStatusNm', 80, '결재상태'),  // L236 SQL 계산 컬럼(selectByRegDateAdmin: f_cdnm('AprStatusCode', apr01_status_cd…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="reset" onClick={reCreateFile}>재생성</Button>
3. <Button type="unknown" onClick={() => /* 인라인 L375-380 (new SelectHandler() { @Override publi…) */}>닫기</Button>

