# SYS-BZ-0022 고객사에 결재 문서 양식을 복사해 준다

> **한 줄 요약** — 휴가신청서·증명서처럼 업무 화면에서 바로 결재를 올리는 문서(데이터연결 링크코드)는 회사마다 **본문 양식**이 있어야 결재문서 본문이 채워져 나온다. 양식은 회사 0(시스템)에만 있으므로, KFS 관리자가 **#1280**에서 위쪽 기초 링크(회사 0)를 고르고 아래쪽에서 목적지 회사를 골라 [양식복사]를 누른다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자 `admin/admin/1111` |
| 언제 | 고객사 도입 때, 회사 0의 양식이 바뀌었을 때 |
| 먼저 있어야 하는 것 | SYS-BZ-0001(고객사). 목적지 회사의 링크 행(`dcr30_link`)은 없어도 된다 — 없으면 새로 만든다 |
| 다음 이벤트 | EMP-BZ-0014 휴가신청(A01), EMP-BZ-0013 증명서 발급(B01~B04) 등 데이터연결 결재 |
| 실제 실행 | kalpa, 2026-11-10 — A01 휴가신청서 · B01 재직 · B02 퇴직 · B03 경력 · B04 징계내역확인서 5개를 복사 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS 관리자 | **#1280** 기초자료 > 20. 문서(전자결재) > 문서분류지정 | 화면을 연다 | 위: 회사 0의 링크 목록(링크코드·이름·문서분류·양식 구분 `B` = 양식 있음), 아래: 목적지 회사 목록. 열 때 모든 회사에 없는 링크 행을 만든다(`linkCheck`) |
| 2 | 〃 | 〃 | 위에서 `A01 휴가신청서`, `B01`~`B04` 체크 · 아래에서 `(주)칼파테크` 체크 → [양식복사] → 예 | "양식 복사가 완료되었습니다" |
| 3 | 직원 | #1032 휴가신청 → [상신하기] | 결재문서 창 | 본문이 휴가 신청서 양식으로 채워진다(부서·직위·성명·구분·시작일·종료일·기간·사유·휴가중연락처·상신일) |

같은 화면의 [문서분류지정복사]는 양식 대신 **문서분류 연결**을 복사한다(목적지 회사의 분류 중 기초 분류에서 복사된 것을 찾아 연결). 이번엔 실행하지 않았다.

## DB에 남는 것

| 테이블 | 무엇 | 단계 |
|:---|:---|:---|
| `com10_form_mapping` | 목적지 회사의 새 양식 행(회사 0 양식의 제목·본문·기본여부·비고를 그대로) — 링크마다 +1 | 2 (kalpa +5) |
| `dcr30_link` | 목적지 회사 링크 행의 양식 ID. 행이 있으면 양식 ID만 바꾸고(문서분류는 그대로), 없으면 새로 만든다 | 2 (kalpa는 행이 있어 변화 없음, 5행 양식 ID 채움) |

## 결과를 볼 수 있는 화면

- #1280 / #1033·#1115의 [문서분류지정] 창(양식 구분), 결재문서 창의 본문.

## 업무 규칙 · 주의

- 서버는 원본 `dcr.Dcr30_Link.updateForm` L189-214와 같다(`dcr30_link.updateFormDcr30` upsert + `com10_form_mapping.insertForm`). TOBE는 KFS 관리자만 부를 수 있고, 복사 원본은 화면이 보낸 행이 아니라 로그인 회사(0)의 링크 ID로 서버가 다시 읽는다.
- **다시 누르면 양식이 또 생긴다.** 누를 때마다 새 양식 행을 만들고 링크를 새 행으로 바꾼다. 앞서 만든 행은 지우지 않아 주인 없는 양식이 남는다(원본과 같다).
- **회사 0의 휴가신청서 양식에는 채워지지 않는 칸이 하나 있다.** 양식이 `#{직무대행자}`라고 쓰는데, 원본 `Emp20_Edit_Leave.createMapping` L858-884와 TOBE `HrLinkSeedProvider`는 `대직자`라는 키로만 값을 넣어서 본문에 `#{직무대행자}`가 그대로 보인다. **원본도 같다.** asseterpdb의 A01 양식 2개 중 다른 고객사 것은 `#{대직자}`로 고쳐 썼다 → 회사 0 양식을 고치거나, 고객사가 자기 양식을 고쳐야 한다(코드 문제는 아님).
- **증명서 양식(B01~B04)은 회사 0에도 진짜가 없다.** 본문이 시험용 글(B01 "복사 테스트!!!", B02~B04 몇 글자)이고, asseterpdb 전체에서 증명서 양식이 있는 회사는 0뿐이다. 그래서 kalpa에도 이 시험용 글이 복사됐다(2026-11-10) — 증명서 결재문서 본문이 이 글로 열린다. 고객사가 쓸 증명서 양식은 따로 만들어야 한다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SYS-BZ-0022
needs: [SYS-BZ-0001]
steps:
  - no: 2
    actor: { company: admin, user: admin, password: "1111" }
    api: POST /api/v1/dcr/links/copy-form
    body: { companyIds: ["<kalpa>"], linkIds: [77738, 202204180108528, 202204180108529, 202204180108530, 202204180108531] }   # 회사 0의 A01·B01~B04
    expect: [{ value: 5 }, { table: com10_form_mapping, delta: +5 }]
  - no: 3
    actor: { company: kalpa, user: "401", password: "Kalpa1234!" }
    api: GET /api/v1/apr/apprs/link-seed?classTreeId=<휴가/휴가신청>&linkCode=A01&refId=<leaveId>
    expect: { field: content, contains: "김사원" }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Dcr30_Tab_LinkAdmin`(#1280, E0~E9 — [양식복사] E6·E7 → `formCopy` L350-372, [문서분류지정복사] E4·E5 → `documentCopy` L325-348), 목적지 회사 `Dcr30_TabPage_Company`
- AS-IS 서버: `dcr.Dcr30_Link.updateForm` L189-214 → `dcr30_link.updateFormDcr30`, `com10_form_mapping.insertForm`(회사 0의 같은 링크코드 양식을 복사)
- TOBE: `POST /api/v1/dcr/links/copy-form` `DcrLinkService.copyForm`(`requireSysAdmin`), 화면 `Dcr30_Tab_LinkAdmin.tsx` L129
- `yunhee trace-crud -t com10_form_mapping`: 쓰는 화면은 `Dcr30_Tab_LinkAdmin` 하나, ASIS CR / TOBE CR
- TOBE 상태(2026-11-10): **실행(API)** — 복사 5건, 휴가 본문 채움 확인. 화면 눈 확인은 `대기`.
</details>
