# Dcr30_Lookup_Link

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `apr`, `ast`, `biz`, `emp`, `fnd`, `pay`, `sch`
- 파일: `client/vi/dcr/Dcr30_Lookup_Link.java`
- 함께 쓰는 클래스 1개:
  - `Dcr30_Lookup_LinkNote` `client/vi/dcr/Dcr30_Lookup_LinkNote.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Com10_Lookup_CommonMapping`](../../com/components/Com10_Lookup_CommonMapping.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `com.Com10_FormMapping.selectById` | Dcr30_Lookup_Link:162 | [`Com10_FormMapping.java:20`](../../com/services/Com10_FormMapping.md) | [`com10_form_mapping.selectById`](../../com/sql/com10_form_mapping.md) |
| `dcr.Dcr30_Link.insertCheck` | Dcr30_Lookup_Link:230 | [`Dcr30_Link.java:79`](../../dcr/services/Dcr30_Link.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr30_link.insert`](../../dcr/sql/dcr30_link.md), [`dcr30_link.selectByLinkCode`](../../dcr/sql/dcr30_link.md), [`sys09_code.linkCheck`](../../sys/sql/sys09_code.md) |
| `dcr.Dcr30_Link.selectBySearchId` | Dcr30_Lookup_Link:284 | [`Dcr30_Link.java:34`](../../dcr/services/Dcr30_Link.md) | [`dcr30_link.selectBySearchId`](../../dcr/sql/dcr30_link.md) |
| `dcr.Dcr30_Link.update` | Dcr30_Lookup_Link:245 | [`Dcr30_Link.java:240`](../../dcr/services/Dcr30_Link.md) | `UpdateDataModel(dcr30_link)` 동적 INSERT/UPDATE → [`dcr30_link.selectById`](../../dcr/sql/dcr30_link.md) |
| `dcr.Dcr30_Link.updateDcrAuth` | Dcr30_Lookup_Link:248 | [`Dcr30_Link.java:165`](../../dcr/services/Dcr30_Link.md) | [`dcr03_org_auth.update`](../../dcr/sql/dcr03_org_auth.md), [`dcr30_link.selectByCompanyId`](../../dcr/sql/dcr30_link.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `dcr.Dcr30_Link.updateNote` | Dcr30_Lookup_LinkNote:77 | [`Dcr30_Link.java:178`](../../dcr/services/Dcr30_Link.md) | [`dcr30_link.updateNote`](../../dcr/sql/dcr30_link.md) |

## 테이블

[`com10_form_mapping`](../../../db/tables/com.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr30_Lookup_Link (`client/vi/dcr/Dcr30_Lookup_Link.java`, 303줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton} A : 시스템지정(양식) / B : 데이터연결(양식):
- 입력·하위 화면: `searchText` TextField 빈칸="Link명/문서분류명", `lookupClassTree` LookupTriggerField, `lookup` Com10_Lookup_CommonMapping, `lookupLinkNote` Dcr30_Lookup_LinkNote
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - linkName 350 "Link명" Text
  - classTreeFullName 500 "문서분류명" Text 편집:lookupClassTree
  - actionCell 95 "데이터연결(양식)" Cell 편집:actionCell
  - actionCell 60 "비고" Cell 편집:noteActionCell
  - gubun 60 "구분" TextCenter
  - linkCode 60 "코드" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L90-143) → 초기화
[E1] searchText.KeyPress [Enter] (L98) → retrieveSearch()
[E2] retrieveButton[조회].Select (L106) → retrieveSearch()
[E3] updateButton[저장].Select (L112) → update()
[E4] cancleButton[닫기].Select (L118) → hide()
[E5] lookupClassTree.TriggerClick (L150) → lookupClassTree()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L60-67 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L69-88 | 공개 메서드 | 상태 처리 | 업무 |
| private lookupClassTree() | L215-227 | E5 | 상태 처리 | 업무 |
| private insertCheck() | L229-241 | open | 서비스 dcr.Dcr30_Link.insertCheck | 업무 |
| public update() | L243-260 | E3 | 서비스 dcr.Dcr30_Link.update, dcr.Dcr30_Link.updateDcrAuth(companyId) | 업무 |
| public retrieve() | L262-276 | buildGrid,insertCheck,update | 상태 처리 | 업무 |
| public retrieveSearch() | L278-290 | E1,E2 | 서비스 dcr.Dcr30_Link.selectBySearchId(companyId, searchText) | 업무 |
| public buildGrid() | L145-213 | 필드 초기화 | 조회창 Com10_Lookup_CommonMapping 열기, 조회창 Dcr30_Lookup_LinkNote 열기, 서비스 com.Com10_FormMapping.selectById(formMappingId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L292-294 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L296-298 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L300-302 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('linkNm', 350, 'Link명'),  // L205 SQL 계산 컬럼(selectById: f_cdnm('LinkCode', dcr30_link_cd, dcr30…)
  gb.text('classTreeFullNm', 500, '문서분류명'),  // L206 SQL 계산 컬럼(selectById: f_class_tree_nm_allpath(dcr30_class_tre…)
  // ⚠ 대응 없음 (GridBuilder L207) addCell
  // ⚠ 대응 없음 (GridBuilder L208) addCell
  gb.textCenter('gubun', 60, '구분'),  // L209 SQL 계산 컬럼(selectByCompanyId: CASE WHEN dcr30_link_cd IN ( 'A02' ,'A0…)
  gb.textCenter('linkCd', 60, '코드'),  // L210
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieveSearch}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

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

