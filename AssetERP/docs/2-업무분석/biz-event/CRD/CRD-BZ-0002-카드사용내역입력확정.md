# CRD-BZ-0002 카드 사용내역을 입력하고 확정한다

> **한 줄 요약** — 매달 카드사에서 받은 사용내역을 올린다(엑셀 업로드 — 이번엔 **직접 입력**으로 같은 저장을 탔다). 올린 내역은 `crd02_data`에 쌓이고, **[내역확정]**을 누르면 카드번호로 카드·사용자를 찾아 **배분 대상(`biz01_promo`)** 행이 생긴다(이후 CRD-BZ-0003 배분·0004 결재·회계처리).

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리팀 |
| 언제 | 매월 카드사 명세 수령 뒤 |
| 먼저 있어야 하는 것 | CRD-BZ-0001(카드 + 사용자 **기간 겹침 없이 1명**) |
| 다음 이벤트 | CRD-BZ-0003 사용내역 배분 |
| 실제 실행 | kalpa, 2026-11-13, API(관리자). 2026.11 신한카드 3건(한식당 55,000·주유소 80,000·호텔 220,000, 합 355,000·부가세 32,272) 직접 입력 → 조회·금액 합계 → 확정 사전검사 → 확정(배분 3행) → 삭제 시험(1건 지움, 배분도 같이 지워짐) → 재확정 0건. 사용자가 2명 겹치면 확정 거절 확인 → 사용자 1명으로 고침. 엑셀 업로드·양식 코드는 안 함. 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1039 자금관리 > 30. 법인카드관리 > 법인카드 내역 업로드 (#1479 같은 화면). kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 경영관리 | #1039 | [엑셀 업로드](카드회사·사용년월) 또는 편집창에서 직접 입력 → [저장] (`PUT /crd/data`, 엑셀은 `POST /crd/data/excel`) | `crd02_data` +3 |
| 2 | 경영관리 | #1039 | 사용년월·카드회사·검색 조건 → [조회] (`GET /crd/data`) · 합계(`…/amount`) | 목록·승인금액·부가세 합계 |
| 3 | 경영관리 | #1039 | [내역확정] 전 확인 (`GET …/target-check?checkType=2`, `POST …/confirm-check`) → [선택내역확정]/[전체내역확정] (`POST …/confirm`) | `biz01_promo` +3(제공금액=승인금액) |
| 4 | 경영관리 | #1039 | 잘못 올린 내역 [삭제] (`DELETE /crd/data`) | 내역 + 그 배분 행 삭제(마감 안 된 것만) |

## DB에 남는 것

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `crd02_data` | 카드사 사용내역 원본(승인일·가맹점·금액·부가세·상태) | +3 −1 = 2 |
| `biz01_promo` | 확정된 배분 대상(제공금액·부가세·카드ID·과세유형) | 확정 +3, 삭제 −1 = 2 (실사용자 `person_id`는 비어 있음 — 0003에서 배분) |

## 업무 규칙 · 주의

- **확정 대상**: 고른 줄(`ids`) 또는 조회 조건 전체(`ids`를 **보내지 않고** `confirm: NOT_ALL`(미확정 전체)·`DONE`·`NOT_EXCEPT_CANCEL`). `ids: []`는 "대상 없음"이다.
- 확정은 카드번호(식별구분)·승인일로 **사용자가 정확히 1명인 카드**를 찾는다. 0명·2명 이상이면 "카드정보가 존재하지 않습니다. 카드번호 및 사용자 등록을 확인하세요" → [의심 #184](../../보안_및_버그_의심.md).
- 승인취소 상태는 금액·부가세를 음수로 배분하고, 같은 승인번호의 정상 건과 상쇄(금액 0이면 둘 다 삭제)한다(이번엔 취소건 시험 안 함).
- 이미 확정된 내역을 다시 확정하면 0건(이미 O 확정 건은 대상에서 빠짐). `target-check`는 checkType `1`(엑셀업로드) `2`(내역확정) `3`(등록)만 의미가 있고, 다른 값이나 `2`일 때도 `status 0`에 "에러…" 문구가 같이 와 화면이 그 문구를 쓰지 않는지 눈 확인이 필요하다.
- **메뉴 권한 없는 사원(402)이 내역 금액을 고치고 확정 배분과 어긋나게 만든다** → [의심 #183](../../보안_및_버그_의심.md)(시험 값은 되돌림).
- `yunhee trace-crud -s 1039`: ASIS `crd02_data` CRUD ↔ TOBE 같음.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: CRD-BZ-0002
needs: [CRD-BZ-0001]
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: PUT /api/v1/crd/data
    body: { dataYm: "2026.11", dataBankCode: "2000", approvalDt: "2026-11-03", cardNo: "1234567890123456", franchiseName: "한식당", approvalAmount: 55000, surtax: 5000, approvalNo: "A0001", stateName: "승인" }
    expect: { track: { crd02_data: +1 } }
  - no: 2
    api: POST /api/v1/crd/data/confirm
    body: { searchText: "", dataBankCode: "", dataYm: "2026.11", confirm: "NOT_ALL" }
    expect: { track: { biz01_promo: +3 } }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Crd02_Tab_DataUpload`(#1039)·`Crd02_Edit_DataUpload`, 서버 `Crd02_Data`·`Biz01_Promo.insertList/targetCheck/targetListCheck`.
- TOBE: `CrdDataController`·`CrdDataService`·`CrdDataMapper.xml`.
</details>
