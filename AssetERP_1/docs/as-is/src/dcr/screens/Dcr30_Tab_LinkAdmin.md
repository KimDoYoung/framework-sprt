# Dcr30_Tab_LinkAdmin

- 종류: 화면
- 메뉴: 기초자료 > 20. 문서(전자결재) > 문서분류지정 (#1280)
- 파일: `client/vi/dcr/Dcr30_Tab_LinkAdmin.java`
- 함께 쓰는 클래스 2개:
  - `Dcr30_TabPage_Company` `client/vi/dcr/Dcr30_TabPage_Company.java`
  - `Dcr30_Lookup_LinkNote` `client/vi/dcr/Dcr30_Lookup_LinkNote.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Com10_Lookup_CommonMapping`](../../com/components/Com10_Lookup_CommonMapping.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `com.Com10_FormMapping.selectById` | Dcr30_TabPage_Company:142, Dcr30_Tab_LinkAdmin:228 | [`Com10_FormMapping.java:20`](../../com/services/Com10_FormMapping.md) | [`com10_form_mapping.selectById`](../../com/sql/com10_form_mapping.md) |
| `dcr.Dcr30_Link.linkCheck` | Dcr30_Tab_LinkAdmin:267 | [`Dcr30_Link.java:110`](../../dcr/services/Dcr30_Link.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr30_link.insert`](../../dcr/sql/dcr30_link.md), [`dcr30_link.selectByLinkCode`](../../dcr/sql/dcr30_link.md), [`sys01_company.selectByAll`](../../sys/sql/sys01_company.md), [`sys09_code.linkCheck`](../../sys/sql/sys09_code.md) |
| `dcr.Dcr30_Link.selectBySearchId` | Dcr30_TabPage_Company:234, Dcr30_Tab_LinkAdmin:281 | [`Dcr30_Link.java:34`](../../dcr/services/Dcr30_Link.md) | [`dcr30_link.selectBySearchId`](../../dcr/sql/dcr30_link.md) |
| `dcr.Dcr30_Link.update` | Dcr30_TabPage_Company:264, Dcr30_Tab_LinkAdmin:308 | [`Dcr30_Link.java:240`](../../dcr/services/Dcr30_Link.md) | `UpdateDataModel(dcr30_link)` 동적 INSERT/UPDATE → [`dcr30_link.selectById`](../../dcr/sql/dcr30_link.md) |
| `dcr.Dcr30_Link.updateDcrAuth` | Dcr30_TabPage_Company:267, Dcr30_Tab_LinkAdmin:311 | [`Dcr30_Link.java:165`](../../dcr/services/Dcr30_Link.md) | [`dcr03_org_auth.update`](../../dcr/sql/dcr03_org_auth.md), [`dcr30_link.selectByCompanyId`](../../dcr/sql/dcr30_link.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `dcr.Dcr30_Link.updateForm` | Dcr30_Tab_LinkAdmin:358 | [`Dcr30_Link.java:189`](../../dcr/services/Dcr30_Link.md) | [`com10_form_mapping.insertForm`](../../com/sql/com10_form_mapping.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr30_link.updateFormDcr30`](../../dcr/sql/dcr30_link.md) |
| `dcr.Dcr30_Link.updateLink` | Dcr30_Tab_LinkAdmin:334 | [`Dcr30_Link.java:216`](../../dcr/services/Dcr30_Link.md) | [`dcr03_org_auth.updateByBakDcr`](../../dcr/sql/dcr03_org_auth.md), [`dcr30_link.updateLink`](../../dcr/sql/dcr30_link.md) |
| `dcr.Dcr30_Link.updateNote` | Dcr30_Lookup_LinkNote:77 | [`Dcr30_Link.java:178`](../../dcr/services/Dcr30_Link.md) | [`dcr30_link.updateNote`](../../dcr/sql/dcr30_link.md) |
| `sys.Sys01_Company.selectByName` | Dcr30_TabPage_Company:212 | [`Sys01_Company.java:41`](../../sys/services/Sys01_Company.md) | [`sys01_company.selectByName`](../../sys/sql/sys01_company.md) |

## 테이블

[`com10_form_mapping`](../../../db/tables/com.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr30_Tab_LinkAdmin (`client/vi/dcr/Dcr30_Tab_LinkAdmin.java`, 382줄)

- 레이아웃: north=vlcHeader, center=vlc, south=companyMenu
- 툴바 `buttonBar`: {documentCopyButton} {formCopyButton} ※ 상단 : 기초문서분류 / 하단 : 목적지 회사:
- 툴바 `buttonBar2`: 검색: {searchText} {retrieveButton} {updateButton}
- 입력·하위 화면: `searchText` TextField 빈칸="Link명/문서분류명", `companyMenu` Dcr30_TabPage_Company, `lookupClassTree` LookupTriggerField, `lookup` Com10_Lookup_CommonMapping
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - linkName 400 "Link명" Text
  - classTreeFullName 450 "문서분류명" Text 편집:lookupClassTree
  - actionCell 95 "데이터연결(양식)" Cell 편집:actionCell
  - note 550 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L68-118) → settings(), linkCheck()
[E1] searchText.KeyPress [Enter] (L123) → retrieve()
[E2] retrieveButton[조회].Select (L132) → retrieve()
[E3] updateButton[저장].Select (L138) → update()
[E4] documentCopyButton[문서분류지정복사].Select [YES] (L145) → documentCopy()
[E5] msgBox.DialogHide [YES] (L158) → documentCopy()
[E6] formCopyButton[양식복사].Select [YES] (L178) → formCopy()
[E7] msgBox.DialogHide [YES] (L191) → formCopy()
[E8] lookupClassTree.TriggerClick (L216) → lookupClassTree()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public linkCheck() | L263-273 | 생성자 | 서비스 dcr.Dcr30_Link.linkCheck(kindCode) | 업무 |
| public retrieve() | L275-291 | E1,E2,buildGrid,linkCheck,update | 서비스 dcr.Dcr30_Link.selectBySearchId(companyId, searchText) | 업무 |
| private lookupClassTree() | L292-304 | E8 | 상태 처리 | 업무 |
| public update() | L306-323 | E3 | 서비스 dcr.Dcr30_Link.update, dcr.Dcr30_Link.updateDcrAuth(companyId) | 업무 |
| private documentCopy() | L325-348 | E4,E5 | 서비스 dcr.Dcr30_Link.updateLink(companyId) | 업무 |
| private formCopy() | L350-372 | E6,E7 | 서비스 dcr.Dcr30_Link.updateForm(companyId) | 업무 |
| private settings() | L120-209 | 생성자 | 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L211-261 | 필드 초기화 | 조회창 Com10_Lookup_CommonMapping 열기, 서비스 com.Com10_FormMapping.selectById(formMappingId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxStyle() | L374-376 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L378-380 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('linkNm', 400, 'Link명'),  // L255 SQL 계산 컬럼(selectById: f_cdnm('LinkCode', dcr30_link_cd, dcr30…)
  gb.text('classTreeFullNm', 450, '문서분류명'),  // L256 SQL 계산 컬럼(selectById: f_class_tree_nm_allpath(dcr30_class_tre…)
  // ⚠ 대응 없음 (GridBuilder L257) addCell
  gb.text('note', 550, '비고', { editor: 'text' }),  // L258
];
```

#### 사용된 버튼들
1. <Button type="change" onClick={documentCopy}>문서분류지정복사</Button>
2. <Button type="change" onClick={formCopy}>양식복사</Button>
3. <Button type="search" onClick={retrieve}>조회</Button>
4. <Button type="save" onClick={update}>저장</Button>

### Dcr30_TabPage_Company (`client/vi/dcr/Dcr30_TabPage_Company.java`, 288줄)

- 레이아웃: west=cp, center=dcrGrid
- 툴바 `buttonBar`: 회사명: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField, `lookup` Com10_Lookup_CommonMapping, `lookupClassTree` LookupTriggerField, `lookupLinkNote` Dcr30_Lookup_LinkNote
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - companyName 180 "고객명" Text
  - locationName 105 "Sub-Domain" Text
- 그리드 `dcrGrid` (buildDcrGrid()):
  - linkName 400 "Link명" Text
  - classTreeFullName 450 "문서분류명" Text 편집:lookupClassTree
  - actionCell 95 "데이터연결(양식)" Cell 편집:actionCell
  - note 550 "비고" Text
  - actionCell 60 "비고" Cell 편집:noteActionCell

#### 이벤트
[E0] 화면 열림 (생성자 L65-96) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L100) → retrieve()
[E2] retrieveButton[조회].Select (L108) → retrieve()
[E3] grid.RowClick (L114) → retrieve()
[E4] lookupClassTree.TriggerClick (L171) → lookupClassTree()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L61-63 | 공개 메서드 | 상태 처리 | 업무 |
| public buildDcrGrid() | L134-202 | 필드 초기화 | 조회창 Com10_Lookup_CommonMapping 열기, 조회창 Dcr30_Lookup_LinkNote 열기, 서비스 com.Com10_FormMapping.selectById(formMappingId) | 업무 |
| public retrieve() | L204-220 | 생성자,E1,E2,E3,buildDcrGrid,update | 서비스 sys.Sys01_Company.selectByName(companyName, now, useYn) | 업무 |
| public retrieve() | L222-240 | 생성자,E1,E2,E3,buildDcrGrid,update | 서비스 dcr.Dcr30_Link.selectBySearchId(companyId, searchText) | 업무 |
| private lookupClassTree() | L242-258 | E4 | 상태 처리 | 업무 |
| public update() | L260-279 | lookupClassTree | 서비스 dcr.Dcr30_Link.update, dcr.Dcr30_Link.updateDcrAuth(companyId) | 업무 |
| public getModels() | L281-283 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L98-121 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L123-132 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L285-287 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 180, '고객명'),  // L129
  gb.text('locNm', 105, 'Sub-Domain'),  // L130
];

const buildDcrGrid = () => [
  gb.text('linkNm', 400, 'Link명'),  // L195 SQL 계산 컬럼(selectById: f_cdnm('LinkCode', dcr30_link_cd, dcr30…)
  gb.text('classTreeFullNm', 450, '문서분류명'),  // L196 SQL 계산 컬럼(selectById: f_class_tree_nm_allpath(dcr30_class_tre…)
  // ⚠ 대응 없음 (GridBuilder L197) addCell
  gb.text('note', 550, '비고'),  // L198
  // ⚠ 대응 없음 (GridBuilder L199) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Dcr30_Lookup_LinkNote (`client/vi/dcr/Dcr30_Lookup_LinkNote.java`, 94줄)

- 입력·하위 화면: `note` MyTextArea

#### 이벤트
[E1] updateButton[저장].Select (L55) → update()
[E2] closeButton[닫기].Select (L61) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L37-72 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L74-88 | E1 | 서비스 dcr.Dcr30_Link.updateNote | 업무 |
| private setHtmlHeaderStyle() | L90-92 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

