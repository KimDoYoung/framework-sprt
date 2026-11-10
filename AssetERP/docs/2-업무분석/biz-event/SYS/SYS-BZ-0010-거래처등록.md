# SYS-BZ-0010 거래처(기관)를 등록한다

> **한 줄 요약** — 거래처(`sys15_corp`)는 회사마다 따로 갖는다. 은행·증권·선물회사 57곳은 KFS 관리자가 #1155에서 [기초데이터생성]으로 복사해 주고, 그 밖의 거래처는 고객사 관리자가 #1146에서 [등록]·[저장]한다. 거래처마다 계좌(`sys17_corp_account`, 계좌번호는 암호화)를 붙일 수 있다.

| 항목 | 내용 |
|:---|:---|
| 누가 | ① KFS 관리자 `admin/admin/1111` (기관 57곳 복사) ② 고객사 관리자 `kalpa/admin/1111` (거래처·계좌 등록) |
| 언제 | 도입 때(①), 새 거래처가 생길 때마다(②) |
| 먼저 있어야 하는 것 | SYS-BZ-0001(거래처구분 코드 `CorpType`은 등록 때 복사됨), SYS-BZ-0003(#1146 메뉴) |
| 다음 이벤트 | 거래처를 고르는 업무(거래처 조회창 `Sys15_Lookup_Corp`를 쓰는 화면) |
| 실제 실행 | kalpa(회사ID 202611109046432), 2026-11-10 |

## 따라 하기

### ① KFS 관리자 — 기관 기초데이터 복사

| 단계 | 화면 | 누르는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|
| 1 | **#1155** 기초자료 > 30. 자산&경영 > 거래처 관리 | 회사 칸 돋보기 → `(주)칼파테크` | 회사 칸에 `(주)칼파테크` |
| 2 | 〃 | [기초데이터생성] | 완료 메시지. KFS(회사 0)의 거래처 57곳이 칼파테크로 복사됨 |

※ 회사 칸과 [기초데이터생성]은 KFS 관리자에게만 보인다. **두 번 누르면 57곳이 또 생긴다**(AS-IS SQL이 지우지 않고 그대로 넣는다) — 누르기 전에 칼파테크로 로그인해 #1146이 비어 있는지 본다.

### ② 고객사 관리자 — 거래처 직접 등록

| 단계 | 화면 | 누르는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|
| 1 | **#1146** 관리자 > 09. 기타 > 거래처 등록 | 거래처구분 `전체` → [조회] | 57곳(국내은행 24 · 증권회사 24 · 선물회사 9) |
| 2 | 〃 | [등록] → 아래 입력란: 거래처구분 `일반`, 거래처명 `(주)코바`, 사업자번호 `2208122222`, 거래처코드 비움, 조회순서 `1`, 사용 체크, 비고 `가상회사(업무분석) 거래처` → [저장] | "저장이 완료되었습니다." 사업자번호 `220-81-22222`, 거래처코드 **`220812222201`**(자동) |
| 3 | 〃 아래 계좌 그리드 | [행 추가] → 기관명 `국민은행`, 계좌번호 `000-00-0000-000`, 예금주명 `(주)코바`, 대표계좌 체크 → [저장] | 목록의 계좌정보 `1건` |

(코바는 다른 가상회사 이름을 빌린 것이고, 계좌번호는 가짜다.)

## DB에 남는 것

| 테이블 | 무엇 | 추가 | 행 |
|:---|:---|:---|---:|
| `sys15_corp` | 칼파테크 거래처 | ① 복사 57 + ② 등록 1 | 58 |
| `sys17_corp_account` | (주)코바의 계좌(계좌번호는 `to_encrypts`로 암호화, 화면은 복호화해서 보여 줌) | 추가 | 1 |

## 업무 규칙 (실행으로 확인)

| 규칙 | 결과 |
|:---|:---|
| 거래처구분·거래처명은 필수 | "거래처구분을 선택해주세요." / "거래처명을 입력해주세요." |
| 사업자번호는 `-` 빼고 10자리, 저장하면 `000-00-00000` 꼴로 바꿔 넣음 | `2208122222` → `220-81-22222`. 9자리면 "사업자번호는 10자리('-'제외) 입니다. 확인해주세요." (**확인**, 저장 안 됨) |
| 거래처코드를 비우면 **사업자번호 + 2자리 순번**으로 만든다(같은 사업자번호의 거래처가 또 생기면 `…02`) | `220812222201` (**확인**) |
| 거래처코드는 12자리까지, 회사 안에서 사용 중인 거래처끼리 겹치면 안 됨 | "동일 거래처코드가 존재합니다. (220812222201)" (**확인**, 저장 안 됨) |
| 삭제는 다른 업무에서 쓰는 거래처면 막힌다(`f_check_use_corp_id`) | 이번엔 실행 안 함 |

- 복사된 기관 57곳은 거래처코드·사업자번호가 비어 있다(회사 0에도 없음).
- **TOBE 회사 등록 누락(SYS-BZ-0008·0009에서 말한 것과 같은 건):** 현재 AS-IS는 회사 등록 때 이 57곳도 자동으로 복사한다(`UpdateDataModel` 19번 `sys15_corp.insertFormSys15`, SQL이 ①과 같다). TOBE `initCompany`에 이 단계가 없어서 ①을 손으로 했다.

## 결과를 볼 수 있는 화면

- #1146(칼파테크), #1155(KFS 관리자가 회사를 칼파테크로 골라 조회)
- 거래처 조회창(`Sys15_Lookup_Corp`, `GET /api/v1/sys/corps/lookup`)으로 거래처를 고르는 업무 화면

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SYS-BZ-0010
needs: [SYS-BZ-0001, SYS-BZ-0003]
steps:
  - no: ①2
    actor: { company: admin, user: admin, password: "1111" }
    screen: 1155
    action: '회사 칼파테크 → [기초데이터생성]'
    api: POST /api/v1/sys/corps/init-data?companyId=<칼파테크 회사ID>
  - no: ②2
    actor: { company: kalpa, user: admin, password: "1111" }
    screen: 1146
    action: '[등록] → (주)코바 → [저장]'
    api: PUT /api/v1/sys/corps
    body: [{ corpId: null, corpType: "0", corpName: "(주)코바", bizNo: "2208122222", corpCode: null, seq: 1, useYn: "true", note: "가상회사(업무분석) 거래처" }]
  - no: ②3
    actor: { company: kalpa, user: admin, password: "1111" }
    screen: 1146
    action: '계좌 [행 추가] → 국민은행 → [저장]'
    api: PUT /api/v1/sys/corps/{corpId}/accounts
    body: [{ corpAccountId: null, bankCode: "004", accountNoDec: "000-00-0000-000", accountName: "(주)코바", mainAccountYn: "true" }]
expect:
  - { table: sys15_corp, where: "sys15_company_id = :cid", rows: 58 }
  - { table: sys15_corp, where: "sys15_company_id = :cid and sys15_corp_cd = '220812222201' and sys15_biz_no = '220-81-22222'", rows: 1 }
  - { table: sys17_corp_account, where: "sys17_corp_id = :corpId", rows: 1 }
reject:
  - { body: { bizNo: "220812222" }, message: "사업자번호는 10자리('-'제외) 입니다. 확인해주세요." }
  - { body: { corpCode: "220812222201" }, message: "동일 거래처코드가 존재합니다. (220812222201)" }
```
</details>

<details>
<summary>확인 SQL</summary>

```sql
select f_cdnm('CorpType', sys15_corp_type, sys15_company_id, f_sysdate()) 구분, count(*)
  from sys15_corp where sys15_company_id = :cid group by 1 order by 1;

select c.sys15_corp_nm, c.sys15_biz_no, c.sys15_corp_cd, a.sys17_bank_cd, to_decrypts(a.sys17_account_no) 계좌
  from sys15_corp c left join sys17_corp_account a on a.sys17_corp_id = c.sys15_corp_id
 where c.sys15_company_id = :cid and c.sys15_corp_type = '0';
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Sys15_Tab_Corp`(#1146·#1155. 회사 칸·[기초데이터생성] E4·E8, `initData` L260-275), `Sys15_Edit_Corp`(아래 입력란 [저장] `updateRow` L143-159), `Sys17_Grid_CorpAccount`(계좌 그리드, `update` L144-191)
- AS-IS 서버: `sys.Sys15_Corp.update`(Sys15_Corp.java:45-126 — 필수·사업자번호 10자리·코드 12자리·중복 `selectCorpCodeCheck`·자동코드 `selectNewCorpCodeByBizNo`), `insertInitData`(Sys15_Corp.java:40 → `sys15_corp.insertInitData`, 회사 0 전부 INSERT·삭제 없음), `sys.Sys17_CorpAccount.update`(`dbConfig.getEncrypts`)
- AS-IS 회사 등록: `UpdateDataModel` 19번 `sys15_corp.insertFormSys15`
- TOBE: `SysCorpController` `/api/v1/sys/corps`(`GET`·`PUT`·`DELETE`, `POST /init-data`(관리자만, 회사 미선택은 "고객사를 선택해주세요"), `GET·PUT·DELETE /{corpId}/accounts`)
- TOBE 상태(2026-11-10): **실행** — kalpa에서 API로 복사 57·등록 1·계좌 1, 오류 2가지 확인. 자동 시험·화면 눈 확인은 아직.
</details>
