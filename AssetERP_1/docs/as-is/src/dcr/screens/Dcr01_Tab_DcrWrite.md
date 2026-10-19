# Dcr01_Tab_DcrWrite

- 종류: 화면
- 메뉴: 문서작성 > 01. 문서작성 > 신규 문서작성 (#1318)
- 파일: `client/vi/dcr/Dcr01_Tab_DcrWrite.java`
- 함께 쓰는 클래스 1개:
  - `Dcr08_Lookup_SelectSingle` `client/vi/dcr/Dcr08_Lookup_SelectSingle.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr50_Lookup_ApprList`](../../apr/components/Apr50_Lookup_ApprList.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectByApprId2` | Dcr01_Tab_DcrWrite:612 | [`Apr01_Appr.java:53`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectByApprId2`](../../apr/sql/apr01_appr.md) |
| `apr.Apr01_Appr.selectByPaging` | Dcr01_Tab_DcrWrite:168 | [`Apr01_Appr.java:1171`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectByDcrWritePaging`](../../apr/sql/apr01_appr.md), [`apr01_appr.selectByDcrWriteTotal`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr01_ClassTree.selectById` | Dcr01_Tab_DcrWrite:485 | [`Dcr01_ClassTree.java:27`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectById`](../../dcr/sql/dcr01_class_tree.md) |
| `dcr.Dcr07_ClassDetail.selectById` | Dcr01_Tab_DcrWrite:502 | [`Dcr07_ClassDetail.java:18`](../../dcr/services/Dcr07_ClassDetail.md) | [`dcr07_class_detail.selectById`](../../dcr/sql/dcr07_class_detail.md) |
| `dcr.Dcr08_OftenUse.insertUpdate` | Dcr01_Tab_DcrWrite:398 | [`Dcr08_OftenUse.java:34`](../../dcr/services/Dcr08_OftenUse.md) | [`dcr08_often_use.insertUpdate`](../../dcr/sql/dcr08_often_use.md) |
| `dcr.Dcr08_OftenUse.selectByPersonId` | Dcr08_Lookup_SelectSingle:112 | [`Dcr08_OftenUse.java:24`](../../dcr/services/Dcr08_OftenUse.md) | [`dcr08_often_use.selectByPersonId`](../../dcr/sql/dcr08_often_use.md) |
| `sys.Sys09_Code.selectByDcrDetail` | Dcr01_Tab_DcrWrite:73 | [`Sys09_Code.java:267`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByDcrDetail`](../../sys/sql/sys09_code.md) |
| `sys.Sys09_Code.selectByDcrLv1` | Dcr01_Tab_DcrWrite:69 | [`Sys09_Code.java:232`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByDcr01`](../../sys/sql/sys09_code.md) |
| `sys.Sys09_Code.selectByDcrLv2` | Dcr01_Tab_DcrWrite:70 | [`Sys09_Code.java:243`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByDcr01`](../../sys/sql/sys09_code.md) |
| `sys.Sys09_Code.selectByDcrLv3` | Dcr01_Tab_DcrWrite:71 | [`Sys09_Code.java:255`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByDcr01`](../../sys/sql/sys09_code.md) |

## 테이블

[`adv02_account`](../../../db/tables/adv.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr07_alt_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr12_relate_adv`](../../../db/tables/apr.md), [`apr13_person_auth`](../../../db/tables/apr.md), [`apr30_appr_step_group`](../../../db/tables/apr.md), [`apr50_bookmark`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr07_class_detail`](../../../db/tables/dcr.md), [`dcr08_often_use`](../../../db/tables/dcr.md), [`dcr10_mail_history`](../../../db/tables/dcr.md), [`ics40_dcr_preconfirm`](../../../db/tables/ics.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_get_fund_nm2`, `f_sysdate`, `f_to_number`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr01_Tab_DcrWrite (`client/vi/dcr/Dcr01_Tab_DcrWrite.java`, 637줄)

- 레이아웃: north=buttonBarVlc, center=vlc
- 툴바 `buttonBar01`: 문서분류: {dcrClassLComboBox} {dcrClassMComboBox} {dcrClassSComboBox} 세부분류: {dcrClassDetailComboBox} {oftenUseButton}
- 툴바 `buttonBar02`: &nbsp;&nbsp;&nbsp;문서명: {title} {helpHlc}
- 툴바 `buttonBar03`: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;비고: {note} {insertButton} {hlc}
- 툴바 `buttonBar`: 등록기간: {startDate} ~: {closeDate} 검색: {searchText} 수신처: {receiveName} {aprCheckBox} {retrieveButton}
- 입력·하위 화면: `dcrClassLComboBox` CommonComboBoxField("sys.Sys09_Code.selectByDcrLv1") 빈칸="대분류를 선택하세요", `dcrClassMComboBox` CommonComboBoxField("sys.Sys09_Code.selectByDcrLv2") 빈칸="중분류를 선택하세요", `dcrClassSComboBox` CommonComboBoxField("sys.Sys09_Code.selectByDcrLv3") 빈칸="문서분류를 선택하세요", `dcrClassDetailComboBox` CommonComboBoxField("sys.Sys09_Code.selectByDcrDetail") 빈칸="선택하세요", `title` TextField 빈칸="세부분류 선택시 작성됩니다.(작성요령을 확인하여 완성해주세요)", `note` TextField 빈칸="세부분류 선택시 작성됩니다.", `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="등록자/문서분류/문서명/비고", `receiveName` TextField 빈칸="미입력", `aprCheckBox` CheckBox, `lookup` Apr50_Lookup_ApprList, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스):
  - bookmarkYn 30 " " BookMarkYn
  - regDate 90 "등록일" Date
  - effectDate 90 "시행일" Date
  - regEmpName 100 "등록자" TextCenter
  - classTreeName 250 "문서분류" Text
  - title 400 "문서명" TextHtml
  - receiveName 150 "수신처" Text
  - relateDisplayName 250 "연관펀드(일임)" Text
  - statusNameBold 80 "상태" TextHtml
  - actionCell 80 "상세보기" Cell 편집:actionCell
  - note 300 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L99-193) → settings(), retrieve()
[E1] bookmarkAnchor.MouseDown (L125) → 인라인 L125-131 (new MouseDownHandler() { @Override pu…)
[E2] dcrClassLComboBox[sys.Sys09_Code.selectByDcrLv1].Collapse [preValue == null] (L207) → refreshCode()
[E3] dcrClassMComboBox[sys.Sys09_Code.selectByDcrLv2].Collapse [preValue == null] (L238) → refreshCode()
[E4] dcrClassSComboBox[sys.Sys09_Code.selectByDcrLv3].Collapse [preValue == null] (L267) → refreshCode(), getClassTreeModel()
[E5] dcrClassDetailComboBox[sys.Sys09_Code.selectByDcrDetail].Collapse [preValue == null] (L296) → getClassDetailModel()
[E6] oftenUseButton[불러오기].Select [result != null] (L316) → getClassDetailModel()
[E7] helpAnchor.MouseDown (L376) → 메시지 "작성요령 / 해당 세부분류는 작성요령이 없습니다"
[E8] insertButton[신규문서 작성].Select (L387) → insertApproval()
[E9] searchText.KeyPress [Enter] (L431) → retrieve()
[E10] receiveName.KeyPress [Enter] (L441) → retrieve()
[E11] retrieveButton[조회].Select (L453) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private refreshCode() | L461-481 | E2,E3,E4 | 서비스 sys.Sys09_Code.selectByDcrLv2, sys.Sys09_Code.selectByDcrLv3, sys.Sys09_Code.selectByDcrDetail | 업무 |
| private getClassTreeModel() | L483-498 | E4 | 서비스 dcr.Dcr01_ClassTree.selectById | 업무 |
| private getClassDetailModel() | L500-521 | E5,E6 | 서비스 dcr.Dcr07_ClassDetail.selectById | 업무 |
| public insertApproval() | L523-536 | E8 | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| public retrieve() | L577-609 | 생성자,E9,E10,E11,insertApproval | 상태 처리 | 업무 |
| private retrieveOne() | L611-628 | buildGrid | 서비스 apr.Apr01_Appr.selectByApprId2(personId, apprId) | 업무 |
| private settings() | L195-459 | 생성자 | 조회창 Dcr08_Lookup_SelectSingle 열기, 서비스 sys.Sys09_Code.selectByDcrLv2, sys.Sys09_Code.selectByDcrLv3, sys.Sys09_Code.selectByDcrDetail, dcr.Dcr08_OftenUse.insertUpdate(companyId, personId, classTreeId, classDetailId, classDetailId), 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(lastMonthDate, closeDate=LoginUser.getToday(, aprCheckBox=false("상단의 문서분류를 조회조건에 포함") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L538-575 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L630-632 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L634-636 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L562) addBookMarkYn
  gb.date('regDate', 90, '등록일'),  // L563
  gb.date('effectDate', 90, '시행일'),  // L564
  gb.textCenter('regEmpNm', 100, '등록자'),  // L565
  gb.text('classTreeNm', 250, '문서분류'),  // L566
  // ⚠ 대응 없음 (GridBuilder L567) addTextHtml
  gb.text('receiveNm', 150, '수신처'),  // L568
  gb.text('relateDisplayName', 250, '연관펀드(일임)'),  // L569
  // ⚠ 대응 없음 (GridBuilder L570) addTextHtml
  // ⚠ 대응 없음 (GridBuilder L571) addCell
  gb.text('note', 300, '비고'),  // L572
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertApproval}>신규문서 작성</Button>
3. <Button type="register" onClick={getClassDetailModel}>불러오기</Button>

### Dcr08_Lookup_SelectSingle (`client/vi/dcr/Dcr08_Lookup_SelectSingle.java`, 134줄)

- 툴바 `buttonBar`: {retrieveButton}
- 그리드 `grid` (buildGrid(), 체크박스):
  - classTreeFullName 400 "문서분류" Text
  - classDetailName 250 "세부분류" Text
  - count 80 "사용횟수" Long

#### 이벤트
[E1] retrieveButton[새로고침].Select (L68) → retrieve()
[E2] oKButton[확인].Select (L74) → confirm()
[E3] cancelButton[닫기].Select (L80) → hide()
[E4] grid.CellDoubleClick (L86) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L40-65 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L107-118 | E1,open | 서비스 dcr.Dcr08_OftenUse.selectByPersonId(personId) | 업무 |
| public confirm() | L120-129 | E2,E4 | 미선택 시 alert "선택된 문서분류가 없습니다" | 업무 |
| private settings() | L67-92 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L94-105 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L131-133 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('classTreeFullNm', 400, '문서분류'),  // L100
  gb.text('classDetailNm', 250, '세부분류'),  // L101
  gb.long('count', 80, '사용횟수'),  // L102
];
```

#### 사용된 버튼들
1. <Button type="reset" onClick={retrieve}>새로고침</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

