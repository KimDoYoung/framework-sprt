# Crm01_Tab_ItemTreeGrid

- 종류: 화면
- 메뉴: 커뮤니티 > 03. 업무활동 > (X)영업활동관리 (#1062, 미사용)
- 파일: `client/vi/crm/Crm01_Tab_ItemTreeGrid.java`
- 함께 쓰는 클래스 1개:
  - `Crm01_Edit_Item` `client/vi/crm/Crm01_Edit_Item.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Org00_Lookup_SelectSingle`](../../org/components/Org00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `crm.Crm01_Item.delete` | Crm01_Edit_Item:434 | [`Crm01_Item.java:85`](../../crm/services/Crm01_Item.md) | [`crm01_item.selectByParentId`](../../crm/sql/crm01_item.md), [`crm10_cmnt.selectByItemId`](../../crm/sql/crm10_cmnt.md), `UpdateDataModel(crm01_item)` 동적 DELETE |
| `crm.Crm01_Item.selectByText` | Crm01_Tab_ItemTreeGrid:220 | [`Crm01_Item.java:27`](../../crm/services/Crm01_Item.md) | [`crm01_item.selectByParentId`](../../crm/sql/crm01_item.md), [`crm01_item.selectByText`](../../crm/sql/crm01_item.md) |
| `crm.Crm01_Item.update` | Crm01_Edit_Item:400 | [`Crm01_Item.java:73`](../../crm/services/Crm01_Item.md) | `UpdateDataModel(crm01_item)` 동적 INSERT/UPDATE → [`crm01_item.selectById`](../../crm/sql/crm01_item.md) |
| `crm.Crm10_Comment.delete` | Crm01_Edit_Item:271 | [`Crm10_Comment.java:41`](../../crm/services/Crm10_Comment.md) | `UpdateDataModel(crm10_cmnt)` 동적 DELETE |
| `crm.Crm10_Comment.insert` | Crm01_Edit_Item:224 | [`Crm10_Comment.java:26`](../../crm/services/Crm10_Comment.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(crm10_cmnt)` 동적 INSERT/UPDATE → [`crm10_cmnt.selectById`](../../crm/sql/crm10_cmnt.md) |
| `crm.Crm10_Comment.selectByItemId` | Crm01_Edit_Item:289 | [`Crm10_Comment.java:18`](../../crm/services/Crm10_Comment.md) | [`crm10_cmnt.selectByItemId`](../../crm/sql/crm10_cmnt.md) |
| `crm.Crm11_Count.insertUpdateCount` | Crm01_Tab_ItemTreeGrid:318 | [`Crm11_Count.java:34`](../../crm/services/Crm11_Count.md) | [`crm11_count.insertUpdateCount`](../../crm/sql/crm11_count.md) |
| `getSeq` | Crm01_Edit_Item:293, Crm01_Edit_Item:319 | (공통) 채번 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `org.Org00_OrgInfo.selectByOrgCodeId` | Crm01_Tab_ItemTreeGrid:336 | [`Org00_OrgInfo.java:21`](../../org/services/Org00_OrgInfo.md) | [`org00_org_info.selectByOrgCodeId`](../../org/sql/org00_org_info.md) |

## 테이블

[`crm01_item`](../../../db/tables/crm.md), [`crm10_cmnt`](../../../db/tables/crm.md), [`crm11_count`](../../../db/tables/crm.md), [`emp01_person`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_org_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Crm01_Tab_ItemTreeGrid (`client/vi/crm/Crm01_Tab_ItemTreeGrid.java`, 360줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 부서: {orgCodeName} 영업구분: {itemTypeCodeComboBox} 검색어: {searchText} 작성자: {empKorName} {retrieveButton} {insertRootButton} {insertChildButton}
- 입력·하위 화면: `itemTypeCodeComboBox` ComboBoxField("CrmItemTypeCode", "%", "전체"), `searchText` TextField 빈칸="제목/영업구분/프로젝트명", `empKorName` LookupTriggerField 빈칸="전체", `orgCodeName` LookupTriggerField 빈칸="전체", `searchPopup` Org00_Lookup_SelectSingle, `empSearch` Emp00_Lookup_SelectSingle, `editor` Crm01_Edit_Item
- 그리드 `treeGrid` (buildTreeGrid()):
  - myCount 40 " " Count
  - parentCodeName 150 "부서" Text
  - title 400 "제목" Text
  - actionCell 80 "상세보기" Cell 편집:editCell
  - itemTypeName 400 "영업구분" Text
  - projectName 200 "프로젝트명" Text
  - contactText 200 "고객사 및 담당자" Text
  - regDate 100 "작성일" Date
  - korName 80 "작성자" Text
  - viewCount 50 "조회수" Long

#### 이벤트
[E0] 화면 열림 (생성자 L66-98) → settings()
[E1] orgCodeName[전체].TriggerClick [result != null] (L104) → 인라인 L104-122 (new TriggerClickHandler(){ @Override …)
[E2] orgCodeName[전체].Change (L123) → 인라인 L123-130 (new ChangeHandler() { @Override publi…)
[E3] empKorName[전체].TriggerClick [result != null] (L134) → 인라인 L134-153 (new TriggerClickHandler(){ @Override …)
[E4] empKorName[전체].Change (L154) → 인라인 L154-161 (new ChangeHandler() { @Override publi…)
[E5] searchText.KeyPress [Enter] (L166) → retrieve()
[E6] retrieveButton[조회].Select (L174) → retrieve()
[E7] insertRootButton[신규등록].Select (L180) → insertRoot()
[E8] insertChildButton[하위등록].Select (L186) → insertChildItem()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildTreeGrid() | L196-217 | 필드 초기화 | 상태 처리 | 업무 |
| private retrieve() | L219-238 | E5,E6,editItem | 서비스 crm.Crm01_Item.selectByText(companyId, personId, orgCodeId, myCount, searchText, itemTypeCode) | 업무 |
| private refresh() | L240-253 | retrieve | 상태 처리 | 업무 |
| private addChildItem() | L255-263 | refresh | 상태 처리 | 업무 |
| private insertRoot() | L265-276 | E7 | 팝업 Crm01_Edit_Item 열기 | 업무 |
| private insertChildItem() | L278-302 | E8 | 팝업 Crm01_Edit_Item 열기, 미선택 시 alert "먼저 상위 등록건을 선택해주세요" | 업무 |
| private editItem() | L304-333 | buildTreeGrid | 팝업 Crm01_Edit_Item 열기, 서비스 crm.Crm11_Count.insertUpdateCount | 업무 |
| private checkOrgCode() | L335-355 | settings | 서비스 org.Org00_OrgInfo.selectByOrgCodeId(orgCodeId, companyId, baseDate) | 업무 |
| private settings() | L100-194 | 생성자 | 조회창 Org00_Lookup_SelectSingle 열기, 조회창 Emp00_Lookup_SelectSingle 열기, 이벤트 연결, 초기값: orgCodeName=findOrgCodeModel.getKorName(("전체"), empKorName=codeModel.getKorName(("전체"), itemTypeCodeComboBox="전체"("CrmItemTypeCode") | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L357-359 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L205) addCount
  gb.text('parentCodeNm', 150, '부서'),  // L206
  gb.text('title', 400, '제목'),  // L207
  // ⚠ 대응 없음 (GridBuilder L208) addCell
  gb.text('itemTypeNm', 400, '영업구분'),  // L209
  gb.text('projectNm', 200, '프로젝트명'),  // L210
  // ⚠DB없음 L211 contactText 200 "고객사 및 담당자" (crm11_contact_text 컬럼 없음)
  gb.date('regDate', 100, '작성일'),  // L212
  gb.text('korNm', 80, '작성자'),  // L213
  gb.long('viewCount', 50, '조회수'),  // L214
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRoot}>신규등록</Button>
3. <Button type="register" onClick={insertChildItem}>하위등록</Button>

### Crm01_Edit_Item (`client/vi/crm/Crm01_Edit_Item.java`, 471줄)

- 입력·하위 화면: `title` TextField, `regDate` MyDateField, `closeDate` MyDateField, `korName` TextField, `contactCompany` TextField, `contactDept` TextField, `contactEmpName` TextField, `contactEmpPos` TextField, `itemTypeCode` TextField, `itemTypeName` ComboBoxField("CrmItemTypeCode"), `projectName` TextField, `meetingContent` TextArea, `comment` TextArea
- 그리드 `grid` (buildGrid(), 체크박스):
  - korName 80 "작성자" Text
  - comment 550 "내용" TextArea 편집:""
  - regDate 130 "작성일시" DateTime
  - actionCell 50 "삭제" Cell 편집:editCell

#### 이벤트
[E0] 화면 열림 (생성자 L83-206) → show()
[E1] addCommentButton[등록].Select (L87) → addComment()
[E2] updateButton[저장].Select (L171) → update()
       └ [E6] msgBox.DialogHide [YES] (L395) → hide()
[E3] deleteButton[삭제].Select (L178) → delete()
       └ [E7] msgBox.DialogHide [YES] (L429) → hide()
[E4] closeButton[닫기].Select (L184) → hide()
[E5] msgBox.DialogHide [YES] (L250) → deleteComment()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private addComment() | L208-238 | E1 | 서비스 crm.Crm10_Comment.insert(commentModel) | 업무 |
| private deleteConfirm() | L240-265 | buildGrid | 확인창 표시 | 업무 |
| private deleteComment() | L267-285 | E5 | 서비스 crm.Crm10_Comment.delete(commentId) | 업무 |
| private retrieveComment() | L286-290 | addComment,deleteComment,editItemModel | 서비스 crm.Crm10_Comment.selectByItemId(itemId) | 업무 |
| public insertChildItem() | L292-316 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRoot() | L318-336 | 공개 메서드 | 상태 처리 | 업무 |
| public editItemModel() | L338-350 | insertChildItem,insertRoot | 상태 처리 | 업무 |
| public update() | L370-424 | E2 | ConfirmBox → E6 | 업무 |
| public delete() | L426-458 | E3 | ConfirmBox → E7 | 업무 |
| private buildGrid() | L352-368 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L460-462 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlSmallStyle() | L464-466 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlWHeaderStyle() | L468-470 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('korNm', 80, '작성자'),  // L362
  gb.textArea('cmnt', 550, '내용'),  // L363
  gb.dateTime('regDate', 130, '작성일시'),  // L364
  // ⚠ 대응 없음 (GridBuilder L365) addCell
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="delete" onClick={delete}>삭제</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>
4. <Button type="register" onClick={addComment}>등록</Button>

