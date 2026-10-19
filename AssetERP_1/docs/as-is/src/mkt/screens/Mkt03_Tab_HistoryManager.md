# Mkt03_Tab_HistoryManager

- 종류: 화면
- 메뉴: 커뮤니티 > 03. 업무활동 > 업무활동등록(관리자) (#1408)
- 파일: `client/vi/mkt/Mkt03_Tab_HistoryManager.java`
- 함께 쓰는 클래스 2개:
  - `Mkt05_Lookup_Share` `client/vi/mkt/Mkt05_Lookup_Share.java`
  - `Mkt01_Lookup_TargetCompany2` `client/vi/mkt/Mkt01_Lookup_TargetCompany2.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Mkt03_Lookup_History`](../../mkt/components/Mkt03_Lookup_History.md), [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md), [`Sys10_Lookup_File`](../../sys/components/Sys10_Lookup_File.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `mkt.Mkt01_TargetCompany.selectTargetCompanyPaging` | Mkt01_Lookup_TargetCompany2:87 | [`Mkt01_TargetCompany.java:40`](../../mkt/services/Mkt01_TargetCompany.md) | [`mkt01_target_company.selectTargetCompanyPaging`](../../mkt/sql/mkt01_target_company.md), [`mkt01_target_company.selectTargetCompanyTotal`](../../mkt/sql/mkt01_target_company.md) |
| `mkt.Mkt03_History.selectByTargetCompanyId` | Mkt03_Tab_HistoryManager:203 | [`Mkt03_History.java:24`](../../mkt/services/Mkt03_History.md) | [`mkt03_history.selectByTargetCompanyId`](../../mkt/sql/mkt03_history.md) |
| `mkt.Mkt05_Share.delete` | Mkt05_Lookup_Share:252 | [`Mkt05_Share.java:50`](../../mkt/services/Mkt05_Share.md) | `UpdateDataModel(mkt05_share)` 동적 DELETE |
| `mkt.Mkt05_Share.selectByParentId` | Mkt05_Lookup_Share:312 | [`Mkt05_Share.java:21`](../../mkt/services/Mkt05_Share.md) | [`mkt05_share.selectByParentId`](../../mkt/sql/mkt05_share.md) |
| `mkt.Mkt05_Share.selectShareInfo` | Mkt05_Lookup_Share:280 | [`Mkt05_Share.java:26`](../../mkt/services/Mkt05_Share.md) | [`mkt05_share.selectShareInfo`](../../mkt/sql/mkt05_share.md) |
| `mkt.Mkt05_Share.update` | Mkt05_Lookup_Share:266 | [`Mkt05_Share.java:45`](../../mkt/services/Mkt05_Share.md) | `UpdateDataModel(mkt05_share)` 동적 INSERT/UPDATE → [`mkt05_share.selectById`](../../mkt/sql/mkt05_share.md) |

## 테이블

[`fnd02_fund_info`](../../../db/tables/fnd.md), [`mkt01_target_company`](../../../db/tables/mkt.md), [`mkt03_history`](../../../db/tables/mkt.md), [`mkt04_relate_fund`](../../../db/tables/mkt.md), [`mkt05_share`](../../../db/tables/mkt.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Mkt03_Tab_HistoryManager (`client/vi/mkt/Mkt03_Tab_HistoryManager.java`, 215줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 활동기간: {startDate} ~: {closeDate} 활동처: {targetCompany} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="활동처/활동내용/작성자", `targetCompany` LookupTriggerField 빈칸="전체", `lookup` Mkt01_Lookup_TargetCompany2
- 그리드 `grid` (buildGrid()):
  - actionCell 40 "상세" Cell 편집:viewCell
  - activityDate 100 "활동일" Date
  - targetCompanyName 150 "활동처" Text
  - activityTitle 350 "활동내용" Text
  - fundInfo 250 "연결펀드" Text
  - fileCount 70 "첨부파일" TextCenter
  - actionCell 35 " " Cell 편집:fileCell
  - regDate 100 "작성일" Date
  - personOrgName 200 "작성자" Text
  - shareInfo 200 "공유" Text
  - actionCell 35 " " Cell 편집:shareCell

#### 이벤트
[E0] 화면 열림 (생성자 L53-83) → setting(), retrieve()
[E1] targetCompany.TriggerClick [result != null] (L95) → 인라인 L95-113 (new TriggerClickHandler() { @Override…)
[E2] searchText.KeyPress [Enter] (L117) → retrieve()
[E3] retrieveButton[조회].Select (L126) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L85-132 | 생성자 | 조회창 Mkt01_Lookup_TargetCompany2 열기 | 업무 |
| public retrieve() | L183-209 | 생성자,E2,E3 | 서비스 mkt.Mkt03_History.selectByTargetCompanyId(isManager, companyId, personId, itemType, startDate, closeDate, searchText, allContactYn, allContactYn, targetCompanyId) | 업무 |
| public buildGrid() | L134-181 | 필드 초기화 | 조회창 Mkt03_Lookup_History 열기, 조회창 Sys10_Lookup_File 열기, 조회창 Mkt05_Lookup_Share 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L211-213 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L168) addCell
  gb.date('activityDate', 100, '활동일'),  // L169
  gb.text('targetCompanyNm', 150, '활동처'),  // L170
  gb.text('activityTitle', 350, '활동내용'),  // L171
  gb.text('fundInfo', 250, '연결펀드'),  // L172
  gb.textCenter('fileCount', 70, '첨부파일'),  // L173
  // ⚠ 대응 없음 (GridBuilder L174) addCell
  gb.date('regDate', 100, '작성일'),  // L175
  gb.text('personOrgNm', 200, '작성자'),  // L176
  gb.text('shareInfo', 200, '공유'),  // L177
  // ⚠ 대응 없음 (GridBuilder L178) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

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

### Mkt01_Lookup_TargetCompany2 (`client/vi/mkt/Mkt01_Lookup_TargetCompany2.java`, 223줄)

- 툴바 `buttonBar`: 구분: {itemTypeComboBox} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="활동처", `itemTypeComboBox` ComboBoxField("CrmItemTypeCode", "%", "전체", "전체")
- 그리드 `grid` (buildGrid(), 체크박스):
  - targetCompanyName 200 "활동처" Text
  - itemTypeName 350 "구분" Text

#### 이벤트
[E1] itemTypeComboBox[CrmItemTypeCode].Collapse (L112) → retrieve()
[E2] searchText.KeyPress [Enter] (L121) → retrieve()
[E3] grid.RowDoubleClick (L130) → confirm()
[E4] retrieveButton[조회].Select (L137) → retrieve()
[E5] confirmButton[확인].Select (L143) → confirm()
[E6] selectAllButton[전체].Select [callback != null] (L150) → hide()
[E7] cancelButton[닫기].Select (L159) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L47-50 | open,retrieve | 상태 처리 | 업무 |
| public open() | L61-108 | 공개 메서드 | 서비스 mkt.Mkt01_TargetCompany.selectTargetCompanyPaging | 업무 |
| private setting() | L110-165 | open | 상태 처리 | 업무 |
| private retrieve() | L178-201 | E1,E2,E4,execute,open | 상태 처리 | 업무 |
| private confirm() | L203-214 | E3,E5 | 미선택 시 alert "활동처를 선택해주세요" | 업무 |
| private buildGrid() | L167-176 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L216-218 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L220-222 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('targetCompanyNm', 200, '활동처'),  // L172
  gb.text('itemTypeNm', 350, '구분'),  // L173
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>전체</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

