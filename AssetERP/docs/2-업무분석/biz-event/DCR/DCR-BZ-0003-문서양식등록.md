# DCR-BZ-0003 문서양식을 등록하고 문서분류에 지정한다

> **한 줄 요약** — 고객사 관리자가 결재문서의 **본문 양식**(제목·구분·HTML 본문)을 만들어 두고, 문서종류(0001의 T)마다 어떤 양식을 쓸지(기본 양식 포함) **지정**한다. 직원이 문서를 작성할 때 문서종류를 고르면 지정된 양식이 본문에 채워진다. 새 회사는 KFS가 표준 양식을 복사해 준다(SYS-BZ-0022 / 아래 KFS 내보내기). 지정된 양식은 지울 수 없다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 고객사 관리자 (KFS 관리자가 표준 양식 내보내기) |
| 언제 | 도입 때, 새 서식이 생길 때 |
| 먼저 있어야 하는 것 | DCR-BZ-0001 문서분류(문서종류 T), 구분 코드(`DocFormClassCode`: 020 임직원매매·030 이익제공·050 기타신청서 …) |
| 다음 이벤트 | DCR-BZ-0005 문서 작성 |
| 실제 실행 | kalpa, 2026-11-13, API. kalpa 양식 0건에서 시작 → 양식 생성(`dcr05_doc_type` +1) → 제목·구분 없이 생성은 거절 → **존재하지 않는 구분코드 `A`도 저장됨(이름만 빈 값)** → 구분 `050`으로 수정 → 검색 → 문서종류에 양식 지정(`dcr06_relate_doc_type` +1) → **지정된 양식 삭제는 거절**("문서분류 지정된 양식이 포함되어 있습니다.") → 사원 402가 양식 수정·지정 해제(⚠#206) → 지정 해제 뒤 삭제 → KFS가 회사 0의 표준 양식 1건을 kalpa로 내보내기(+1, 삭제로 원복) → 사원 402의 내보내기·타사 지정은 거절. 편집창 미리보기 PDF·구분 추가(코드 관리)·문서종류 양식 일괄 등록은 안 함. 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1007 문서작성 > 03. 파일 및 양식관리 > 문서양식등록, #1482 기초자료 > 20. 문서(전자결재) > 문서양식등록(KFS). 지정 창은 #1001 문서분류의 문서종류 행 [양식] 셀. kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 관리자 | #1007 | 구분·검색 [조회] (`GET /dcr/doc-types`) | 양식 목록 |
| 2 | 〃 | #1007 | [등록] → 구분·제목·본문 편집 → 저장 (`POST /dcr/doc-types`) | `dcr05_doc_type` +1 |
| 3 | 〃 | #1007 | 행의 편집 셀 → 수정 (`PUT /dcr/doc-types/{id}`), [미리보기](PDF) | 갱신 |
| 4 | 〃 | #1007 | 행 선택 → [삭제] (`DELETE /dcr/doc-types`) | 삭제(지정된 양식이 있으면 전부 취소) |
| 5 | 〃 | #1001 | 문서종류 행의 [양식] → 양식 추가·기본 양식 체크 (`PUT /dcr/relate-doc-types`) | `dcr06_relate_doc_type` +1 |
| 6 | KFS | #1482 | 고객사 → 양식 선택 → [내보내기] (`POST /dcr/doc-types/push`) | 대상 회사에 새 ID로 복사 |

## DB에 남는 것

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `dcr05_doc_type` | 양식(제목·본문 HTML·구분·비고) | +1 → 삭제 −1, 내보내기 +1 → 삭제 −1 (107 원복) |
| `dcr06_relate_doc_type` | 문서종류·양식 지정(기본 여부) | +1 → 해제 −1 (25 원복) |

## 업무 규칙 · 주의

- 필수: 구분·제목·본문("구분은 필수선택 항목입니다"·"제목은 필수입력 항목입니다"·"내용은 필수입력 항목입니다"). 구분 코드가 실제 코드인지는 서버가 검사하지 않는다(`A` 저장됨, 구분 이름만 빈 값).
- 지정된 양식이 한 건이라도 섞여 있으면 삭제 전체가 취소된다. 구분 코드 자체를 코드 관리에서 지우려 하면 `check-form-class`가 "사용중인 코드는 삭제 불가합니다"로 막는다.
- 다른 회사 양식은 KFS만 본다: 사원이 `companyId=0`을 줘도 자기 회사 행만 받는다(`companyOf`). 내보내기(`push`)는 `ROLE_ADMIN`만("접근 권한이 없습니다").
- **메뉴 권한 없는 사원이 양식을 만들고·고치고·지정을 해제한다** → [의심 #206](../../보안_및_버그_의심.md). 결재문서 본문이 되는 양식이라 영향이 크다.
- kalpa 양식이 0건인 이유: SYS-BZ-0022에서 시험용으로 복사한 양식을 이후 지운 것으로 보인다. 직원 작성 이벤트(0005) 전에 양식 복사가 다시 필요하다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: DCR-BZ-0003
needs: [DCR-BZ-0001]
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: POST /api/v1/dcr/doc-types
    body: { title: "BZ시험양식", content: "<p>시험 본문</p>", note: "업무분석", docFormClassCode: "050" }
    expect: { track: { dcr05_doc_type: +1 } }
  - no: 2
    api: PUT /api/v1/dcr/relate-doc-types
    body: [ { classTreeId: "{문서종류ID}", docTypeId: "{docTypeId}", defaultYn: "true" } ]
    expect: { track: { dcr06_relate_doc_type: +1 } }
  - no: 3
    api: DELETE /api/v1/dcr/doc-types
    body: [ "{docTypeId}" ]
    expect: { error: "문서분류 지정된 양식이 포함되어 있습니다." }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Dcr05_Tab_DocType`(#1007·#1482)·`Dcr05_Edit_DocType`·`Dcr05_Edit_Update`·`Dcr06_Lookup_Form`, 서버 `Dcr05_DocType`(update·updateEdit·delete·pushData·checkDocFormClassCode)·`Dcr06_RelateDocType`.
- TOBE: `DcrDocTypeController`·`DcrDocTypeService`, `DcrRelateDocTypeController`.
</details>
