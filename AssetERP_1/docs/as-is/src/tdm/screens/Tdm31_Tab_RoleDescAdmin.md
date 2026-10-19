# Tdm31_Tab_RoleDescAdmin

- 종류: 화면
- 메뉴: 기초자료 > 10. 책무 > 책무기술서 재생성 (#1493)
- 파일: `client/vi/tdm/Tdm31_Tab_RoleDescAdmin.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys01_Lookup_Company`](../../sys/components/Sys01_Lookup_Company.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys10_File.checkFileStatus` | Tdm31_Tab_RoleDescAdmin:334 | [`Sys10_File.java:591`](../../sys/services/Sys10_File.md) | - |
| `sys.Sys10_File.copyFile` | Tdm31_Tab_RoleDescAdmin:440 | [`Sys10_File.java:417`](../../sys/services/Sys10_File.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md), [`sys11_relate_file.insert`](../../sys/sql/sys11_relate_file.md) |
| `sys.Sys10_File.fileReName` | Tdm31_Tab_RoleDescAdmin:341 | [`Sys10_File.java:557`](../../sys/services/Sys10_File.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys10_file.insertUpdate`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.getServerPath` | Tdm31_Tab_RoleDescAdmin:289 | [`Sys10_File.java:231`](../../sys/services/Sys10_File.md) | [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `sys.Sys10_File.selectByParentId` | Tdm31_Tab_RoleDescAdmin:536 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys99_Print.CreateTdmRoleDesc` | Tdm31_Tab_RoleDescAdmin:274, Tdm31_Tab_RoleDescAdmin:397 | [`Sys99_Print.java:122`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPJobTp`](../../sys/sql/sys99_print.md), [`sys99_print.tdmCreateData`](../../sys/sql/sys99_print.md) |
| `tdm.Tdm31_RoleDesc.fileCheck` | Tdm31_Tab_RoleDescAdmin:517 | [`Tdm31_RoleDesc.java:66`](../../tdm/services/Tdm31_RoleDesc.md) | [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `tdm.Tdm31_RoleDesc.selectByRegDateAdmin` | Tdm31_Tab_RoleDescAdmin:262 | [`Tdm31_RoleDesc.java:32`](../../tdm/services/Tdm31_RoleDesc.md) | [`tdm31_role_desc.selectByRegDateAdmin`](../../tdm/sql/tdm31_role_desc.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md), [`tdm01_hr`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm31_role_desc`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_get_company_nm`, `f_get_emptrans`, `f_get_tdmpersoninfo`, `f_sysdate`, `f_today`, `gettdm30roleallc`, `tdm_create_data`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm31_Tab_RoleDescAdmin (`client/vi/tdm/Tdm31_Tab_RoleDescAdmin.java`, 572줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 고객사: {companyField} 조회기간: {startDate} ~: {closeDate} {notPeriodYn} 검색: {searchText} {endYn} {retrieveButton} {reCreateButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="직책/담당임원", `endYn` CheckBox, `notPeriodYn` CheckBox, `companyField` LookupTriggerField, `lookupCompany` Sys01_Lookup_Company, `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - regDate 90 "생성일" Date
  - reasonName 180 "생성사유" Text
  - companyName 180 "회사명" Text
  - personName 90 "임원명" TextCenter
  - allcStdDate 90 "임원의 최종<br>책무배분일" Date
  - roleName 200 "(본)직책" Text
  - addTitle 300 "겸직사항" Text
  - actionCell 80 "책무기술서" Cell 편집:actionCell01
  - apprStatusName 80 "결재상태" TextStatus

#### 이벤트
[E0] 화면 열림 (생성자 L82-119) → settings()
[E1] notPeriodYn[전체보기].ValueChange [event.getValue()] (L134) → retrieve()
[E2] companyField[ADMIN].TriggerClick [result != null] (L148) → 인라인 L148-167 (new TriggerClickHandler() { @Override…)
[E3] endYn[상신건만 조회].Change (L171) → retrieve()
[E4] searchText.KeyPress [Enter] (L180) → retrieve()
[E5] retrieveButton[조회].Select (L189) → retrieve()
[E6] reCreateButton[재생성].Select (L196) → reCreateFile()
[E7] button01[닫기].Select (L486) → 인라인 L486-491 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L235-269 | E1,E3,E4,E5 | 서비스 tdm.Tdm31_RoleDesc.selectByRegDateAdmin(companyId, startDate, closeDate, searchText, endYn, notPeriodYn) | 업무 |
| private createRd() | L271-391 | processRecreate | 확인창 표시, 서비스 sys.Sys99_Print.CreateTdmRoleDesc, sys.Sys10_File.getServerPath, sys.Sys10_File.checkFileStatus, sys.Sys10_File.fileReName(companyId, personId, windowClassName, pJobTp, allcStdDate, pId, companyId, filePathFull, parentId, companyId, filePath, filePathFull, fileName, fileType) | 업무 |
| private viewRd() | L393-434 | buildGrid,viewFile | 서비스 sys.Sys99_Print.CreateTdmRoleDesc(companyId, personId, windowClassName, pJobTp, allcStdDate, pId) | 업무 |
| private relateRdFile() | L437-464 | createRd | 확인창 표시, 서비스 sys.Sys10_File.copyFile(apprId, companyId, parentId, tableName) | 업무 |
| private reCreateFile() | L466-498 | E6 | 확인창 표시 | 업무 |
| private processRecreate() | L500-533 | reCreateFile | 확인창 표시, 서비스 tdm.Tdm31_RoleDesc.fileCheck(parentId) | 업무 |
| private viewFile() | L535-555 | buildGrid | 조회창 Sys10_Lookup_FileViewer 열기, 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private settings() | L121-203 | 생성자 | 조회창 Sys01_Lookup_Company 열기, 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday(, notPeriodYn=true("전체보기"), companyField=companyModel.getCompanyName(("ADMIN"), companyField="전체"("ADMIN"), endYn=true("상신건만 조회") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L205-233 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlContentStyle() | L557-559 | createRd,relateRdFile,reCreateFile,processRecreate | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L561-563 | reCreateFile | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L565-567 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L569-571 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 90, '생성일'),  // L222
  gb.text('reasonNm', 180, '생성사유'),  // L223 SQL 계산 컬럼(selectByRegDateAdmin: f_cdnm('TdmDescRegReason', tdm31_reason…)
  gb.text('companyNm', 180, '회사명'),  // L224 SQL 계산 컬럼(selectByRegDateAdmin: f_get_company_nm(tdm31_company_id))
  gb.textCenter('personNm', 90, '임원명'),  // L225 SQL 계산 컬럼(selectByRegDateAdmin: tdm01_person_nm)
  gb.date('allcStdDate', 90, '임원의 최종<br>책무배분일'),  // L226
  gb.text('roleNm', 200, '(본)직책'),  // L227 SQL 계산 컬럼(selectByRegDateAdmin: tdm20_role_nm)
  gb.text('addTitle', 300, '겸직사항'),  // L228 SQL 계산 컬럼(selectByRegDateAdmin: f_get_tdmPersonInfo(tdm31_person_id, td…)
  // ⚠ 대응 없음 (GridBuilder L229) addCell
  gb.textStatus('apprStatusNm', 80, '결재상태'),  // L230 SQL 계산 컬럼(selectByRegDateAdmin: f_cdnm('AprStatusCode', apr01_status_cd…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="reset" onClick={reCreateFile}>재생성</Button>
3. <Button type="unknown" onClick={() => /* 인라인 L486-491 (new SelectHandler() { @Override publi…) */}>닫기</Button>

