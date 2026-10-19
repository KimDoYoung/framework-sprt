# Bmt12_Tab_PcList

- 종류: 화면
- 메뉴: 고유자산 > 30. 고유자산 현황 > PC장비상세 (#1170)
- 파일: `client/vi/bmt/Bmt12_Tab_PcList.java`
- 함께 쓰는 클래스 4개:
  - `Bmt12_Edit_PcHistory` `client/vi/bmt/Bmt12_Edit_PcHistory.java`
  - `Bmt10_Lookup_InfoList` `client/vi/bmt/Bmt10_Lookup_InfoList.java`
  - `Bmt10_Lookup_History` `client/vi/bmt/Bmt10_Lookup_History.java`
  - `Bmt11_TabPage_History` `client/vi/bmt/Bmt11_TabPage_History.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `bmt.Bmt10_Info.selectByCompanyId` | Bmt10_Lookup_InfoList:178 | [`Bmt10_Info.java:25`](../../bmt/services/Bmt10_Info.md) | [`bmt10_info.selectByCompanyId`](../../bmt/sql/bmt10_info.md) |
| `bmt.Bmt11_History.delete` | Bmt11_TabPage_History:182 | [`Bmt11_History.java:36`](../../bmt/services/Bmt11_History.md) | `UpdateDataModel(bmt11_history)` 동적 DELETE |
| `bmt.Bmt11_History.selectByInfoId` | Bmt11_TabPage_History:139 | [`Bmt11_History.java:23`](../../bmt/services/Bmt11_History.md) | [`bmt11_history.selectByInfoId`](../../bmt/sql/bmt11_history.md) |
| `bmt.Bmt11_History.update` | Bmt11_TabPage_History:187 | [`Bmt11_History.java:31`](../../bmt/services/Bmt11_History.md) | `UpdateDataModel(bmt11_history)` 동적 INSERT/UPDATE → [`bmt11_history.selectById`](../../bmt/sql/bmt11_history.md) |
| `bmt.Bmt12_PcHistory.delete` | Bmt10_Lookup_History:212 | [`Bmt12_PcHistory.java:81`](../../bmt/services/Bmt12_PcHistory.md) | `UpdateDataModel(bmt12_pc_history)` 동적 DELETE |
| `bmt.Bmt12_PcHistory.deleteByInfoId` | Bmt12_Tab_PcList:206 | [`Bmt12_PcHistory.java:71`](../../bmt/services/Bmt12_PcHistory.md) | [`bmt12_pc_history.deleteByInfoId`](../../bmt/sql/bmt12_pc_history.md) |
| `bmt.Bmt12_PcHistory.modelUpdate` | Bmt12_Edit_PcHistory:204 | [`Bmt12_PcHistory.java:48`](../../bmt/services/Bmt12_PcHistory.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bmt12_pc_history)` 동적 INSERT/UPDATE → [`bmt12_pc_history.selectById`](../../bmt/sql/bmt12_pc_history.md) |
| `bmt.Bmt12_PcHistory.selectByCompanyId` | Bmt12_Tab_PcList:164 | [`Bmt12_PcHistory.java:25`](../../bmt/services/Bmt12_PcHistory.md) | [`bmt12_pc_history.selectByCompanyId`](../../bmt/sql/bmt12_pc_history.md) |
| `bmt.Bmt12_PcHistory.selectByInfoId` | Bmt10_Lookup_History:157 | [`Bmt12_PcHistory.java:35`](../../bmt/services/Bmt12_PcHistory.md) | [`bmt12_pc_history.selectByInfoId`](../../bmt/sql/bmt12_pc_history.md) |
| `sys.Sys00_Common.selectByKindCode` | Bmt10_Lookup_InfoList:47 | [`Sys00_Common.java:111`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`ast01_class_tree`](../../../db/tables/ast.md), [`bmt10_info`](../../../db/tables/bmt.md), [`bmt11_history`](../../../db/tables/bmt.md), [`bmt12_pc_history`](../../../db/tables/bmt.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_emp_kor_nm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Bmt12_Tab_PcList (`client/vi/bmt/Bmt12_Tab_PcList.java`, 221줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준일자: {baseDate} 검색어: {searchText} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `baseDate` MyDateField, `searchText` TextField 빈칸="사원명/내부IP/Mac주소/종목명/기타사항", `lookup` Bmt10_Lookup_History
- 그리드 `grid` (buildGrid()):
  - personName 100 "사원명" TextCenter
  - startDate 100 "시작(사용)일자" Date
  - internalIp 150 "내부IP" Text
  - macAddress 200 "Mac주소" Text
  - astClassTreeName 250 "PC명" Text
  - etc 400 "기타사항" TextArea
  - actionCell 60 "History" Cell 편집:historyCell

#### 이벤트
[E0] 화면 열림 (생성자 L50-77) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L85) → retrieve()
[E2] retrieveButton[조회].Select (L94) → retrieve()
[E3] insertButton[등록].Select (L100) → insert()
[E4] deleteButton[삭제].Select (L106) → deleteCheck()
       └ [E5] msgBox.DialogHide [YES] (L185) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L149-170 | 생성자,E1,E2,buildGrid,insert,delete | 서비스 bmt.Bmt12_PcHistory.selectByCompanyId(companyId, baseDate, searchText) | 업무 |
| private insert() | L172-180 | E3 | 팝업 Bmt12_Edit_PcHistory 열기 | 업무 |
| private deleteCheck() | L182-201 | E4 | ConfirmBox → E5 | 업무 |
| private delete() | L203-216 | E5 | 서비스 bmt.Bmt12_PcHistory.deleteByInfoId(infoId) | 업무 |
| private settings() | L79-112 | 생성자 | 이벤트 연결, 초기값: baseDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L114-147 | 필드 초기화 | 조회창 Bmt10_Lookup_History 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L218-220 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('personNm', 100, '사원명'),  // L138 SQL 계산 컬럼(selectByCompanyId: COALESCE(f_emp_kor_nm( ( SELECT c.bmt11…)
  gb.date('startDate', 100, '시작(사용)일자'),  // L139
  gb.text('internalIp', 150, '내부IP'),  // L140
  gb.text('macAddress', 200, 'Mac주소'),  // L141
  gb.text('astClassTreeNm', 250, 'PC명'),  // L142 SQL 계산 컬럼(selectByCompanyId: c.ast01_class_tree_nm)
  gb.textArea('etc', 400, '기타사항'),  // L143
  // ⚠ 대응 없음 (GridBuilder L144) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="delete" onClick={deleteCheck}>삭제</Button>

### Bmt12_Edit_PcHistory (`client/vi/bmt/Bmt12_Edit_PcHistory.java`, 225줄)

- 입력·하위 화면: `astClassTreeName` LookupTriggerField, `infoId` LongField, `startDate` MyDateField, `hostName` TextField, `settingDate` MyDateField, `internalIp` TextField, `macAddress` TextField, `etc` MyTextArea, `note` MyTextArea, `lookup` Bmt10_Lookup_InfoList

#### 이벤트
[E0] 화면 열림 (생성자 L116-175) → add(), show()
[E1] updateButton[저장].Select (L122) → update()
[E2] closeButton[닫기].Select (L128) → hide()
[E3] astClassTreeName[장비명].TriggerClick (L179) → openLookupBmt()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L60-70 | 공개 메서드 | 상태 처리 | 업무 |
| package insert() | L72-89 | 미사용 후보 | 상태 처리 | 업무 |
| public add() | L91-102 | 생성자 | 상태 처리 | 업무 |
| public edit() | L104-114 | 공개 메서드 | 상태 처리 | 업무 |
| private openLookupBmt() | L187-199 | E3 | 조회창 Bmt10_Lookup_InfoList 열기 | 업무 |
| private update() | L201-216 | E1 | 서비스 bmt.Bmt12_PcHistory.modelUpdate | 업무 |
| private settings() | L177-185 | insert,add,edit | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L218-220 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L222-224 | insert,add,edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Bmt10_Lookup_InfoList (`client/vi/bmt/Bmt10_Lookup_InfoList.java`, 197줄)

- 툴바 `buttonBar`: 기준일자: {baseDate} 구분: {itemClassName} {checkBox} {retrieveButton}
- 입력·하위 화면: `itemClassName` CommonComboBoxField("sys.Sys00_Common.selectByKindCode", "%", "전체") 빈칸="전체", `checkBox` CheckBox, `baseDate` MyDateField
- 그리드 `grid` (buildGrid(), 체크박스):
  - astClassTreeName 150 "종목명" Text
  - personName 80 "담당자" TextCenter
  - applyDate 90 "매입일자" Date
  - retireDate 90 "폐기일자" Date 편집:"CE4242"
  - acqAmount 100 "취득금액" Long
  - acqInfo 200 "취득정보" TextArea
  - spec 250 "세부사양" TextArea
  - note 250 "비고" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L54-83) → show()
[E1] itemClassName[sys.Sys00_Common.selectByKindCode].Collapse (L111) → retrieve()
[E2] retrieveButton[조회].Select (L118) → retrieve()
[E3] okButton[확인].Select (L124) → hide()
[E4] closeButton[취소].Select (L131) → hide()
[E5] grid.CellDoubleClick (L138) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L85-90 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L162-184 | E1,E2,open,settings | 서비스 bmt.Bmt10_Info.selectByCompanyId(companyId, itemClassCode, baseDate, checkYn) | 업무 |
| private settings() | L92-145 | open | 이벤트 연결, 초기값: baseDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L147-160 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L186-188 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L190-192 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L194-196 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('astClassTreeNm', 150, '종목명'),  // L150 SQL 계산 컬럼(selectByCompanyId: ast01_class_tree_nm)
  gb.textCenter('personNm', 80, '담당자'),  // L151 SQL 계산 컬럼(selectByCompanyId: COALESCE(f_emp_kor_nm(( SELECT bmt11_pe…)
  gb.date('applyDate', 90, '매입일자'),  // L152
  gb.date('retireDate', 90, '폐기일자'),  // L153
  gb.long('acqAmount', 100, '취득금액'),  // L154
  gb.textArea('acqInfo', 200, '취득정보'),  // L155
  gb.textArea('spec', 250, '세부사양'),  // L156
  gb.textArea('note', 250, '비고'),  // L157
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={hide}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

### Bmt10_Lookup_History (`client/vi/bmt/Bmt10_Lookup_History.java`, 222줄)

- 툴바 `buttonBar`: ▶ 장비이력: {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `tabPage` Bmt11_TabPage_History, `lookup` Bmt12_Edit_PcHistory
- 그리드 `grid` (buildGrid()):
  - actionCell 40 "수정" Cell 편집:editCell
  - startDate 90 "시작일자" Date
  - hostName 100 "호스트" Text
  - settingDate 90 "설치(포맷)" Date
  - internalIp 120 "내부IP" Text
  - macAddress 170 "MAC주소" Text
  - etc 300 "기타사항" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L54-82) → show()
[E1] retrieveButton[조회].Select (L96) → retrieve()
[E2] insertButton[등록].Select (L102) → insert()
[E3] deleteButton[삭제].Select (L108) → deleteCheck()
       └ [E5] msgBox.DialogHide [YES] (L191) → delete()
[E4] closeButton[닫기].Select [callback != null] (L114) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L84-93 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L153-166 | E1,open,buildGrid,insert | 서비스 bmt.Bmt12_PcHistory.selectByInfoId(companyId, infoId) | 업무 |
| private insert() | L168-186 | E2 | 팝업 Bmt12_Edit_PcHistory 열기 | 업무 |
| private deleteCheck() | L188-207 | E3 | ConfirmBox → E5 | 업무 |
| private delete() | L209-213 | E5 | GridDeleteData bmt.Bmt12_PcHistory.delete(체크된 행 목록) | 업무 |
| private settings() | L95-123 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L125-151 | 필드 초기화 | 팝업 Bmt12_Edit_PcHistory 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L215-217 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarNoticeStyleNoSpace() | L219-221 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L142) addCell
  gb.date('startDate', 90, '시작일자'),  // L143
  gb.text('hostNm', 100, '호스트'),  // L144
  gb.date('settingDate', 90, '설치(포맷)'),  // L145
  gb.text('internalIp', 120, '내부IP'),  // L146
  gb.text('macAddress', 170, 'MAC주소'),  // L147
  gb.textArea('etc', 300, '기타사항'),  // L148
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="delete" onClick={deleteCheck}>삭제</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Bmt11_TabPage_History (`client/vi/bmt/Bmt11_TabPage_History.java`, 193줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: ▶ 사용자: {retrieveButton} {insertButton} {deleteButton} {updateButton}
- 입력·하위 화면: `lookupEmp` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid()):
  - startDate 90 "시작일자" Date 편집:MyDateField
  - personName 80 "사원명" TextCenter 편집:lookupEmp
  - messenger 200 "사용 메신저" TextArea 편집:TextArea
  - website 200 "사용 웹사이트" TextArea 편집:TextArea
  - note 180 "비고" TextArea 편집:TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L51-68) → settings()
[E1] retrieveButton[조회].Select (L71) → retrieve()
[E2] insertButton[등록].Select (L77) → insert()
[E3] deleteButton[삭제].Select (L83) → deleteCheck()
       └ [E6] msgBox.DialogHide [YES] (L161) → delete()
[E4] updateButton[저장].Select (L89) → update()
[E5] lookupEmp.TriggerClick [result != null] (L101) → 인라인 L101-121 (new TriggerClickHandler(){ @Override …)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L133-140 | E1 | 서비스 bmt.Bmt11_History.selectByInfoId(companyId, infoId) | 업무 |
| private retrieve() | L142-147 | E1 | 서비스 bmt.Bmt11_History.selectByInfoId(companyId, infoId) | 업무 |
| private insert() | L149-156 | E2 | 상태 처리 | 업무 |
| private deleteCheck() | L158-177 | E3 | ConfirmBox → E6 | 업무 |
| private delete() | L179-183 | E6 | GridDeleteData bmt.Bmt11_History.delete(체크된 행 목록) | 업무 |
| private update() | L185-188 | E4 | 서비스 bmt.Bmt11_History.update | 업무 |
| private settings() | L70-95 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L97-131 | 필드 초기화 | 조회창 Emp00_Lookup_SelectSingle 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarNoticeStyleNoSpace() | L190-192 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 90, '시작일자', { editor: 'date' }),  // L124
  gb.textCenter('personNm', 80, '사원명'),  // L125 SQL 계산 컬럼(selectByInfoId: f_emp_kor_nm(bmt11_person_id))
  gb.textArea('messenger', 200, '사용 메신저', { editor: 'largeText' }),  // L126
  gb.textArea('website', 200, '사용 웹사이트', { editor: 'largeText' }),  // L127
  gb.textArea('note', 180, '비고', { editor: 'largeText' }),  // L128
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="delete" onClick={deleteCheck}>삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>

