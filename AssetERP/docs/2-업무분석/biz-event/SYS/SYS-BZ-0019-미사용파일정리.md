# SYS-BZ-0019 쓰지 않는 파일을 정리한다

> **한 줄 요약** — KFS 관리자가 #1353에서 **어디에도 붙어 있지 않은 첨부파일**(미사용 파일) 목록을 보고 하나씩 지운다. 목록은 **전 회사 공통**이다(회사 구분 없음). 지금 857행(중복 14건 포함, 실제 파일 843개). 지우기 전에 서버가 "아직 쓰는 파일인가"를 다시 확인한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자 `admin/admin/1111` (고객사 관리자는 못 본다 — 403) |
| 언제 | 가끔(디스크 정리, 점검 때) |
| 먼저 있어야 하는 것 | — (파일을 올린 화면이 있어야 목록에 뭔가 생긴다) |
| 실제 실행 | 2026-11-10 — 칼파테크에 주인 없는 시험 파일 1개를 올려 목록 858행 → 지워서 857행(DB·디스크 모두 지움) |

## "미사용 파일"이란

DB 함수 `find_orphan_sys10_files()`가 정한다. 둘 중 하나면 미사용이다.

1. 파일의 `parentId`(어느 글·문서에 붙었는지)가 **DB의 어떤 테이블 기본키 값과도 같지 않다** — 글·문서가 지워져서 파일만 남은 것.
2. `parentId`가 **삭제된 결재문서**(`apr99_appr_del`)다.

두 조건에 다 걸리는 파일은 목록에 **두 번** 나온다(지금 14개, AS-IS도 같다).

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS 관리자 | **#1353** 관리자 > 02. 시스템관리 > 미사용 파일조회 | (열면 바로 조회) [조회] | 857행 — parentId·등록일·첨부파일·경로·용량(KB)·보기·받기·삭제 |
| 2 | (준비) 칼파테크 관리자 | 파일 올리기 | `bz-test-0019.pdf`를 주인 없는 parentId `990000190001`로 올리기 | `sys10_file` +1 |
| 3 | KFS 관리자 | #1353 | [조회] | 858행 — 방금 파일이 보인다(경로 `…/uploads/kalpa/202611`) |
| 4 | 〃 | 〃 | 그 행의 **삭제** 아이콘 → "해당 파일을 삭제하시겠습니까?" [예] | 서버 판정 **3(지워도 됨)** → 파일 삭제 → 다시 조회 857행. 디스크 파일도 지워짐(서버 로그 "삭제 성공") |
| 5 | 〃 | 〃 | 다른 회사가 아직 쓰는 파일(예: fileId 202512159208673)의 삭제 아이콘 | **"해당 파일은 사용중인 파일이므로 삭제할 수 없습니다"** — 지워지지 않음(판정만 확인, 지우지 않음) |
| — | 〃 | 〃 | [일괄삭제] | 아무 일도 없다(AS-IS `deleteAll()`이 빈 메서드) |

삭제 아이콘의 서버 판정(`check-delete`):

| 판정 | 조건 | 화면 |
|:---:|:---|:---|
| 1 | 이 파일이 이 parentId에 **연관파일**(`sys11_relate_file`)로만 붙어 있다 | 연결만 지우고 다시 조회(파일은 그대로) |
| 2 | 진행 중인 결재문서가 연관파일로 쓴다 | "해당 파일은 다른 상신문서에서 사용 중이므로 삭제할 수 없습니다" |
| 2 | 그 밖의 글이 연관파일로 쓴다(부모 테이블 모름 또는 부모 행이 있음) | "해당 파일은 사용중인 파일이므로 삭제할 수 없습니다" |
| 3 | 아무도 안 쓴다 | 파일(DB 행 + 디스크) 삭제 → 다시 조회 |

## DB에 남는 것 (이번 실행: 넣었다가 지움 → 최종 0)

| 테이블 | 무엇 | 단계 | 행 |
|:---|:---|:---|---:|
| `sys10_file` | 첨부파일(디스크 파일 포함) | 추가(2), 삭제(4) | +1 → 0 |
| `sys11_relate_file` | 연관파일 연결 | 판정 1일 때만 삭제 | 0 |

## 업무 규칙 · 주의

- **목록에 있어도 못 지우는 파일이 있다.** 목록은 `sys10_file.parentId`만 보고, 연관파일(`sys11_relate_file`)로 다른 글에 붙은 것은 보지 않는다. 그런 파일이 지금 7개(연결 11건)다 — 삭제를 누르면 판정 2로 막힌다. 부모 테이블 칸이 빈 연결은 늘 "사용중"으로 본다(AS-IS 그대로).
- **전 회사 공통**이다. KFS 관리자가 모든 고객사의 파일을 보고 지운다. 경로(`…/{회사}/{년월}`)로 회사를 알 수 있다.
- 목록은 DB의 모든 테이블 기본키를 모아 비교하므로 느리다(지금 약 2.5초).
- **TOBE에서 고친 것(2026-11-10):** 판정 2일 때 화면이 늘 "다른 상신문서에서 사용 중" 문구를 보였다. AS-IS처럼 서버 문구(`result.getMessage()`)를 보이게 고쳤다(`Sys10_Tab_TrashFileList.tsx` `checkFileDelete`). **같은 꼴(고정 문구)이 파일을 지우는 다른 화면 15곳에 있다** — `Com01_Lookup_RelateFile`, `Bbs02·07·15`, `Biz05`, `Com01_Grid_RelateFile`, `Emp18`, `Ics01·17·20`, `Pay50`, `Rpt02`, `Sys10_Lookup_ListFileViewer`, `Sys90_Grid_ApprFile`, `Sys95_Tab_ManualAdmin` — AS-IS 원본 15개 모두 `SimpleMessage(result.getMessage())`임을 확인하고 같은 날 모두 고쳤다(사용자 결정 2026-11-10, 쓰지 않게 된 `fileApi.checkFileDelete`는 지움).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SYS-BZ-0019
steps:
  - no: 1
    actor: { company: admin, user: admin, password: "1111" }
    screen: 1353
    api: GET /api/v1/sys/files/trash        # rows = N
  - no: 2
    actor: { company: kalpa, user: admin, password: "1111" }
    api: POST /api/v1/sys/files?parentId=990000190001   # multipart file=bz-test-0019.pdf (data/samples/1.pdf 복사본)
  - no: 3
    actor: { company: admin, user: admin }
    api: GET /api/v1/sys/files/trash        # rows = N+1
  - no: 4
    api: [POST /api/v1/sys/files/{fileId}/check-delete?parentId=990000190001, DELETE /api/v1/sys/files/{fileId}]
    expect: { checkDelete: 3 }
  - no: 5
    api: POST /api/v1/sys/files/202512159208673/check-delete?parentId=202512159208672
    expect: { data: 2, message: "해당 파일은 사용중인 파일이므로 삭제할 수 없습니다" }
  - actor: { company: kalpa, user: admin }
    api: GET /api/v1/sys/files/trash
    expect: { status: 403, code: ACCESS_DENIED }
expect_after_cleanup:
  - { table: sys10_file, where: "sys10_parent_id = 990000190001", rows: 0 }
```
</details>

<details>
<summary>근거 (yunhee · AS-IS · TOBE)</summary>

- 조사: `yunhee screen-desc 1353 -s`, `yunhee trace-pair '#1353'`(서비스 2개 모두 API 짝), `yunhee trace-crud --screen '#1353'`, `yunhee analysis method Sys11_RelateFile.checkFileDelete -o code`, `Sys10_Tab_TrashFileList.checkFileDelete`·`deleteAll`, `yunhee sql`(함수 결과 집계·중복·연관파일), `yunhee api … --track sys10_file --log`, `yunhee log trace … --raw`. trace-crud의 "sys11_relate_file ⚠ TOBE에 D 없음"과 trace-pair의 "ASIS에만 있음 checkFileDelete01·03·deleteRelateFile"은 오탐 — TOBE `SysRelateFileService.checkFileDelete` L32-44가 01·02·03·deleteRelateFile을 다 쓴다(매퍼 문장 주석에 AS-IS id 표기가 달라 못 잇는다).
- AS-IS: `Sys10_Tab_TrashFileList`(#1353, L48-201), 서버 `sys.Sys10_File.findTrashFile`(→ `find_orphan_sys10_files()`), `sys.Sys11_RelateFile.checkFileDelete` L59-141, 서블릿 `FileDelete`
- TOBE: `SysFileController` `GET /api/v1/sys/files/trash`(KFS만), `POST /api/v1/sys/files/{fileId}/check-delete`, `DELETE /api/v1/sys/files/{fileId}`; `SysRelateFileService.checkFileDelete`, `SysFileMapper.findTrashFile`, `SysRelateFileMapper.countCheckFileDelete01~03`
- TOBE 상태(2026-11-10): **실행** — 조회·올리기·판정 3 삭제(DB·디스크)·판정 2(03 문구)·고객사 403. 화면 문구 1곳 고침(눈 확인 대기). 판정 1(연결만 지움)은 실제 데이터가 없어 안 돌림. 자동 시험은 아직.
</details>
