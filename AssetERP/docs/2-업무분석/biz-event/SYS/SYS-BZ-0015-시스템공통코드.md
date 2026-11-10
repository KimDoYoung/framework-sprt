# SYS-BZ-0015 시스템 공통코드를 관리한다

> **한 줄 요약** — KFS 관리자가 #1078에서 코드구분(`sys08_code_kind`)과 그 코드(`sys09_code`)·코드그룹(`sys13_code_group`)을 관리한다. 코드구분의 **"시스템" 체크가 핵심**이다: 켜져 있으면 모든 회사가 **회사 0의 코드**를 쓰고, 꺼져 있으면 각 회사가 **자기 코드**를 쓴다(회사 등록 때 복사됨, SYS-BZ-0001·0007).

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자 `admin/admin/1111` |
| 언제 | 새 업무에 코드가 필요할 때, 코드 이름·순서·사용기간을 바꿀 때 |
| 먼저 있어야 하는 것 | — |
| 다음 이벤트 | 시스템이 아닌 코드구분이면 기존 고객사에 [코드복사](SYS-BZ-0007) |
| 실제 실행 | 2026-11-10, **시험 코드구분 `BzTest`를 만들어 확인한 뒤 지움**(코드구분은 전 회사 공용) |

## 따라 하기

| 단계 | 화면 | 누르는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|
| 1 | **#1078** 관리자 > 03. 코드관리 > 시스템 공통코드 관리 | 왼쪽 [등록] → 코드구분 `BzTest`, 코드구분명 `업무분석 시험코드`, 시스템 체크 → [저장] | 왼쪽 목록에 한 줄 |
| 2 | 〃 오른쪽 코드 탭(`Sys09_Grid_Code`) | [등록] ×2 → `10 가`, `20 나`(시작일자 필수) → [저장] | 코드 2개 |
| 3 | (확인) 칼파테크 화면의 `BzTest` 콤보 | | `가·나`가 보임 — 칼파테크에는 코드가 없지만 **회사 0의 것을 읽는다** |
| 4 | #1078 왼쪽 | 시스템 체크 끔 → [저장] | 칼파테크 콤보가 **빈다**(회사 0 콤보는 그대로) |
| 5 | 〃 [코드 그룹] 창(`Sys13_Lookup_CodeGroup`) → 그룹 탭(`Sys13_TabPage_Code`) | 그룹 `G1 시험그룹` 등록·저장 → 코드 `10 가`를 그룹에 넣기 | 그룹 코드 1개 |
| 6 | (정리) | 그룹 삭제 → 코드 삭제 → 코드구분 삭제 | 0건 |

## DB에 남는 것 (이번 실행: 만들었다가 지움 → 최종 0)

| 테이블 | 무엇 | 단계 | 행 |
|:---|:---|:---|---:|
| `sys08_code_kind` | 코드구분(`sys08_kind_cd`·이름·`sys08_sys_yn`) | 추가(1), 수정(4), 삭제(6) | +1 → 0 |
| `sys09_code` | 코드(회사·코드·이름·순서·시작/종료일·마감) | 추가(2), 삭제(6) | +3 → 0 (중복 시험 1건 포함) |
| `sys13_code_group` | 코드그룹: **머리 행(`code_id = 0`) 1 + 소속 코드마다 1** | 추가(5), 삭제(6) | +2 → 0 |

## 업무 규칙 · 주의 (실행으로 확인)

- **시스템 체크 = 어느 회사 코드를 읽나.** 콤보 SQL(`SysCodeMapper`): 시스템이면 `sys09_company_id = 0`, 아니면 로그인 회사. 체크를 바꾸는 순간 전 회사 화면이 바뀐다 — 끄면 자기 코드가 없는 회사는 콤보가 빈다(칼파테크로 확인).
- 회사 등록 때는 **시스템이 아닌** 코드구분만 새 회사로 복사된다(SYS-BZ-0001). 시스템 코드는 복사할 필요가 없고, 사원구분처럼 시스템인데 회사별로 필요한 것은 [코드복사](SYS-BZ-0007)로 따로 넣는다.
- 코드구분·코드구분명 필수("코드구분을 입력하세요." / "코드구분명을 입력하세요."). 코드는 **시작일자 필수**("시작일자를 입력하세요." — 확인). 화면은 새 행에 시작일자 `1910-01-01`을 넣어 준다.
- **같은 코드를 두 번 넣어도 막지 않는다.** `10`을 하나 더 저장했더니 성공했고, 콤보에 `10`이 두 번 나왔다(`가`, `중복`). AS-IS도 같다(서버 `UpdateDataModel`, 화면, DB 색인 어디에도 중복 검사 없음). 저장 전에 목록을 보고 넣는다.
- **코드구분을 지워도 그 코드·그룹은 남는다**(AS-IS `deleteModel` 그대로). 지울 때는 그룹 → 코드 → 코드구분 순서.
- 그룹 삭제는 머리 행 하나를 골라도 **그 그룹의 소속 코드까지** 지운다(1건 선택 → 2행 삭제).
- 코드그룹은 코드 일부만 묶어 콤보에 보여 줄 때 쓴다(`SystemCodeComboBox`의 `kindGroupCd`).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SYS-BZ-0015
actor: { company: admin, user: admin, password: "1111" }
steps:
  - no: 1
    api: PUT /api/v1/sys/code-kinds
    body: [{ codeKindId: null, kindCd: BzTest, kindNm: "업무분석 시험코드", sysYn: "true", note: null }]
  - no: 2
    api: PUT /api/v1/sys/codes
    body: [{ codeId: null, codeKindId: "{kind}", companyId: 0, code: "10", name: "가", seq: 1, closeYn: "false", applyDate: "2026-01-01" },
           { codeId: null, codeKindId: "{kind}", companyId: 0, code: "20", name: "나", seq: 2, closeYn: "false", applyDate: "2026-01-01" }]
  - no: 3
    actor: { company: kalpa, user: admin, password: "1111" }
    api: GET /api/v1/sys/codes?kindCd=BzTest      # [10 가, 20 나]
  - no: 4
    api: PUT /api/v1/sys/code-kinds               # sysYn "false" → kalpa 콤보 []
  - no: 5
    api: [PUT /api/v1/sys/code-groups, POST /api/v1/sys/code-groups/members]
  - no: 6
    api: [DELETE /api/v1/sys/code-groups, DELETE /api/v1/sys/codes?companyId=0, DELETE /api/v1/sys/code-kinds]
reject:
  - { api: PUT /api/v1/sys/codes, body: { applyDate: null }, message: "시작일자를 입력하세요." }
expect_after_cleanup:
  - { table: sys08_code_kind, where: "sys08_kind_cd = 'BzTest'", rows: 0 }
```
</details>

<details>
<summary>근거 (yunhee · AS-IS · TOBE)</summary>

- 조사: `yunhee trace-pair '#1078'`(서비스 12개 모두 API 짝), `yunhee trace-crud --screen '#1078'`, `yunhee screen-desc 1078 --summary --section tobe,popup,tabs`. trace-crud의 "TOBE에 CUD/CU/UD 없음"과 trace-pair의 "TOBE 호출" 빈칸 6건은 **오탐** — 화면이 CRUD 그리드 부품에 `save: sysApi.updateCodeKinds`·`remove: …`처럼 넘겨 부른다(`Sys08_Tab_CodeKindAdmin.tsx` L54-55, `Sys09_Grid_Code.tsx` L60, `Sys13_Lookup_CodeGroup.tsx` L44-45, `Sys13_TabPage_Code.tsx` L58).
- AS-IS: `Sys08_Tab_CodeKindAdmin`(#1078), `Sys09_Grid_Code`(새 행 시작일자 1910-01-01 L169-186), `Sys13_Lookup_CodeGroup`·`Sys13_TabPage_Code`; 서버 `sys.Sys09_Code.update`(Sys09_Code.java:386 — `UpdateDataModel`만, 중복 검사 없음)
- TOBE: `SysCodeKindController` `/api/v1/sys/code-kinds`(`GET·PUT·DELETE`, `/{id}/codes`, `/{id}/code-groups`, `/{id}/codes/copy`), `SysCodeController` `/api/v1/sys/codes`(`GET`(콤보)·`PUT`·`DELETE`), `SysCodeGroupController` `/api/v1/sys/code-groups`(`PUT·DELETE`, `/members` `GET·POST·DELETE`), 콤보 SQL `SysCodeMapper.xml` L14-15
- TOBE 상태(2026-11-10): **실행** — 만들기·시스템 전환 효과·그룹·정리까지 API로, 필수·중복 규칙 확인. **화면 눈 확인(사용자, 2026-11-10): #1078 코드구분 선택 → 코드 탭·[코드 그룹] 창 정상.** 자동 시험은 아직.
</details>
