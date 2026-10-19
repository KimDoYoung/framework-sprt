# Dcr05_Tab_DocType

- 종류: 화면
- 메뉴: 문서작성 > 03. 파일 및 양식관리 > 문서양식등록 (#1007)
- 메뉴: 기초자료 > 20. 문서(전자결재) > 문서양식등록 (#1482)
- 파일: `client/vi/dcr/Dcr05_Tab_DocType.java`
- 함께 쓰는 클래스 2개:
  - `Dcr05_Edit_Update` `client/vi/dcr/Dcr05_Edit_Update.java`
  - `Dcr05_Edit_DocType` `client/vi/dcr/Dcr05_Edit_DocType.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys01_Lookup_Company`](../../sys/components/Sys01_Lookup_Company.md), [`Sys09_Lookup_Code`](../../sys/components/Sys09_Lookup_Code.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_ApprTemp.insert` | Dcr05_Edit_Update:241 | [`Apr01_ApprTemp.java:38`](../../apr/services/Apr01_ApprTemp.md) | [`apr01_appr_temp.insert`](../../apr/sql/apr01_appr_temp.md), [`apr03_relate_fund.conflict`](../../apr/sql/apr03_relate_fund.md), [`dbConfig.getEtcSeq`](../../utils/sql/dbConfig.md) |
| `dcr.Dcr05_DocType.delete` | Dcr05_Tab_DocType:274 | [`Dcr05_DocType.java:163`](../../dcr/services/Dcr05_DocType.md) | [`dcr06_relate_doc_Type.selectByDocTypeId`](../../dcr/sql/dcr06_relate_doc_Type.md), `UpdateDataModel(dcr05_doc_type)` 동적 DELETE |
| `dcr.Dcr05_DocType.pushData` | Dcr05_Tab_DocType:310 | [`Dcr05_DocType.java:139`](../../dcr/services/Dcr05_DocType.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr05_doc_type.insertRequest`](../../dcr/sql/dcr05_doc_type.md) |
| `dcr.Dcr05_DocType.selectByName` | Dcr05_Tab_DocType:257 | [`Dcr05_DocType.java:31`](../../dcr/services/Dcr05_DocType.md) | [`dcr05_doc_type.selectByName`](../../dcr/sql/dcr05_doc_type.md) |
| `dcr.Dcr05_DocType.update` | Dcr05_Edit_DocType:162 | [`Dcr05_DocType.java:113`](../../dcr/services/Dcr05_DocType.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(dcr05_doc_type)` 동적 INSERT/UPDATE → [`dcr05_doc_type.selectById`](../../dcr/sql/dcr05_doc_type.md) |
| `dcr.Dcr05_DocType.updateEdit` | Dcr05_Edit_Update:198 | [`Dcr05_DocType.java:128`](../../dcr/services/Dcr05_DocType.md) | `UpdateDataModel(dcr05_doc_type)` 동적 INSERT/UPDATE → [`dcr05_doc_type.selectById`](../../dcr/sql/dcr05_doc_type.md) |

## 테이블

[`apr01_appr_temp`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`dcr05_doc_type`](../../../db/tables/dcr.md), [`dcr06_relate_doc_type`](../../../db/tables/dcr.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr05_Tab_DocType (`client/vi/dcr/Dcr05_Tab_DocType.java`, 336줄)

- 레이아웃: center=vlc
- 입력·하위 화면: `companyField` LookupTriggerField, `titleName` TextField 빈칸="양식제목/비고", `docFormClassComboBox` ComboBoxField("DocFormClassCode", "%", "전체", "전체"), `lookupCompany` Sys01_Lookup_Company, `lookupCode` Sys09_Lookup_Code, `editor` Dcr05_Edit_Update
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - docFormClassName 200 "구분" Text
  - title 450 "양식 제목" Text
  - actionCell 80 "상세보기" Cell 편집:editDocCell
  - note 1000 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L80-82) → init()
[E1] docFormClassComboBox[DocFormClassCode].Collapse (L106) → retrieve()
[E2] titleName.KeyPress [Enter] (L115) → retrieve()
[E3] companyField.TriggerClick [result != null] (L127) → execute()
[E4] retrieveButton[조회].Select (L152) → retrieve()
[E5] insertButton[등록].Select (L159) → insert()
[E6] deleteButton[삭제].Select (L166) → delete()
       └ [E9] messageBox.DialogHide [YES] (L268) → execute()
[E7] docClassButton[구분추가].Select (L173) → execute()
[E8] pushDataButton[내보내기].Select (L186) → pushData()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L74-77 | E3,E7,E9,buildGrid,insert,retrieve,pushData | 상태 처리 | 업무 |
| public init() | L84-204 | 생성자 | 조회창 Sys01_Lookup_Company 열기, 조회창 Sys09_Lookup_Code 열기 | 업무 |
| public insert() | L233-240 | E5 | 팝업 Dcr05_Edit_DocType 열기 | 업무 |
| public retrieve() | L242-263 | E1,E2,E4,execute,buildGrid,insert | 서비스 dcr.Dcr05_DocType.selectByName(searchText, companyId, formClassCode) | 업무 |
| public delete() | L265-290 | E6 | ConfirmBox → E9 | 업무 |
| private pushData() | L292-330 | E8 | 조회창 Sys01_Lookup_Company 열기, 미선택 시 alert "선택된 내역이 없습니다.", 서비스 dcr.Dcr05_DocType.pushData(companyId) | 업무 |
| public buildGrid() | L206-231 | 필드 초기화 | 팝업 Dcr05_Edit_Update 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L332-334 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('docFormClassNm', 200, '구분'),  // L225 SQL 계산 컬럼(selectByName: b.sys09_name)
  gb.text('title', 450, '양식 제목'),  // L226
  // ⚠ 대응 없음 (GridBuilder L227) addCell
  gb.text('note', 1000, '비고'),  // L228
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="delete" onClick={delete}>삭제</Button>
4. <Button type="view" onClick={execute}>구분추가</Button>
5. <Button type="unknown" onClick={pushData}>내보내기</Button>

### Dcr05_Edit_Update (`client/vi/dcr/Dcr05_Edit_Update.java`, 304줄)

- 입력·하위 화면: `title` TextField, `content` TextField, `note` MyTextArea, `docFormClassCode` TextField, `docFormClassName` ComboBoxField("DocFormClassCode")

#### 이벤트
[E0] 화면 열림 (생성자 L71-98) → settings(), getEditor(), show()
[E1] updateButton[수정].Select (L101) → updateEdit()
[E2] pdfButton[미리보기].Select (L107) → makePreviewPDF()
[E3] closeButton[닫기].Select (L113) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L122-157 | 생성자 | 상태 처리 | 업무 |
| public retrieveReadOnly() | L159-167 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieveApproval() | L170-173 | retrieveReadOnly | 상태 처리 | 업무 |
| public retrieveApproval() | L175-178 | retrieveReadOnly | 상태 처리 | 업무 |
| public updateEdit() | L180-218 | E1 | 서비스 dcr.Dcr05_DocType.updateEdit(updateDcrModel) | 업무 |
| private makePreviewPDF() | L220-273 | E2 | 서비스 apr.Apr01_ApprTemp.insert(updateApprModel) | 업무 |
| public getServiceResult() | L276-277 | updateEdit,makePreviewPDF | 상태 처리 | 업무 |
| private masking() | L279-281 | makePreviewPDF | 상태 처리 | 업무 |
| private unmasking() | L282-284 | makePreviewPDF | 상태 처리 | 업무 |
| private settings() | L100-120 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L296-298 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L300-302 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={updateEdit}>수정</Button>
2. <Button type="unknown" onClick={makePreviewPDF}>미리보기</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Dcr05_Edit_DocType (`client/vi/dcr/Dcr05_Edit_DocType.java`, 227줄)

- 입력·하위 화면: `title` TextField, `content` TextField, `note` MyTextArea, `docFormClassCode` TextField, `docFormClassName` ComboBoxField("DocFormClassCode")

#### 이벤트
[E0] 화면 열림 (생성자 L65-100) → getEditor(), show()
[E1] updateButton[저장].Select (L74) → update()
[E2] closeButton[닫기].Select (L83) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L102-137 | 생성자 | 상태 처리 | 업무 |
| public update() | L144-183 | E1 | 서비스 dcr.Dcr05_DocType.update(updateDcrModel) | 업무 |
| public getServiceResult() | L196-199 | update | 상태 처리 | 업무 |
| private setReadOnly() | L201-203 | 미사용 후보 | 상태 처리 | 업무 |
| private setEditable() | L205-207 | 미사용 후보 | 상태 처리 | 업무 |
| private getAppr() | L209-217 | 미사용 후보 | 상태 처리 | 업무 |
| private setHtml() | L139-142 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L219-221 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L223-225 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

