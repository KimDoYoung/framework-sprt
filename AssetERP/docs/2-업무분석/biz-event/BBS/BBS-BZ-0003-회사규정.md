# BBS-BZ-0003 회사규정을 등록하고 직원이 본다

> **한 줄 요약** — 관리자가 #1477(준법감시)·#1345(커뮤니티) 회사규정(관리자)에서 규정(`bbs15_company_rule`: 구분 `CompanyRuleType`·규정코드·제목·본문·개정일·개정회차·공개·폐지일)을 [등록]·[저장]하거나 엑셀로 올린다. KFS는 #1483에서 회사를 골라 관리하고 [내보내기]로 고객사에 복사해 준다. 직원은 #1476·#1344 회사규정에서 **공개이고 최신 회차인 것**만 본다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 준법감시·경영관리(관리자 메뉴) → 직원 |
| 언제 | 규정 제정·개정 때 |
| 먼저 있어야 하는 것 | 코드 `CompanyRuleType`(020 취업규칙 … 090 업무매뉴얼) |
| 다음 이벤트 | TDM 책무(직무에 내규 연결) |
| 실제 실행 | 2026-11-14, kalpa API(#1476·#1477은 kalpa 메뉴 있음). 301 `POST /bbs/company-rules` `여비규정`(취업규칙, 개정 0) → `bbs15` +1. 401 #1476 1행 — AS-IS `bbs15_company_rule.selectBySearchText` 1 = 1. 다른 회사 `companyId`로 조회 → 0행(막힘). **401(관리자 메뉴 없음)이 규정 등록 → 200**, ID도 요청 값 1 그대로 → 지움(⚠#258) |
| 메뉴 | #1477·#1345·#1476·#1344, #1483(ADMIN). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 관리자 | #1477 | [등록] (`GET /bbs/company-rules/next-id`) → 창 → 구분·코드·제목·본문·개정일·공개 → [저장] (`POST /bbs/company-rules`) | 목록(`GET /bbs/company-rules`) |
| 2 | 〃 | 〃 | 행 고침 → [저장] (`PUT /bbs/company-rules/{id}`) · [엑셀업로드] (`POST /bbs/company-rules/excel`) | |
| 3 | 직원 | #1476 | 구분·검색 → [조회] (`GET /bbs/company-rules/public`) | 공개·최신 회차 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `bbs15_company_rule` | 회사규정 | +1 |

## 업무 규칙 · 주의

- 관리자 목록의 회사 선택은 KFS관리자만(`companyOf`) — 고객사는 자기 회사.
- **사원도 등록·수정·삭제 API를 부를 수 있다**(메뉴로만 막힘) → [#258](../../보안_및_버그_의심.md).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: BBS-BZ-0003
company: kalpa
steps:
  - {no: 1, user: 301, api: POST /api/v1/bbs/company-rules, body: {companyRuleId: "{next-id}", ruleType: "020", companyRuleCode: "010101", title: 여비규정, seq: 1, revisionDate: 2026-11-14, revisionNo: 0, publicYn: true}, expect: "bbs15 +1"}
  - {no: 2, user: 401, api: GET /api/v1/bbs/company-rules/public, expect: rows 1}
  - {no: 3, user: 401, api: GET /api/v1/bbs/company-rules?companyId=28000, expect: rows 0}
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Bbs15_Tab_CompanyRuleManager`·`Bbs15_Edit_CompanyRuleManager`, `Bbs15_Tab_CompanyRule`(`selectBySearchText`).
- TOBE: `BbsCompanyRuleController` L36-60, `BbsCompanyRuleService.searchPublic` L65-69·`search` L72-75.
</details>
