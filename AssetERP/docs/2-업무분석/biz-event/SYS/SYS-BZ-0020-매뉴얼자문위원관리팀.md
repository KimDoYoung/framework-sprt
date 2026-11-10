# SYS-BZ-0020 매뉴얼·자문위원·관리팀 안내를 올린다

> **한 줄 요약** — KFS 관리자가 **고객사 사용자에게 보일 안내 3가지**를 올린다: 사용 매뉴얼(PDF 등 파일, #1298), 자문위원 명단(#1302), KFS 관리팀 명단(#1304). 고객사 사용자는 **커뮤니티 > 91. AssetERP** 메뉴(#1297·#1301·#1303)에서 본다. 세 목록 모두 **전 회사 공통**이다(회사별로 나뉘지 않는다).

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자 `admin/admin/1111` (보는 쪽: 고객사 사용자) |
| 언제 | 매뉴얼을 새로 만들거나 고칠 때, 자문위원·관리팀이 바뀔 때 |
| 먼저 있어야 하는 것 | 관리팀: KFS 직원(**회사ID 1**)의 사원 정보 — 이 DB에는 없다(아래 주의) |
| 실제 실행 | 2026-11-10 — 세 가지 모두 시험 행을 넣고 고객사(칼파테크)에서 확인한 뒤 지움(최종 0) |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| **매뉴얼** | | | | |
| 1 | KFS 관리자 | **#1298** 관리자 > 09. 기타 > AssetERP 매뉴얼 등록 | 분류 `기타` 고르기 → [파일업로드] → `BZ0020-시험매뉴얼.pdf` | 목록에 1행 추가(등록일 오늘, **공개 꺼짐**). 오른쪽에 PDF가 보인다 |
| 2 | 칼파테크 사용자 | #1297 커뮤니티 > 91. AssetERP > AssetERP 매뉴얼 | (조회) | **안 보인다** — 공개한 것만 보인다(6건 그대로) |
| 3 | KFS 관리자 | #1298 | 그 행 `공개` 체크, 비고 입력 → [저장] | 공개 |
| 4 | 칼파테크 사용자 | #1297 | (조회) | 보인다(7건). PDF 열기도 된다 |
| 5 | (정리) KFS 관리자 | #1298 | 그 행 삭제 → [예] | 파일·매뉴얼 행 삭제, 6건 |
| **자문위원** | | | | |
| 6 | KFS 관리자 | **#1302** 관리자 > 09. 기타 > AssetERP 자문의원 관리 | [등록] → 분야·회사명·대표·약력·홈페이지·상담전화·이메일·주소 입력 → [저장] | 3건 |
| 7 | 칼파테크 사용자 | #1301 커뮤니티 > 91. AssetERP > AssetERP 자문위원 | (조회) | 3건 보임. 읽기 전용(조회 버튼만, 홈페이지는 링크) |
| 8 | (정리) KFS 관리자 | #1302 | 그 행 선택 → [삭제] → [예] | 2건 |
| **관리팀** | | | | |
| 9 | KFS 관리자 | **#1304** 관리자 > 09. 기타 > AssetERP 관리팀 등록 | [등록] → 성명 칸 돋보기 → 사원찾기에서 직원 고르기 → 담당 업무·근속년수·주요경력 → [저장] | **저장은 되지만 목록에 안 나온다**(0건) — 아래 주의 |
| 10 | (정리) | | API로 지움 | 1건(원래 있던 것) |

같은 클래스를 두 메뉴가 쓴다: KFS(회사 0)로 열면 편집 그리드 + 조회·등록·저장·삭제, 고객사로 열면 읽기 전용 그리드 + 조회만(#1301·#1303). 매뉴얼은 등록(#1298 `Sys95_Tab_ManualAdmin`)과 보기(#1297 `Sys95_Tab_Manual`)가 다른 클래스다.

## DB에 남는 것 (이번 실행: 넣었다가 지움 → 최종 0)

| 테이블 | 무엇 | 단계 | 행 |
|:---|:---|:---|---:|
| `sys95_manual` | 매뉴얼(분류·공개·비고) | 추가(1), 수정(3), 삭제(5) | +1 → 0 |
| `sys10_file` | 매뉴얼 파일(parentId = 매뉴얼ID) | 추가(1), 삭제(5) | +1 → 0 |
| `sys91_advice_member` | 자문위원 | 추가(6), 삭제(8) | +1 → 0 |
| `sys92_management_team` | 관리팀(사원ID·담당 업무·근속·경력) | 추가(9), 삭제(10) | +1 → 0 |

## 업무 규칙 · 주의

- **전 회사 공통**이다. 세 테이블에 회사 칸이 있지만 조회는 회사를 보지 않는다(AS-IS `selectByAll`·`selectByText` 그대로). 새 행의 회사 칸에는 `1`이 들어간다(AS-IS `insertRow`).
- **매뉴얼은 처음에 비공개**로 올라간다. 공개를 켜고 저장해야 고객이 본다. 고객사가 비공개까지 달라고 하면 403(관리자만).
- **고객사는 보기만 한다.** 자문위원·관리팀 저장을 고객사 관리자로 부르면 403(접근 권한이 없습니다)으로 막힌다(확인). AS-IS는 화면에서만 버튼을 숨겼다.
- ⚠ **관리팀 목록은 회사ID 1의 직원만 보인다.** AS-IS SQL이 `emp01_company_id = 1`(운영의 KFS 회사)로 고정이고, TOBE도 그대로다. 이 DB에는 회사 1이 없고(KFS 관리자 회사는 0, 직원 1명) 기존 관리팀 1건도 없는 사원을 가리켜, **#1304·#1303 목록은 늘 0건**이다. 사원찾기로 회사 0 직원을 골라 저장해도 목록에 안 나오고, 화면에서 지울 수도 없다. 운영 DB에서는 정상일 것 — 시험 DB의 데이터 문제(고칠지 사용자 결정 대기).
- ⚠ **칼파테크에는 커뮤니티 > 91. AssetERP 메뉴가 없다.** 출발지 `prod_s1`에 없어서(SYS-BZ-0003), 고객 쪽 확인은 API로만 했다(매뉴얼 보기 메뉴는 6개 회사, 관리팀 메뉴는 9개 회사에 열려 있음).
- #1298의 매뉴얼 삭제도 "사용 중" 판정 때 고정 문구를 보였다 — 2026-11-10 서버 문구로 고침(SYS-BZ-0019의 15곳과 함께).
- 메뉴 이름은 원본 그대로 "자문**의**원 관리"(#1302)와 "자문**위**원"(#1301)이 다르다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SYS-BZ-0020
steps:
  - no: 1
    actor: { company: admin, user: admin, password: "1111" }
    screen: 1298
    api: POST /api/v1/sys/manuals?manualType=999   # multipart file=BZ0020-시험매뉴얼.pdf (data/samples/1.pdf 복사본)
    expect: { publicYn: "false" }
  - no: 2
    actor: { company: kalpa, user: admin, password: "1111" }
    api: GET /api/v1/sys/manuals?searchText=BZ0020   # → 0행
  - no: 3
    actor: { company: admin, user: admin }
    api: PUT /api/v1/sys/manuals
    body: [{ manualId: <1의 id>, manualType: "999", publicYn: "true", note: "업무분석 시험(SYS-BZ-0020)" }]
  - no: 4
    actor: { company: kalpa, user: admin }
    api: [GET /api/v1/sys/manuals?searchText=BZ0020, GET /api/v1/sys/files/{fileId}]   # → 1행, PDF
  - no: 5
    actor: { company: admin, user: admin }
    api: [POST /api/v1/sys/files/{fileId}/check-delete?parentId={manualId}, DELETE /api/v1/sys/files/{fileId}, DELETE /api/v1/sys/manuals]
  - no: 6
    screen: 1302
    api: PUT /api/v1/sys/advice-members
    body: [{ adviceMemberId: -1, companyId: 1, field: "업무분석", companyNm: "(시험)칼파자문", memberNm: "김자문" }]
  - no: 7
    actor: { company: kalpa, user: admin }
    api: [GET /api/v1/sys/advice-members, PUT /api/v1/sys/advice-members]
    expect: { get: "3행", put: { status: 403, code: ACCESS_DENIED } }
  - no: 8
    api: DELETE /api/v1/sys/advice-members
  - no: 9
    screen: 1304
    api: [PUT /api/v1/sys/management-teams, GET /api/v1/sys/management-teams]
    body: [{ managementTeamId: -1, companyId: 1, personId: 1, chargePart: "업무분석 시험" }]
    expect: { get: "0행 (회사 1 직원 없음)" }
expect_after_cleanup:
  - { table: sys95_manual, rows: 6 }
  - { table: sys91_advice_member, rows: 2 }
  - { table: sys92_management_team, rows: 1 }
```
</details>

<details>
<summary>근거 (yunhee · AS-IS · TOBE)</summary>

- 조사: `yunhee screen-desc 1298,1302,1304 -s`, `yunhee trace-pair '#1298'`·`'#1302'`·`'#1304'`(서비스 4·3·3개 모두 API 짝), `yunhee analysis method Sys91_AdviceMember.selectByAll`·`Sys92_ManagementTeam.selectByAll`·`Sys95_Manual.selectByText -o code`, `yunhee analysis sql … -o sql`, `yunhee sql`(회사 0·1, 메뉴가 열린 회사 수, 관리팀 사원), `yunhee api … --track`. screen-desc의 #1302 "호출 API 없음"은 오탐(`useGridCrud`의 `search:`·`save:`·`remove:`로 부름 — yunhee 수정사항051 §1과 같은 꼴), trace-pair는 짝을 다 찾았다.
- AS-IS: `Sys95_Tab_ManualAdmin`(#1298)·`Sys95_Tab_Manual`(#1297)·`Sys95_PDFViewer`, `Sys91_Tab_AdviceMember`(#1301·#1302), `Sys92_Tab_ManagementTeam`(#1303·#1304); 서버 `sys.Sys95_Manual.selectByText·update·delete`, `sys.Sys91_AdviceMember.*`, `sys.Sys92_ManagementTeam.*`(`selectByAll`의 `emp01_company_id = 1`)
- TOBE: `SysManualController` `GET·POST·PUT·DELETE /api/v1/sys/manuals`, `SysAdviceMemberController` `/api/v1/sys/advice-members`, `SysManagementTeamController` `/api/v1/sys/management-teams`(`SysManagementTeamMapper.xml` L30 회사 1 고정, L88 신규 회사 기본 1)
- TOBE 상태(2026-11-10): **실행** — 매뉴얼(올리기·비공개·공개·고객 보기·PDF·삭제), 자문위원(등록·고객 보기·고객 쓰기 403·삭제), 관리팀(저장되지만 목록 0 — 시험 DB에 회사 1 없음). 화면 눈 확인·자동 시험은 아직.
</details>
