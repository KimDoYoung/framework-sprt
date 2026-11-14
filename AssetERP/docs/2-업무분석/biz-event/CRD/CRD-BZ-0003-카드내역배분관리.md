# CRD-BZ-0003 카드 사용내역을 관리하고(용도·계정과목) 실사용자에게 배분한다

> **한 줄 요약** — 확정된 카드 내역(CRD-BZ-0002)에 **제공 용도·내용·계정과목·메모**를 붙이고(#1141), **공통카드**를 쓴 내역은 **실제 쓴 사원**에게 배분한다(#1406). 계정과목이 다 붙으면 달 단위로 **마감**하고(이후 결재·회계처리 — 0004), 사원에게 **알림**을 보낼 수 있다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리팀(배분·마감) / 카드 사용 사원(자기 내역 입력) |
| 언제 | 매월, 카드 내역 확정 뒤 |
| 먼저 있어야 하는 것 | CRD-BZ-0002(확정된 `biz01_promo`), 제공 용도·내용 설정(`provide-setups` — kalpa는 판매(일반) 10, 식사 1001 등 5종 있음), 계정과목(접대비) |
| 다음 이벤트 | CRD-BZ-0004 결재·회계처리 |
| 실제 실행 | kalpa, 2026-11-13, API. 카드 사용자 401을 공통카드로 바꿈 → #1406 목록(2건, 실사용자 이미 채워짐 ⚠#185) → 실사용자 비움/배분(402·관리자·사원 호출, 없는 사원 999 저장 ⚠#186) → #1141 목록·용도 조회·수정(용도 10·내용 식사 1001·계정 접대비·메모) → 계정 없이 마감 거절 → 마감 → 재마감 거절 → 마감 뒤 내역 삭제 거절(그러나 #1141 수정은 가능 ⚠#187) → 알림 → 마감 취소. 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1141 법인카드 내역관리, #1406 법인카드 실사용자 배분 (모두 자금관리 > 30. 법인카드관리). kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 경영관리 | #1406 | 기준년월 → [조회](미배분만 체크 가능) → 행 선택 → [선택 일괄반영] → 사원 선택 (`PUT /biz/card-user-allocations`, 사원을 비우면 "공통"으로) | `biz01_promo.biz01_real_person_id` |
| 2 | 경영관리·사원 | #1141 | 기준년월·사용자·용도 필터 → [조회] (`GET /biz/card-managements`) → 행에서 용도·내용·계정과목·메모 수정 (`PUT /biz/card-managements/{promoId}`) | 용도·내용·계정·메모 |
| 3 | 경영관리 | #1141 | [마감] (`POST …/close {procType:"P"}`) — 계정과목 빠진 행·회계마감 달·이미 마감이면 거절. [마감취소] `C` | `biz01_close_yn` true/false |
| 4 | 경영관리 | #1141 | [메시지 보내기] (`POST …/messages`) | 사원 알림 |
| 5 | 경영관리 | #1141 | 전월 대비(`GET …/compare`)·RD 다운로드 | (조회) |

## DB에 남는 것

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `biz01_promo` | 용도(`provide_pur_cd`)·내용(`provide_content_cd`)·계정과목·메모·실사용자·마감 | 내역 2건 수정, 마감했다가 취소(`false`) |

## 업무 규칙 · 주의

- 배분 화면(#1406)은 **공통카드(`publicYn`) 내역만** 보인다. 그런데 확정이 실사용자를 이미 채워 두어 "미배분만"이 비어 있다 → [의심 #185](../../보안_및_버그_의심.md).
- 목록의 사용자 이름: 회사 설정 `카드 실사용자 사용(sys01_card_real_user_yn)`이 꺼져 있으면(kalpa 기본) 공통카드는 늘 "공통", 켜져 있으면 `공통(실사용자)`로 나온다(#1406은 설정과 무관하게 실사용자 이름). `GET …/real-user` = 로그인 사원이 실사용자인가.
- 마감(`P`)은 계정과목이 비어 있는 행이 있거나(`계정과목이 없는 내역이 존재합니다`), 회계마감된 달이거나, 전표가 이미 있으면 거절된다. 마감 뒤 카드 내역(#1039) 삭제·수정은 "마감내역이 존재합니다…"로 막힌다. **그러나 #1141 수정과 #1406 배분은 막지 않는다** → [의심 #186·#187](../../보안_및_버그_의심.md).
- 배분 PUT은 회사·사원 검사가 없다(`⚠없음`, 원본 `updateRealPersonId`도 회사 조건 없음).
- `yunhee trace-crud -s 1141`: `biz05_relate_appr` ASIS CRUD ↔ TOBE CRD(⚠U 없음 — 결재 연결 갱신은 0004에서 확인). 나머지 테이블은 같음.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: CRD-BZ-0003
needs: [CRD-BZ-0002]
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: PUT /api/v1/biz/card-managements/{promoId}
    body: { providePurCode: "10", provideContentCode: "1001", accountCodeId: "{접대비}", note: "접대", taxType: "1" }
  - no: 2
    api: POST /api/v1/biz/card-managements/close
    body: { dataYm: "2026.11", procType: "P" }
    expect: { biz01_close_yn: true }
  - no: 3
    api: POST /api/v1/biz/card-managements/close
    body: { dataYm: "2026.11", procType: "C" }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Biz01_Tab_CardManagement`(#1141)·`Biz01_Tab_CardUserAllocation`(#1406), 서버 `Biz01_Promo`(`selectCardCommonUser`·`updateRealPersonId`·`cardClose`).
- TOBE: `BizCardManagementController`·`BizCardUserAllocationController`, 매퍼 `BizCardUserAllocationMapper.xml`·`BizPromoMapper.xml`.
</details>
