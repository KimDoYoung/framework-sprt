# ICS-BZ-0007 법규 개정내역을 알리고 본다

> **한 줄 요약** — 법규가 개정되면(입법예고 포함) KFS 관리자가 #1257 법규개정내역 등록에서 **등록일·의견제출일·시행일·소관부처·법규명·조문**을 적고 영향을 받는 **연결 법규**(법규 마스터의 항목)를 붙인다. 회사 사용자는 #1256 법규개정내역에서 기간·소관부처·검색어로 조회하고, 법규관리(#1013) 같은 곳에서 법규를 고르면 그 법규에 걸린 개정내역을 본다. 개정 내용(비고)은 KFS가 [내용] 창에서 고친다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자(등록·연결·내용·삭제), 회사 임직원(조회만) |
| 언제 | 법규가 개정·입법예고될 때 |
| 먼저 있어야 하는 것 | 법규 마스터(회사 0 `ics01_class_tree`), 공통코드 `FinanceAgency`(소관부처) |
| 다음 이벤트 | 회사가 개정에 맞춰 법규 관리·체크리스트를 손봄(ICS-BZ-0002·0003) |
| 실제 실행 | kalpa·KFS, 2026-11-13. KFS가 개정내역 등록(전자금융감독규정 개정(안)·금융투자협회) → 연결 법규 1건 추가 → 내용(비고) 저장 → kalpa 301이 기간 조회·법규별 조회·연결 법규 조회로 봄. 사원(301)이 등록·수정·연결·삭제·내용 저장을 시도하면 모두 403. **시험 행은 지움**(회사 0 공용 자료라 모든 회사 목록에 보이기 때문) |
| 메뉴 | #1256 준법감시 > 00. 법규정보 > 법규개정내역(조회), #1257 기초자료 > 00. 내부통제 > 법규개정내역 등록(KFS). kalpa에는 #1256이 없어 API로 실행. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS 관리자 | #1257 | [등록] → 등록일·시행일·소관부처·법규명·조문 → [저장] | 목록에 새 줄(연결법규 0·첨부 0) |
| 2 | 〃 | #1257 | 줄 선택 → 연결 법규 [행 추가] → 법규 고르기 | 연결법규 1 |
| 3 | 〃 | #1257 | [내용] 창에서 개정 내용 → [저장] | 비고(내용) 저장 |
| 4 | 회사 임직원 | #1256 | 기간·등록일/시행일·소관부처·검색어 → [조회] | 개정내역 줄(연결법규·첨부 수) |
| 5 | 〃 | #1256 | 줄 선택 | 아래에 개정 내용·연결 법규 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ics20_revision_history` | 개정내역(제목·날짜·소관부처·조문·비고) | +1 → 지움 |
| `ics19_revision_relate_ics` | 개정내역 ↔ 법규 연결 | +1 → 지움 |
| `sys10_file` / `sys11_relate_file` | 개정 첨부파일(#1257 [파일등록]) | 이번에는 안 함 |

## 업무 규칙 · 주의

- 쓰기(등록·연결·내용·삭제)는 **KFS 관리자만**이다. 사원 301은 전부 403이다(정상). 조회 API는 로그인한 사원 누구나이며 회사 구분이 없는 공용 자료다.
- **내용**(`updateContent`)은 `ics20_note`(비고) 열에 저장된다.
- AS-IS 대조: `selectByDate` 8 = 8(kalpa/301 기간 2020~2026, 등록일 기준), 그리드 열 모두 포함.
- 서버가 필수값(법규명·등록일·소관부처)을 검사하지 않아 빈 행이 저장된다. 같은 법규를 두 번 연결할 수 있다. 개정내역을 지우면 **연결 법규 행이 남는다**(원본도 개정내역만 지움) → [의심 #138](../../보안_및_버그_의심.md).
- 첨부파일(`fileCount`)·[파일등록]은 이번에 시험하지 않았다(`SysFileController` 공통 — 내려받기 권한은 [의심 #88](../../보안_및_버그_의심.md)).
- 화면 쪽 `Ics20_Tab_RevisionHistory`의 [삭제]는 원본에서도 도달 불가(호출처 없음)다. TOBE 쓰기 짝: AS-IS 회사 화면은 U·D가 있으나 TOBE는 U만(`trace-crud`의 "D 없음"은 이 때문).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICS-BZ-0007
needs: []
steps:
  - no: 1
    actor: { company: admin, user: admin, password: "1111" }
    api: PUT /api/v1/ics/revision-history-admin
    body: { regDate: "2026-11-13", submissionDate: "2026-12-01", effectDate: "2027-01-01", financeAgencyCode: "03", title: "[업무분석 시험] 전자금융감독규정 개정(안)", relatedLaw: 제15조, note: ICS-BZ-0007 시험 }
    expect: { track: { ics20_revision_history: +1 } }
  - no: 2
    actor: { company: admin, user: admin, password: "1111" }
    api: POST /api/v1/ics/revision-history-admin/{id}/laws
    body: [24691]
    expect: { track: { ics19_revision_relate_ics: +1 } }
  - no: 3
    actor: { company: admin, user: admin, password: "1111" }
    api: PUT /api/v1/ics/revision-histories/{id}/content
    body: { content: "<p>제15조 개정: 접근통제 강화</p>" }
  - no: 4
    actor: { company: kalpa, user: "301", password: "1111" }
    api: GET /api/v1/ics/revision-histories/period?startDate=2026-11-01&closeDate=2026-11-30&dateType=reg
    expect: { rows: 1 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ics20_Tab_RevisionHistory`(#1256)·`Ics20_Tab_RevisionHistoryAdmin`(#1257)·`Ics20_Edit_RevisionHistory`·`Ics20_Lookup_Content` — `ics20_revision_history`·`ics19_revision_relate_ics`·`sys10_file`.
- TOBE: `IcsRevisionHistoryController`(`/revision-histories`·`/period`·`/{id}/laws`·`/{id}/content`)·`IcsRevisionHistoryAdminController`(`/revision-history-admin`, 쓰기 KFS 전용).
</details>
