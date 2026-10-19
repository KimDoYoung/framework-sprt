# Biz01_Tab_Other

- 종류: 화면
- 메뉴: 준법감시 > 40. 이익제공(수령)현황 > 이익제공 입력(현금,물품) (#1132)
- 파일: `client/vi/biz/Biz01_Tab_Other.java`
- 함께 쓰는 클래스 6개:
  - `Biz02_Grid_PersonList` `client/vi/biz/Biz02_Grid_PersonList.java`
  - `Biz02_Grid_InternalList` `client/vi/biz/Biz02_Grid_InternalList.java`
  - `Biz02_Grid_ExternalList` `client/vi/biz/Biz02_Grid_ExternalList.java`
  - `Biz01_Edit_Other` `client/vi/biz/Biz01_Edit_Other.java`
  - `Biz05_Lookup_RelateAppr` `client/vi/biz/Biz05_Lookup_RelateAppr.java`
  - `Biz05_Lookup_RelateFile` `client/vi/biz/Biz05_Lookup_RelateFile.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr05_Lookup_LoadDoc`](../../apr/components/Apr05_Lookup_LoadDoc.md), [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Mkt01_Lookup_Select`](../../mkt/components/Mkt01_Lookup_Select.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Biz05_Lookup_RelateAppr:128 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `biz.Biz01_Promo.closeCheck` | Biz02_Grid_ExternalList:217, Biz02_Grid_InternalList:216 | [`Biz01_Promo.java:182`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.closeCheck`](../../biz/sql/biz01_promo.md) |
| `biz.Biz01_Promo.delete` | Biz01_Tab_Other:263 | [`Biz01_Promo.java:669`](../../biz/services/Biz01_Promo.md) | [`biz02_person.delete`](../../biz/sql/biz02_person.md), `UpdateDataModel(biz01_promo)` 동적 DELETE |
| `biz.Biz01_Promo.modelUpdate` | Biz01_Edit_Other:242 | [`Biz01_Promo.java:655`](../../biz/services/Biz01_Promo.md) | `UpdateDataModel(biz01_promo)` 동적 INSERT/UPDATE → [`biz01_promo.selectById`](../../biz/sql/biz01_promo.md) |
| `biz.Biz01_Promo.selectByOther` | Biz01_Tab_Other:221 | [`Biz01_Promo.java:106`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.selectByOther`](../../biz/sql/biz01_promo.md) |
| `biz.Biz02_Person.delete` | Biz02_Grid_ExternalList:189, Biz02_Grid_InternalList:188 | [`Biz02_Person.java:118`](../../biz/services/Biz02_Person.md) | `UpdateDataModel(biz02_person)` 동적 DELETE |
| `biz.Biz02_Person.insertEmpId` | Biz01_Edit_Other:262 | [`Biz02_Person.java:59`](../../biz/services/Biz02_Person.md) | [`biz02_person.insert`](../../biz/sql/biz02_person.md), [`biz02_person.selectByEmpId`](../../biz/sql/biz02_person.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `biz.Biz02_Person.modelUpdate` | Biz02_Grid_ExternalList:156, Biz02_Grid_InternalList:153 | [`Biz02_Person.java:99`](../../biz/services/Biz02_Person.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz02_person)` 동적 INSERT/UPDATE → [`biz02_person.selectById`](../../biz/sql/biz02_person.md) |
| `biz.Biz02_Person.selectByExternal` | Biz02_Grid_ExternalList:115 | [`Biz02_Person.java:32`](../../biz/services/Biz02_Person.md) | [`biz02_person.selectByExternal`](../../biz/sql/biz02_person.md) |
| `biz.Biz02_Person.selectByInternal` | Biz02_Grid_InternalList:114 | [`Biz02_Person.java:26`](../../biz/services/Biz02_Person.md) | [`biz02_person.selectByInternal`](../../biz/sql/biz02_person.md) |
| `biz.Biz02_Person.update` | Biz02_Grid_ExternalList:132, Biz02_Grid_InternalList:131 | [`Biz02_Person.java:113`](../../biz/services/Biz02_Person.md) | `UpdateDataModel(biz02_person)` 동적 INSERT/UPDATE → [`biz02_person.selectById`](../../biz/sql/biz02_person.md) |
| `biz.Biz04_ProvideSetup.selectByProvideContentCode` | Biz01_Edit_Other:283 | [`Biz04_ProvideSetup.java:26`](../../biz/services/Biz04_ProvideSetup.md) | [`biz04_provide_setup.selectByProvideContentCode`](../../biz/sql/biz04_provide_setup.md) |
| `biz.Biz05_RelateAppr.delete` | Biz05_Lookup_RelateAppr:200 | [`Biz05_RelateAppr.java:213`](../../biz/services/Biz05_RelateAppr.md) | `UpdateDataModel(biz05_relate_appr)` 동적 DELETE |
| `biz.Biz05_RelateAppr.modelUpdate` | Biz05_Lookup_RelateAppr:182 | [`Biz05_RelateAppr.java:102`](../../biz/services/Biz05_RelateAppr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz05_relate_appr)` 동적 INSERT/UPDATE → [`biz05_relate_appr.selectById`](../../biz/sql/biz05_relate_appr.md) |
| `biz.Biz05_RelateAppr.selectByPromoId` | Biz05_Lookup_RelateAppr:169 | [`Biz05_RelateAppr.java:26`](../../biz/services/Biz05_RelateAppr.md) | [`biz05_relate_appr.selectByPromoId`](../../biz/sql/biz05_relate_appr.md) |
| `biz.Biz05_RelateAppr.selectFileCount` | Biz01_Edit_Other:303 | [`Biz05_RelateAppr.java:92`](../../biz/services/Biz05_RelateAppr.md) | [`biz05_relate_appr.selectFileCount`](../../biz/sql/biz05_relate_appr.md) |
| `sys.Sys09_Code.selectByKindCode` | Biz01_Edit_Other:67 | [`Sys09_Code.java:128`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByKindCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys10_File.selectByParentId` | Biz05_Lookup_RelateFile:176 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Biz05_Lookup_RelateFile:182 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`biz01_promo`](../../../db/tables/biz.md), [`biz02_person`](../../../db/tables/biz.md), [`biz04_provide_setup`](../../../db/tables/biz.md), [`biz05_relate_appr`](../../../db/tables/biz.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_nvl`, `f_org_nm`, `f_org_parent_full_nm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Biz01_Tab_Other (`client/vi/biz/Biz01_Tab_Other.java`, 279줄)

- 레이아웃: center=vlc01, east=vlc02
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 제공/수령: {provideRcvComboBox} {retrieveButton} {insertButton} {deleteButton} {contactPointButton}
- 입력·하위 화면: `editOther` Biz01_Edit_Other, `startDate` MyDateField, `closeDate` MyDateField, `provideRcvComboBox` ComboBoxField("ProvideRcvType", "%", "전체") 빈칸="전체"
- 그리드 `grid` (buildGrid()):
  - provideRcvTypeName 150 "제공/수령" TextCenter
  - provideDate 100 "제공(수령)일자" Date
  - providePurName 150 "목적" TextCenter
  - provideContentName 150 "내역" TextCenter
  - provideAmt 200 "경제적가치" Long
  - totalPeple 100 "인원" Long
  - averagePrice 150 "인당 경제적가치" Long
  - note 300 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L62-103) → setting(), retrieve()
[E1] grid.SelectionChanged [선택>0] (L124) → retrieveTabpage()
[E2] retrieveButton[조회].Select (L132) → retrieve()
[E3] insertButton[등록].Select (L138) → insertRow()
[E4] deleteButton[삭제].Select (L144) → deleteRow()
       └ [E6] msgBox.DialogHide [YES] (L256) → 서비스 biz.Biz01_Promo.delete
[E5] contactPointButton[거래처 관리 바로가기].Select (L150) → 인라인 L150-161 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L105-162 | 생성자 | 상태 처리 | 업무 |
| private retrieveTabpage() | L183-202 | E1 | 상태 처리 | 업무 |
| public retrieve() | L204-233 | 생성자,E2,retrieveTabpage | 서비스 biz.Biz01_Promo.selectByOther(companyId, personId, startDate, closeDate, provideRcvType) | 업무 |
| private insertRow() | L235-245 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L247-274 | E4 | ConfirmBox → E6 | 업무 |
| public buildGrid() | L164-181 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L276-278 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('provideRcvTypeNm', 150, '제공/수령'),  // L168
  gb.date('provideDate', 100, '제공(수령)일자'),  // L169
  gb.textCenter('providePurNm', 150, '목적'),  // L170
  gb.textCenter('provideContentNm', 150, '내역'),  // L171
  gb.long('provideAmt', 200, '경제적가치'),  // L172
  gb.long('totalPeple', 100, '인원'),  // L173
  gb.long('averagePrice', 150, '인당 경제적가치'),  // L174
  gb.text('note', 300, '비고'),  // L175
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="goto" onClick={() => /* 인라인 L150-161 (new SelectHandler() { @Override publi…) */}>거래처 관리 바로가기</Button>

### Biz02_Grid_PersonList (`client/vi/biz/Biz02_Grid_PersonList.java`, 46줄)


#### 이벤트
[E0] 화면 열림 (생성자 L14-17) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public setting() | L19-22 | 공개 메서드 | 상태 처리 | 업무 |
| public setButtonVisible() | L24-27 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L29-45 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Biz02_Grid_InternalList (`client/vi/biz/Biz02_Grid_InternalList.java`, 236줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 직원: {insertButton} {deleteButton}
- 입력·하위 화면: `lookupEmpTransInfo` Emp00_Lookup_SelectMulti
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - orgName 200 "본부(부서)" TextCenter
  - empName 100 "성명" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L57-74) → setting()
[E1] insertButton[등록].Select (L77) → closeCheck(), insertRow()
[E2] deleteButton[삭제].Select (L90) → closeCheck(), deleteRow()
       └ [E3] msgBox.DialogHide [YES] (L181) → 서비스 biz.Biz02_Person.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L76-97 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L108-120 | insertRow | 서비스 biz.Biz02_Person.selectByInternal(promoId) | 업무 |
| public retrieve() | L122-127 | insertRow | 상태 처리 | 업무 |
| public update() | L129-137 | 공개 메서드 | 서비스 biz.Biz02_Person.update | 업무 |
| private insertRow() | L139-170 | E1 | 조회창 Emp00_Lookup_SelectMulti 열기, 서비스 biz.Biz02_Person.modelUpdate | 업무 |
| public deleteRow() | L172-204 | E2 | ConfirmBox → E3 | 업무 |
| public setButtonVisible() | L206-210 | 공개 메서드 | 상태 처리 | 업무 |
| private closeCheck() | L212-231 | E1,E2 | 서비스 biz.Biz01_Promo.closeCheck | 업무 |
| public buildGrid() | L99-106 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxStyle() | L233-235 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('orgNm', 200, '본부(부서)'),  // L102 SQL 계산 컬럼(selectByInternal: f_org_nm(c.emp03_org_code_id, b.biz01_p…)
  gb.textCenter('empNm', 100, '성명'),  // L103 SQL 계산 컬럼(selectByInternal: f_emp_kor_nm(a.biz02_emp_id))
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={() => /* closeCheck(), insertRow() */}>등록</Button>
2. <Button type="delete" onClick={() => /* closeCheck(), deleteRow() */}>삭제</Button>

### Biz02_Grid_ExternalList (`client/vi/biz/Biz02_Grid_ExternalList.java`, 237줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 거래상대방: {insertButton} {deleteButton}
- 입력·하위 화면: `lookup` Mkt01_Lookup_Select
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - targetCompanyName 170 "회사명" Text
  - targetEmpName 70 "성명" Text
  - targetOrgName 100 "부서" Text

#### 이벤트
[E0] 화면 열림 (생성자 L56-74) → setting()
[E1] insertButton[등록].Select (L77) → closeCheck(), insertRow()
[E2] deleteButton[삭제].Select (L90) → closeCheck(), deleteRow()
       └ [E3] msgBox.DialogHide [YES] (L182) → 서비스 biz.Biz02_Person.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L76-97 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L109-121 | insertRow | 서비스 biz.Biz02_Person.selectByExternal(promoId) | 업무 |
| public retrieve() | L123-128 | insertRow | 상태 처리 | 업무 |
| public update() | L130-138 | 공개 메서드 | 서비스 biz.Biz02_Person.update | 업무 |
| public insertRow() | L140-171 | E1 | 조회창 Mkt01_Lookup_Select 열기, 서비스 biz.Biz02_Person.modelUpdate | 업무 |
| public deleteRow() | L173-205 | E2 | ConfirmBox → E3 | 업무 |
| public setButtonVisible() | L207-211 | 공개 메서드 | 상태 처리 | 업무 |
| private closeCheck() | L213-232 | E1,E2 | 서비스 biz.Biz01_Promo.closeCheck | 업무 |
| public buildGrid() | L99-107 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxStyle() | L234-236 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('targetCompanyNm', 170, '회사명'),  // L102
  gb.text('targetEmpNm', 70, '성명'),  // L103
  gb.text('targetOrgNm', 100, '부서'),  // L104
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={() => /* closeCheck(), insertRow() */}>등록</Button>
2. <Button type="delete" onClick={() => /* closeCheck(), deleteRow() */}>삭제</Button>

### Biz01_Edit_Other (`client/vi/biz/Biz01_Edit_Other.java`, 323줄)

- 입력·하위 화면: `provideDate` MyDateField, `provideRcvType` TextField, `providePurCode` TextField, `provideContentCode` TextField, `note` MyTextArea, `provideAmt` LongField, `provideRcvTypeName` ComboBoxField("ProvideRcvType") 빈칸="선택", `providePurName` CommonComboBoxField("sys.Sys09_Code.selectByKindCode") 빈칸="선택", `provideContentName` CommonComboBoxField("sys.Sys09_Code.selectByKindCode") 빈칸="선택", `lookup` Biz05_Lookup_RelateAppr

#### 이벤트
[E0] 화면 열림 (생성자 L73-82) → setting(), getEditor()
[E1] updateButton[저장].Select (L102) → update()
[E2] fileButton[증빙자료(0건)].Select (L108) → setFileButtonText()
[E3] provideRcvTypeName[ProvideRcvType].Collapse [preValue == null] (L130) → 서비스 sys.Sys09_Code.selectByKindCode
[E4] providePurName[sys.Sys09_Code.selectByKindCode].Collapse [preValue == null] (L156) → 서비스 sys.Sys09_Code.selectByKindCode
[E5] provideContentName[sys.Sys09_Code.selectByKindCode].Collapse [preValue == null] (L181) → insertEmp()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public editModel() | L84-90 | 공개 메서드 | 상태 처리 | 업무 |
| public editModel2() | L92-99 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L101-199 | 생성자 | 조회창 Biz05_Lookup_RelateAppr 열기, 서비스 sys.Sys09_Code.selectByKindCode, sys.Sys09_Code.selectByKindCode | 업무 |
| private getEditor() | L201-216 | 생성자 | 상태 처리 | 업무 |
| public update() | L218-251 | E1 | 서비스 biz.Biz01_Promo.modelUpdate | 업무 |
| private insertEmp() | L253-280 | E5 | 서비스 biz.Biz02_Person.insertEmpId(empId) | 업무 |
| private getEmpSetupYn() | L282-299 | insertEmp | 서비스 biz.Biz04_ProvideSetup.selectByProvideContentCode(companyId, provideContentCode) | 업무 |
| private setFileButtonText() | L302-314 | E2,editModel,editModel2 | 서비스 biz.Biz05_RelateAppr.selectFileCount(promoId) | 업무 |
| private setHtmlStyle() | L316-318 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L320-322 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={setFileButtonText}>증빙자료(0건)</Button>

### Biz05_Lookup_RelateAppr (`client/vi/biz/Biz05_Lookup_RelateAppr.java`, 207줄)

- 툴바 `buttonBar`: {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `fileList` Biz05_Lookup_RelateFile, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - title 370 "제목" Text
  - regDate 90 "등록일" Date
  - effectDate 90 "시행일" Date
  - regEmpName 80 "등록자" TextCenter
  - statusName 80 "상신상태" TextCenter
  - actionCell 70 "상세보기" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L97-120) → show()
[E1] retrieveButton[조회].Select (L68) → retrieve()
[E2] insertButton[불러오기].Select (L74) → insert()
[E3] deleteButton[연결제거].Select (L80) → delete()
[E4] closeButton[닫기].Select [callback != null] (L86) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L56-65 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L164-170 | E1,open,insert | 서비스 biz.Biz05_RelateAppr.selectByPromoId(companyId, promoId) | 업무 |
| private insert() | L172-195 | E2 | 조회창 Apr05_Lookup_LoadDoc 열기, 서비스 biz.Biz05_RelateAppr.modelUpdate | 업무 |
| private delete() | L197-201 | E3 | GridDeleteData biz.Biz05_RelateAppr.delete(체크된 행 목록) | 업무 |
| private settings() | L67-95 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L122-162 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L203-205 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('title', 370, '제목'),  // L154 SQL 계산 컬럼(selectByPromoId: b.apr01_title)
  gb.date('regDate', 90, '등록일'),  // L155 SQL 계산 컬럼(selectByPromoId: b.apr01_reg_date)
  gb.date('effectDate', 90, '시행일'),  // L156 SQL 계산 컬럼(selectByPromoId: b.apr01_effect_date)
  gb.textCenter('regEmpNm', 80, '등록자'),  // L157 SQL 계산 컬럼(selectByPromoId: f_emp_kor_nm(b.apr01_reg_emp_id))
  gb.textCenter('statusNm', 80, '상신상태'),  // L158 SQL 계산 컬럼(selectByPromoId: f_cdnm('AprStatusCode', b.apr01_status_…)
  // ⚠ 대응 없음 (GridBuilder L159) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>불러오기</Button>
3. <Button type="delete" onClick={delete}>연결제거</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Biz05_Lookup_RelateFile (`client/vi/biz/Biz05_Lookup_RelateFile.java`, 209줄)

- 툴바 `buttonBar`: {uploadFileButton} {fileUploadForm}
- 입력·하위 화면: `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildFileGrid(), 체크박스):
  - fileName 450 "첨부파일" Text
  - actionCell 50 "보기" Cell 편집:viewCell
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L60-99) → 초기화
[E1] fileUpload.Change (L68) → 인라인 L68-75 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L78) → retrieve()
[E3] uploadFileButton[파일업로드].Select (L105) → 인라인 L105-110 (new SelectHandler() { @Override publi…)
[E4] fileDeleteForm.SubmitComplete (L115) → retrieve()
[E5] messageBox.DialogHide [YES] (L143) → checkFileDelete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L54-58 | 공개 메서드 | 상태 처리 | 업무 |
| private buildFileGrid() | L123-171 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 확인창 표시 | 업무 |
| public retrieve() | L173-177 | E2,E4,open,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private checkFileDelete() | L179-204 | E5 | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| public clear() | L206-208 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L101-121 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
```javascript
const buildFileGrid = () => [
  gb.text('fileNm', 450, '첨부파일'),  // L165
  // ⚠ 대응 없음 (GridBuilder L166) addCell
  // ⚠ 대응 없음 (GridBuilder L167) addCell
  // ⚠ 대응 없음 (GridBuilder L168) addCell
];
```

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 인라인 L105-110 (new SelectHandler() { @Override publi…) */}>파일업로드</Button>

