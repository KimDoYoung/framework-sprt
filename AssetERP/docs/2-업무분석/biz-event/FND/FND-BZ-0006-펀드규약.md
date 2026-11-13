# FND-BZ-0006 펀드규약을 등록하고 개정한다

> **한 줄 요약** — 펀드의 규약(신탁계약서 등)을 #1503 펀드규약 등록에서 만든다. 규약(`fnd25_terms`)은 **예탁원 펀드코드 한 개**에 묶이고(필수, 한 펀드에 규약 하나), 규약 안에는 **개정 회차별 본문**(`fnd26_terms_detail`)이 쌓인다. 개정은 같은 규약에 회차를 늘려 가며 추가한다. 사원은 #1504 펀드규약에서 읽기만 한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 펀드·준법 담당(등록), 전 직원(조회) |
| 언제 | 펀드 설정 때, 규약을 개정할 때 |
| 먼저 있어야 하는 것 | FND-BZ-0004(펀드 — 예탁원 코드로 선택) |
| 다음 이벤트 | — |
| 실제 실행 | kalpa, 2026-11-13, API. 규약 `신탁계약서`(구분 10)를 펀드 `KF001`에 만들고(개정 1회) → 개정 2회 추가. 같은 회차 재저장 → "사용중인 개정회차입니다." · 같은 펀드에 다른 규약 → "사용중인 예탁원코드입니다." · 펀드 없이 → "예탁원펀드코드는 필수선택사항입니다." 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1503 펀드규약 등록(관리), #1504 펀드규약(조회). kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 담당자 | #1503 | [등록] → 규약구분(`FundTermsType`: 10 신탁계약서 · 20 …)·규약명·순서·예탁원펀드·제개정일·회차·본문 → [저장] (`PUT /fnd/terms/revisions` mode insert) | 규약 + 개정 1 |
| 2 | 담당자 | #1503 | 규약 선택 → [개정 추가] (mode new, 같은 termsId, 회차↑) | 개정 2 |
| 3 | 담당자 | #1503 | [예탁원코드 변경] (`PUT /fnd/terms/{id}`) · 개정 삭제(`DELETE …/revisions`) · 규약 삭제(`DELETE /fnd/terms/{id}`) | |
| 4 | 직원 | #1504 | 구분·검색어로 조회 (`GET /fnd/terms/list`) | 규약 목록·본문 |

## DB에 남는 것

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `fnd25_terms` | 규약(구분·순서·펀드) | +1 |
| `fnd26_terms_detail` | 개정(회차·본문·제개정일) | +2 |

## 업무 규칙 · 주의

- 필수: 예탁원 펀드코드(펀드). 새 규약(insert)일 때만 "이미 다른 규약이 쓰는 펀드" 검사. 개정 회차는 규약 안에서 중복 불가.
- 저장·삭제는 로그인 회사 규약만(다른 회사 규약은 `ACCESS_DENIED`).
- 메뉴 권한이 없는 사원 401이 규약 개정을 추가할 수 있다 → [의심 #165](../../보안_및_버그_의심.md).
- 규약 조회 `GET /fnd/terms/list`는 **펀드 권한(FND-BZ-0005)을 보지 않는다**. 펀드 권한이 없는 경영지원본부 사원 401도 KF001 규약을 읽는다 → [의심 #166](../../보안_및_버그_의심.md).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: FND-BZ-0006
needs: [FND-BZ-0004]
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: PUT /api/v1/fnd/terms/revisions
    body: { mode: insert, termsType: "10", termsName: "칼파 주식형 1호 투자신탁 규약", seq: 1, fundId: "{KF001}", revisionDate: "2026-11-13", revisionNo: 1, content: "…", useYn: "true" }
    expect: { track: { fnd25_terms: +1, fnd26_terms_detail: +1 } }
  - no: 2
    api: PUT /api/v1/fnd/terms/revisions   # mode new, termsId, revisionNo 2
    expect: { track: { fnd26_terms_detail: +1 } }
  - no: 3
    api: PUT /api/v1/fnd/terms/revisions   # revisionNo 2 again
    expect: { message: "사용중인 개정회차입니다." }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Fnd25_Tab_FundTermsManager`(#1503)·`Fnd25_Lookup_FundTermsManager`, 서버 `Fnd26_TermsDetail.update`(mode insert/new/copy/edit)·`Fnd25_Terms.selectByFundId`.
- TOBE: `FndTermsController`·`FndTermsDetailService.saveRevision` L113-147.
</details>
