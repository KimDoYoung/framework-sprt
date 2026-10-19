# Emp00_Tab_ChangeHistory

- 종류: 화면
- 메뉴: 경영관리 > 01. 조직 및 사원관리 > 사원정보 변경조회 (#1474)
- 파일: `client/vi/emp/Emp00_Tab_ChangeHistory.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp03_Trans.selectByHistory` | Emp00_Tab_ChangeHistory:348 | [`Emp03_Trans.java:29`](../../emp/services/Emp03_Trans.md) | [`emp03_trans.selectByHistory`](../../emp/sql/emp03_trans.md) |
| `emp.Emp08_License.selectByHistory` | Emp00_Tab_ChangeHistory:378 | [`Emp08_License.java:22`](../../emp/services/Emp08_License.md) | [`emp08_license.selectByHistory`](../../emp/sql/emp08_license.md) |
| `emp.Emp11_Reward.selectByHistory` | Emp00_Tab_ChangeHistory:394 | [`Emp11_Reward.java:31`](../../emp/services/Emp11_Reward.md) | [`emp11_reward.selectByHistory`](../../emp/sql/emp11_reward.md) |
| `sys.Sys99_Print.insertRdEmp03History` | Emp00_Tab_ChangeHistory:405 | [`Sys99_Print.java:4779`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp03_trans.selectByHistory`](../../emp/sql/emp03_trans.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |
| `sys.Sys99_Print.insertRdEmp08History` | Emp00_Tab_ChangeHistory:445 | [`Sys99_Print.java:4847`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp08_license.selectByHistory`](../../emp/sql/emp08_license.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |
| `sys.Sys99_Print.insertRdEmp11History` | Emp00_Tab_ChangeHistory:481 | [`Sys99_Print.java:4897`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp11_reward.selectByHistory`](../../emp/sql/emp11_reward.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp08_license`](../../../db/tables/emp.md), [`emp11_reward`](../../../db/tables/emp.md), [`emp32_relate_license`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_emptrans`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp00_Tab_ChangeHistory (`client/vi/emp/Emp00_Tab_ChangeHistory.java`, 532줄)

- 레이아웃: center=hlc
- 툴바 `buttonBar`: 조회기간: {startDate01} ~: {closeDate01} 발령구분: {empTransComboBox} 검색: {searchText01} {retrieveButton01} {downLoadButton01} 기준일: {startDate02} 재직구분: {transName} 검색: {searchText02} {retrieveButton02} {downLoadButton02} 조회기간: {startDate03} ~: {closeDate03} 검색: {searchText03} {retrieveButton03} {downLoadButton03}
- 입력·하위 화면: `startDate01` MyDateField, `closeDate01` MyDateField, `searchText01` TextField 빈칸="성명", `empTransComboBox` ComboBoxField("EmpTransCode", "전체"), `startDate02` MyDateField, `searchText02` TextField 빈칸="성명/자격증명/협회등록번호/발급기관", `transName` StringComboBox, `startDate03` MyDateField, `closeDate03` MyDateField, `searchText03` TextField 빈칸="성명"
- 그리드 `grid01` (buildGrid01()):
  - transDate 100 "발령일" Date
  - empKorName 100 "성명" TextCenter
  - transName 80 "발령구분" TextCenter
  - kindName 80 "사원구분" TextCenter
  - orgName 200 "발령조직" Text
  - titleName 100 "발령직책" Text
  - posName 100 "발령직위" Text
  - gradeName 100 "특정직위" Text
  - duty 150 "담당업무" Text
  - expiryDate 100 "계약만료일" Date
  - orgHeadYn 70 "조직장" BooleanYn2
  - officerYn 70 "등기임원" BooleanYn2
  - tdmTargetYn 70 "책무대상" BooleanYn2
  - nonStayYn 70 "비상근" BooleanYn2
  - transReason 200 "비고" Text
- 그리드 `grid02` (buildGrid02()):
  - empOrgName 200 "본부(부서)" Text
  - empKorName 100 "성명" TextCenter
  - certifiedName 200 "자격증명" Text
  - certifiedDt 100 "취득일자" Date
  - licenseNumber 150 "자격증번호(협회등록번호)" Text
  - issuingAgency 150 "발급기관" Text
  - financeProTypeName 150 "금융투자전문인력구분" Text
  - financeRelateYn 120 "금융관련자격증" BooleanYn2
  - kofiaRegDate 100 "협회등록일" Date
  - note 240 "비고" Text
- 그리드 `grid03` (buildGrid03()):
  - rewardDt 100 "상벌일자" Date
  - empKorName 100 "성명" TextCenter
  - rewardCodeName 60 "상벌구분" TextCenter
  - rewardGroup 200 "상벌단체" Text
  - rewardName 350 "수상(징계)사유" TextArea
  - rewardDesc 350 "수상(징계)처분" TextArea
  - note 200 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L87-105) → settings(), vlc01(), vlc02(), vlc03(), retrieve01(), retrieve02(), retrieve03()
[E1] searchText01.KeyPress [Enter] (L126) → retrieve01()
[E2] searchText02.KeyPress [Enter] (L136) → retrieve02()
[E3] transName[재직].Collapse (L152) → retrieve02()
[E4] searchText03.KeyPress [Enter] (L161) → retrieve03()
[E5] empTransComboBox[EmpTransCode].Collapse (L174) → retrieve01()
[E6] retrieveButton01[조회].Select (L181) → retrieve01()
[E7] retrieveButton02[조회].Select (L187) → retrieve02()
[E8] retrieveButton03[조회].Select (L193) → retrieve03()
[E9] downLoadButton01[출력/다운로드].Select (L199) → downLoadButton01()
[E10] downLoadButton02[출력/다운로드].Select (L205) → downLoadButton02()
[E11] downLoadButton03[출력/다운로드].Select (L211) → downLoadButton03()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buildGrid01() | L219-239 | 필드 초기화 | 상태 처리 | 업무 |
| private vlc01() | L241-263 | 생성자 | 상태 처리 | 업무 |
| private buildGrid02() | L265-280 | 필드 초기화 | 상태 처리 | 업무 |
| private vlc02() | L282-302 | 생성자 | 상태 처리 | 업무 |
| private buildGrid03() | L304-316 | 필드 초기화 | 상태 처리 | 업무 |
| private vlc03() | L318-337 | 생성자 | 상태 처리 | 업무 |
| private retrieve01() | L339-354 | 생성자,E1,E5,E6 | 서비스 emp.Emp03_Trans.selectByHistory(companyId, startDate, closeDate, searchText, empTransCode) | 업무 |
| private retrieve02() | L356-384 | 생성자,E2,E3,E7 | 서비스 emp.Emp08_License.selectByHistory(companyId, startDate, searchText, transCode) | 업무 |
| private retrieve03() | L386-400 | 생성자,E4,E8 | 서비스 emp.Emp11_Reward.selectByHistory(companyId, startDate, closeDate, searchText) | 업무 |
| private downLoadButton01() | L402-441 | E9 | 서비스 sys.Sys99_Print.insertRdEmp03History(companyId, personId, windowClassName, startDate, closeDate, searchText, empTransCode) | 업무 |
| private downLoadButton02() | L443-477 | E10 | 서비스 sys.Sys99_Print.insertRdEmp08History(companyId, personId, windowClassName, startDate, searchText) | 업무 |
| private downLoadButton03() | L479-515 | E11 | 서비스 sys.Sys99_Print.insertRdEmp11History(companyId, personId, windowClassName, startDate, closeDate, searchText) | 업무 |
| private getDateStr() | L517-527 | downLoadButton01,downLoadButton02,downLoadButton03 | 상태 처리 | 업무 |
| private settings() | L107-217 | 생성자 | 이벤트 연결, 초기값: startDate01=startDate, closeDate01=LoginUser.getToday(, startDate02=LoginUser.getToday(, startDate03=startDate, closeDate03=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L529-531 | vlc01,vlc02,vlc03 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid01 = () => [
  gb.date('transDate', 100, '발령일'),  // L221
  gb.textCenter('korNm', 100, '성명'),  // L222
  gb.textCenter('transNm', 80, '발령구분'),  // L224 SQL 계산 컬럼(selectByHistory: f_cdnm('EmpTransCode', emp03_trans_cd, …)
  gb.textCenter('kindNm', 80, '사원구분'),  // L225 SQL 계산 컬럼(selectByHistory: f_cdnm('EmpKindCode', emp03_kind_cd, em…)
  gb.text('korNm', 200, '발령조직'),  // L226
  gb.text('titleNm', 100, '발령직책'),  // L227 SQL 계산 컬럼(selectByHistory: f_get_empTrans(emp03_person_id, emp03_t…)
  gb.text('posNm', 100, '발령직위'),  // L228 SQL 계산 컬럼(selectByHistory: f_cdnm('EmpPosCode', emp03_pos_cd, emp0…)
  gb.text('gradeNm', 100, '특정직위'),  // L229 SQL 계산 컬럼(selectByHistory: f_cdnm('EmpGradeCode', emp03_grade_cd, …)
  gb.text('duty', 150, '담당업무'),  // L230
  gb.date('expiryDate', 100, '계약만료일'),  // L231
  gb.booleanYn2('orgHeadYn', 70, '조직장'),  // L232
  gb.booleanYn2('officerYn', 70, '등기임원'),  // L233
  gb.booleanYn2('tdmTargetYn', 70, '책무대상'),  // L234
  gb.booleanYn2('nonStayYn', 70, '비상근'),  // L235
  gb.text('transReason', 200, '비고'),  // L236
];

const buildGrid02 = () => [
  gb.text('empOrgNm', 200, '본부(부서)'),  // L267 SQL 계산 컬럼(selectByHistory: f_get_empTrans(emp01_person_id, f_sysda…)
  gb.textCenter('empKorNm', 100, '성명'),  // L268 SQL 계산 컬럼(selectByHistory: emp01_kor_nm)
  gb.text('certifiedNm', 200, '자격증명'),  // L270
  gb.date('certifiedDt', 100, '취득일자'),  // L271
  gb.text('licenseNo', 150, '자격증번호(협회등록번호)'),  // L272
  gb.text('issuingAgency', 150, '발급기관'),  // L273
  gb.text('financeProTypeNm', 150, '금융투자전문인력구분'),  // L274 SQL 계산 컬럼(selectByHistory: f_cdnm('FinanceProType', emp32_finance_…)
  gb.booleanYn2('financeRelateYn', 120, '금융관련자격증'),  // L275
  gb.date('kofiaRegDate', 100, '협회등록일'),  // L276
  gb.text('note', 240, '비고'),  // L277
];

const buildGrid03 = () => [
  gb.date('rewardDt', 100, '상벌일자'),  // L306
  gb.textCenter('empKorNm', 100, '성명'),  // L307 SQL 계산 컬럼(selectByHistory: emp01_kor_nm)
  gb.textCenter('rewardCdNm', 60, '상벌구분'),  // L309 SQL 계산 컬럼(selectByHistory: f_cdnm('EmpRewardCode', emp11_reward_cd…)
  gb.text('rewardGroup', 200, '상벌단체'),  // L310
  gb.textArea('rewardNm', 350, '수상(징계)사유'),  // L311
  gb.textArea('rewardDesc', 350, '수상(징계)처분'),  // L312
  gb.text('note', 200, '비고'),  // L313
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve01}>조회</Button>
2. <Button type="download" onClick={downLoadButton01}>출력/다운로드</Button>
3. <Button type="search" onClick={retrieve02}>조회</Button>
4. <Button type="download" onClick={downLoadButton02}>출력/다운로드</Button>
5. <Button type="search" onClick={retrieve03}>조회</Button>
6. <Button type="download" onClick={downLoadButton03}>출력/다운로드</Button>

