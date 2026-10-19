# Fnd25_Tab_FundTermsManager

- 종류: 화면
- 메뉴: 펀드관리 > 02. 펀드관리 > 펀드규약 등록 (#1503)
- 파일: `client/vi/fnd/Fnd25_Tab_FundTermsManager.java`
- 함께 쓰는 클래스 3개:
  - `Fnd25_Lookup_FundTermsManager` `client/vi/fnd/Fnd25_Lookup_FundTermsManager.java`
  - `Fnd25_Grid_FundTermsDetail` `client/vi/fnd/Fnd25_Grid_FundTermsDetail.java`
  - `Fnd25_Edit_FundTermsManager` `client/vi/fnd/Fnd25_Edit_FundTermsManager.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Com01_Lookup_RelateFile`](../../com/components/Com01_Lookup_RelateFile.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd26_TermsDetail.delete` | Fnd25_Grid_FundTermsDetail:187 | [`Fnd26_TermsDetail.java:137`](../../fnd/services/Fnd26_TermsDetail.md) | `UpdateDataModel(fnd26_terms_detail)` 동적 DELETE |
| `fnd.Fnd26_TermsDetail.deleteAll` | Fnd25_Lookup_FundTermsManager:164 | [`Fnd26_TermsDetail.java:125`](../../fnd/services/Fnd26_TermsDetail.md) | [`fnd25_terms.deleteByTermsId`](../../fnd/sql/fnd25_terms.md), [`fnd26_terms_detail.deleteByTermsId`](../../fnd/sql/fnd26_terms_detail.md) |
| `fnd.Fnd26_TermsDetail.selectBySearchText` | Fnd25_Tab_FundTermsManager:169 | [`Fnd26_TermsDetail.java:27`](../../fnd/services/Fnd26_TermsDetail.md) | [`fnd26_terms_detail.selectBySearchText`](../../fnd/sql/fnd26_terms_detail.md) |
| `fnd.Fnd26_TermsDetail.selectBySearchTextManager` | Fnd25_Grid_FundTermsDetail:170 | [`Fnd26_TermsDetail.java:32`](../../fnd/services/Fnd26_TermsDetail.md) | [`fnd26_terms_detail.selectBySearchTextManager`](../../fnd/sql/fnd26_terms_detail.md) |
| `fnd.Fnd26_TermsDetail.update` | Fnd25_Edit_FundTermsManager:368, Fnd25_Lookup_FundTermsManager:139 | [`Fnd26_TermsDetail.java:37`](../../fnd/services/Fnd26_TermsDetail.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`fnd26_terms_detail.RevisionNoCheck`](../../fnd/sql/fnd26_terms_detail.md), `UpdateDataModel(fnd25_terms)` 동적 INSERT/UPDATE → [`fnd25_terms.selectById`](../../fnd/sql/fnd25_terms.md), `UpdateDataModel(fnd26_terms_detail)` 동적 INSERT/UPDATE → [`fnd26_terms_detail.selectById`](../../fnd/sql/fnd26_terms_detail.md) |
| `sys.Sys09_Code.selectByCodeKind` | Fnd25_Edit_FundTermsManager:115, Fnd25_Lookup_FundTermsManager:117 | [`Sys09_Code.java:82`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByCodeKind`](../../sys/sql/sys09_code.md) |
| `sys.Sys10_File.selectByParentId` | Fnd25_Edit_FundTermsManager:311 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`fnd25_terms`](../../../db/tables/fnd.md), [`fnd26_terms_detail`](../../../db/tables/fnd.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd25_Tab_FundTermsManager (`client/vi/fnd/Fnd25_Tab_FundTermsManager.java`, 236줄)

- 레이아웃: west=vlc, center=detailGrid
- 툴바 `buttonBar`: 구분: {fundTermsName} 검색: {searchTextField} {retrieveButton} {insertButton}
- 입력·하위 화면: `searchTextField` TextField 빈칸="펀드규약명", `fundTermsName` ComboBoxField("FundTermsType", "%", "전체", "전체"), `lookup` Fnd25_Lookup_FundTermsManager
- 그리드 `grid` (buildGrid()):
  - actionCell 55 "수정" Cell 편집:editCell
  - termsTypeName 80 "구분" Text
  - termsName 320 "펀드규약명" Text
  - revisionDate 90 "제개정일" Date
  - revisionNo 70 "개정회차" LongCenter

#### 이벤트
[E0] 화면 열림 (생성자 L56-87) → settings(), retrieve()
[E1] searchTextField.KeyPress [Enter] (L93) → retrieve()
[E2] grid.SelectionChanged [선택>0] (L102) → retrieveTabPage()
[E3] retrieveButton[조회].Select (L111) → retrieve()
[E4] insertButton[등록].Select (L117) → insert()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L39-41 | buildGrid,retrieve,insert | 상태 처리 | 업무 |
| public execute() | L50-53 | buildGrid,retrieve,insert | 상태 처리 | 업무 |
| private retrieve() | L151-215 | 생성자,E1,E3,execute,buildGrid,insert | 서비스 fnd.Fnd26_TermsDetail.selectBySearchText(companyId, termsType, searchText) | 업무 |
| private retrieveTabPage() | L217-220 | E2,retrieve | 상태 처리 | 업무 |
| public insert() | L222-230 | E4 | 팝업 Fnd25_Edit_FundTermsManager 열기 | 업무 |
| public settings() | L89-123 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L125-149 | 필드 초기화 | 조회창 Fnd25_Lookup_FundTermsManager 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L232-234 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L142) addCell
  gb.text('termsTypeNm', 80, '구분'),  // L143 SQL 계산 컬럼(selectBySearchText: f_cdnm('FundTermsType', fnd25.fnd25_ter…)
  gb.text('termsNm', 320, '펀드규약명'),  // L144
  gb.date('revisionDate', 90, '제개정일'),  // L145
  gb.longCenter('revisionNo', 70, '개정회차'),  // L146
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>

### Fnd25_Lookup_FundTermsManager (`client/vi/fnd/Fnd25_Lookup_FundTermsManager.java`, 190줄)

- 입력·하위 화면: `termsName` TextField, `seq` LongField, `termsType` TextField, `termsTypeName` CommonComboBoxField("sys.Sys09_Code.selectByCodeKind") 빈칸="(선택하세요)"

#### 이벤트
[E0] 화면 열림 (생성자 L78-110) → show()
[E1] updateButton[저장].Select (L86) → update()
[E2] closeButton[닫기].Select (L92) → hide()
[E3] deleteButton[삭제].Select (L98) → delete()
       └ [E4] messageBox.DialogHide [YES] (L160) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L68-76 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L112-133 | edit | 서비스 sys.Sys09_Code.selectByCodeKind | 업무 |
| public update() | L135-155 | E1 | 서비스 fnd.Fnd26_TermsDetail.update(mode) | 업무 |
| public delete() | L157-180 | E3 | ConfirmBox → E4 | 업무 |
| private setHtmlStyle() | L182-184 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L186-188 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="delete" onClick={delete}>삭제</Button>

### Fnd25_Grid_FundTermsDetail (`client/vi/fnd/Fnd25_Grid_FundTermsDetail.java`, 298줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 검색: {searchTextField} {retrieveButton} {insertButton} {copyButton} {deleteButton}
- 입력·하위 화면: `searchTextField` TextField 빈칸="펀드규약명", `lookup` Fnd25_Edit_FundTermsManager
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - actionCell 55 "수정" Cell 편집:editCell
  - termsName 320 "펀드규약명" Text
  - revisionDate 90 "제개정일" Date
  - revisionNo 70 "개정회차" LongCenter
  - fileCnt 90 "첨부파일 갯수" LongCenter
  - useYn 30 "사용" BooleanYn2
  - closeDate 90 "종료일" Date
  - note 270 "비고" Text
  - updName 70 "변경자" TextCenter
  - updDateStr 140 "작성(변경)일" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L58-84) → settings()
[E1] searchTextField.KeyPress [Enter] (L89) → retrieve()
[E2] retrieveButton[조회].Select (L98) → retrieve()
[E3] insertButton[등록].Select (L104) → insert()
[E4] deleteButton[삭제].Select (L110) → deleteRow()
       └ [E6] messageBox.DialogHide [YES] (L181) → 서비스 fnd.Fnd26_TermsDetail.delete
[E5] copyButton[등록(복사)].Select (L116) → copyInsert()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L162-176 | E1,E2,buildGrid,insert,copyInsert | 서비스 fnd.Fnd26_TermsDetail.selectBySearchTextManager(termsId, searchText) | 업무 |
| private deleteRow() | L178-204 | E4 | ConfirmBox → E6 | 업무 |
| public insert() | L206-223 | E3 | 팝업 Fnd25_Edit_FundTermsManager 열기 | 업무 |
| public copyInsert() | L225-242 | E5 | 팝업 Fnd25_Edit_FundTermsManager 열기 | 업무 |
| public settings() | L86-128 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L130-160 | 필드 초기화 | 팝업 Fnd25_Edit_FundTermsManager 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L294-296 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L148) addCell
  gb.text('termsNm', 320, '펀드규약명'),  // L149
  gb.date('revisionDate', 90, '제개정일'),  // L150
  gb.longCenter('revisionNo', 70, '개정회차'),  // L151
  gb.longCenter('fileCnt', 90, '첨부파일 갯수'),  // L152 SQL 계산 컬럼(selectBySearchTextManager: ( SELECT COUNT(*) FROM sys10_file WHERE…)
  gb.booleanYn2('useYn', 30, '사용'),  // L153
  gb.date('closeDate', 90, '종료일'),  // L154 SQL 계산 컬럼(selectBySearchTextManager: fnd25_close_date)
  gb.text('note', 270, '비고'),  // L155
  gb.textCenter('updNm', 70, '변경자'),  // L156
  gb.textCenter('updDateStr', 140, '작성(변경)일'),  // L157 SQL 계산 컬럼(selectBySearchTextManager: COALESCE(TO_CHAR(fnd26_upd_date, 'yyyy-…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="register" onClick={copyInsert}>등록(복사)</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Fnd25_Edit_FundTermsManager (`client/vi/fnd/Fnd25_Edit_FundTermsManager.java`, 431줄)

- 입력·하위 화면: `termsName` TextField, `content` MyTextArea, `note` MyTextArea, `seq` LongField, `termsType` TextField, `revisionDate` MyDateField, `revisionNo` LongField, `useYn` CheckBox, `closeDate` MyDateField, `termsTypeName` CommonComboBoxField("sys.Sys09_Code.selectByCodeKind") 빈칸="(선택하세요)", `lookupFile` Com01_Lookup_RelateFile

#### 이벤트
[E0] 화면 열림 (생성자 L89-174) → getEditor()
[E1] updateButton[저장].Select (L98) → update()
[E2] closeButton[닫기].Select (L104) → hide()
[E3] addFileButton[첨부파일(0건)].Select (L119) → setFileButtonText()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public editFundTerms() | L176-202 | 공개 메서드 | 상태 처리 | 업무 |
| public newFundTerms() | L204-237 | 공개 메서드 | 상태 처리 | 업무 |
| public insertFundTerms() | L239-263 | 공개 메서드 | 상태 처리 | 업무 |
| public copyFundTerms() | L265-308 | 공개 메서드 | 상태 처리 | 업무 |
| private setFileButtonText() | L310-321 | E3,editFundTerms | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| public update() | L323-361 | E1 | 상태 처리 | 업무 |
| private updateData() | L363-384 | update | 서비스 fnd.Fnd26_TermsDetail.update(mode, originRevisionNo) | 업무 |
| private getEditor() | L386-398 | 생성자 | 상태 처리 | 업무 |
| private setHtml() | L400-403 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L415-417 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L419-421 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L423-425 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L427-429 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={setFileButtonText}>첨부파일(0건)</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

