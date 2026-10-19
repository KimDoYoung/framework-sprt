# Emp00_Lookup_SelectSingle

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `apr`, `att`, `bbs`, `biz`, `bmt`, `car`, `crd`, `crm`, `est`, `flt`, `fnd`, `icr`, `ics`, `mrb`, `opr`, `pay`, `pln`, `sch`, `scm`, `sys`, `tdm`
- 파일: `client/vi/emp/Emp00_Lookup_SelectSingle.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp00_TransInfo.selectByText` | Emp00_Lookup_SelectSingle:344 | [`Emp00_TransInfo.java:33`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByText`](../../emp/sql/emp00_trans_info.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp08_license`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp00_Lookup_SelectSingle (`client/vi/emp/Emp00_Lookup_SelectSingle.java`, 389줄)

- 툴바 `buttonBar`: 기준일: {baseDateField} 조직/직무/성명: {findTextField} 재직구분: {transName} {retrieveButton}
- 입력·하위 화면: `findTextField` TextField, `baseDateField` MyDateField, `transName` StringComboBox
- 그리드 `grid` (buildGrid(), 체크박스):
  - parentFullName 200 "조직" Text
  - titleName 120 "직책" Text
  - empNo 80 "사번" Text
  - empKorName 100 "성명" Text
  - transDate 100 "발령일" Date

#### 이벤트
[E1] allButton[전체].Select (L74) → hide()
[E2] nullButton[전체].Select [callback != null] (L127) → hide()
[E3] publicButton[공통].Select (L154) → hide()
[E4] findTextField.KeyPress [Enter] (L187) → retrieve()
[E5] retrieveButton[조회].Select (L196) → retrieve()
[E6] oKButton[확인].Select ["One".equals(jobName1)] (L202) → confirmOne(), confirm()
[E7] nullButton[전체].Select [callback != null] (L212) → hide()
[E8] cancelButton[취소].Select (L221) → hide()
[E9] transName[퇴직].Collapse (L244) → retrieve()
[E10] grid.CellDoubleClick ["One".equals(jobName1)] (L268) → confirmOne(), confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L64-68 | openAll,openNull,openLeaveManager,openOrgCode,openPublic | 상태 처리 | 업무 |
| public openAll() | L70-84 | 공개 메서드 | 상태 처리 | 업무 |
| public openNull() | L86-91 | 공개 메서드 | 상태 처리 | 업무 |
| public openLeaveManager() | L93-96 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L98-101 | openAll,openNull,openLeaveManager,openOrgCode,openPublic | 상태 처리 | 업무 |
| public open() | L103-107 | openAll,openNull,openLeaveManager,openOrgCode,openPublic | 상태 처리 | 업무 |
| public open() | L109-112 | openAll,openNull,openLeaveManager,openOrgCode,openPublic | 상태 처리 | 업무 |
| public open() | L114-117 | openAll,openNull,openLeaveManager,openOrgCode,openPublic | 상태 처리 | 업무 |
| public open() | L119-122 | openAll,openNull,openLeaveManager,openOrgCode,openPublic | 상태 처리 | 업무 |
| public open() | L124-137 | openAll,openNull,openLeaveManager,openOrgCode,openPublic | 상태 처리 | 업무 |
| public open() | L139-142 | openAll,openNull,openLeaveManager,openOrgCode,openPublic | 상태 처리 | 업무 |
| public openOrgCode() | L144-148 | 공개 메서드 | 상태 처리 | 업무 |
| public openPublic() | L150-163 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L165-289 | openAll,openNull,openLeaveManager,openOrgCode,openPublic | 상태 처리 | 업무 |
| public retrieve() | L307-351 | E4,E5,E9,open | 서비스 emp.Emp00_TransInfo.selectByText(companyId, searchText, transDate, transCode, isSeparateAddTitle, orgCodeId, isLeaveManager) | 업무 |
| public confirm() | L353-365 | E6,E10 | 미선택 시 alert "선택된 사원이 없습니다" | 업무 |
| public confirmOne() | L367-379 | E6,E10 | 미선택 시 alert "선택된 사원이 없습니다" | 업무 |
| private buildGrid() | L291-305 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L381-383 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L385-387 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('parentFullNm', 200, '조직'),  // L297
  gb.text('titleNm', 120, '직책'),  // L298
  gb.text('empNo', 80, '사번'),  // L299
  gb.text('korNm', 100, '성명'),  // L300
  gb.date('transDate', 100, '발령일'),  // L302
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={() => /* confirmOne(), confirm() */}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>
4. <Button type="unknown" onClick={hide}>전체</Button>
5. <Button type="unknown" onClick={hide}>공통</Button>
6. <Button type="unknown" onClick={hide}>전체</Button>

