# ACT-BZ-0001 계정과목을 관리한다

> **한 줄 요약** — 회계 담당이 회사가 쓰는 **계정과목**(코드·이름·상위·속성(자산·부채·자본·수익·비용)·차대구분·전표입력 가능 여부·재무제표 표시명)을 보고, 필요하면 새 계정을 만들거나 고치고 쓰지 않는 계정을 끈다. 모든 전표(0002)·장부(0004)·재무제표(0005)의 기준이다. KFS 관리자는 새 계정을 여러 고객사에 복사해 준다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 회계 담당(고객사 관리자) / KFS 관리자(복사) |
| 언제 | 도입 때, 계정 체계가 바뀔 때 |
| 먼저 있어야 하는 것 | 회사 개설 + 기초 계정(kalpa는 907개가 복사돼 있음) |
| 다음 이벤트 | ACT-BZ-0002 전표 입력 |
| 실제 실행 | kalpa, 2026-11-13, API(관리자). 계정 목록(907) → 새 계정 `0407991000 BZ시험비`(판관비 하위·비용·차변) 생성 → 필수 누락 거절 → **같은 코드 재등록이 허용됨(⚠#194)** → 수정(이름) → 인쇄표시 저장 → 사원 402가 `접대비` 수정·시험 계정 삭제(⚠#195, 되돌림) → 시험 계정 2개 삭제. KFS 복사(`copy-admin`)·엑셀 내려받기는 안 함. 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1250 관리회계 > 21. 회계장부 > 계정과목 관리. kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 회계 담당 | #1250 | 검색·사용·속성으로 [조회] (`GET /act/account-codes`) | 계정 트리/목록 |
| 2 | 〃 | #1250 | [등록] → 계정코드·계정과목·상위·계정속성·차대구분·전표입력가능·사용 → [저장] (`PUT /act/account-codes`) | `act01_account_code` +1 |
| 3 | 〃 | #1250 | 행 선택 → 수정 → [저장] / 표시명·인쇄·사용 일괄 저장 (`PUT …/print`) | 갱신 |
| 4 | 〃 | #1250 | 행 선택 → [삭제] (`DELETE /act/account-codes`) | 삭제 |
| 5 | KFS | #1250(KFS 복사) | 기준 회사의 계정을 고객사들에 복사 (`POST …/copy-admin`) | (안 함) |

## DB에 남는 것

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `act01_account_code` | 계정과목(코드·이름·상위·속성·차대·전표입력가능·FSS 표시) | +2(같은 코드 2행) → 삭제 −2 → 변화 없음, `접대비` 설명은 원복 |

## 업무 규칙 · 주의

- 필수: 계정코드·계정과목·계정속성·차대구분. 이름·표시명·영문명·설명은 선택.
- 계정속성 코드: 5=비용 (그 외 자산·부채·자본·수익, 코드 표는 `계정속성` 코드).
- **같은 계정코드가 중복 등록된다** → [의심 #194](../../보안_및_버그_의심.md). **사원이 수정·삭제하고, 삭제 때 사용 중 검사가 없다** → [의심 #195](../../보안_및_버그_의심.md).
- 타사 계정 트리(`tree?companyId=…`)는 KFS 관리자만(사원은 거절됨 — 정상).
- `yunhee trace-crud -s 1250`: `act01_account_code` CRUD 같음.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ACT-BZ-0001
needs: []
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: PUT /api/v1/act/account-codes
    body: { accountCode: "0407991000", accountName: "BZ시험비", accountName2: "BZ시험비", parentCode: "0407000000", attributeCode: "5", drcrType: "D", slipYn: "true", printYn: "true", useYn: "true", fssYn: "false", fssSlipYn: "false" }
    expect: { track: { act01_account_code: +1 } }
  - no: 2
    api: DELETE /api/v1/act/account-codes
    body: ["{accountCodeId}"]
    expect: { track: { act01_account_code: -1 } }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Act01_Tab_AccountCode`(#1250), 서버 `Act01_AccountCode`.
- TOBE: `ActAccountCodeController`·`ActAccountCodeService`(save·savePrint·delete·tree·copyAdmin).
</details>
