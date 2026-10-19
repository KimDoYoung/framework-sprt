# Emp00_Lookup_SelectMulti

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `apr`, `ast`, `att`, `bbs`, `biz`, `crm`, `dcr`, `ics`, `mkt`, `pay`, `sch`, `scm`, `sms`, `sys`, `tdm`
- 파일: `client/vi/emp/Emp00_Lookup_SelectMulti.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp00_TransInfo.selectByText` | Emp00_Lookup_SelectMulti:210 | [`Emp00_TransInfo.java:33`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByText`](../../emp/sql/emp00_trans_info.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp08_license`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp00_Lookup_SelectMulti (`client/vi/emp/Emp00_Lookup_SelectMulti.java`, 237줄)

- 툴바 `buttonBar`: 기준일: {baseDateField} 조직/직무/성명: {findTextField} 재직구분: {transName} {retrieveButton}
- 입력·하위 화면: `findTextField` TextField, `baseDateField` MyDateField, `transName` StringComboBox
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - parentFullName 200 "조직" Text
  - titleName 120 "직책" Text
  - empNo 80 "사번" Text
  - empKorName 100 "성명" Text
  - transDate 100 "발령일" Date

#### 이벤트
[E1] findTextField.KeyPress [Enter] (L89) → retrieve()
[E2] retrieveButton[조회].Select (L98) → retrieve()
[E3] oKButton[확인].Select (L104) → confirm()
[E4] cancelButton[취소].Select (L110) → hide()
[E5] transName[재직].Collapse (L127) → retrieve()
[E6] grid.CellDoubleClick (L151) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L57-61 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L63-66 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L68-164 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L181-216 | E1,E2,E5,open | 서비스 emp.Emp00_TransInfo.selectByText(companyId, companyId, searchText, transDate, transCode, isSeparateAddTitle) | 업무 |
| public confirm() | L218-227 | E3,E6 | 상태 처리 | 업무 |
| private buildGrid() | L166-179 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L229-231 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L233-235 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('parentFullNm', 200, '조직'),  // L172
  gb.text('titleNm', 120, '직책'),  // L173
  gb.text('empNo', 80, '사번'),  // L174
  gb.text('korNm', 100, '성명'),  // L175
  gb.date('transDate', 100, '발령일'),  // L176
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

