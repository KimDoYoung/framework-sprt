# ICS-BZ-0015 KFS가 법규에 서식파일을 연결한다

> **한 줄 요약** — 법규(회사 0 마스터)마다 **보고 서식·근거 문서**를 붙여 둔다. KFS 관리자가 #1012 법규관리(관리자)에서 법규를 고르고 [서식파일] 창의 **[불러오기]**로 ICS-BZ-0008에서 올려 둔 서식파일 목록에서 골라 연결(또는 창에서 바로 업로드)한다. 회사 사용자는 #1336 법규조회·#1013 법규관리의 **서식파일 수** 셀로 그 법규의 파일을 보고 내려받는다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자(연결·해제), 회사 임직원(조회·내려받기) |
| 언제 | 법규 서식이 생기거나 바뀔 때 |
| 먼저 있어야 하는 것 | 법규(0011), 서식파일(0008) |
| 다음 이벤트 | 회사가 서식으로 보고서 작성·상신(0010) |
| 실제 실행 | KFS·kalpa, 2026-11-13. KFS가 샘플 PDF를 서식으로 올려(0008과 같은 길) 법규 `자산건전성 보고`(24762)에 연결 → 법규의 서식파일 2건이 3건으로 → kalpa 301이 법규별 파일 목록·`fileCount "3건"`·다운로드(PDF 내용) 확인. 같은 파일을 다시 연결하면 0건(중복 막힘). 301의 연결은 403. 연결·파일 모두 지움. ⚠ 없는 파일 ID로도 연결 행이 저장됨 |
| 메뉴 | #1012 기초자료 > 00. 내부통제 > 법규관리(관리자) → [서식파일], 읽기 #1336·#1013. kalpa 메뉴 없음(API). 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS 관리자 | #1012 | 법규 줄의 서식파일 셀 | 그 법규의 서식파일 창 |
| 2 | 〃 | 서식파일 창 | [불러오기] → 서식 목록에서 선택 → [확인] (또는 파일 선택으로 바로 업로드) | 목록에 파일 추가 |
| 3 | 회사 임직원 | #1336 | 법규 줄의 서식파일 셀 | 파일 목록 → 다운로드 |
| 4 | KFS 관리자 | 서식파일 창 | 파일 선택 → [삭제] | 연결 해제 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `sys11_relate_file` | 법규 ↔ 파일 연결(`parentId`=법규) | +1 → 지움(없는 파일 ID 시험 +1 → 지움) |
| `sys10_file` | 서식 파일(0008에서 올린 것) | +1 → 지움 |

## 업무 규칙 · 주의

- 연결·해제는 **KFS 관리자만**(`POST·DELETE /ics/laws/{id}/files` — 사원 403). 목록 조회는 로그인 사원 누구나이고 회사 구분이 없다.
- 같은 파일 재연결은 0건으로 막힌다. **없는 파일 ID는 막지 않는다** → [의심 #150](../../보안_및_버그_의심.md). 내려받기는 공통 파일 API라 파일 ID만 알면 다른 회사도 받는다([의심 #88](../../보안_및_버그_의심.md)).
- 해제 요청 본문은 연결 행 ID 목록(`relateFileId`)이다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICS-BZ-0015
needs: [ICS-BZ-0008, ICS-BZ-0011]
steps:
  - no: 1
    actor: { company: admin, user: admin, password: "1111" }
    api: POST /api/v1/ics/form-file-admin?lawType=001  # file data/samples/1.pdf
    expect: { track: { sys10_file: +1 } }
  - no: 2
    actor: { company: admin, user: admin, password: "1111" }
    api: POST /api/v1/ics/laws/24762/files
    body: { fileIds: [<1단계>] }
    expect: { track: { sys11_relate_file: +1 } }
  - no: 3
    actor: { company: kalpa, user: "301", password: "1111" }
    api: GET /api/v1/ics/laws/24762/files
    expect: { rows: 3 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ics01_Lookup_IcsFile`·`Ics01_Lookup_IcsFileAdmin`·`Ics01_Tab_ClassTree`(#1012) — 서버 `Sys11_RelateFile.insert·delete·selectByParentId`.
- TOBE: `IcsRelateFileController`(`/laws/{id}/files`)·`SysFileController`.
</details>
