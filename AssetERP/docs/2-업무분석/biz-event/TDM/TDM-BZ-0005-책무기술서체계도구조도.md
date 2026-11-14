# TDM-BZ-0005 책무기술서·책무체계도를 만들고 책무구조도를 이사회에 제출한다

> **한 줄 요약** — 결재 완료된 직책배정을 바탕으로 ① #1418에서 임원별 **책무기술서**를 만들어(등록 사유·기준일) 결재(A91)받고 ② #1419에서 회사 전체 **책무체계도**를 만들어 결재(A92)받으며 ③ #1480 책무구조도 제출에서 **이사회 개최 정보**(일시·장소·참석·안건·찬성자)와 제출일을 기록한다. 기술서·체계도 파일(PDF)은 RD 리포트가 만드는데 TOBE는 아직 연결이 없다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 책무 담당(301), 결재자 박부장(201) |
| 언제 | 임원·직제가 바뀔 때, 책무구조도 제출 때 |
| 먼저 있어야 하는 것 | TDM-BZ-0004(결재 완료된 직책배정), 문서분류지정 A91·A92 |
| 다음 이벤트 | TDM-BZ-0006(매뉴얼), 이사회 제출 증빙 |
| 실제 실행 | kalpa, 2026-11-13. 김사장 배정으로 기술서 등록(등록일 2026-07-01, 사유 `D03`, 기준일 2026-07-01 → `tdm31` +1) → A91 결재 상신·승인. 체계도 등록(`tdm32` +1) → A92 결재 상신·승인. 책무구조도 제출(`tdm36` +1: 이사회 2026-07-10 본사 대회의실, 참석 5/5, 안건 "책무구조도 승인의 건", 제출일 2026-07-15). ⚠ **기술서 [재생성](`POST /tdm/role-descs/{id}/recreate`)이 400** — "책무기술서 PDF 생성 연동(RD 리포트 `Tdm31_Rd_DescRpt`)이 아직 없어 파일을 만들지 않았습니다"(`DisabledRoleDescPdfMaker`). 결재 전 상태에서는 기술서 목록(`/role-descs/company`)이 비어 보이고, 배정 결재가 끝난 뒤에야 나온다 |
| 메뉴 | #1418 임원별 책무기술서, #1419 책무체계도, #1480 책무구조도 제출. kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 책무 담당 | #1418 | [등록] → 임원·기준일·사유 → [저장] → [재생성]·[상신](A91) | 기술서 줄, 결재 문서 |
| 2 | 〃 | #1419 | [등록] → 기준일·사유 → [저장] → [상신](A92) | 체계도 줄, 결재 문서 |
| 3 | 〃 | #1480 | [등록] → 이사회 개최일·장소·참석·안건·찬성자·제출일 | 제출 내역 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `tdm31_role_desc` | 책무기술서 | +1 |
| `tdm32_role_digm` | 책무체계도 | +1 |
| `tdm36_role_report` | 책무구조도 제출(이사회) | +1 |
| `apr01_appr` 외 | 기술서·체계도 결재 문서 | +2 |

## 업무 규칙 · 주의

- 기술서·체계도는 기준일의 **결재 완료된 직책배정**(`getTdm30RoleAllc(…, true)`)을 읽는다. 배정이 승인 전이거나 확정 책무가 비어 있으면 목록·내용이 비게 된다(TDM-BZ-0004).
- PDF 생성은 RD 연동 대기 — 기술서 `recreate`는 시험으로 확인했고, 체계도 `recreate`(`POST /tdm/role-digms/{id}/recreate`)도 같은 구조일 것으로 보이나 시험하지 않았다. 변환 범위의 공백이다.
- 기술서·체계도·제출 API는 '회사' 검사뿐이다 → [의심 #133](../../보안_및_버그_의심.md).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: TDM-BZ-0005
needs: [TDM-BZ-0004]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [PUT /api/v1/tdm/role-descs, PUT /api/v1/tdm/role-digms, PUT /api/v1/tdm/role-reports]
    body: [[{ regDate: "2026-07-01", reasonCode: D03, personId: <김사장>, roleAllcId: <배정>, allcStdDate: "2026-07-01" }],
           [{ regDate: "2026-07-01", allcStdDate: "2026-07-01", reasonCode: D03 }],
           [{ boardOpenDate: "2026-07-10", allcStdDate: "2026-07-01", reportDate: "2026-07-15", boardOpenLoc: 본사 대회의실, membTotCnt: 5, membAttendCnt: 5, boardOpenAgenda: 책무구조도 승인의 건 }]]
    expect: { track: { tdm31_role_desc: +1, tdm32_role_digm: +1, tdm36_role_report: +1 } }
  - no: 2
    api: [POST /api/v1/tdm/role-descs/{id}/recreate]
    expect: { status: 400, message: 책무기술서 PDF 생성 연동(RD 리포트 Tdm31_Rd_DescRpt)이 아직 없어 파일을 만들지 않았습니다 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Tdm31_Tab_RoleDesc`(#1418, 링크 A91, `f_inner_make_desc`)·`Tdm32_Tab_RoleDigm`(#1419, A92, `f_inner_make_digm`)·`Tdm36_Tab_RoleReport`(#1480).
- TOBE: `TdmRoleDescController`·`TdmRoleDigmController`·`TdmRoleReportController`, `TdmApprLinkController`, `DisabledRoleDescPdfMaker`, 매퍼 `TdmRoleDescMapper.xml#selectByRegDateAdmin`(`getTdm30RoleAllc`).
</details>
