# Ics01_Lookup_SelectMulti

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `apr`, `dcr`, `icam`, `tdm`
- 파일: `client/vi/ics/Ics01_Lookup_SelectMulti.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ics01_Lookup_Content`](../../ics/components/Ics01_Lookup_Content.md), [`Ics01_Lookup_SelectParent`](../../ics/components/Ics01_Lookup_SelectParent.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics01_ClassTree.selectByListIcsId` | Ics01_Lookup_SelectMulti:279 | [`Ics01_ClassTree.java:206`](../../ics/services/Ics01_ClassTree.md) | [`ics01_class_tree.selectByListIcsId`](../../ics/sql/ics01_class_tree.md) |
| `ics.Ics01_ClassTree.selectByTypeCodePaging` | Ics01_Lookup_SelectMulti:115 | [`Ics01_ClassTree.java:96`](../../ics/services/Ics01_ClassTree.md) | [`ics01_class_tree.selectByTypeCodePaging`](../../ics/sql/ics01_class_tree.md), [`ics01_class_tree.selectByTypeCodePagingTotal`](../../ics/sql/ics01_class_tree.md) |

## 테이블

[`ics01_class_tree`](../../../db/tables/ics.md), [`ics02_manager`](../../../db/tables/ics.md), [`ics03_company_info`](../../../db/tables/ics.md), [`ics05_relate_manager`](../../../db/tables/ics.md), [`ics19_revision_relate_ics`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`tdm45_manl_relate_ics`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_get_deadline_nm`, `f_get_ics_nm`, `f_ics_class_tree_nm_allpath`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics01_Lookup_SelectMulti (`client/vi/ics/Ics01_Lookup_SelectMulti.java`, 308줄)

- 툴바 `buttonBar`: 분류: {classTreeName} 법규검색: {lawSearch} 조문검색: {statuteSearch} {retrieveButton} {detailSearchCheckBox}
- 입력·하위 화면: `classTreeName` LookupTriggerField, `classTreeId` LongField, `lawSearch` TextField 빈칸="법규코드/법규명", `statuteSearch` TextField 빈칸="관련조문", `detailSearchCheckBox` CheckBox, `lookup` Ics01_Lookup_Content
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - classTreeCode 70 "법규코드" TextCenter
  - classTreeName 300 "법규명" TextArea
  - content 400 "상세내용" TextLimitArea
  - actionCell 35 " " Cell 편집:actionCell
  - submitTo 200 "제출처" TextArea
  - cycleName 100 "주기" Text
  - relatedLaw 200 "관련조문" TextArea
  - classTreeFullName 250 "분류" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L71-77) → 초기화
[E1] classTreeName[전체].TriggerClick [result == null] (L139) → 인라인 L139-157 (new TriggerClickHandler(){ @Override …)
[E2] lawSearch.KeyPress [Enter] (L160) → retrieve()
[E3] statuteSearch.KeyPress [Enter] (L170) → retrieve()
[E4] retrieveButton[검색].Select (L180) → retrieve()
[E5] changeButton[확인].Select (L186) → update()
[E6] cancleButton[닫기].Select (L192) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openUnConn() | L79-83 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L85-131 | openUnConn | 서비스 ics.Ics01_ClassTree.selectByTypeCodePaging | 업무 |
| private retrieve() | L230-255 | E2,E3,E4,open | 상태 처리 | 업무 |
| private update() | L257-295 | E5 | 미선택 시 alert "우측 법규를 선택해주세요", 서비스 ics.Ics01_ClassTree.selectByListIcsId(classTreeIdList) | 업무 |
| private settings() | L133-198 | open | 조회창 Ics01_Lookup_SelectParent 열기, 이벤트 연결, 초기값: classTreeId=null, classTreeId=null, classTreeId=resultModel.getClassTreeId(, detailSearchCheckBox=false("상세내용 포함") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L200-228 | 필드 초기화 | 조회창 Ics01_Lookup_Content 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L297-299 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L301-303 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L305-307 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('classTreeCd', 70, '법규코드'),  // L219
  gb.textArea('classTreeNm', 300, '법규명'),  // L220
  // ⚠ 대응 없음 (GridBuilder L221) addTextLimitArea
  // ⚠ 대응 없음 (GridBuilder L222) addCell
  gb.textArea('submitTo', 200, '제출처'),  // L223
  gb.text('cycleNm', 100, '주기'),  // L224
  gb.textArea('relatedLaw', 200, '관련조문'),  // L225
  gb.textArea('classTreeFullNm', 250, '분류'),  // L226
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>검색</Button>
2. <Button type="save" onClick={update}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

