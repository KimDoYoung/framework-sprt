# AS-IS DB 스키마 색인

`yunhee index-db`가 `.yunhee/asseterp-dbml.md`에서 생성했다. 직접 수정하지 말고 명령어를 다시 실행한다.

## 원본

- 생성: 2026-09-30 12:16:33 +0900
- 대상: `postgresql://kdy987:***@localhost:5432/asseterpdb` (database `asseterpdb`, PostgreSQL 15.19 (Debian 15.19-1.pgdg13+2))
- 스키마: public
- 객체: tables 663, enums 0, refs 0, views 7, materialized views 0, functions 333, procedures 8, sequences 11, triggers 76

## 읽는 방법

- 테이블: `tables/{도메인}.md` — 도메인은 테이블명 접두어 (`emp01_person` → `emp`). 맨 위 요약 표로 먼저 찾는다.
- 함수: `functions/README.md` 색인에서 찾고 `functions/{이름}.md`만 읽는다.
- 뷰: `views.md`, 트리거: `triggers.md`
- FK(ref)는 DB에 없다. 테이블 간 관계는 AS-IS 매퍼 SQL에서 확인한다.

## 도메인별 테이블

| 도메인 | 테이블 수 | 파일 |
|:---|---:|:---|
| `act` | 17 | [tables/act.md](tables/act.md) |
| `adv` | 4 | [tables/adv.md](tables/adv.md) |
| `apr` | 35 | [tables/apr.md](tables/apr.md) |
| `ast` | 27 | [tables/ast.md](tables/ast.md) |
| `att` | 6 | [tables/att.md](tables/att.md) |
| `bbs` | 20 | [tables/bbs.md](tables/bbs.md) |
| `biz` | 24 | [tables/biz.md](tables/biz.md) |
| `bmt` | 5 | [tables/bmt.md](tables/bmt.md) |
| `bnd` | 1 | [tables/bnd.md](tables/bnd.md) |
| `car` | 5 | [tables/car.md](tables/car.md) |
| `chk` | 4 | [tables/chk.md](tables/chk.md) |
| `cmp` | 10 | [tables/cmp.md](tables/cmp.md) |
| `com` | 4 | [tables/com.md](tables/com.md) |
| `conv` | 3 | [tables/conv.md](tables/conv.md) |
| `crd` | 5 | [tables/crd.md](tables/crd.md) |
| `crm` | 11 | [tables/crm.md](tables/crm.md) |
| `dcr` | 16 | [tables/dcr.md](tables/dcr.md) |
| `emp` | 55 | [tables/emp.md](tables/emp.md) |
| `est` | 4 | [tables/est.md](tables/est.md) |
| `fbx` | 3 | [tables/fbx.md](tables/fbx.md) |
| `flt` | 15 | [tables/flt.md](tables/flt.md) |
| `fnd` | 16 | [tables/fnd.md](tables/fnd.md) |
| `icam` | 15 | [tables/icam.md](tables/icam.md) |
| `icr` | 3 | [tables/icr.md](tables/icr.md) |
| `ics` | 24 | [tables/ics.md](tables/ics.md) |
| `ifi` | 17 | [tables/ifi.md](tables/ifi.md) |
| `imt` | 8 | [tables/imt.md](tables/imt.md) |
| `kfs` | 1 | [tables/kfs.md](tables/kfs.md) |
| `mkt` | 6 | [tables/mkt.md](tables/mkt.md) |
| `mrb` | 1 | [tables/mrb.md](tables/mrb.md) |
| `msc` | 1 | [tables/msc.md](tables/msc.md) |
| `opr` | 3 | [tables/opr.md](tables/opr.md) |
| `org` | 3 | [tables/org.md](tables/org.md) |
| `pay` | 35 | [tables/pay.md](tables/pay.md) |
| `pcd` | 1 | [tables/pcd.md](tables/pcd.md) |
| `pln` | 3 | [tables/pln.md](tables/pln.md) |
| `raw` | 2 | [tables/raw.md](tables/raw.md) |
| `rpt` | 6 | [tables/rpt.md](tables/rpt.md) |
| `sch` | 21 | [tables/sch.md](tables/sch.md) |
| `scm` | 8 | [tables/scm.md](tables/scm.md) |
| `sms` | 4 | [tables/sms.md](tables/sms.md) |
| `sys` | 52 | [tables/sys.md](tables/sys.md) |
| `tdm` | 54 | [tables/tdm.md](tables/tdm.md) |
| `test` | 2 | [tables/test.md](tables/test.md) |
| `tgt` | 3 | [tables/tgt.md](tables/tgt.md) |
| `_backup` | 86 | [tables/_backup.md](tables/_backup.md) |
| `_etc` | 14 | [tables/_etc.md](tables/_etc.md) |

## 그 밖의 객체

- 뷰 7개: [views.md](views.md) (`all_source`, `crd00_slip_backup`, `dcr00_doc_list`, `emp00_trans_info`, `fnd00_fund`, `fnd00_fund_sysdate`, `org00_org_info`)
- 함수·프로시저 229개: [functions/README.md](functions/README.md)
- 트리거: [triggers.md](triggers.md)

## 시퀀스

| name | type | start | increment | min | max | cycle | owned by |
|---|---|---|---|---|---|---|---|
| public.app_user_user_id_seq | bigint | 1 | 1 | 1 | 9223372036854775807 | no | public.app_user.user_id |
| public.batchseq | bigint | 1 | 1 | 1 | 9999999999 | yes |  |
| public.bookmarkseq | bigint | 1 | 1 | 1 | 9223372036854775807 | no |  |
| public.etcseq | bigint | 1 | 1 | 1 | 9999999999 | yes |  |
| public.ifi_recv_id_seq | bigint | 1 | 1 | 1 | 9223372036854775807 | no | public.ifi_recv.id |
| public.seq | bigint | 9000000 | 1 | 9000000 | 9999999 | yes |  |
| public.smsseq | bigint | 1 | 1 | 1 | 9223372036854775807 | no |  |
| public.sys71_security_audit_log_audit_id_seq | bigint | 1 | 1 | 1 | 9223372036854775807 | no | public.sys71_security_audit_log.audit_id |
| public.sys97_notice_log_sys97_notice_log_id_seq | integer | 1 | 1 | 1 | 2147483647 | no | public.sys97_notice_log.sys97_notice_log_id |
| public.sys98_log_sys98_log_id_seq | integer | 1 | 1 | 1 | 2147483647 | no | public.sys98_log.sys98_log_id |
| public.temp_seq | bigint | 1 | 1 | 1 | 9223372036854775807 | no |  |
