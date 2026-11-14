# DCR-BZ-0004 KFS가 업무 결재문서(링크코드)의 문서분류를 회사에 지정해 준다

> **한 줄 요약** — 휴가신청서(A01)·재직증명서(B01)·연봉계약(D01)처럼 **업무 화면에서 바로 상신하는 결재문서**는 링크코드(`LinkCode`, 회사 0 기준 97개)마다 어느 문서분류(0001의 트리)로 만들지 정해져 있어야 한다(`dcr30_link`). KFS 관리자가 #1280 문서분류지정을 열면 모든 회사에 없는 링크 행이 생기고(`linkCheck`), 위쪽 회사 0 링크를 골라 아래쪽 목적지 회사에 **[문서분류지정복사]**하면 목적지 회사의 "회사 0에서 복사된 같은 분류"가 지정된다. [양식복사]는 본문 양식을 내려 준다(SYS-BZ-0022). 회사 관리자는 업무 화면의 [문서분류지정] 창이나 같은 API로 자기 회사 링크를 직접 고친다(ATT-BZ-0003·APR-BZ-0011). 저장하면 문서세부분류를 안 쓰는 회사는 링크 분류의 문서수정 권한이 꺼진다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자(복사·전체 회사), 회사 관리자(자기 회사 링크 저장) |
| 언제 | 고객사 도입 때, 새 업무 결재문서(링크코드)가 생길 때 |
| 먼저 있어야 하는 것 | DCR-BZ-0001 문서분류(목적지 회사 트리가 회사 0에서 복사돼 `dcr01_insert_bak_dcr_id`가 있어야 복사가 맞게 붙음 — kalpa 622행 모두 있음), 공통코드 `LinkCode` |
| 다음 이벤트 | SYS-BZ-0022 양식복사, DCR-BZ-0005 문서 작성, 업무별 상신(ATT·APR·EMP·PAY) |
| 실제 실행 | 2026-11-14, API. ① KFS admin `POST /dcr/links/check` → 링크 행 +4(kalpa 93 → 97). ② `GET /dcr/links?companyId=kalpa` 93행(AS-IS 93 = 93). ③ [문서분류지정복사] 회사 0 → kalpa: B01·B02·B03·D01(회사 0 분류 있음) + A11(회사 0 분류 없음) → `Data: 5`. B01 → `인사/증명서 발급/재직증명서`, B02 → `…/퇴직증명서`, D01 → `급여/연봉계약체결/연봉계약서`, **B03 경력증명서 → `리서치/시장분석/시장분석`(⚠#212)**, **A11 → 빈 값(kalpa가 정해 둔 분류가 지워짐, ⚠#211)**. ④ KFS `PUT /dcr/links?companyId=kalpa`로 5건 원래 값으로 되돌림. ⑤ 사원 401: 자기 회사 `PUT /dcr/links` 200(같은 값, #48 확인), `POST /dcr/links/copy-link` 403 |
| 메뉴 | #1280 기초자료 > 20. 문서(전자결재) > 문서분류지정(KFS). 회사 쪽은 업무 화면의 [문서분류지정] 창(예: #1033 휴가신청, #1115 증명서 발급). kalpa 메뉴 없음. 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS | #1280 | 화면 열기 (`POST /dcr/links/check`) | 모든 회사에 없는 링크 행 생성(분류 빈 값) |
| 2 | 〃 | 〃 | 검색 → [조회] (`GET /dcr/links`) | 위: 회사 0 링크(Link명·문서분류·양식·비고), 아래: 목적지 회사(상품 콤보로 거름 — CH-0410) |
| 3 | 〃 | 〃 | 링크 행의 문서분류 칸 → 트리에서 고르기 · 비고 → [저장] (`PUT /dcr/links`) | 회사 0 링크 저장, 문서세부분류를 안 쓰는 회사면 링크 분류의 `dcr03_update_yn` = false |
| 4 | 〃 | 〃 | 위 행 체크 + 아래 회사 체크 → [문서분류지정복사] → "N개의 회사에 복사하시겠습니까?" [예] (`POST /dcr/links/copy-link`) | 목적지 회사 링크 = 원본 분류에서 복사된 그 회사 분류, 그 분류 `dcr03_update_yn` = false |
| 5 | 〃 | 〃 | 같은 선택 → [양식복사] (`POST /dcr/links/copy-form`) | SYS-BZ-0022 |
| 6 | 〃 | 〃 | 행의 [데이터연결(양식)] 셀 / 비고 창 (`PUT /dcr/links/{id}/note`) | 양식 매핑 보기·비고 저장 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `dcr30_link` | 회사·링크코드별 문서분류·양식 매핑·비고 | check +4, 복사 5건 갱신 → 되돌림 |
| `dcr03_org_auth` | 링크 분류의 문서수정여부(`dcr03_update_yn`) | kalpa 링크 분류 20행 이미 모두 false |

## 업무 규칙 · 주의

- 복사는 "원본 분류 ID"를 그대로 쓰지 않고, 목적지 회사에서 **`dcr01_insert_bak_dcr_id` = 원본 분류 ID**인 행을 찾아 붙인다. 목적지 트리를 회사 0에서 복사하지 않았거나, 원본 링크 분류가 비어 있으면 **빈 값으로 덮어쓴다** → [의심 #211](../../보안_및_버그_의심.md). 회사가 직접 바꾼 지정(예: kalpa A01·A11)도 복사하면 회사 0 기준으로 돌아간다.
- 회사 0 기초의 B03 경력증명서가 `리서치/시장분석`에 붙어 있다 → [의심 #212](../../보안_및_버그_의심.md).
- 저장(`PUT /dcr/links`) 뒤 `updateDcrAuth`: 회사의 `sys01_dcr_detail_use_yn`이 true가 아니면 그 회사 **모든** 링크 분류의 문서수정여부를 false로 만든다(원본 그대로).
- 권한: 복사·양식복사는 KFS 관리자만(`requireSysAdmin`, 401 → 403). 다른 회사 저장도 KFS만. 같은 회사 링크 저장은 사원도 된다 → [의심 #48](../../보안_및_버그_의심.md)(확인).
- 원본 화면은 고른 행이 없거나 분류가 빈 행이 섞여도 막지 않는다(TOBE도 같음).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: DCR-BZ-0004
needs: [DCR-BZ-0001]
steps:
  - no: 1
    actor: { company: admin, user: admin, password: "1111" }
    api: POST /api/v1/dcr/links/check
    expect: { track: { dcr30_link: "+(없는 링크 수)" } }
  - no: 2
    api: POST /api/v1/dcr/links/copy-link
    body: { companyIds: ["{kalpa}"], linkIds: ["{회사0 B01}", "{회사0 D01}"] }
    expect: { kalpa: { B01: "인사/증명서 발급/재직증명서", D01: "급여/연봉계약체결/연봉계약서" } }
  - no: 3
    actor: { company: kalpa, user: "401", password: "1111" }
    api: POST /api/v1/dcr/links/copy-link
    expect: { status: 403 }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Dcr30_Tab_LinkAdmin`(#1280 E0~E9: linkCheck L263·retrieve L275·update L306·documentCopy L325-348·formCopy L350), `Dcr30_TabPage_Company`, `Dcr30_Lookup_LinkNote`, 서버 `Dcr30_Link.linkCheck` L110·`update` L240·`updateDcrAuth` L165·`updateLink` L216-238(`dcr30_link.updateLink` — `dcr01_insert_bak_dcr_id`로 분류 찾기, `dcr03_org_auth.updateByBakDcr`).
- TOBE: `DcrLinkController`(`/api/v1/dcr/links`·`/check`·`/copy-link`·`/copy-form`·`/{linkId}/note`), `DcrLinkService.update` L88·`updateDcrAuth` L102·`copyLink` L126·`targetCompany` L172, 프론트 `Dcr30_Tab_LinkAdmin.tsx` L96-129.
</details>
