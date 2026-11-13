# FND-BZ-0001 수탁사·사무수탁사·수탁은행·발행기관을 등록한다

> **한 줄 요약** — 펀드를 만들기 전에 펀드가 맡겨질 **수탁사·사무수탁사·수탁은행**을 회사 코드표에 갖춘다. KFS가 공통 마스터(회사 0)를 두고, 회사는 ICAM에서 **가져오거나**(관리자 화면 [ICAM가져오기]) 직접 한 줄씩 등록한다. 발행기관은 KFS 공통 마스터를 모든 회사가 그대로 읽는다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 고객사 관리자(회사별 코드), KFS 관리자(마스터) |
| 언제 | 도입 때, 새 기관이 생길 때 |
| 먼저 있어야 하는 것 | 회사(SYS-BZ-0001), 메뉴(kalpa는 #1100만 있음 — API로 실행) |
| 다음 이벤트 | FND-BZ-0002(신규기획펀드), 0004(펀드 등록) |
| 실제 실행 | kalpa, 2026-11-13, API. 마스터(회사 0)는 사무수탁사 11·수탁은행 1·수탁사 0. 회사 관리자가 `PUT …/company`로 사무수탁사 `00950`·수탁은행 `01640`·수탁사 `T001`을 직접 등록(+1씩). [ICAM가져오기]는 거절(아래). 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1051 수탁사 · #1052 사무수탁사 · #1100 수탁은행 · #1053 발행기관(조회·삭제·업로드). 관리자용: 수탁사·사무수탁사·수탁은행 정보 관리(마스터) |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS 관리자 | 기관정보 관리(마스터) | 행 추가 → [저장] (`PUT /fnd/{consignments\|office-works\|trust-banks}`) | 공통 코드표 |
| 2 | 고객사 관리자 | #1052·#1100·#1051 | [ICAM가져오기](`POST …/company/import`) 또는 행 추가 → [저장](`PUT …/company`) | 회사 코드표 |
| 3 | 고객사 관리자 | #1053 | 조회(공통 1,000건) · 엑셀 업로드 | 발행기관 목록 |

## DB에 남는 것

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `fnd06_office_work` | 사무수탁사 | +1 (`00950`) |
| `fnd09_trust_bank` | 수탁은행 | +1 (`01640`) |
| `fnd03_consignment` | 수탁사 | +1 (`T001`) |
| `fnd07_issuing_entity` | 발행기관(전부 공통, 회사 79) | 변화 없음 |

## 업무 규칙 · 주의

- **ICAM가져오기는 아직 안 된다**: 서버가 "ICAM 연동이 아직 없다"며 거절한다. TOBE에는 `FndIcamImporter` 인터페이스와 `DisabledFndIcamImporter`(항상 거절)뿐이고, ICAM 시뮬레이터(`data/icam-simulator`)에도 사무수탁사·수탁은행·수탁사용 CSV가 없다(→ [의심 #157](../../보안_및_버그_의심.md)). 이 사건은 직접 등록으로 갖춘다.
- 발행기관 저장(`PUT /fnd/issuing-entities`)은 원본 서버에 update 메서드가 없어 원본에서도 저장이 안 된다 — TOBE도 거절한다. 등록은 엑셀 업로드뿐.
- 마스터 쓰기는 KFS 관리자만. 일반 사원이 회사 코드표를 쓸 수 있다 → [의심 #156](../../보안_및_버그_의심.md).
- `⚠없음` API(`issuing-entities` 조회·템플릿류)는 로그인만 하면 부른다. 읽기 전용·공통 마스터라 영향은 낮다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: FND-BZ-0001
needs: [SYS-BZ-0001]
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: [PUT /api/v1/fnd/office-works/company, PUT /api/v1/fnd/trust-banks/company, PUT /api/v1/fnd/consignments/company]
    body: [[{ officeWorkCode: "00950", officeWorkName: "우리펀드서비스", kofiaCode: "A02016", officeWorkUseYn: "true" }],
           [{ trustBankCode: "01640", trustBankName: "신한은행", useYn: "true" }],
           [{ consignmentCode: "T001", consignmentName: "칼파수탁", useYn: "true" }]]
    expect: { track: { fnd06_office_work: +1, fnd09_trust_bank: +1, fnd03_consignment: +1 } }
```
</details>

<details>
<summary>근거</summary>

- TOBE: `FndOfficeWorkController`·`FndTrustBankController`·`FndConsignmentController`(관리자 `/…`·회사 `/…/company`), `FndIssuingEntityController`, `FndIcamImporter`(구현은 `DisabledFndIcamImporter`뿐).
- AS-IS: `Fnd06_Tab_OfficeWork`(#1052)·`Fnd03_Tab_Consignment`(#1051)·`Fnd09_Tab_TrustBank`(#1100)·`Fnd07_Tab_IssuingEntity`(#1053), 서버 `selectIcam*`.
</details>
