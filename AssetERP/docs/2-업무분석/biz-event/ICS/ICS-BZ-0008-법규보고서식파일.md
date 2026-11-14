# ICS-BZ-0008 법규보고 서식파일을 올리고 쓴다

> **한 줄 요약** — 법규에 따라 감독기관에 보고할 때 쓰는 **서식파일**(엑셀·한글·PDF 등)을 KFS 관리자가 #1107에서 법령구분(자본시장법 등)을 골라 올리고 비고를 적는다. 회사 임직원은 #1009 법규보고 서식파일에서 법령구분·검색어로 찾아 **내려받는다**. 서식은 회사와 무관한 공용 자료다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자(업로드·비고 수정), 회사 임직원(조회·내려받기) |
| 언제 | 보고 서식이 새로 나오거나 바뀔 때 |
| 먼저 있어야 하는 것 | 공통코드 `LawType`(법령구분) |
| 다음 이벤트 | 회사가 서식으로 보고서를 만들어 상신(법규별 문서 — ICS-BZ-0010) |
| 실제 실행 | kalpa·KFS, 2026-11-13. KFS가 샘플 엑셀을 법령구분 `001`(자본시장법)로 업로드 → 비고 수정 → kalpa 301이 목록에서 검색·내려받기(엑셀 파일 내용 확인). 사원 301의 업로드·비고 저장은 403. 법령구분 `999`로도 올라간다(⚠). **시험 파일 2건은 지움**(공용 자료) |
| 메뉴 | #1009 준법감시 > 00. 법규정보 > 법규보고 서식파일, #1107 기초자료 > 00. 내부통제 > 법규보고 서식파일 등록(KFS). kalpa에는 #1009가 없어 API로 실행. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS 관리자 | #1107 | [파일업로드] → 법령구분·파일·내용 → [업로드] | 목록에 새 줄(법령구분·내용·등록일·파일명) |
| 2 | 〃 | #1107 | 내용 칸 고침 → [저장] | 비고 갱신 |
| 3 | 회사 임직원 | #1009 | 법령구분·검색어 → [조회] | 서식 목록 |
| 4 | 〃 | #1009 | 줄의 [다운로드] | 파일 저장 |
| 5 | KFS 관리자 | #1107 | 줄 선택 → 삭제(원본 화면은 먼저 `check-delete`로 사용 여부를 물음 — 이번에는 직접 삭제 API만 시험) | 목록에서 사라짐 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `sys10_file` | 서식파일(법령구분·비고·파일 경로) | +1 → 지움 |
| `sys11_relate_file` | 법규 항목 ↔ 파일 연결(법규별 첨부, #1013 아래 파일 탭) | 이번에는 안 씀 |

## 업무 규칙 · 주의

- 업로드·비고 수정은 **KFS 관리자만**(사원 403, 정상). 목록(`/form-files`·`/form-files/user`·`/form-file-admin`)은 사원 누구나 본다(공용 자료).
- 내려받기는 공통 `GET /sys/files/{id}`다 — 파일 ID만 알면 다른 회사 사용자도 받는다([의심 #88](../../보안_및_버그_의심.md)). 서식은 공용이라 문제가 작지만 같은 경로로 다른 첨부도 받는다.
- AS-IS 대조: `sys10_file.getIcsFile`(parentId 0) 4 = 4(kalpa/301), 그리드 열 모두 포함.
- 법령구분이 `LawType` 코드인지 서버가 검사하지 않는다 → [의심 #139](../../보안_및_버그_의심.md).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICS-BZ-0008
needs: []
steps:
  - no: 1
    actor: { company: admin, user: admin, password: "1111" }
    api: POST /api/v1/ics/form-file-admin?lawType=001&note=ICS-BZ-0008 시험
    file: data/samples/1.xlsx
    expect: { track: { sys10_file: +1 } }
  - no: 2
    actor: { company: admin, user: admin, password: "1111" }
    api: PUT /api/v1/ics/form-file-admin
    body: [{ fileId: <1단계>, note: 비고 수정 }]
  - no: 3
    actor: { company: kalpa, user: "301", password: "1111" }
    api: GET /api/v1/ics/form-files/user?searchText=ICS-BZ-0008
    expect: { rows: 1 }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ics01_Tab_IcsFileUser`(#1009)·`Ics01_Tab_IcsFileUpload`(#1107)·`Ics01_Lookup_IcsFileMultiUpload` — 서버 `Sys10_File.getIcsFile` → `sys10_file`.
- TOBE: `IcsRelateFileController`(`/form-files`·`/form-files/user`)·`IcsFormFileAdminController`(`/form-file-admin`, 쓰기 KFS 전용)·`SysFileController`(다운로드·삭제).
</details>
