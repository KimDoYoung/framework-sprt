# Emp01_Tab_UserInfo

- 종류: 화면
- 메뉴: 관리자 > 01. 고객관리 > 사용자정보 조회 (#1325)
- 파일: `client/vi/emp/Emp01_Tab_UserInfo.java`
- 함께 쓰는 클래스 1개:
  - `Emp02_Edit_Note` `client/vi/emp/Emp02_Edit_Note.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys01_Lookup_Company`](../../sys/components/Sys01_Lookup_Company.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp01_Person.selectBySearchTextPaging` | Emp01_Tab_UserInfo:91 | [`Emp01_Person.java:63`](../../emp/services/Emp01_Person.md) | [`emp01_person.selectBySearchTextPaging`](../../emp/sql/emp01_person.md), [`emp01_person.selectBySearchTextTotal`](../../emp/sql/emp01_person.md) |
| `emp.Emp02_Others.modelUpdate` | Emp02_Edit_Note:90 | [`Emp02_Others.java:54`](../../emp/services/Emp02_Others.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(emp02_others)` 동적 INSERT/UPDATE → [`emp02_others.selectById`](../../emp/sql/emp02_others.md) |
| `emp.Emp02_Others.selectById` | Emp01_Tab_UserInfo:183 | [`Emp02_Others.java:18`](../../emp/services/Emp02_Others.md) | [`emp02_others.selectById`](../../emp/sql/emp02_others.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_emptrans`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp01_Tab_UserInfo (`client/vi/emp/Emp01_Tab_UserInfo.java`, 338줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 고객사: {companyField} 검색: {searchText} {useYn} {quitYn} {retrieveButton} ※ 복사하고싶은 정보를 더블클릭하시면 복사가 됩니다.:
- 입력·하위 화면: `searchText` TextField 빈칸="고객사명/부서명/사원명/사무실/휴대폰/비고", `useYn` CheckBox, `quitYn` CheckBox, `companyField` LookupTriggerField, `lookupCompany` Sys01_Lookup_Company, `lookup` Emp02_Edit_Note
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - companyName 200 "고객사" Text
  - erpProductCode 50 "적용" TextCenter
  - korName 100 "사원명" Text
  - empNo 100 "사번" Text
  - posName 80 "직위" Text
  - orgName 200 "부서명" Text
  - officeTelNo 110 "사무실" TextCenter
  - mobileTelNo 110 "휴대폰" TextCenter
  - emailAddress 200 "이메일" Text
  - hireDate 90 "입사일" Date
  - retireDate 90 "퇴사일" Date
  - noteAdmin 150 "비고" TextArea
  - actionCell 40 " " Cell 편집:actionCell
  - subDomain 80 "서브도메인" Text
  - companyId 80 "회사ID" Long
  - personId 80 "사원ID" Long
  - orgId 80 "부서ID" Long

#### 이벤트
[E0] 화면 열림 (생성자 L62-107) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L122) → retrieve()
[E2] companyField[전체].TriggerClick [result != null] (L131) → 인라인 L131-150 (new TriggerClickHandler() { @Override…)
[E3] retrieveButton[조회].Select (L152) → retrieve()
[E4] grid.CellDoubleClick (L159) → getCellValue(), showCopyMessage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L229-275 | 생성자,E1,E3 | 상태 처리 | 업무 |
| private getCellValue() | L278-295 | E4 | 상태 처리 | 업무 |
| private showCopyMessage() | L307-325 | E4 | 확인창 표시 | 업무 |
| private settings() | L109-175 | 생성자 | 조회창 Sys01_Lookup_Company 열기, 이벤트 연결, 초기값: useYn=true("사용고객만 보기"), quitYn=true("퇴사자 제외"), companyField=companyModel.getCompanyName(("전체"), companyField="전체"("전체") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L177-227 | 필드 초기화 | 팝업 Emp02_Edit_Note 열기, 서비스 emp.Emp02_Others.selectById(personId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L327-329 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L331-333 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L335-337 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 200, '고객사'),  // L208 SQL 계산 컬럼(selectBySearchTextPaging: sys01_company_nm)
  gb.textCenter('erpProductCd', 50, '적용'),  // L209 SQL 계산 컬럼(selectBySearchTextPaging: sys01_erp_product_cd)
  gb.text('korNm', 100, '사원명'),  // L210
  gb.text('empNo', 100, '사번'),  // L211
  gb.text('posNm', 80, '직위'),  // L212 SQL 계산 컬럼(selectBySearchTextPaging: f_get_empTrans(emp01_person_id, f_sysda…)
  gb.text('orgNm', 200, '부서명'),  // L213 SQL 계산 컬럼(selectBySearchTextPaging: f_get_empTrans(emp01_person_id, f_sysda…)
  gb.textCenter('officeTelno', 110, '사무실'),  // L214
  gb.textCenter('mobileTelno', 110, '휴대폰'),  // L215
  gb.text('emailAddr', 200, '이메일'),  // L216
  gb.date('hireDate', 90, '입사일'),  // L217
  gb.date('retireDate', 90, '퇴사일'),  // L218 SQL 계산 컬럼(selectBySearchTextPaging: f_get_emptrans(emp01_person_id, null, '…)
  gb.textArea('noteAdmin', 150, '비고'),  // L219 SQL 계산 컬럼(selectBySearchTextPaging: emp02_note_admin)
  // ⚠ 대응 없음 (GridBuilder L220) addCell
  gb.text('subDomain', 80, '서브도메인'),  // L221 SQL 계산 컬럼(selectBySearchTextPaging: sys01_loc_nm)
  gb.long('companyId', 80, '회사ID'),  // L222
  gb.long('personId', 80, '사원ID'),  // L223
  gb.long('orgId', 80, '부서ID'),  // L224 SQL 계산 컬럼(selectBySearchTextPaging: emp03_org_code_id)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Emp02_Edit_Note (`client/vi/emp/Emp02_Edit_Note.java`, 106줄)

- 입력·하위 화면: `noteAdmin` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L50-70) → settings(), show()
[E1] updateButton[저장].Select (L73) → update()
[E2] closeButton[닫기].Select (L79) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L40-48 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L87-101 | E1 | 서비스 emp.Emp02_Others.modelUpdate | 업무 |
| private settings() | L72-85 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L103-105 | edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

