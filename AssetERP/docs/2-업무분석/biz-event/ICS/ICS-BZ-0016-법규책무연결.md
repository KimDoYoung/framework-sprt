# ICS-BZ-0016 KFS가 법규와 책무이행 점검항목을 연결한다

> **한 줄 요약** — 법규를 어기지 않았는지 **책무이행 점검항목**(책무매뉴얼 `tdm43_manl`)에서 확인하도록, KFS 관리자가 #1012 법규관리(관리자)에서 법규를 고르고 [책무점검항목] 창의 **[점검항목연결]**로 점검항목을 골라 연결한다. 연결된 점검항목 수는 법규 목록의 개수 열로, 점검항목 쪽에서는 관련 법규로 보인다. 해제는 [연결제거]다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자 |
| 언제 | 법규·책무 점검 기준을 정비할 때 |
| 먼저 있어야 하는 것 | 법규(0011), 책무 점검항목 마스터(TDM) |
| 다음 이벤트 | 회사가 책무이행점검(TDM-BZ-0007)에서 연결 법규를 근거로 사용 |
| 실제 실행 | KFS(admin), 2026-11-13. 법규 `자산건전성 보고`(24762): 연결 5건 조회 → 후보 점검항목 400건 중 2건 연결(`tdm45` +2) → 같은 항목 재연결 0건 → 잘못된 법규 ID로 해제 0건 → 올바른 ID로 해제(−2). 사원 301의 연결·401의 해제는 403. kalpa 301의 후보·연결 조회는 0건(kalpa의 책무 매뉴얼은 템플릿 복사본이라 마스터 연결과 별개). 없는 점검항목·법규 ID로도 저장됨(⚠, 지움) |
| 메뉴 | #1012 기초자료 > 00. 내부통제 > 법규관리(관리자) → [책무점검항목]. kalpa 메뉴 없음(API). 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS 관리자 | #1012 | 법규 줄의 책무점검 셀 | 연결된 점검항목 창 |
| 2 | 〃 | 연결 창 | [점검항목연결] → 선택 창에서 검색 → [확인] | 목록에 추가 |
| 3 | 〃 | 연결 창 | 줄 선택 → [연결제거] → 확인 | 연결 해제 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `tdm45_manl_relate_ics` | 점검항목 ↔ 법규 | +2 → 지움(총 91 그대로) |

## 업무 규칙 · 주의

- 연결·해제 **KFS 관리자만**(`POST·DELETE /tdm/manl-relate-ics` — 사원 403). 해제는 `icsId`가 맞아야 지워진다(틀리면 0건).
- 후보는 법규에 아직 연결되지 않은 점검항목(`candidates`)이다.
- 없는 점검항목·법규 ID는 검사하지 않는다 → [의심 #150](../../보안_및_버그_의심.md).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICS-BZ-0016
needs: [ICS-BZ-0011]
steps:
  - no: 1
    actor: { company: admin, user: admin, password: "1111" }
    api: POST /api/v1/tdm/manl-relate-ics
    body: { icsId: 24762, manlIds: [<후보 2건>] }
    expect: { track: { tdm45_manl_relate_ics: +2 } }
  - no: 2
    actor: { company: admin, user: admin, password: "1111" }
    api: DELETE /api/v1/tdm/manl-relate-ics?icsId=24762
    body: [<연결 행 ID 2건>]
    expect: { track: { tdm45_manl_relate_ics: -2 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ics01_Lookup_RelateTdm`·`Ics01_Lookup_SelectTdm` — 서버 `Tdm45_ManlRelateIcs`·`Tdm43_Manl`.
- TOBE: `TdmManlRelateIcsController`(`/tdm/manl-relate-ics`).
</details>
