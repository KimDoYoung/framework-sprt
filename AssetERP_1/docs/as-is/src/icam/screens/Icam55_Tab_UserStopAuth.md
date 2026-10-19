# Icam55_Tab_UserStopAuth

- 종류: 화면
- 메뉴: KFS > 04. ICAM 사용자ID 관리 > 미사용ID 기록관리 (#1317)
- 파일: `client/vi/icam/Icam55_Tab_UserStopAuth.java`
- 함께 쓰는 클래스 2개:
  - `Icam55_Lookup_UserStopAuth` `client/vi/icam/Icam55_Lookup_UserStopAuth.java`
  - `Icam55_Edit_UserStopAuth` `client/vi/icam/Icam55_Edit_UserStopAuth.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `icam.Icam55_IcamUser.selectByProcStateCode` | Icam55_Tab_UserStopAuth:173 | [`Icam55_IcamUser.java:52`](../../icam/services/Icam55_IcamUser.md) | [`icam55_icam_user.selectByProcStateCode`](../../icam/sql/icam55_icam_user.md) |
| `icam.Icam55_IcamUser.updateEachAuth` | Icam55_Edit_UserStopAuth:138 | [`Icam55_IcamUser.java:149`](../../icam/services/Icam55_IcamUser.md) | [`icam55_icam_user.updateStopAuth`](../../icam/sql/icam55_icam_user.md) |
| `icam.Icam55_IcamUser.updateMultiAuth` | Icam55_Lookup_UserStopAuth:129 | [`Icam55_IcamUser.java:126`](../../icam/services/Icam55_IcamUser.md) | [`icam55_icam_user.updateStopAuth`](../../icam/sql/icam55_icam_user.md) |

## 테이블

[`icam55_icam_user`](../../../db/tables/icam.md)

## DB 함수

`f_emp_kor_nm`, `f_get_datedif`, `f_get_datediff`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icam55_Tab_UserStopAuth (`client/vi/icam/Icam55_Tab_UserStopAuth.java`, 211줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 권한정지일: {startDate} ~: {closeDate} 검색: {searchText} {delTargetCheckBox} {retrieveButton} {allUpdateButton}
- 입력·하위 화면: `delTargetCheckBox` CheckBox, `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="회사명/사용자ID/사용자명/상태/비고", `lookupResult` Icam55_Edit_UserStopAuth
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - companyName 300 "회사명" Text
  - userId 150 "사용자ID" Text
  - userName 150 "사용자" Text
  - email 150 "이메일" Text
  - procDate 100 "권한 정지일" Date
  - stopMonthPeriod 150 "권한 정지기간" Text
  - state 150 "상태" IcamUserState
  - delDate 100 "삭제일자" Date
  - unstopDate 100 "권한정지<br>해제일자" Date
  - mngEmpName 80 "처리자" Text
  - note 150 "비고" Text
  - actionCell 50 "변경" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L51-81) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L95) → retrieve()
[E2] retrieveButton[조회].Select (L104) → retrieve()
[E3] allUpdateButton[일괄저장].Select (L111) → openLookupResult()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L155-179 | 생성자,E1,E2,buildGrid,openLookupResult | 서비스 icam.Icam55_IcamUser.selectByProcStateCode(searchText, companyId, startDate, closeDate, delTarget, procStateCode) | 업무 |
| private openLookupResult() | L182-196 | E3 | 조회창 Icam55_Lookup_UserStopAuth 열기 | 업무 |
| private settings() | L83-117 | 생성자 | 이벤트 연결, 초기값: delTargetCheckBox=false("삭제대상만 조회"), startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L119-153 | 필드 초기화 | 팝업 Icam55_Edit_UserStopAuth 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L198-201 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L203-205 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L207-209 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 300, '회사명'),  // L139
  gb.text('userId', 150, '사용자ID'),  // L140
  gb.text('userNm', 150, '사용자'),  // L141
  gb.text('email', 150, '이메일'),  // L142
  gb.date('procDate', 100, '권한 정지일'),  // L143
  gb.text('stopMonthPeriod', 150, '권한 정지기간'),  // L144 SQL 계산 컬럼(selectByProcStateCode: f_get_datediff(icam55_proc_date, f_sysd…)
  // ⚠ 대응 없음 (GridBuilder L145) addIcamUserState
  gb.date('delDate', 100, '삭제일자'),  // L146
  gb.date('unstopDate', 100, '권한정지<br>해제일자'),  // L147
  gb.text('mngEmpNm', 80, '처리자'),  // L148 SQL 계산 컬럼(selectByProcStateCode: f_emp_kor_nm(icam55_mng_emp_id))
  gb.text('note', 150, '비고'),  // L149
  // ⚠ 대응 없음 (GridBuilder L150) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={openLookupResult}>일괄저장</Button>

### Icam55_Lookup_UserStopAuth (`client/vi/icam/Icam55_Lookup_UserStopAuth.java`, 159줄)

- 입력·하위 화면: `delDate` MyDateField, `unstopDate` MyDateField, `note` MyTextArea

#### 이벤트
[E1] delDate[삭제일자].Collapse (L95) → 인라인 L95-100 (new CollapseHandler() { @Override pub…)
[E2] unstopDate[권한정지 해제일자].Collapse (L102) → 인라인 L102-107 (new CollapseHandler() { @Override pub…)
[E3] updateButton[저장].Select (L109) → update()
[E4] closeButton[닫기].Select (L115) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L50-91 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L93-121 | open | 상태 처리 | 업무 |
| public update() | L123-149 | E3 | 서비스 icam.Icam55_IcamUser.updateMultiAuth(delDate, unstopDate, note, mngEmpId, mngEmpId) | 업무 |
| private setHtmlStyle() | L151-153 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L155-157 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Icam55_Edit_UserStopAuth (`client/vi/icam/Icam55_Edit_UserStopAuth.java`, 160줄)

- 입력·하위 화면: `delDate` MyDateField, `unstopDate` MyDateField, `note` MyTextArea

#### 이벤트
[E1] delDate[삭제일자].Collapse (L101) → 인라인 L101-106 (new CollapseHandler() { @Override pub…)
[E2] unstopDate[권한정지 해제일자].Collapse (L108) → 인라인 L108-113 (new CollapseHandler() { @Override pub…)
[E3] updateButton[저장].Select (L115) → update()
[E4] closeButton[닫기].Select (L121) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-97 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L99-127 | open | 상태 처리 | 업무 |
| public update() | L129-150 | E3 | 서비스 icam.Icam55_IcamUser.updateEachAuth | 업무 |
| private setHtmlStyle() | L152-154 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L156-158 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

