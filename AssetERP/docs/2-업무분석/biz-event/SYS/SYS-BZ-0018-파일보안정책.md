# SYS-BZ-0018 파일보안정책(올릴 수 있는 확장자)을 정한다

> **한 줄 요약** — KFS 관리자가 #1500에서 **올릴 수 있는 파일 확장자 목록**(`sys60_file_policy`)을 관리한다. 목록에 없는 확장자는 모든 화면의 파일 올리기에서 "허용되지 않는 파일입니다."로 막힌다. 목록은 **전 회사 공통**이다(회사 칸 없음). 지금 31개(문서·이미지·압축 등).

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자 `admin/admin/1111` |
| 언제 | 고객이 새 형식의 파일을 올려야 할 때, 보안 점검 때 |
| 먼저 있어야 하는 것 | — |
| 실제 실행 | 2026-11-10 — `md`를 허용했다가 되돌림(정책 31건 그대로, 올린 시험 파일 0건) |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 칼파테크 관리자 | 파일 올리기가 있는 아무 화면 | `bz-test-0018.md` 올리기 | **"허용되지 않는 파일입니다."** (확인 — 저장 안 됨) |
| 2 | KFS 관리자 | **#1500** 관리자 > 09. 기타 > 파일보안정책 | [등록] → 확장자 `md`, 비고 `업무분석 시험` → [저장] | 32개 |
| 3 | 칼파테크 관리자 | 같은 화면 | 같은 파일 다시 올리기 | **"파일을 성공적으로 등록하였습니다."** — 저장 즉시 반영(확인) |
| 4 | 〃 | 〃 | `bz-test-0018-UP.MD`(대문자 확장자) 올리기 | 성공 — 확장자는 소문자로 비교(확인) |
| 5 | (정리) | | 올린 파일 2개 삭제 → #1500에서 `md` 행 삭제 → [저장] | 다시 올리면 1단계처럼 막힘(확인) |

## DB에 남는 것 (이번 실행: 넣었다가 지움 → 최종 0)

| 테이블 | 무엇 | 단계 | 행 |
|:---|:---|:---|---:|
| `sys60_file_policy` | 허용 확장자(확장자·MIME규칙·비고) | 추가(2), 삭제(5) | +1 → 0 |
| `sys10_file` | 올린 파일(디스크의 실제 파일 포함) | 추가(3·4), 삭제(5) | +2 → 0 |

## 업무 규칙 · 주의

- **확장자만 본다.** MIME규칙 칸이 있지만 검사하지 않는다(AS-IS `FilePolicyService.isAllowed`도 MIME 검사가 주석 처리). 이름만 `.pdf`로 바꾼 파일도 통과한다.
- **전 회사 공통**이다. 한 고객사를 위해 확장자를 열면 모든 고객사에 열린다.
- **AS-IS와 다른 점(의도한 것):** AS-IS는 서버가 켜질 때 목록을 한 번 읽어 두므로 #1500에서 바꿔도 **서버를 다시 켜야** 반영된다. TOBE는 올릴 때마다 읽어 **바로 반영**된다(`SysFileService.checkAllowedType` 주석, 사용자 결정 2026-11-04).
- 막힌 업로드는 감사 로그에 `FILE_UPLOAD_REJECTED`로 남는다(TOBE).
- 파일 삭제는 DB 행과 디스크 파일을 함께 지운다(서버 로그 "삭제 성공 fileId : …").

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SYS-BZ-0018
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: POST /api/v1/sys/files?parentId=<임의 ID>   # multipart file=bz-test-0018.md (data/samples/1.md 복사본)
    expect: { status: 400, code: INVALID_FILE, message: "허용되지 않는 파일입니다." }
  - no: 2
    actor: { company: admin, user: admin, password: "1111" }
    screen: 1500
    api: PUT /api/v1/sys/file-policies
    body: [{ filePolicyId: null, ext: md, mimeType: null, note: "업무분석 시험(SYS-BZ-0018)" }]
  - no: 3
    actor: { company: kalpa, user: admin }
    api: POST /api/v1/sys/files?parentId=<같은 ID>   # → 200 "파일을 성공적으로 등록하였습니다."
  - no: 5
    api: [DELETE /api/v1/sys/files/{fileId}, DELETE /api/v1/sys/file-policies]
expect_after_cleanup:
  - { table: sys60_file_policy, where: "sys60_ext = 'md'", rows: 0 }
```
</details>

<details>
<summary>근거 (yunhee · AS-IS · TOBE)</summary>

- 조사: `yunhee trace-pair '#1500'`(서비스 3개 모두 API 짝), `yunhee trace-crud --screen '#1500'`, `yunhee screen-desc 1500 --section tobe,popup,tabs`, `yunhee grep`(정책을 읽는 곳: AS-IS `FilePolicyService`·`FileUpload` L185, TOBE `SysFileService` L323-331), `yunhee api -F … --track sys10_file`, `yunhee log trace … --raw`(디스크 삭제 확인). trace-crud의 "TOBE에 CUD 없음"·trace-pair의 "TOBE 호출" 빈칸은 오탐(yunhee 수정사항051 §1·§2와 같은 꼴 — `Sys60_Tab_FilePolicy.tsx` L34-35 `save:`·`remove:`).
- AS-IS: `Sys60_Tab_FilePolicy`(#1500), 서버 `sys.Sys60_FilePolicy.selectByText`·`update`·`delete`, `utils/file/FilePolicyService.isAllowed`(L17, 시작 때 `sys60_file_policy.getAll`), `utils/file/FileUpload` L185
- TOBE: `SysFilePolicyController` `GET·PUT·DELETE /api/v1/sys/file-policies`, `SysFileService.checkAllowedType`(`SysFileMapper.selectAllowedExts`), `POST /api/v1/sys/files`, `DELETE /api/v1/sys/files/{fileId}`
- TOBE 상태(2026-11-10): **실행** — 차단·허용(즉시 반영)·대문자·정리까지. **화면 눈 확인(사용자, 2026-11-10): #1500 목록 31개·등록/저장/삭제 정상.** 자동 시험은 아직.
</details>
