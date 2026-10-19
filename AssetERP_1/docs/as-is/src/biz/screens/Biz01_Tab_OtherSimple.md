# Biz01_Tab_OtherSimple

- 종류: 화면
- 메뉴: 준법감시 > 40. 이익제공(수령)현황 > (s)이익제공입력(현금,물품) (#1320)
- 파일: `client/vi/biz/Biz01_Tab_OtherSimple.java`
- 함께 쓰는 클래스 4개:
  - `Biz01_Edit_OtherSimple` `client/vi/biz/Biz01_Edit_OtherSimple.java`
  - `Biz05_Lookup_RelateAppr` `client/vi/biz/Biz05_Lookup_RelateAppr.java`
  - `Biz05_Lookup_RelateFile` `client/vi/biz/Biz05_Lookup_RelateFile.java`
  - `Biz01_Lookup_ProvideCompany` `client/vi/biz/Biz01_Lookup_ProvideCompany.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr05_Lookup_LoadDoc`](../../apr/components/Apr05_Lookup_LoadDoc.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Biz05_Lookup_RelateAppr:128 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `biz.Biz01_Promo.delete` | Biz01_Tab_OtherSimple:220 | [`Biz01_Promo.java:669`](../../biz/services/Biz01_Promo.md) | [`biz02_person.delete`](../../biz/sql/biz02_person.md), `UpdateDataModel(biz01_promo)` 동적 DELETE |
| `biz.Biz01_Promo.modelUpdate` | Biz01_Edit_OtherSimple:283 | [`Biz01_Promo.java:655`](../../biz/services/Biz01_Promo.md) | `UpdateDataModel(biz01_promo)` 동적 INSERT/UPDATE → [`biz01_promo.selectById`](../../biz/sql/biz01_promo.md) |
| `biz.Biz01_Promo.selectByOther` | Biz01_Tab_OtherSimple:186 | [`Biz01_Promo.java:106`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.selectByOther`](../../biz/sql/biz01_promo.md) |
| `biz.Biz01_Promo.selectByProvideCompany` | Biz01_Lookup_ProvideCompany:131 | [`Biz01_Promo.java:126`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.selectByProvideCompany`](../../biz/sql/biz01_promo.md) |
| `biz.Biz05_RelateAppr.delete` | Biz05_Lookup_RelateAppr:200 | [`Biz05_RelateAppr.java:213`](../../biz/services/Biz05_RelateAppr.md) | `UpdateDataModel(biz05_relate_appr)` 동적 DELETE |
| `biz.Biz05_RelateAppr.modelUpdate` | Biz05_Lookup_RelateAppr:182 | [`Biz05_RelateAppr.java:102`](../../biz/services/Biz05_RelateAppr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz05_relate_appr)` 동적 INSERT/UPDATE → [`biz05_relate_appr.selectById`](../../biz/sql/biz05_relate_appr.md) |
| `biz.Biz05_RelateAppr.selectByPromoId` | Biz05_Lookup_RelateAppr:169 | [`Biz05_RelateAppr.java:26`](../../biz/services/Biz05_RelateAppr.md) | [`biz05_relate_appr.selectByPromoId`](../../biz/sql/biz05_relate_appr.md) |
| `biz.Biz05_RelateAppr.selectFileCount` | Biz01_Edit_OtherSimple:309 | [`Biz05_RelateAppr.java:92`](../../biz/services/Biz05_RelateAppr.md) | [`biz05_relate_appr.selectFileCount`](../../biz/sql/biz05_relate_appr.md) |
| `sys.Sys09_Code.selectByKindCode` | Biz01_Edit_OtherSimple:56 | [`Sys09_Code.java:128`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByKindCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys10_File.selectByParentId` | Biz05_Lookup_RelateFile:176 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Biz05_Lookup_RelateFile:182 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`biz01_promo`](../../../db/tables/biz.md), [`biz02_person`](../../../db/tables/biz.md), [`biz05_relate_appr`](../../../db/tables/biz.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_nvl`, `f_org_nm`, `f_org_parent_full_nm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Biz01_Tab_OtherSimple (`client/vi/biz/Biz01_Tab_OtherSimple.java`, 236줄)

- 레이아웃: center=vlc01, east=editOther
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 제공/수령: {provideRcvComboBox} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `editOther` Biz01_Edit_OtherSimple, `startDate` MyDateField, `closeDate` MyDateField, `provideRcvComboBox` ComboBoxField("ProvideRcvType", "%", "전체") 빈칸="전체"
- 그리드 `grid` (buildGrid()):
  - provideRcvTypeName 120 "제공/수령" TextCenter
  - provideDate 100 "제공(수령)일자" Date
  - providePurName 120 "목적" TextCenter
  - provideContentName 120 "내역" TextCenter
  - provideAmt 100 "경제적가치" Long
  - provideCompany 150 "거래상대방" Text
  - pepleCount 80 "인원" LongCenter
  - averagePrice2 120 "인당 경제적가치" Long
  - note 300 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L55-92) → setting(), retrieve()
[E1] grid.SelectionChanged [선택>0] (L112) → retrieveTabpage()
[E2] retrieveButton[조회].Select (L120) → retrieve()
[E3] insertButton[등록].Select (L126) → insertRow()
[E4] deleteButton[삭제].Select (L132) → deleteRow()
       └ [E5] msgBox.DialogHide [YES] (L213) → 서비스 biz.Biz01_Promo.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L94-138 | 생성자 | 상태 처리 | 업무 |
| private retrieveTabpage() | L157-167 | E1 | 상태 처리 | 업무 |
| public retrieve() | L169-198 | 생성자,E2,retrieveTabpage | 서비스 biz.Biz01_Promo.selectByOther(companyId, personId, startDate, closeDate, provideRcvType) | 업무 |
| private insertRow() | L200-208 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L210-231 | E4 | ConfirmBox → E5 | 업무 |
| public buildGrid() | L140-155 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L233-235 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('provideRcvTypeNm', 120, '제공/수령'),  // L144
  gb.date('provideDate', 100, '제공(수령)일자'),  // L145
  gb.textCenter('providePurNm', 120, '목적'),  // L146
  gb.textCenter('provideContentNm', 120, '내역'),  // L147
  gb.long('provideAmt', 100, '경제적가치'),  // L148
  gb.text('provideCompany', 150, '거래상대방'),  // L149
  gb.longCenter('pepleCount', 80, '인원'),  // L150
  gb.long('averagePrice2', 120, '인당 경제적가치'),  // L151
  gb.text('note', 300, '비고'),  // L152
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Biz01_Edit_OtherSimple (`client/vi/biz/Biz01_Edit_OtherSimple.java`, 329줄)

- 입력·하위 화면: `provideRcvTypeName` ComboBoxField("ProvideRcvType") 빈칸="선택", `providePurName` CommonComboBoxField("sys.Sys09_Code.selectByKindCode") 빈칸="선택", `provideContentName` CommonComboBoxField("sys.Sys09_Code.selectByKindCode") 빈칸="선택", `provideDate` MyDateField, `provideRcvType` TextField, `providePurCode` TextField, `provideContentCode` TextField, `note` MyTextArea, `provideAmt` LongField, `pepleCount` LongField, `provideCompany` LookupTriggerField, `lookupCompany` Biz01_Lookup_ProvideCompany, `lookup` Biz05_Lookup_RelateAppr

#### 이벤트
[E0] 화면 열림 (생성자 L73-82) → setting(), getEditor()
[E1] updateButton[저장].Select (L96) → update()
[E2] provideRcvTypeName[ProvideRcvType].Collapse [preValue == null] (L122) → setComboProvidePur()
[E3] providePurName[sys.Sys09_Code.selectByKindCode].Collapse [preValue == null] (L164) → setComboProvideContent()
[E4] provideContentName[sys.Sys09_Code.selectByKindCode].Collapse (L196) → 인라인 L196-201 (new CollapseHandler(){ @Override publ…)
[E5] provideCompany[거래상대방].TriggerClick [result != null] (L203) → 인라인 L203-216 (new TriggerClickHandler() { @Override…)
[E6] fileButton[증빙자료(0건)].Select (L218) → setFileButtonText()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public editModel() | L84-92 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L94-230 | 생성자 | 조회창 Biz01_Lookup_ProvideCompany 열기, 조회창 Biz05_Lookup_RelateAppr 열기 | 업무 |
| private getEditor() | L232-249 | 생성자 | 상태 처리 | 업무 |
| public update() | L251-292 | E1 | 서비스 biz.Biz01_Promo.modelUpdate | 업무 |
| private setComboProvidePur() | L294-299 | E2,editModel | 서비스 sys.Sys09_Code.selectByKindCode | 업무 |
| private setComboProvideContent() | L300-305 | E3,editModel | 서비스 sys.Sys09_Code.selectByKindCode | 업무 |
| private setFileButtonText() | L308-320 | E6,editModel | 서비스 biz.Biz05_RelateAppr.selectFileCount(promoId) | 업무 |
| private setHtmlStyle() | L322-324 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L326-328 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

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

### Biz01_Lookup_ProvideCompany (`client/vi/biz/Biz01_Lookup_ProvideCompany.java`, 160줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid()):
  - provideCompany 270 "거래상대방" Text

#### 이벤트
[E1] searchText.KeyPress [Enter] (L80) → retrieve()
[E2] retrieveButton[조회].Select (L89) → retrieve()
[E3] oKButton[선택].Select (L95) → confirm()
[E4] cancelButton[닫기].Select (L101) → hide()
[E5] grid.CellDoubleClick (L108) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L46-49 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L51-77 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L125-137 | E1,E2,open | 서비스 biz.Biz01_Promo.selectByProvideCompany(companyId, searchText) | 업무 |
| public confirm() | L139-150 | E3,E5 | 미선택 시 alert "선택된 내역이 없습니다" | 업무 |
| private settings() | L79-114 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L116-123 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L152-154 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L156-158 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('provideCompany', 270, '거래상대방'),  // L120
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="select" onClick={confirm}>선택</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

