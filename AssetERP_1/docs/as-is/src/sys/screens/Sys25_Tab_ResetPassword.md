# Sys25_Tab_ResetPassword

- 종류: 화면
- 메뉴: 관리자 > 09. 기타 > 비밀번호 초기화 (#1182)
- 파일: `client/vi/sys/Sys25_Tab_ResetPassword.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp01_Person.updateLockYn` | Sys25_Tab_ResetPassword:207 | [`Emp01_Person.java:243`](../../emp/services/Emp01_Person.md) | [`emp01_person.updateLockYn`](../../emp/sql/emp01_person.md) |
| `emp.Emp03_Trans.selectByGrade` | Sys25_Tab_ResetPassword:189 | [`Emp03_Trans.java:68`](../../emp/services/Emp03_Trans.md) | [`emp03_trans.selectByGrade`](../../emp/sql/emp03_trans.md) |
| `emp.Emp03_Trans.selectByPasswordPersonId` | Sys25_Tab_ResetPassword:197 | [`Emp03_Trans.java:93`](../../emp/services/Emp03_Trans.md) | [`emp03_trans.selectByPasswordPersonId`](../../emp/sql/emp03_trans.md) |
| `sys.Sys25_Password.insert` | Sys25_Tab_ResetPassword:222 | [`Sys25_Password.java:79`](../../sys/services/Sys25_Password.md) | [`emp01_person.selectByCompanyCode`](../../emp/sql/emp01_person.md), [`sys25_password.checkInsert`](../../sys/sql/sys25_password.md), [`sys25_password.insert`](../../sys/sql/sys25_password.md), [`sys25_password.updatePassword`](../../sys/sql/sys25_password.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp25_mypage_notice`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys25_password`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_get_emptrans`, `f_org_parent_full_nm`, `f_sysdate`, `to_decrypts`, `to_encrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys25_Tab_ResetPassword (`client/vi/sys/Sys25_Tab_ResetPassword.java`, 241줄)

- 레이아웃: center=vlc
- 툴바 `searchBar`: 성명: {selectPersonField} {retrieveButton}
- 입력·하위 화면: `selectPersonField` LookupTriggerField 빈칸="전체", `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid()):
  - empNo 100 "사번" TextCenter
  - orgName 300 "본부(부서)" Text
  - empKorName 100 "성명" TextCenter
  - lockYn 100 "상태" BooleanIcon
  - actionCell 150 "잠금해제" Cell 편집:actionCell1
  - actionCell 150 "비밀번호 초기화" Cell 편집:actionCell2

#### 이벤트
[E0] 화면 열림 (생성자 L54-74) → buttonSetting(), retrieve()
[E1] msgBox.DialogHide [YES] (L84) → resetLock()
[E2] msgBox.DialogHide [YES] (L108) → resetPassword()
[E3] selectPersonField.TriggerClick (L141) → lookupPerson()
[E4] selectPersonField.Change (L147) → 인라인 L147-155 (new ChangeHandler() { @Override publi…)
[E5] retrieveButton[조회].Select (L156) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buttonSetting() | L138-162 | 생성자 | 상태 처리 | 업무 |
| private lookupPerson() | L164-180 | E3 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| public retrieve() | L182-204 | 생성자,E5,resetLock,resetPassword | 서비스 emp.Emp03_Trans.selectByGrade, emp.Emp03_Trans.selectByPasswordPersonId(companyId, baseDate, personId) | 업무 |
| private resetLock() | L206-219 | E1 | 서비스 emp.Emp01_Person.updateLockYn(personId, lockYn) | 업무 |
| private resetPassword() | L221-235 | E2 | 미선택 시 alert "비밀번호 초기화를 완료하였습니다.", 서비스 sys.Sys25_Password.insert(personId, companyId, password) | 업무 |
| private buildGrid() | L76-136 | 필드 초기화 | 확인창 표시, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L237-239 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('empNo', 100, '사번'),  // L128
  gb.text('korNm', 300, '본부(부서)'),  // L129
  gb.textCenter('korNm', 100, '성명'),  // L130
  // ⚠ 대응 없음 (GridBuilder L131) addBooleanIcon
  // ⚠ 대응 없음 (GridBuilder L132) addCell
  // ⚠ 대응 없음 (GridBuilder L133) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

