# Mkt01_Lookup_Select

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `bbs`, `biz`
- 파일: `client/vi/mkt/Mkt01_Lookup_Select.java`
- 함께 쓰는 클래스 3개:
  - `Mkt01_Lookup_TargetCompany` `client/vi/mkt/Mkt01_Lookup_TargetCompany.java`
  - `Mkt05_Lookup_Share` `client/vi/mkt/Mkt05_Lookup_Share.java`
  - `Mkt01_Lookup_SelectCompany` `client/vi/mkt/Mkt01_Lookup_SelectCompany.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `getSeq` | Mkt01_Lookup_TargetCompany:138 | (공통) 채번 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `mkt.Mkt01_TargetCompany.selectByCompanyIdPaging` | Mkt01_Lookup_SelectCompany:110 | [`Mkt01_TargetCompany.java:28`](../../mkt/services/Mkt01_TargetCompany.md) | [`mkt01_target_company.selectByCompanyIdPaging`](../../mkt/sql/mkt01_target_company.md), [`mkt01_target_company.selectByCompanyIdTotal`](../../mkt/sql/mkt01_target_company.md) |
| `mkt.Mkt01_TargetCompany.selectById` | Mkt01_Lookup_TargetCompany:154 | [`Mkt01_TargetCompany.java:18`](../../mkt/services/Mkt01_TargetCompany.md) | [`mkt01_target_company.selectById`](../../mkt/sql/mkt01_target_company.md) |
| `mkt.Mkt01_TargetCompany.selectBySearchTextPaging` | Mkt01_Lookup_Select:132 | [`Mkt01_TargetCompany.java:34`](../../mkt/services/Mkt01_TargetCompany.md) | [`mkt01_target_company.selectBySearchTextPaging`](../../mkt/sql/mkt01_target_company.md), [`mkt01_target_company.selectBySearchTextTotal`](../../mkt/sql/mkt01_target_company.md) |
| `mkt.Mkt01_TargetCompany.updateOne` | Mkt01_Lookup_TargetCompany:411 | [`Mkt01_TargetCompany.java:58`](../../mkt/services/Mkt01_TargetCompany.md) | `UpdateDataModel(mkt01_target_company)` 동적 INSERT/UPDATE → [`mkt01_target_company.selectById`](../../mkt/sql/mkt01_target_company.md) |
| `mkt.Mkt02_Manager.delete` | Mkt01_Lookup_TargetCompany:357 | [`Mkt02_Manager.java:56`](../../mkt/services/Mkt02_Manager.md) | `UpdateDataModel(mkt02_manager)` 동적 DELETE |
| `mkt.Mkt02_Manager.selectByTargetCompanyId` | Mkt01_Lookup_TargetCompany:382 | [`Mkt02_Manager.java:25`](../../mkt/services/Mkt02_Manager.md) | [`mkt02_manager.selectByTargetCompanyId`](../../mkt/sql/mkt02_manager.md) |
| `mkt.Mkt02_Manager.update` | Mkt01_Lookup_TargetCompany:367 | [`Mkt02_Manager.java:51`](../../mkt/services/Mkt02_Manager.md) | `UpdateDataModel(mkt02_manager)` 동적 INSERT/UPDATE → [`mkt02_manager.selectById`](../../mkt/sql/mkt02_manager.md) |
| `mkt.Mkt02_Manager.updateTargetCompanyId` | Mkt01_Lookup_SelectCompany:194 | [`Mkt02_Manager.java:30`](../../mkt/services/Mkt02_Manager.md) | [`mkt02_manager.updateTargetCompanyId`](../../mkt/sql/mkt02_manager.md) |
| `mkt.Mkt05_Share.delete` | Mkt05_Lookup_Share:252 | [`Mkt05_Share.java:50`](../../mkt/services/Mkt05_Share.md) | `UpdateDataModel(mkt05_share)` 동적 DELETE |
| `mkt.Mkt05_Share.selectByParentId` | Mkt05_Lookup_Share:312 | [`Mkt05_Share.java:21`](../../mkt/services/Mkt05_Share.md) | [`mkt05_share.selectByParentId`](../../mkt/sql/mkt05_share.md) |
| `mkt.Mkt05_Share.selectShareInfo` | Mkt05_Lookup_Share:280 | [`Mkt05_Share.java:26`](../../mkt/services/Mkt05_Share.md) | [`mkt05_share.selectShareInfo`](../../mkt/sql/mkt05_share.md) |
| `mkt.Mkt05_Share.update` | Mkt05_Lookup_Share:266 | [`Mkt05_Share.java:45`](../../mkt/services/Mkt05_Share.md) | `UpdateDataModel(mkt05_share)` 동적 INSERT/UPDATE → [`mkt05_share.selectById`](../../mkt/sql/mkt05_share.md) |

## 테이블

[`mkt01_target_company`](../../../db/tables/mkt.md), [`mkt02_manager`](../../../db/tables/mkt.md), [`mkt05_share`](../../../db/tables/mkt.md), [`mkt06_favorite`](../../../db/tables/mkt.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_org_nm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Mkt01_Lookup_Select (`client/vi/mkt/Mkt01_Lookup_Select.java`, 240줄)

- 툴바 `buttonBar`: 검색: {searchText} {favoriteCheckBox} {retrieveButton} {insertButton}
- 입력·하위 화면: `searchText` TextField 빈칸="활동처/담당자", `favoriteCheckBox` CheckBox, `lookup` Mkt01_Lookup_TargetCompany
- 그리드 `buildGrid` (buildGrid(), 체크박스(다중), 체크박스):
  - targetCompanyName 250 "활동처" Text
  - managerName 120 "담당자" Text
  - managerPosName 120 "직위" Text
  - managerOrgName 200 "부서" Text
  - actionCell 100 "담당자 추가" Cell 편집:actionCell

#### 이벤트
[E1] searchText.KeyPress [Enter] (L70) → retrieve()
[E2] retrieveButton[조회].Select (L80) → retrieve()
[E3] insertButton[활동처 추가].Select (L86) → retrieve()
[E4] oKButton[확인].Select (L98) → confirm()
[E5] cancelButton[취소].Select (L104) → hide()
[E6] favoriteCheckBox[즐겨찾기만 조회].ValueChange (L113) → retrieve()
[E7] grid.CellDoubleClick (L146) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L59-158 | 공개 메서드 | 조회창 Mkt01_Lookup_TargetCompany 열기, 서비스 mkt.Mkt01_TargetCompany.selectBySearchTextPaging | 업무 |
| public retrieve() | L193-217 | E1,E2,E3,E6,open,buildGrid | 상태 처리 | 업무 |
| public confirm() | L219-228 | E4,E7 | 상태 처리 | 업무 |
| private buildGrid() | L160-191 | open | 조회창 Mkt01_Lookup_TargetCompany 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L230-232 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L234-236 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L237-239 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('targetCompanyNm', 250, '활동처'),  // L184
  gb.text('managerNm', 120, '담당자'),  // L185
  gb.text('managerPosNm', 120, '직위'),  // L186
  gb.text('managerOrgNm', 200, '부서'),  // L187
  // ⚠ 대응 없음 (GridBuilder L188) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={retrieve}>활동처 추가</Button>
3. <Button type="save" onClick={confirm}>확인</Button>
4. <Button type="cancel" onClick={hide}>취소</Button>

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

