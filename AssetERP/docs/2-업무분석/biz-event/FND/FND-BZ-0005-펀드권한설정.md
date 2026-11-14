# FND-BZ-0005 펀드 권한을 조직에 설정한다

> **한 줄 요약** — 펀드마다 **어느 조직이 그 펀드를 볼 수 있는지**를 #1050에서 정한다(`fnd08_org_auth`). 펀드 × 조직 행의 `authYn`이 `true`면 그 조직 소속 사원의 펀드 선택·조회 목록(`GET /fnd/fund-codes/org-auth`)에 펀드가 나온다. 임시(기획) 펀드는 #1047에서 같은 방식으로 정한다. 여러 펀드 × 여러 조직을 한 번에 켜거나(`confirm=true`) 끈다(`false`).

| 항목 | 내용 |
|:---|:---|
| 누가 | 펀드 담당(kalpa는 관리자가 대행) |
| 언제 | 펀드 설정 때, 담당 조직이 바뀔 때 |
| 먼저 있어야 하는 것 | FND-BZ-0004(펀드), ORG(조직) |
| 다음 이벤트 | 0006~0011(권한이 있어야 펀드가 선택·조회됨) |
| 실제 실행 | kalpa, 2026-11-13, API. 펀드 `KF001`에 운용본부 권한을 켬(+1 행) → 운용본부 사원 402는 `org-auth` 목록에 KF001이 나오고 경영지원본부 사원 401은 안 나옴. 권한을 끄면(`confirm=false`) 402 목록에서 사라짐 → 다시 켜 둠. 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1050 펀드 권한설정, #1047 신규기획펀드 권한설정. kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 펀드 담당 | #1050 | 왼쪽 펀드 목록에서 펀드 체크 → 조직 트리에서 조직 체크 → [권한부여] / [권한삭제] (`PUT /fnd/org-auths` `{fundCodeIds, orgCodeIds, confirm}`) | 펀드 × 조직 권한 |
| 2 | 해당 조직 사원 | 펀드 조회·선택 | 목록 확인 (`GET /fnd/fund-codes/org-auth?closeYn=false&classFundExceptYn=false`) | 권한 있는 펀드만 보임 |

## DB에 남는 것

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `fnd08_org_auth` | 펀드 × 조직 권한(`auth_yn`) | 운용본부 `true` · 경영지원본부 `false` (권한 행은 한 번 만들어지면 지워지지 않고 `false`로 바뀐다) |

## 업무 규칙 · 주의

- 목록 조회(`org-auth`)는 `closeYn`을 안 주면 해지 펀드 기준이라 **빈 목록**이 나온다. 정상 펀드는 `closeYn=false`로 부른다.
- 존재하지 않는 조직·다른 회사 조직 ID는 "조직을 찾을 수 없습니다"(`DATA_NOT_FOUND`)로 막힌다(회사 경계는 지켜짐).
- 일반 사원 401이 자기 조직에 펀드 권한을 부여하고 다른 조직의 권한을 지울 수 있다 → [의심 #164](../../보안_및_버그_의심.md).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: FND-BZ-0005
needs: [FND-BZ-0004]
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: PUT /api/v1/fnd/org-auths
    body: { fundCodeIds: ["{KF001}"], orgCodeIds: ["{운용본부}"], confirm: "true" }
    expect: { data: 1, track: { fnd08_org_auth: +1 } }
  - no: 2
    actor: { user: "402" }
    api: GET /api/v1/fnd/fund-codes/org-auth?closeYn=false&classFundExceptYn=false
    expect: { rows: 1 }
  - no: 3
    actor: { user: "401" }
    api: GET /api/v1/fnd/fund-codes/org-auth?closeYn=false&classFundExceptYn=false
    expect: { rows: 0 }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Fnd08_Tab_OrgAuth`(#1050)·`Fnd08_Lookup_OrgAuth`, 서버 `Fnd08_OrgAuth.updateAuthYn` L37.
- TOBE: `FndOrgAuthController` `PUT /fnd/org-auths`·`FndOrgAuthService.updateAuthYn` L22-54, `FndFundCodeService.searchByOrgAuth`.
</details>
