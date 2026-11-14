# ICS-BZ-0006 임직원이 새 법규 등록을 신청하고 KFS가 처리한다

> **한 줄 요약** — 법규 마스터(회사 0)는 KFS만 고칠 수 있으므로, 회사가 우리 업무에 필요한 법규가 목록에 없으면 #1338 법규등록신청에서 **법규명·내용·보고주기·제출처·관련법령**을 적어 신청한다. KFS 관리자는 신청 관리(`Ics17_Tab_UserRequestAdmin`)에서 신청을 보고 **진행상태(신규·이행불가·진행중·완료)**와 처리결과·메모를 적는다. 신청자는 자기 신청의 진행상태를 본다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 임직원 301(신청), KFS 관리자(처리) |
| 언제 | 필요한 법규가 목록에 없을 때 |
| 먼저 있어야 하는 것 | SYS-BZ-0001(회사) |
| 다음 이벤트 | KFS의 법규 마스터 등록(`PUT /ics/laws`, KFS 전용) → ICS-BZ-0002에서 회사가 관리 |
| 실제 실행 | kalpa, 2026-11-13. 301이 신청(`전자금융감독규정 개정`, 연1회, 금융감독원) 등록 → KFS 관리자 목록에 보임(`GET /ics/user-requests/admin`) → KFS가 `진행중(20)`·처리결과 "법규 마스터에 등록 완료"로 저장. ⚠ **401(작성자도 아닌 사원)이 301의 신청 제목을 바꿨다**(KFS 처리 뒤에도, 시험 뒤 복원) |
| 메뉴 | #1338 준법감시 > 01. 법규관리 > 법규등록신청, (KFS) 법규등록신청 관리. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 임직원 | #1338 | [등록] → 법규명·내용·주기·제출처·관련법령 → [저장] | 신청 줄(진행상태 신규) |
| 2 | KFS 관리자 | 신청 관리 | 기간·회사 → [조회] → 줄 → 진행상태·처리결과·메모 → [저장] | 진행상태 갱신 |
| 3 | 임직원 | #1338 | [조회] | 내 신청의 진행상태·처리결과 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ics17_user_request` | 법규등록 신청(진행상태·처리결과) | +1 |

## 업무 규칙 · 주의

- 진행상태 코드는 `AfterStateCode`(00 신규·10 이행불가·20 진행중·90 완료) — 개선사항 처리와 같은 코드 종류를 쓴다.
- 수정 API `PUT /ics/user-requests/my/{id}`는 본인 여부·KFS 처리 여부를 보지 않는다 → [의심 #125](../../보안_및_버그_의심.md). 삭제(`DELETE /my/{id}`)는 시험하지 않음.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICS-BZ-0006
needs: [SYS-BZ-0001]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: POST /api/v1/ics/user-requests/my
    body: { regDate: "2026-11-13", confirmYn: "false", lawTitle: 전자금융감독규정 개정, lawContent: …, reportCycle: 연1회, submitTo: 금융감독원, relatedLaw: 전자금융감독규정 제15조 }
    expect: { track: { ics17_user_request: +1 } }
  - no: 2
    actor: { company: admin, user: admin, password: "1111" }
    api: PUT /api/v1/ics/user-requests/{id}
    body: { regDate: "2026-11-13", confirmYn: "true", stateCode: "20", closeDate: "2026-11-13", result: 법규 마스터에 등록 완료, note: KFS 검토 }
    expect: { db: { ics17_state_cd: "20" } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ics17_Tab_UserRequest`(#1338)·`Ics17_Tab_UserRequestAdmin`(KFS) — `ics17_user_request`.
- TOBE: `IcsUserRequestController`(`/api/v1/ics/user-requests/my`·`/admin`·`/{id}`·`/law-content`)·`IcsUserRequestService`(`update` L101-110 — 수정은 같은 회사이거나 KFS면 허용, 처리 필드는 KFS만).
</details>
