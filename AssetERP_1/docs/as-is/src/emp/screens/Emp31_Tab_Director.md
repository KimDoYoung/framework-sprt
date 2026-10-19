# Emp31_Tab_Director

- 종류: 화면
- 메뉴: 경영관리 > 01. 조직 및 사원관리 > 임원정보 관리 (#1294)
- 파일: `client/vi/emp/Emp31_Tab_Director.java`
- 함께 쓰는 클래스 1개:
  - `Emp31_Lookup_Rd_Director` `client/vi/emp/Emp31_Lookup_Rd_Director.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Dcr30_Lookup_Link`](../../dcr/components/Dcr30_Lookup_Link.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr30_Link.selectByLinkCode` | Emp31_Lookup_Rd_Director:174 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `emp.Emp31_Director.delete` | Emp31_Tab_Director:240 | [`Emp31_Director.java:62`](../../emp/services/Emp31_Director.md) | `UpdateDataModel(emp31_director)` 동적 DELETE |
| `emp.Emp31_Director.selectByText` | Emp31_Tab_Director:192 | [`Emp31_Director.java:24`](../../emp/services/Emp31_Director.md) | [`emp31_director.selectByText`](../../emp/sql/emp31_director.md) |
| `emp.Emp31_Director.updateList` | Emp31_Tab_Director:213 | [`Emp31_Director.java:36`](../../emp/services/Emp31_Director.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp31_director.selectByPersonId`](../../emp/sql/emp31_director.md), `UpdateDataModel(emp31_director)` 동적 INSERT/UPDATE → [`emp31_director.selectById`](../../emp/sql/emp31_director.md) |
| `sys.Sys99_Print.insertRdDirector01` | Emp31_Tab_Director:258 | [`Sys99_Print.java:2944`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp31_director.selectByTextReport`](../../emp/sql/emp31_director.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |
| `sys.Sys99_Print.insertRdDirector02` | Emp31_Tab_Director:265 | [`Sys99_Print.java:3019`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp31_director.selectByText`](../../emp/sql/emp31_director.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp07_career`](../../../db/tables/emp.md), [`emp31_director`](../../../db/tables/emp.md), [`sys99_print`](../../../db/tables/sys.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm34_role_allc_detail`](../../../db/tables/tdm.md), [`tdm35_role_allc_task`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate`, `f_today`, `gettdm30roleallc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp31_Tab_Director (`client/vi/emp/Emp31_Tab_Director.java`, 316줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar01`: 검색: {searchTextField} {checkBox} {retrieveButton} {updateButton} {rdButton} {notice}
- 툴바 `buttonBar02`: {dcrLinkButton}
- 입력·하위 화면: `searchTextField` TextField 빈칸="성명/직위/비고", `checkBox` CheckBox, `lookup` Dcr30_Lookup_Link, `lookupRd` Emp31_Lookup_Rd_Director
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - personName 80 "성명" TextFrozen 편집:"center"
  - chnName 80 "한자명" TextCenter
  - posName 100 "직위" TextCenter
  - officerYn 70 "등기여부" OfficerYn
  - ctzNo 80 "주민번호<br>(앞6자리)" TextCenterHtml
  - initAssignDate 100 "최초선임일" Date 편집:MyDateField
  - rcntAssingDate 100 "최근선임일" Date 편집:MyDateField
  - expireDate 100 "임기만료일" Date 편집:MyDateField
  - assignCnt 70 "선임횟수" LongCenter 편집:LongField
  - addTitle 250 "겸직사항" TextArea 편집:MyTextArea
  - qualified 250 "자격요건확인" TextArea 편집:MyTextArea
  - preferStock 80 "우선주" Long 편집:LongField
  - commonStock 80 "보통주" Long 편집:LongField
  - endDate 100 "해(사)임일" Date 편집:MyDateField
  - endReason 250 "해(사)임 사유" TextArea 편집:MyTextArea
  - note 200 "비고" TextArea 편집:MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L68-104) → settings(), retrieve()
[E1] searchTextField.KeyPress [Enter] (L112) → retrieve()
[E2] retrieveButton[조회].Select (L120) → retrieve()
[E3] updateButton[저장].Select (L126) → update()
[E4] dcrLinkButton[문서분류지정].Select (L132) → 인라인 L132-143 (new SelectHandler(){ @Override public…)
[E5] rdButton[임원 선임/해임 보고].Select (L144) → createPrint()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L186-198 | 생성자,E1,E2,update | 서비스 emp.Emp31_Director.selectByText(searchText, companyId, endCheck) | 업무 |
| public update() | L201-227 | E3 | 서비스 emp.Emp31_Director.updateList | 업무 |
| public insertRow() | L230-234 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L237-241 | 공개 메서드 | GridDeleteData emp.Emp31_Director.delete(체크된 행 목록) | 업무 |
| private createPrint() | L243-298 | E5 | 조회창 Emp31_Lookup_Rd_Director 열기, 미선택 시 alert, 서비스 sys.Sys99_Print.insertRdDirector01, sys.Sys99_Print.insertRdDirector02(companyId, personId, windowClassName, searchText, companyId, personId, windowClassName, searchText, endCheck) | 업무 |
| private settings() | L106-154 | 생성자 | 조회창 Dcr30_Lookup_Link 열기, 미선택 시 alert "선임(해임)보고 대상을 선택해주세요", 이벤트 연결, 초기값: checkBox=false("해임임원 포함") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L156-183 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L300-303 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L305-307 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L309-311 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L313-315 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L159 newHeaderGroupMap013newHeaderGroupConfigsetHtmlGridStyle12 100 "주식 보유수" (emp03_new_header_group_map013new_header_group_configset_html_grid_style12 컬럼 없음)
  // ⚠ 대응 없음 (GridBuilder L162) addTextFrozen
  gb.textCenter('chnNm', 80, '한자명'),  // L166
  gb.textCenter('posNm', 100, '직위'),  // L167
  // ⚠ 대응 없음 (GridBuilder L168) addOfficerYn
  // ⚠ 대응 없음 (GridBuilder L169) addTextCenterHtml
  gb.date('initAssignDate', 100, '최초선임일', { editor: 'date' }),  // L170
  gb.date('rcntAssingDate', 100, '최근선임일', { editor: 'date' }),  // L171
  gb.date('expireDate', 100, '임기만료일', { editor: 'date' }),  // L172
  gb.longCenter('assignCnt', 70, '선임횟수', { editor: 'number' }),  // L173
  gb.textArea('addTitle', 250, '겸직사항', { editor: 'largeText' }),  // L174
  gb.textArea('qualified', 250, '자격요건확인', { editor: 'largeText' }),  // L175
  gb.long('preferStock', 80, '우선주', { editor: 'number' }),  // L176
  gb.long('commonStock', 80, '보통주', { editor: 'number' }),  // L177
  gb.date('endDate', 100, '해(사)임일', { editor: 'date' }),  // L178
  gb.textArea('endReason', 250, '해(사)임 사유', { editor: 'largeText' }),  // L179
  gb.textArea('note', 200, '비고', { editor: 'largeText' }),  // L180
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="save" onClick={() => /* 인라인 L132-143 (new SelectHandler(){ @Override public…) */}>문서분류지정</Button>
4. <Button type="download" onClick={createPrint}>임원 선임/해임 보고</Button>

### Emp31_Lookup_Rd_Director (`client/vi/emp/Emp31_Lookup_Rd_Director.java`, 246줄)

- 툴바 `buttonBar`: 구분: {divisionComboBox} {retrieveButton}
- 입력·하위 화면: `divisionComboBox` StringComboBox, `popup` Dcr01_Lookup_Class, `apprDoc` Apr01_Edit_ApprDoc

#### 이벤트
[E0] 화면 열림 (생성자 L66-124) → defaultName(), show()
[E1] retrieveButton[조회].Select (L89) → setRd()
[E2] apprButton[상신하기].Select (L95) → insertApproval()
[E3] closeButton[닫기].Select (L101) → hide()
[E4] divisionComboBox[선임].Collapse (L107) → setRd()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L126-132 | 공개 메서드 | 상태 처리 | 업무 |
| private setRd() | L134-171 | E1,E4,open | 상태 처리 | 업무 |
| private defaultName() | L173-194 | 생성자,setRd | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertApproval() | L196-208 | E2 | 조회창 Dcr01_Lookup_Class 열기 | 업무 |
| private insertLinkApproval() | L210-236 | insertApproval | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private setHtmlHeaderStyle() | L238-240 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L242-244 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={setRd}>조회</Button>
2. <Button type="unknown" onClick={insertApproval}>상신하기</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

