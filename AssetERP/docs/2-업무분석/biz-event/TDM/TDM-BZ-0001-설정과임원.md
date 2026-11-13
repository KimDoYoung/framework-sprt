# TDM-BZ-0001 책무 사용을 설정하고 책무구조도 대상 임원을 등록한다

> **한 줄 요약** — 회사가 책무구조도를 쓰려면 KFS 관리자가 회사 정보의 **책무 시작일**(`tdmStartDate`)을 정하고, 회사가 #(책무 기본설정)에서 **의견 최소 글자수·일괄점검/일괄승인 사용·증빙파일 필수** 같은 운영 규칙을 정한다. 책무 대상 임원은 EMP 발령에서 **책무대상**으로 체크한 사원이며, #1411 임원 등록의 [인사정보 가져오기]가 그들을 **신규/변경/퇴직**으로 보여 주고 [적용]하면 `tdm01_hr`에 들어간다(변경 이력 `tdm02` 자동).

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자(책무 시작일), 책무 담당(kalpa 과장 301) |
| 언제 | 도입 때, 임원이 바뀔 때 |
| 먼저 있어야 하는 것 | EMP 직원·발령(책무대상 체크), 회사 정보 |
| 다음 이벤트 | TDM-BZ-0002(책무·직책), 0004(임원별 직책배정) |
| 실제 실행 | kalpa, 2026-11-13. ① KFS 관리자 `biz-patch`로 `tdmStartDate=2026-07-01` ② 301이 책무 기본설정 저장(시작일 2026-07-01, 의견 최소 10자, 일괄점검·일괄승인 사용, 증빙파일 필수 아님) → `tdm91` +1 ③ 김사장·박부장·정부장의 현재 발령에 **책무대상(+조직장·등기임원) 체크**(`PUT /emp/trans`, 특정직 120은 그대로 유지됨) ④ `GET /tdm/hrs/changes` → **신규 3명**(김사장 대표이사, 박부장·정부장 본부장) → `POST /tdm/hrs/changes/apply` → `tdm01_hr` +3, 변경 이력 `tdm02` +3(`NEW`, 직위·직책·조직·입사일 기록) |
| 메뉴 | #1411 책무 > 01. 기본정보 > 임원 등록. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 0 | KFS 관리자 | #1075 | 회사 승인 탭 → 책무 시작일 | 회사가 책무를 쓸 수 있음 |
| 1 | 책무 담당 | 책무 기본설정 | 적용 시작일·최소 글자수·일괄점검/승인·증빙 → [저장] | 설정 줄 |
| 2 | 인사 담당 | #1029 발령 | 임원 발령에 책무대상 체크 | 책무 대상 지정 |
| 3 | 책무 담당 | #1411 | [인사정보 가져오기] → 변경 목록 → [적용] | 임원 목록(직위·직책·조직·입사/퇴직일) |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `sys01_company` | 책무 시작일 | 2026-07-01 |
| `tdm91_company_setup` | 책무 기본설정 | +1 |
| `emp03_trans` | 책무대상 체크(임원 3명) | 갱신 |
| `tdm01_hr` · `tdm02_hr_record` | 책무 임원 · 변경 이력 | +3 · +3 |

## 업무 규칙 · 주의

- 후보는 "책무대상 체크 + 겸직이 아닌" 현재 재직자이며, 이미 등록된 사람은 퇴직일이 바뀐 경우만 변경으로 나온다.
- `PUT /emp/trans`는 발령 한 줄을 통째로 저장한다(필드를 빼면 비워진다) — 책무대상만 바꾸려면 기존 값을 그대로 같이 보낸다.
- 임원 등록·적용 API는 메뉴 권한을 보지 않는다 → [의심 #133](../../보안_및_버그_의심.md).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: TDM-BZ-0001
needs: [EMP-BZ-0001, EMP-BZ-0007]
steps:
  - no: 1
    actor: { company: admin, user: admin, password: "1111" }
    api: PUT /api/v1/sys/companies/{kalpa}/approval
    body: { tdmStartDate: "2026-07-01", … }
  - no: 2
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [PUT /api/v1/tdm/company-setups, PUT /api/v1/emp/trans, GET /api/v1/tdm/hrs/changes, POST /api/v1/tdm/hrs/changes/apply]
    body: [[{ startDate: "2026-07-01", cmntMinLimit: 10, batchCheckUseYn: "true", batchApprUseYn: "true", evidFileCheckYn: "false" }],
           [{ transId, personId, …, tdmTargetYn: "true" } ×3], null, [{ personId, changeTypeCode: "1" } ×3]]
    expect: { track: { tdm91_company_setup: +1, tdm01_hr: +3, tdm02_hr_record: +3 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Tdm01_Tab_Hr`(#1411 — `Tdm01_Hr.selectPersonModifyed`·`updateHrInfo`, `f_get_tdmpersoninfo`), `Tdm01_Lookup_HrChangeInfo`, `Tdm03_Lookup_AddTitle`(겸직), `Tdm91` 기본설정.
- TOBE: `TdmHrController`(`/api/v1/tdm/hrs`·`/changes`·`/changes/apply`)·`TdmHrService`, `TdmHrMapper.xml#selectPersonModifyed`(`emp00_tdm_target_yn`), `TdmCompanySetupController`.
</details>
