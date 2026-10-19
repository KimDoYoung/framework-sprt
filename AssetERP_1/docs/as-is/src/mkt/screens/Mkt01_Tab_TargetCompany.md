# Mkt01_Tab_TargetCompany

- 종류: 화면
- 메뉴: 커뮤니티 > 03. 업무활동 > 업무활동등록 (#1405)
- 파일: `client/vi/mkt/Mkt01_Tab_TargetCompany.java`
- 함께 쓰는 클래스 8개:
  - `Mkt01_Grid_TargetCompany` `client/vi/mkt/Mkt01_Grid_TargetCompany.java`
  - `Mkt03_Grid_History` `client/vi/mkt/Mkt03_Grid_History.java`
  - `Mkt01_Lookup_TargetCompany` `client/vi/mkt/Mkt01_Lookup_TargetCompany.java`
  - `Mkt05_Lookup_Share` `client/vi/mkt/Mkt05_Lookup_Share.java`
  - `Mkt01_Lookup_SelectCompany` `client/vi/mkt/Mkt01_Lookup_SelectCompany.java`
  - `Mkt01_Lookup_Favorite` `client/vi/mkt/Mkt01_Lookup_Favorite.java`
  - `Mkt01_Lookup_FavoriteInsert` `client/vi/mkt/Mkt01_Lookup_FavoriteInsert.java`
  - `Mkt01_Lookup_ExcelUpload` `client/vi/mkt/Mkt01_Lookup_ExcelUpload.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Mkt03_Lookup_History`](../../mkt/components/Mkt03_Lookup_History.md), [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md), [`Sys10_Lookup_File`](../../sys/components/Sys10_Lookup_File.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `getSeq` | Mkt01_Lookup_TargetCompany:138 | (공통) 채번 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `mkt.Mkt01_TargetCompany.delete` | Mkt01_Grid_TargetCompany:325 | [`Mkt01_TargetCompany.java:71`](../../mkt/services/Mkt01_TargetCompany.md) | [`mkt02_manager.deleteByTargetCompanyId`](../../mkt/sql/mkt02_manager.md), [`mkt05_share.deleteByParentId`](../../mkt/sql/mkt05_share.md), `UpdateDataModel(mkt01_target_company)` 동적 DELETE |
| `mkt.Mkt01_TargetCompany.selectByCompanyIdPaging` | Mkt01_Grid_TargetCompany:96, Mkt01_Lookup_SelectCompany:110 | [`Mkt01_TargetCompany.java:28`](../../mkt/services/Mkt01_TargetCompany.md) | [`mkt01_target_company.selectByCompanyIdPaging`](../../mkt/sql/mkt01_target_company.md), [`mkt01_target_company.selectByCompanyIdTotal`](../../mkt/sql/mkt01_target_company.md) |
| `mkt.Mkt01_TargetCompany.selectById` | Mkt01_Lookup_TargetCompany:154 | [`Mkt01_TargetCompany.java:18`](../../mkt/services/Mkt01_TargetCompany.md) | [`mkt01_target_company.selectById`](../../mkt/sql/mkt01_target_company.md) |
| `mkt.Mkt01_TargetCompany.selectBySearchTextPaging` | Mkt01_Lookup_FavoriteInsert:101 | [`Mkt01_TargetCompany.java:34`](../../mkt/services/Mkt01_TargetCompany.md) | [`mkt01_target_company.selectBySearchTextPaging`](../../mkt/sql/mkt01_target_company.md), [`mkt01_target_company.selectBySearchTextTotal`](../../mkt/sql/mkt01_target_company.md) |
| `mkt.Mkt01_TargetCompany.selectFavoritePaging` | Mkt01_Lookup_Favorite:113 | [`Mkt01_TargetCompany.java:52`](../../mkt/services/Mkt01_TargetCompany.md) | [`mkt01_target_company.selectFavoritePaging`](../../mkt/sql/mkt01_target_company.md), [`mkt01_target_company.selectFavoriteTotal`](../../mkt/sql/mkt01_target_company.md) |
| `mkt.Mkt01_TargetCompany.updateOne` | Mkt01_Lookup_TargetCompany:411 | [`Mkt01_TargetCompany.java:58`](../../mkt/services/Mkt01_TargetCompany.md) | `UpdateDataModel(mkt01_target_company)` 동적 INSERT/UPDATE → [`mkt01_target_company.selectById`](../../mkt/sql/mkt01_target_company.md) |
| `mkt.Mkt02_Manager.delete` | Mkt01_Lookup_TargetCompany:357 | [`Mkt02_Manager.java:56`](../../mkt/services/Mkt02_Manager.md) | `UpdateDataModel(mkt02_manager)` 동적 DELETE |
| `mkt.Mkt02_Manager.selectByTargetCompanyId` | Mkt01_Lookup_TargetCompany:382 | [`Mkt02_Manager.java:25`](../../mkt/services/Mkt02_Manager.md) | [`mkt02_manager.selectByTargetCompanyId`](../../mkt/sql/mkt02_manager.md) |
| `mkt.Mkt02_Manager.update` | Mkt01_Lookup_TargetCompany:367 | [`Mkt02_Manager.java:51`](../../mkt/services/Mkt02_Manager.md) | `UpdateDataModel(mkt02_manager)` 동적 INSERT/UPDATE → [`mkt02_manager.selectById`](../../mkt/sql/mkt02_manager.md) |
| `mkt.Mkt02_Manager.updateTargetCompanyId` | Mkt01_Lookup_SelectCompany:194 | [`Mkt02_Manager.java:30`](../../mkt/services/Mkt02_Manager.md) | [`mkt02_manager.updateTargetCompanyId`](../../mkt/sql/mkt02_manager.md) |
| `mkt.Mkt03_History.checkByTargetCompanyId` | Mkt01_Grid_TargetCompany:295 | [`Mkt03_History.java:34`](../../mkt/services/Mkt03_History.md) | [`mkt03_history.checkByTargetCompanyId`](../../mkt/sql/mkt03_history.md) |
| `mkt.Mkt03_History.delete` | Mkt03_Grid_History:252 | [`Mkt03_History.java:61`](../../mkt/services/Mkt03_History.md) | [`mkt04_relate_fund.deleteByHistoryId`](../../mkt/sql/mkt04_relate_fund.md), [`mkt05_share.deleteByParentId`](../../mkt/sql/mkt05_share.md), `UpdateDataModel(mkt03_history)` 동적 DELETE |
| `mkt.Mkt03_History.selectByTargetCompanyId` | Mkt03_Grid_History:191 | [`Mkt03_History.java:24`](../../mkt/services/Mkt03_History.md) | [`mkt03_history.selectByTargetCompanyId`](../../mkt/sql/mkt03_history.md) |
| `mkt.Mkt05_Share.delete` | Mkt05_Lookup_Share:252 | [`Mkt05_Share.java:50`](../../mkt/services/Mkt05_Share.md) | `UpdateDataModel(mkt05_share)` 동적 DELETE |
| `mkt.Mkt05_Share.selectByParentId` | Mkt05_Lookup_Share:312 | [`Mkt05_Share.java:21`](../../mkt/services/Mkt05_Share.md) | [`mkt05_share.selectByParentId`](../../mkt/sql/mkt05_share.md) |
| `mkt.Mkt05_Share.selectShareInfo` | Mkt05_Lookup_Share:280 | [`Mkt05_Share.java:26`](../../mkt/services/Mkt05_Share.md) | [`mkt05_share.selectShareInfo`](../../mkt/sql/mkt05_share.md) |
| `mkt.Mkt05_Share.update` | Mkt05_Lookup_Share:266 | [`Mkt05_Share.java:45`](../../mkt/services/Mkt05_Share.md) | `UpdateDataModel(mkt05_share)` 동적 INSERT/UPDATE → [`mkt05_share.selectById`](../../mkt/sql/mkt05_share.md) |
| `mkt.Mkt06_Favorite.deleteList` | Mkt01_Lookup_Favorite:210 | [`Mkt06_Favorite.java:51`](../../mkt/services/Mkt06_Favorite.md) | [`mkt06_favorite.deleteFavoriteId`](../../mkt/sql/mkt06_favorite.md), `UpdateDataModel(mkt06_favorite)` 동적 DELETE |
| `mkt.Mkt06_Favorite.modelUpdate` | Mkt01_Lookup_Favorite:185 | [`Mkt06_Favorite.java:32`](../../mkt/services/Mkt06_Favorite.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(mkt06_favorite)` 동적 INSERT/UPDATE → [`mkt06_favorite.selectById`](../../mkt/sql/mkt06_favorite.md) |
| `sys.Sys09_Code.selectByCode` | Mkt01_Tab_TargetCompany:80 | [`Sys09_Code.java:100`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys99_Print.insertRdTargetCompany` | Mkt01_Grid_TargetCompany:347 | [`Sys99_Print.java:4942`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`mkt01_target_company.selectBySearchText`](../../mkt/sql/mkt01_target_company.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`fnd02_fund_info`](../../../db/tables/fnd.md), [`mkt01_target_company`](../../../db/tables/mkt.md), [`mkt02_manager`](../../../db/tables/mkt.md), [`mkt03_history`](../../../db/tables/mkt.md), [`mkt04_relate_fund`](../../../db/tables/mkt.md), [`mkt05_share`](../../../db/tables/mkt.md), [`mkt06_favorite`](../../../db/tables/mkt.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Mkt01_Tab_TargetCompany (`client/vi/mkt/Mkt01_Tab_TargetCompany.java`, 89줄)

- 레이아웃: west=cp, center=targetCompany
- 입력·하위 화면: `itemTypeCode` TextField, `itemTypeName` TextField
- 그리드 `itemTypeGrid` (buildGrid(), 행번호숨김):
  - name 255 "" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L29-63) → retrieve()
[E1] itemTypeGrid.Selection (L32) → 인라인 L32-37 (new SelectionHandler<Sys09_CodeModel>…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L75-88 | 생성자 | 서비스 sys.Sys09_Code.selectByCode(companyId, itemTypeCodeName) | 업무 |
| private buildGrid() | L65-73 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textArea('name', 255, ''),  // L70
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Mkt01_Grid_TargetCompany (`client/vi/mkt/Mkt01_Grid_TargetCompany.java`, 387줄)

- 레이아웃: north=buttonBar, center=vlcGrid, south=historyPage, center=vlcGrid
- 툴바 `buttonBar`: 검색: {searchText} {unUseCheckBox} {retrieveButton} {insertButton} {deleteButton} {favoriteButton} {downLoadButton} {dataUploadButton}
- 입력·하위 화면: `searchText` TextField 빈칸="활동처/주요사항", `unUseCheckBox` CheckBox, `itemTypeCode` TextField, `lookup` Mkt01_Lookup_ExcelUpload
- 그리드 `grid` (buildGrid(), 체크박스):
  - actionCell 40 "수정" Cell 편집:modiCell
  - targetCompanyName 250 "회사명" Text
  - managerInfo 150 "담당자" Text
  - itemTypeName 150 "구분" Text
  - note 600 "주요사항" Text
  - unuseYn 70 "미사용" BooleanYn2

#### 이벤트
[E0] 화면 열림 (생성자 L74-126) → setting(), retrieve()
[E1] searchText.KeyPress [Enter] (L132) → retrieve()
[E2] grid.SelectionChanged [선택>0] (L144) → retrieveHistory()
[E3] retrieveButton[조회].Select (L153) → retrieve()
[E4] insertButton[등록].Select (L159) → insertRow()
[E5] deleteButton[삭제].Select (L165) → preDelete()
       └ [E9] messageBox.DialogHide (L308) → deleteRow()
[E6] favoriteButton[즐겨찾기].Select (L171) → favoriteSetting()
[E7] downLoadButton[출력/다운로드].Select (L177) → downLoad()
[E8] dataUploadButton[데이터업로드].Select (L183) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L128-195 | 생성자 | 조회창 Mkt01_Lookup_ExcelUpload 열기 | 업무 |
| private retrieveHistory() | L223-225 | E2 | 상태 처리 | 업무 |
| public retrieve() | L227-237 | 생성자,E1,E3,E8 | 상태 처리 | 업무 |
| public retrieve() | L240-267 | 생성자,E1,E3,E8 | 상태 처리 | 업무 |
| public update() | L270-271 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L274-281 | E4 | 조회창 Mkt01_Lookup_TargetCompany 열기 | 업무 |
| private preDelete() | L283-320 | E5 | ConfirmBox → E9 | 업무 |
| public deleteRow() | L323-337 | E9 | GridDeleteData mkt.Mkt01_TargetCompany.delete(체크된 행 목록) | 업무 |
| public favoriteSetting() | L339-342 | E6 | 조회창 Mkt01_Lookup_Favorite 열기 | 업무 |
| private downLoad() | L344-379 | E7 | 서비스 sys.Sys99_Print.insertRdTargetCompany(companyId, personId, windowClassName, searchText, itemTypeCode) | 업무 |
| public buildGrid() | L197-221 | 필드 초기화 | 조회창 Mkt01_Lookup_TargetCompany 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L381-383 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L384-386 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L213) addCell
  gb.text('targetCompanyNm', 250, '회사명'),  // L214
  gb.text('managerInfo', 150, '담당자'),  // L215
  gb.text('itemTypeNm', 150, '구분'),  // L216
  gb.text('note', 600, '주요사항'),  // L217
  gb.booleanYn2('unuseYn', 70, '미사용'),  // L218
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={preDelete}>삭제</Button>
4. <Button type="unknown" onClick={favoriteSetting}>즐겨찾기</Button>
5. <Button type="download" onClick={downLoad}>출력/다운로드</Button>
6. <Button type="unknown" onClick={retrieve}>데이터업로드</Button>

### Mkt03_Grid_History (`client/vi/mkt/Mkt03_Grid_History.java`, 276줄)

- 툴바 `buttonBar`: ▼ 업무활동내역: {startDate} ~: {closeDate} 검색: {searchText} {allTargetCompanyYn} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `allTargetCompanyYn` CheckBox, `searchText` TextField 빈칸="활동처/활동내용/작성자", `lookup` Sys10_Lookup_File
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - actionCell 40 "수정" Cell 편집:editCell
  - activityDate 100 "활동일" Date
  - targetCompanyName 150 "활동처" Text
  - activityTitle 350 "활동내용" Text
  - fundInfo 250 "연결펀드" Text
  - fileCount 70 "첨부파일" TextCenter
  - actionCell 35 " " Cell 편집:viewCell
  - regDate 100 "작성일" Date
  - personOrgName 200 "작성자" Text
  - shareInfo 200 "공유" Text

#### 이벤트
[E0] 화면 열림 (생성자 L59-87) → setting()
[E1] searchText.KeyPress [Enter] (L102) → retrieve()
[E2] retrieveButton[조회].Select (L114) → retrieve()
[E3] insertButton[등록].Select (L120) → insert()
[E4] deleteButton[삭제].Select (L126) → preDelete()
       └ [E5] messageBox.DialogHide [YES] (L239) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public setItemType() | L89-91 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L93-132 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L177-197 | E1,E2 | 서비스 mkt.Mkt03_History.selectByTargetCompanyId(companyId, orgId, personId, itemType, targetCompanyId, startDate, closeDate, allContactYn, searchText) | 업무 |
| private getTargetCompanyId() | L199-205 | retrieve,insert | 상태 처리 | 업무 |
| private insert() | L207-221 | E3 | 조회창 Mkt03_Lookup_History 열기, 미선택 시 alert "상단의 활동처를 선택하세요" | 업무 |
| private preDelete() | L223-248 | E4 | ConfirmBox → E5 | 업무 |
| private delete() | L250-264 | E5 | GridDeleteData mkt.Mkt03_History.delete | 업무 |
| public buildGrid() | L134-175 | 필드 초기화 | 조회창 Sys10_Lookup_File 열기, 조회창 Mkt03_Lookup_History 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L266-268 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L269-271 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L272-274 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L163) addCell
  gb.date('activityDate', 100, '활동일'),  // L164
  gb.text('targetCompanyNm', 150, '활동처'),  // L165
  gb.text('activityTitle', 350, '활동내용'),  // L166
  gb.text('fundInfo', 250, '연결펀드'),  // L167
  gb.textCenter('fileCount', 70, '첨부파일'),  // L168
  // ⚠ 대응 없음 (GridBuilder L169) addCell
  gb.date('regDate', 100, '작성일'),  // L170
  gb.text('personOrgNm', 200, '작성자'),  // L171
  gb.text('shareInfo', 200, '공유'),  // L172
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="delete" onClick={preDelete}>삭제</Button>

### Mkt01_Lookup_TargetCompany (`client/vi/mkt/Mkt01_Lookup_TargetCompany.java`, 470줄)

- 툴바 `managerButtonBar`: {insertManagerButton} {deleteManagerButton} {updateManagerButton} {companyChangeButton} {refreshManagerButton}
- 입력·하위 화면: `note` MyTextArea, `targetCompanyName` TextField, `addr` TextField, `tel` TextField, `shareInfo` TextField, `unuseYn` CheckBox, `itemTypeCode` TextField, `itemTypeName` ComboBoxField("CrmItemTypeCode") 빈칸="선택하세요", `lookup` Mkt01_Lookup_SelectCompany
- 그리드 `managerGrid` (managerGirdBuilder(), 체크박스(다중)):
  - managerName 80 "담당자" TextCenter 편집:TextField
  - orgName 130 "부서" Text 편집:TextField
  - posName 100 "직위" TextCenter 편집:TextField
  - tel 200 "전화" Text 편집:TextField
  - emailAddr 180 "이메일" Text 편집:TextField
  - note 230 "비고" TextArea 편집:TextField
  - retireInfo 100 "퇴직정보" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L97-116) → getEditor(), show()
[E1] insertManagerButton[행 추가].Select (L182) → managerInsertRow()
[E2] deleteManagerButton[행 삭제].Select (L188) → managerDeleteRow()
[E3] updateManagerButton[저장].Select (L194) → managerUpdate()
[E4] companyChangeButton[활동처 변경].Select (L200) → companyChange()
[E5] refreshManagerButton.MouseDown (L206) → retrieveManager()
[E6] updateButton[저장].Select (L213) → update()
[E7] cancleButton[닫기].Select (L219) → hide()
[E8] shareButton[설정].Select (L234) → lookupShare()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNew() | L118-151 | 공개 메서드 | 상태 처리 | 업무 |
| public open2() | L153-164 | 공개 메서드 | 서비스 mkt.Mkt01_TargetCompany.selectById(targetCompanyId) | 업무 |
| public open() | L166-175 | open2 | 상태 처리 | 업무 |
| private setting() | L177-240 | openNew,open | 상태 처리 | 업무 |
| private getEditor() | L242-286 | 생성자 | 상태 처리 | 업무 |
| private managerVlc() | L288-301 | getEditor | 상태 처리 | 업무 |
| private managerGirdBuilder() | L303-317 | 필드 초기화 | 상태 처리 | 업무 |
| private managerInsertRow() | L319-326 | E1 | 상태 처리 | 업무 |
| private managerDeleteRow() | L328-334 | E2 | 상태 처리 | 업무 |
| private managerUpdate() | L336-374 | E3 | GridDeleteData mkt.Mkt02_Manager.delete, mkt.Mkt02_Manager.update | 업무 |
| private retrieveManager() | L376-388 | E5,open,companyChange | 서비스 mkt.Mkt02_Manager.selectByTargetCompanyId(targetCompanyId) | 업무 |
| private update() | L390-425 | E6 | 서비스 mkt.Mkt01_TargetCompany.updateOne | 업무 |
| private companyChange() | L427-440 | E4 | 조회창 Mkt01_Lookup_SelectCompany 열기 | 업무 |
| private lookupShare() | L442-452 | E8 | 조회창 Mkt05_Lookup_Share 열기 | 업무 |
| private setHtmlStyle() | L454-456 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L458-460 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L462-464 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlGrayStyle() | L466-468 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const managerGirdBuilder = () => [
  gb.textCenter('managerNm', 80, '담당자', { editor: 'text' }),  // L308
  gb.text('orgNm', 130, '부서', { editor: 'text' }),  // L309
  gb.textCenter('posNm', 100, '직위', { editor: 'text' }),  // L310
  gb.text('tel', 200, '전화', { editor: 'text' }),  // L311
  gb.text('emailAddr', 180, '이메일', { editor: 'text' }),  // L312
  gb.textArea('note', 230, '비고', { editor: 'text' }),  // L313
  gb.text('retireInfo', 100, '퇴직정보', { editor: 'text' }),  // L314
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={managerInsertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={managerDeleteRow}>행 삭제</Button>
3. <Button type="save" onClick={managerUpdate}>저장</Button>
4. <Button type="unknown" onClick={companyChange}>활동처 변경</Button>
5. <Button type="register" onClick={lookupShare}>설정</Button>
6. <Button type="save" onClick={update}>저장</Button>
7. <Button type="unknown" onClick={hide}>닫기</Button>

### Mkt05_Lookup_Share (`client/vi/mkt/Mkt05_Lookup_Share.java`, 319줄)

- 툴바 `buttonBar`: {hlc}
- 입력·하위 화면: `radio01` Radio, `radio02` Radio, `orgSearch` Org00_Lookup_SelectMulti, `lookupEmpTransInfo` Emp00_Lookup_SelectMulti
- 그리드 `grid` (grid(), 체크박스(다중)):
  - shareName 70 "구분" TextCenter
  - orgName 250 "부서" Text
  - personName 100 "성명" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L77-107) → show()
[E1] updateButton[저장].Select (L84) → update()
[E2] closeButton[닫기].Select (L90) → hide()
[E3] anchor.MouseDown (L123) → retrieve()
[E4] insertButton[행 추가].Select (L137) → insertRow()
[E5] deleteButton[행 삭제].Select (L143) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L109-112 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L114-118 | 공개 메서드 | 상태 처리 | 업무 |
| private ButtonSetting() | L120-159 | open | 상태 처리 | 업무 |
| private grid() | L161-170 | 필드 초기화 | 상태 처리 | 업무 |
| private openLookupOrgInfo() | L172-198 | insertRow | 조회창 Org00_Lookup_SelectMulti 열기 | 업무 |
| private openLookupEmpInfo() | L200-228 | insertRow | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| private insertRow() | L230-238 | E4 | 상태 처리 | 업무 |
| private update() | L240-275 | E1 | GridDeleteData mkt.Mkt05_Share.delete, mkt.Mkt05_Share.update | 업무 |
| private updateEnd() | L277-298 | update | 서비스 mkt.Mkt05_Share.selectShareInfo(parentId) | 업무 |
| private deleteRow() | L300-306 | E5 | 상태 처리 | 업무 |
| private retrieve() | L308-313 | E3,open | 서비스 mkt.Mkt05_Share.selectByParentId(parentId) | 업무 |
| private setHtmlHeaderStyle() | L315-317 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const grid = () => [
  gb.textCenter('shareNm', 70, '구분'),  // L165 SQL 계산 컬럼(selectByParentId: f_cdnm('ShareCode', mkt05_share_cd, mkt…)
  gb.text('orgNm', 250, '부서'),  // L166 SQL 계산 컬럼(selectByParentId: f_org_nm(mkt05_org_id, f_today()))
  gb.textCenter('personNm', 100, '성명'),  // L167 SQL 계산 컬럼(selectByParentId: f_emp_kor_nm(mkt05_person_id))
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="addRow" onClick={insertRow}>행 추가</Button>
4. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>

### Mkt01_Lookup_SelectCompany (`client/vi/mkt/Mkt01_Lookup_SelectCompany.java`, 216줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="활동처"
- 그리드 `grid` (buildGrid(), 체크박스):
  - targetCompanyName 270 "활동처" Text
  - note 270 "주요사항" Text

#### 이벤트
[E1] searchText.KeyPress [Enter] (L70) → retrieve()
[E2] retrieveButton[조회].Select (L80) → retrieve()
[E3] oKButton[확인].Select (L86) → confirm()
[E4] cancelButton[취소].Select (L92) → hide()
[E5] grid.CellDoubleClick (L124) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L60-136 | 공개 메서드 | 서비스 mkt.Mkt01_TargetCompany.selectByCompanyIdPaging | 업무 |
| public retrieve() | L150-173 | E1,E2,open | 상태 처리 | 업무 |
| public confirm() | L175-185 | E3,E5 | 미선택 시 alert "선택된 활동처가 없습니다" | 업무 |
| private companyChange() | L187-207 | confirm | 서비스 mkt.Mkt02_Manager.updateTargetCompanyId(targetCompanyId) | 업무 |
| private buildGrid() | L138-148 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L209-211 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L213-215 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('targetCompanyNm', 270, '활동처'),  // L144
  gb.text('note', 270, '주요사항'),  // L145
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

### Mkt01_Lookup_Favorite (`client/vi/mkt/Mkt01_Lookup_Favorite.java`, 230줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `searchText` TextField 빈칸="활동처/담당자", `lookup` Mkt01_Lookup_FavoriteInsert
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - targetCompanyName 300 "활동처" Text
  - managerName 140 "담당자" Text
  - managerPosName 140 "직위" Text
  - managerOrgName 290 "부서" Text

#### 이벤트
[E1] searchText.KeyPress [Enter] (L66) → retrieve()
[E2] retrieveButton[조회].Select (L76) → retrieve()
[E3] insertButton[추가].Select (L82) → insert()
[E4] deleteButton[제거].Select (L88) → delete()
       └ [E6] messageBox.DialogHide (L204) → retrieve()
[E5] closeButton[닫기].Select (L94) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L58-131 | 공개 메서드 | 서비스 mkt.Mkt01_TargetCompany.selectFavoritePaging | 업무 |
| public retrieve() | L146-169 | E1,E2,E6,open,insert | 상태 처리 | 업무 |
| public insert() | L171-199 | E3 | 조회창 Mkt01_Lookup_FavoriteInsert 열기, 서비스 mkt.Mkt06_Favorite.modelUpdate | 업무 |
| private delete() | L201-221 | E4 | ConfirmBox → E6 | 업무 |
| private buildGrid() | L133-144 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L223-225 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L227-229 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('targetCompanyNm', 300, '활동처'),  // L138
  gb.text('managerNm', 140, '담당자'),  // L139
  gb.text('managerPosNm', 140, '직위'),  // L140
  gb.text('managerOrgNm', 290, '부서'),  // L141
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>추가</Button>
3. <Button type="delete" onClick={delete}>제거</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Mkt01_Lookup_FavoriteInsert (`client/vi/mkt/Mkt01_Lookup_FavoriteInsert.java`, 196줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="활동처/담당자"
- 그리드 `buildGrid` (buildGrid(), 체크박스(다중), 체크박스):
  - targetCompanyName 250 "활동처" Text
  - managerName 100 "담당자" Text
  - managerPosName 100 "직위" Text
  - managerOrgName 200 "부서" Text

#### 이벤트
[E1] searchText.KeyPress [Enter] (L62) → retrieve()
[E2] retrieveButton[조회].Select (L72) → retrieve()
[E3] oKButton[확인].Select (L78) → confirm()
[E4] cancelButton[취소].Select (L84) → hide()
[E5] grid.CellDoubleClick (L115) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L51-127 | 공개 메서드 | 서비스 mkt.Mkt01_TargetCompany.selectBySearchTextPaging | 업무 |
| public retrieve() | L147-170 | E1,E2,open | 상태 처리 | 업무 |
| public confirm() | L172-187 | E3,E5 | 미선택 시 alert "선택된 활동처가 없습니다" | 업무 |
| private buildGrid() | L129-145 | open | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L189-191 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L193-195 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('targetCompanyNm', 250, '활동처'),  // L139
  gb.text('managerNm', 100, '담당자'),  // L140
  gb.text('managerPosNm', 100, '직위'),  // L141
  gb.text('managerOrgNm', 200, '부서'),  // L142
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

### Mkt01_Lookup_ExcelUpload (`client/vi/mkt/Mkt01_Lookup_ExcelUpload.java`, 143줄)


#### 이벤트
[E0] 화면 열림 (생성자 L46-65) → settings(), show()
[E1] tempDownloadButton[템플릿].Select (L70) → 인라인 L70-75 (new SelectHandler(){ @Override public…)
[E2] excelUploadButton[엑셀업로드].Select (L76) → excelUpload()
[E3] cancleButton[닫기].Select (L82) → hide()
[E4] uploadExcelForm.SubmitComplete (L93) → hide()
[E5] fileUploadField.Change (L130) → 인라인 L130-135 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L40-44 | 공개 메서드 | 상태 처리 | 업무 |
| private excelUpload() | L109-138 | E2 | 상태 처리 | 업무 |
| private settings() | L67-107 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L140-142 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="download" onClick={() => /* 인라인 L70-75 (new SelectHandler(){ @Override public…) */}>템플릿</Button>
2. <Button type="upload" onClick={excelUpload}>엑셀업로드</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

