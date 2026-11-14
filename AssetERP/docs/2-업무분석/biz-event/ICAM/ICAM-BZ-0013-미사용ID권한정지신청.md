# ICAM-BZ-0013 KFS가 미사용 사용자ID 권한정지 신청서를 올린다(엑셀·상신)

> **한 줄 요약** — KFS 담당이 분기마다 ICAM에서 오래 쓰지 않은 사용자ID 목록을 뽑는다. #1315 미사용ID 권한정지 신청에서 **[템플릿]**(기준일자·회사명·사용자ID·사용자명·이메일)으로 엑셀을 만들어 **[엑셀업로드]**하거나 행을 직접 [등록]·[저장]한다(`icam55_icam_user`, 신청서구분 2). 그런 다음 **[상신]**으로 그 기준일자의 모든 행을 링크코드 **A34**(미사용 사용자ID 권한정지 신청서) 결재문서 하나에 붙인다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS ICAM 운영 담당(시험은 104) → 결재자(박동진 29025) |
| 언제 | 분기마다(기준일자 = 분기 마지막 날) |
| 먼저 있어야 하는 것 | A34 문서분류(0011에서 KFS에 지정) |
| 다음 이벤트 | 0012 처리결과, 0014 정지·해제 기록 |
| 실제 실행 | 2026-11-14, API(104). [템플릿] `GET /users/stops/template` → xlsx. 시험 엑셀 2행(2026-09-30, `zzuser01`·`zzuser02`) [엑셀업로드] → `Data: 2`, `icam55` +2, 목록 AS-IS 2 = 2(그리드 11열). A34 결재문서 `202611149151493` 상신(10) → 두 행 연결(`PUT /users/stops/appr-id`) → 목록 `상신`. **같은 엑셀을 다시 올리면 결재 중인 두 행이 지워지고 새로 들어가 결재 연결이 사라진다**(⚠#245). 결재 중 행 사용자명 [저장]도 된다(이상한점 #196 ① 재현). 다시 연결·되돌림 |
| 메뉴 | #1315 KFS > 04. ICAM 사용자ID 관리 > 미사용ID 권한정지 신청 (6곳). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS | #1315 | 분기(기준일자)·검색어 → [조회] (`GET /icam/users/stops?stdDate=&searchText=`) | 그 기준일자의 권한정지 대상(회사·사용자ID·사용자명·이메일·결재상태) |
| 2 | 〃 | 〃 | [템플릿] (`GET /icam/users/stops/template`) | `Template_권한정지 신청서.xlsx` |
| 3 | 〃 | 〃 | [엑셀업로드] → 파일 (`POST /icam/users/stops/excel`, 폼 `excelUpload`) | 넣은 건수. 같은 기준일자·회사명·사용자명·ID 행은 지우고 다시 넣음 |
| 4 | 〃 | 〃 | [등록] → 행 입력 → [저장] (`PUT /icam/users/stops [{icamUserId, regDate, companyName, userId, userName, email}]`) | "회사명/사용자ID/사용자명은 필수입력 항목입니다." |
| 5 | 〃 | 〃 | [상신] → A34 결재문서 → 상신 → 그리드의 모든 행에 연결 (`PUT /icam/users/stops/appr-id {ids, apprId}`) | 결재상태 `상신` |
| 6 | 〃 | 〃 | 체크 → [삭제] (`DELETE /icam/users?ids=`, 0011과 같은 API) | 결재 10·20이면 막음 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `icam55_icam_user` | 권한정지 대상(구분 2)·결재 ID | +2(`202611149151496`·`…497`, 0014에서 씀) |
| `apr01_appr` | A34 결재문서(상신 10) | +1(`202611149151493`) |

## 업무 규칙 · 주의

- 엑셀은 첫 시트 2번째 행부터 읽는다. 기준일자는 날짜 값이나 `yyyy-mm-dd`/`yyyymmdd` 글자다. 한 행이라도 틀리면 전체를 되돌린다.
- 엑셀 업로드는 결재 상태를 보지 않고 "지우고 넣기"를 한다. 그래서 결재 중·완료 행도 지워지고 결재 연결이 끊긴다 → [의심 #245](../../보안_및_버그_의심.md). 신청구분 조건도 없다(이상한점 #196 ④ — 원본 그대로).
- 결재 중 행 수정을 막는 원본 검사는 문자열 `==` 비교라 실제로는 걸리지 않는다. TOBE도 걸지 않는다(이상한점 #196 ①, 원본 그대로).
- 표에 회사 열이 없어 다른 회사 사원도 같은 자료를 다룬다 → [#244](../../보안_및_버그_의심.md).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICAM-BZ-0013
company: 28000 (KFS)
steps:
  - no: 1
    api: GET /api/v1/icam/users/stops/template
  - no: 2
    api: POST /api/v1/icam/users/stops/excel
    form: {excelUpload: "stop_zz.xlsx (2026-09-30, ZZ칼파테크, zzuser01·02)"}
    expect: Data 2
  - no: 3
    api: GET /api/v1/icam/users/stops?stdDate=2026-09-30
    expect: rows 2
  - no: 4
    api: PUT /api/v1/apr/apprs/{apprId}
    body: {mode: request, linkCode: A34, effectDate: "2026-11-14T00:00:00", steps: [00:29049, 10:29025]}
  - no: 5
    api: PUT /api/v1/icam/users/stops/appr-id
    body: {ids: ["{3의 두 행}"], apprId: "{4}"}
  - no: 6
    api: POST /api/v1/icam/users/stops/excel   # 같은 파일
    expect: 결재 연결이 남아 있어야 함 (지금 끊김 — #245)
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Icam55_Tab_UserStopAuthAppr`(#1315 E2~E8, `update` L325-361, `deleteCheck` L389-397, `insertLinkApprovals` L474-502, `retrieveDoc` L517-535), `ExcelUpload.icamUserStopUpload` L1761-1823, SQL `icam55_icam_user.excelDelete`.
- TOBE: `IcamUserStopController` L39-70, `IcamUserStopService` L37-119, `frontend/src/pages/icam/Icam55_Tab_UserStopAuthAppr.tsx` L26·L59-154.
- 확인: `compare GET /icam/users/stops --sql icam55_icam_user.selectBySearchText(regType 2) --grid Icam55_Tab_UserStopAuthAppr` 2=2, `api POST /icam/users/stops/excel -F excelUpload=@… --track icam55_icam_user`.
</details>
