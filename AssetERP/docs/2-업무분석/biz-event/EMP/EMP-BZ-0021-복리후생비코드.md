# EMP-BZ-0021 복리후생비 코드를 정한다

> **한 줄 요약** — 복리후생비 종류(통신비·건강검진비·경조금·학자금·기타복리후생)마다 "신청서 문서분류 연결코드·지출결의서 연결코드·계정과목"을 정해 둔 표가 있다. **KFS 관리자가 #1373에서 기준 표(회사 0)를 만들고, 고객사에 [기초데이터생성]으로 복사**해 주면 고객사의 복리후생비 신청(EMP-BZ-0022)이 그 코드를 따른다. 고객사가 계정과목을 바꾸는 길은 #1222의 [복리후생비 설정]이다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자(`admin/admin/1111`, 회사 0). 고객사 쪽 계정과목 수정은 경영관리(과장) |
| 언제 | 도입 때(고객사 등록 직후), 신청서·지출결의서 양식 코드가 바뀔 때 |
| 먼저 있어야 하는 것 | 시스템 공통코드 `EmpBenefitType`(010BN·020AN·030AN·040AN·900BY — SYS-BZ-0015), 계정과목(`act01_account_code`) |
| 다음 이벤트 | 고객사에서 복리후생비 신청·관리(EMP-BZ-0022). 신청서 코드(`A21` 등)를 문서분류에 연결하는 일은 문서분류지정(EMP-BZ-0014와 같은 방식) |
| 실제 실행 | kalpa, 2026-11-12, API. 기준 표에 시험 코드 `TST9` 추가 → kalpa로 복사 → 같은 코드 한 번 더 복사 → 지움. 직원(402)의 접근도 확인 |
| 메뉴 | #1373 기초자료 > 30. 자산&경영 > 복리후생비 코드관리 (**ADMIN 회사 0 전용** — kalpa엔 없음, 화면 눈 확인 `대기`) |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS 관리자 | **#1373** 왼쪽 표 | 화면이 열리면 자동 조회. 검색어 입력 + Enter/[조회] | 기준 표(회사 0): 복리후생비명·코드·신청코드·지출결의코드·계정코드·계정과목·미사용 |
| 2 | 〃 | 〃 | [등록] → 코드·신청코드·지출결의코드, 계정코드(조회창) 입력 → [저장] | 행 저장. 복리후생비명은 공통코드에서 읽으므로 공통코드에 없는 코드(`TST9`)는 이름이 비어 보임 |
| 3 | 〃 | 오른쪽 표 | 고객사 칸의 조회창에서 회사 선택 → [조회] | 그 고객사의 복리후생비 설정 |
| 4 | 〃 | 왼쪽 표 | 복사할 행 체크 → [기초데이터생성] → 고객사 선택창 | 고객사 표에 같은 값의 행이 생김(`복리후생비 코드를 선택해주세요` — 미선택 때 메시지) |
| 5 | 〃 | 오른쪽 표 | 고객사 행 수정 → [저장], 잘못된 행 체크 → [삭제] → 확인 | 수정·삭제 |
| 6 | 경영관리 | **#1222** [복리후생비 설정] | 계정코드 칸을 바꿔 [저장] | 고객사 설정(계정과목 등)이 바뀜 — 창의 세부 동작은 화면 확인 `대기` |

## DB에 남는 것

| 테이블 | 무엇 | 단계 |
|:---|:---|:---|
| `emp55_benefit_info` | 복리후생비 설정(회사별 코드·신청코드·지출결의코드·계정코드·미사용). 회사 0이 기준 | 2 회사 0 +1, 4 고객사 +선택 행 수, 5 수정·삭제 |

## 결과를 볼 수 있는 화면

- #1373 오른쪽 표, #1221 신청구분 콤보(미사용 `true`와 설정 없는 구분은 안 나옴 — `sys00_common.selectBenefit`), #1222 [복리후생비 설정] 창.

## 업무 규칙 · 주의

- 실행 결과: 기준 표 6행(통신비 `A21/A46`, 건강검진비 `A22/A47`, 경조금 `A23/A48`, 학자금 `A49/A50`, 기타 `A37/A51`, 그리고 **시험 때 남은 `TEST1` 행**). 복사하면 새 ID로 같은 값이 들어간다. kalpa는 오늘 이미 5건을 받아 둔 상태였고 이번 시험 행은 모두 지웠다(kalpa 5행·회사 0 6행으로 되돌림).
- **복사는 기존 행을 지우지도 건너뛰지도 않는다**(원본 `insertInitData` 같음): 이미 있는 `010BN`을 다시 복사하니 kalpa에 `010BN`이 2행이 되었다. 중복이 생기면 #1373 오른쪽 표에서 지워야 한다 → 보고 후보 A.
- 서버 검사: 복사는 KFS 관리자만(직원 402 → `ACCESS_DENIED`), 다른 회사 설정을 읽거나 쓰는 것도 KFS 관리자만(`companyId` 지정 → 직원 `ACCESS_DENIED`).
- **직원(402)이 자기 회사 설정을 저장하는 것은 막지 않는다** — 미사용 `true`로 바꿨다 되돌리는 것이 `200`(되돌려 둠). 서버가 메뉴 권한을 보지 않는다(원본도 서버 검사 없음 추정) → 보고 후보 B.
- 연결코드가 문서분류에 연결돼 있어야 신청이 된다. kalpa에서 `A21·A22·A37`(신청서)·`A46·A47·A51`(지출결의서)만 문서분류에 지정되어 있고 **`A23`(경조금)·`A49`(학자금)·`A48`·`A50`은 미지정**이다. 그래서 kalpa는 경조금(`030AN`)·학자금(`040AN`)을 **미사용 `true`로 해 두었고**(고객사 설정으로 이미 그렇게 되어 있음), 신청구분 콤보에는 통신비·건강검진비·기타만 나온다(`GET /emp/benefits/types`로 확인). 미사용이 아닌데 문서분류가 없으면 신청 때 문서분류가 비어 상신이 막힐 것이다(확인 못 함).
- 안 한 것: 화면 눈 확인, 계정과목 조회창, #1222 [복리후생비 설정] 창, 회사 0 `TEST1` 행 정리 여부(남겨 둠).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0021
needs: [SYS-BZ-0001, SYS-BZ-0015]
steps:
  - no: 1
    actor: { company: admin, user: admin, password: "1111" }
    api: GET /api/v1/emp/benefit-infos?companyId=0
    expect: { rows: 6 }
  - no: 2
    api: PUT /api/v1/emp/benefit-infos?companyId=0
    body: [{ benefitInfoId: 0, benefitCode: "TST9", issueLinkCode: "A21", expenseLinkCode: "A46", accountCode: "0407040000", unUseYn: "false" }]
    expect: { table: emp55_benefit_info, delta: +1 }
  - no: 4
    api: POST /api/v1/emp/benefit-infos/copy
    body: { companyIds: ["<kalpa>"], benefitInfoIds: ["<TST9>", "<010BN 기준>"] }
    expect: { data: 2, kalpaRows: 7, duplicate: "010BN 2행" }
  - no: 5
    api: DELETE /api/v1/emp/benefit-infos?companyId=<kalpa> / ?companyId=0
    body: [ids]
    expect: { kalpaRows: 5, company0Rows: 6 }
  - no: B
    actor: { company: kalpa, user: "402", password: "Kalpa1234!" }
    api: [POST /copy → 403, GET ?companyId=0 → 403, PUT own company → 200]
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Emp55_Tab_benefitInfoManager`(#1373) — 이벤트 E0~E16, [기초데이터생성] `initData` L337-382. 서버 `emp.Emp55_BenefitInfo`(`selectBySearchText` L25, `insertInitData` L83 → `emp55_benefit_info.insertInitData`, `update` L98, `delete` L103).
- TOBE: `/api/v1/emp/benefit-infos`(`GET`·`PUT`·`DELETE`·`POST /copy`·`/by-company`·`/by-code`), `EmpBenefitInfoService.insertInitData`(KFS 관리자만), `targetCompany`.
- `yunhee trace-crud --screen Emp55_Tab_benefitInfoManager`: 테이블 `emp55_benefit_info` ASIS CRUD / TOBE CRUD 일치.
- TOBE 상태(2026-11-12): 실행(API). 화면 눈 확인 `대기`.
</details>
