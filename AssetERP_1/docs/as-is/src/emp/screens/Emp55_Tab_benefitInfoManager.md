# Emp55_Tab_benefitInfoManager

- 종류: 화면
- 메뉴: 기초자료 > 30. 자산&경영 > 복리후생비 코드관리 (#1373)
- 파일: `client/vi/emp/Emp55_Tab_benefitInfoManager.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act01_Lookup_AccountCode`](../../act/components/Act01_Lookup_AccountCode.md), [`Sys01_Lookup_Company`](../../sys/components/Sys01_Lookup_Company.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp55_BenefitInfo.delete` | Emp55_Tab_benefitInfoManager:465 | [`Emp55_BenefitInfo.java:103`](../../emp/services/Emp55_BenefitInfo.md) | `UpdateDataModel(emp55_benefit_info)` 동적 DELETE |
| `emp.Emp55_BenefitInfo.insertInitData` | Emp55_Tab_benefitInfoManager:360 | [`Emp55_BenefitInfo.java:83`](../../emp/services/Emp55_BenefitInfo.md) | [`emp55_benefit_info.insertInitData`](../../emp/sql/emp55_benefit_info.md) |
| `emp.Emp55_BenefitInfo.selectBySearchText` | Emp55_Tab_benefitInfoManager:392 | [`Emp55_BenefitInfo.java:25`](../../emp/services/Emp55_BenefitInfo.md) | [`emp55_benefit_info.selectBySearchText`](../../emp/sql/emp55_benefit_info.md) |
| `emp.Emp55_BenefitInfo.update` | Emp55_Tab_benefitInfoManager:426 | [`Emp55_BenefitInfo.java:98`](../../emp/services/Emp55_BenefitInfo.md) | `UpdateDataModel(emp55_benefit_info)` 동적 INSERT/UPDATE → [`emp55_benefit_info.selectById`](../../emp/sql/emp55_benefit_info.md) |

## 테이블

[`emp55_benefit_info`](../../../db/tables/emp.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_get_account_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp55_Tab_benefitInfoManager (`client/vi/emp/Emp55_Tab_benefitInfoManager.java`, 474줄)

- 레이아웃: center=centerVlc, east=eastVlc
- 툴바 `buttonBarL`: 검색: {searchText} {retrieveButton} {insertButton} {updateButton} {deleteButton} {dataButton}
- 툴바 `buttonBarR`: 고객사: {companyField} 검색: {searchText2} {retrieveButton2} {insertButton2} {updateButton2} {deleteButton2}
- 입력·하위 화면: `searchText` TextField, `searchText2` TextField, `companyField` LookupTriggerField, `lookupCompany` Sys01_Lookup_Company, `lookupAccount` LookupTriggerField
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - benefitName 120 "복리후생비명" Text
  - benefitCode 120 "복리후생비 코드" Text 편집:TextField
  - issueLinkCode 100 "신청코드" Text 편집:TextField
  - expenseLinkCode 100 "지출결의코드" Text 편집:TextField
  - accountCode 100 "계정코드" Text 편집:lookupAccount
  - accountName 120 "계정과목" Text
  - unUseYn 80 "미사용" Boolean
- 그리드 `tgtGrid` (tgtBuildGrid(), 체크박스(다중)):
  - benefitName 120 "복리후생비명" Text
  - benefitCode 120 "복리후생비 코드" Text 편집:TextField
  - issueLinkCode 100 "신청코드" Text 편집:TextField
  - expenseLinkCode 100 "지출결의코드" Text 편집:TextField
  - accountCode 100 "계정코드" Text 편집:lookupAccount
  - accountName 120 "계정과목" Text
  - unUseYn 80 "미사용" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L75-125) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L129) → retrieve()
[E2] searchText2.KeyPress [Enter] (L139) → retrieveCompany()
[E3] companyField.TriggerClick [result != null] (L150) → retrieveCompany()
[E4] retrieveButton[조회].Select (L172) → retrieve()
[E5] insertButton[등록].Select (L178) → insert()
[E6] updateButton[저장].Select (L184) → update()
[E7] deleteButton[삭제].Select [YES] (L190) → delete()
[E8] msgBox.DialogHide [YES] (L199) → delete()
[E9] retrieveButton2[조회].Select (L217) → retrieveCompany()
[E10] insertButton2[등록].Select (L223) → insert2()
[E11] updateButton2[저장].Select (L229) → update2()
[E12] deleteButton2[삭제].Select [YES] (L235) → delete2()
[E13] msgBox.DialogHide [YES] (L244) → delete2()
[E14] dataButton[기초데이터생성].Select (L261) → initData()
[E15] lookupAccount.TriggerClick (L275) → 인라인 L275-289 (new TriggerClickHandler(){ @Override …)
[E16] lookupAccount.TriggerClick (L309) → 인라인 L309-323 (new TriggerClickHandler(){ @Override …)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public tgtBuildGrid() | L303-335 | 필드 초기화 | 조회창 Act01_Lookup_AccountCode 열기 | 업무 |
| private initData() | L337-382 | E14 | 조회창 Sys01_Lookup_Company 열기, 미선택 시 alert "복리후생비 코드를 선택해주세요", 서비스 emp.Emp55_BenefitInfo.insertInitData(companyId) | 업무 |
| public retrieve() | L384-398 | 생성자,E1,E4 | 서비스 emp.Emp55_BenefitInfo.selectBySearchText(companyId, searchText) | 업무 |
| public retrieveCompany() | L399-418 | E2,E3,E9 | 서비스 emp.Emp55_BenefitInfo.selectBySearchText(companyId, searchText) | 업무 |
| public update() | L424-427 | E6 | 서비스 emp.Emp55_BenefitInfo.update | 업무 |
| public update2() | L429-437 | E11 | 서비스 emp.Emp55_BenefitInfo.update | 업무 |
| public insert() | L439-446 | E5 | 상태 처리 | 업무 |
| public insert2() | L448-460 | E10 | 상태 처리 | 업무 |
| public delete() | L462-466 | E7,E8 | GridDeleteData emp.Emp55_BenefitInfo.delete(체크된 행 목록) | 업무 |
| public delete2() | L468-472 | E12,E13 | GridDeleteData emp.Emp55_BenefitInfo.delete(체크된 행 목록) | 업무 |
| private settings() | L127-267 | 생성자 | 조회창 Sys01_Lookup_Company 열기, 확인창 표시, 이벤트 연결, 초기값: companyField=companyModel.getCompanyName(, companyField=null | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L269-301 | 필드 초기화 | 조회창 Act01_Lookup_AccountCode 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L420-422 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('benefitNm', 120, '복리후생비명'),  // L292 SQL 계산 컬럼(selectBySearchText: f_cdnm('EmpBenefitType', emp55_benefit_…)
  gb.text('benefitCd', 120, '복리후생비 코드', { editor: 'text' }),  // L293
  gb.text('issueLinkCd', 100, '신청코드', { editor: 'text' }),  // L294
  gb.text('expenseLinkCd', 100, '지출결의코드', { editor: 'text' }),  // L295
  gb.text('accountCd', 100, '계정코드'),  // L296
  gb.text('accountNm', 120, '계정과목'),  // L297 SQL 계산 컬럼(selectBySearchText: f_get_account_nm(emp55_company_id, emp5…)
  gb.boolean('unUseYn', 80, '미사용'),  // L298
];

const tgtBuildGrid = () => [
  gb.text('benefitNm', 120, '복리후생비명'),  // L326 SQL 계산 컬럼(selectBySearchText: f_cdnm('EmpBenefitType', emp55_benefit_…)
  gb.text('benefitCd', 120, '복리후생비 코드', { editor: 'text' }),  // L327
  gb.text('issueLinkCd', 100, '신청코드', { editor: 'text' }),  // L328
  gb.text('expenseLinkCd', 100, '지출결의코드', { editor: 'text' }),  // L329
  gb.text('accountCd', 100, '계정코드'),  // L330
  gb.text('accountNm', 120, '계정과목'),  // L331 SQL 계산 컬럼(selectBySearchText: f_get_account_nm(emp55_company_id, emp5…)
  gb.boolean('unUseYn', 80, '미사용'),  // L332
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={delete}>삭제</Button>
5. <Button type="search" onClick={retrieveCompany}>조회</Button>
6. <Button type="register" onClick={insert2}>등록</Button>
7. <Button type="save" onClick={update2}>저장</Button>
8. <Button type="delete" onClick={delete2}>삭제</Button>
9. <Button type="unknown" onClick={initData}>기초데이터생성</Button>

